// routes/courierWebhookRoutes.js

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Order = require('../src/models/Order');

// ============================================================
// ✅ COMPLETE STATUS MAPPING FOR ALL COURIERS
// ============================================================

const STATUS_MAP = {
    // ========== PATHAO STATUSES ==========
    'order.created': 'processing',
    'order.updated': 'processing',
    'pickup.requested': 'processing',
    'assigned.for.pickup': 'processing',
    'pickup': 'picked_up',
    'pickup.failed': 'failed',
    'pickup.cancelled': 'cancelled',
    'at.the.sorting.hub': 'in_transit',
    'in.transit': 'in_transit',
    'received.at.last.mile.hub': 'in_transit',
    'assigned.for.delivery': 'out_for_delivery',
    'delivered': 'delivered',
    'partial.delivery': 'delivered',
    'return': 'returned',
    'delivery.failed': 'failed',
    'on.hold': 'pending',
    'payment.invoice': 'processing',
    'paid.return': 'returned',
    'exchange': 'processing',
    'return.id.created': 'returned',
    'return.in.transit': 'returned',
    'returned.to.merchant': 'returned',
    
    // ========== REDX STATUSES ==========
    'ready-for-delivery': 'processing',
    'delivery-in-progress': 'out_for_delivery',
    'delivered': 'delivered',
    'agent-hold': 'pending',
    'agent-returning': 'returned',
    'returned': 'returned',
    'agent-area-change': 'processing',
    'pending': 'pending',
    'processing': 'processing',
    'picked_up': 'picked_up',
    'in_transit': 'in_transit',
    'out_for_delivery': 'out_for_delivery',
    'cancelled': 'cancelled',
    'failed': 'failed',
    
    // ========== STEADFAST STATUSES ==========
    'pending': 'pending',
    'delivered': 'delivered',
    'partial_delivered': 'delivered',
    'cancelled': 'cancelled',
    'unknown': 'processing',
    'processing': 'processing',
    'picked_up': 'picked_up',
    'in_transit': 'in_transit',
    'out_for_delivery': 'out_for_delivery',
    'returned': 'returned',
    'failed': 'failed'
};

// ============================================================
// ✅ HELPER: Normalize Status
// ============================================================

function normalizeStatus(status, courier) {
    if (!status) {
        console.log('⚠️ No status provided, defaulting to processing');
        return 'processing';
    }
    
    // Convert to lowercase for case-insensitive matching
    const normalized = status.toLowerCase().trim();
    
    // Try direct mapping
    if (STATUS_MAP[normalized]) {
        return STATUS_MAP[normalized];
    }
    
    // Try partial match (e.g., "Delivered" -> "delivered")
    const partialMatch = Object.keys(STATUS_MAP).find(key => 
        normalized.includes(key) || key.includes(normalized)
    );
    
    if (partialMatch) {
        return STATUS_MAP[partialMatch];
    }
    
    // Log unmapped status for debugging
    console.log(`⚠️ Unmapped status: "${status}" for courier: ${courier}`);
    
    // Default to processing if unknown
    return 'processing';
}

// ============================================================
// ✅ IMPROVED: Get Status from Payload
// ============================================================

function extractStatus(payload, courier) {
    console.log(`🔍 Extracting status from ${courier} payload:`, JSON.stringify(payload, null, 2));
    
    switch (courier) {
        case 'pathao':
            // Pathao sends status in event field
            if (payload.event) {
                console.log(`📌 Pathao event: ${payload.event}`);
                return payload.event;
            }
            // Some Pathao webhooks might have direct status
            if (payload.status) {
                console.log(`📌 Pathao status: ${payload.status}`);
                return payload.status;
            }
            break;
            
        case 'redx':
            // RedX sends status directly
            if (payload.status) {
                console.log(`📌 RedX status: ${payload.status}`);
                return payload.status;
            }
            // Check for message that might contain status
            if (payload.message_en) {
                const msg = payload.message_en.toLowerCase();
                if (msg.includes('delivered')) return 'delivered';
                if (msg.includes('return')) return 'returned';
                if (msg.includes('cancel')) return 'cancelled';
                if (msg.includes('pickup')) return 'picked_up';
                if (msg.includes('transit')) return 'in_transit';
            }
            break;
            
        case 'steadfast':
            // Steadfast sends status in delivery_status webhook
            if (payload.status) {
                console.log(`📌 Steadfast status: ${payload.status}`);
                return payload.status;
            }
            // Check notification type
            if (payload.notification_type === 'delivery_status' && payload.status) {
                console.log(`📌 Steadfast delivery_status: ${payload.status}`);
                return payload.status;
            }
            // Check tracking message for status hints
            if (payload.tracking_message) {
                const msg = payload.tracking_message.toLowerCase();
                if (msg.includes('delivered')) return 'delivered';
                if (msg.includes('return')) return 'returned';
                if (msg.includes('cancel')) return 'cancelled';
                if (msg.includes('pickup')) return 'picked_up';
            }
            break;
            
        default:
            // Generic - try common fields
            if (payload.status) return payload.status;
            if (payload.event) return payload.event;
            if (payload.delivery_status) return payload.delivery_status;
            break;
    }
    
    console.log('⚠️ No status found in payload, defaulting to processing');
    return 'processing';
}

// ============================================================
// ✅ UPDATED: Webhook Handler
// ============================================================

async function handleWebhookUpdate(orderId, status, message, location, courierSlug, rawData = {}) {
    try {
        console.log(`📦 Processing webhook for order ${orderId} from ${courierSlug}`);
        console.log(`📌 Raw status: "${status}"`);
        
        const order = await Order.findById(orderId);
        if (!order) {
            console.error(`❌ Order not found: ${orderId}`);
            return { success: false, error: 'Order not found' };
        }

        // Normalize the status
        const normalizedStatus = normalizeStatus(status, courierSlug);
        console.log(`📌 Normalized status: "${normalizedStatus}" (from "${status}")`);
        
        const currentStatus = order.deliveryService?.deliveryStatus || 'pending';
        console.log(`📌 Current stored status: "${currentStatus}"`);
        
        if (currentStatus === normalizedStatus) {
            console.log(`📦 Order ${order.orderNumber}: Status unchanged (${normalizedStatus})`);
            return { success: true, message: 'Status unchanged' };
        }

        const oldPaymentStatus = order.paymentStatus;

        // Update delivery status
        order.updateDeliveryStatus(
            normalizedStatus,
            message || `Status updated to ${normalizedStatus}`,
            location || ''
        );

        // Store raw webhook data for reference
        if (!order.deliveryService.webhookData) {
            order.deliveryService.webhookData = [];
        }
        order.deliveryService.webhookData.push({
            courier: courierSlug,
            timestamp: new Date(),
            rawData: rawData,
            rawStatus: status,
            normalizedStatus: normalizedStatus,
            message: message
        });

        await order.save();

        console.log(`✅ Order ${order.orderNumber}: ${currentStatus} → ${normalizedStatus} (${courierSlug})`);
        if (oldPaymentStatus !== order.paymentStatus) {
            console.log(`💰 Order ${order.orderNumber}: Payment ${oldPaymentStatus} → ${order.paymentStatus}`);
        }

        return {
            success: true,
            order: {
                id: order._id,
                orderNumber: order.orderNumber,
                deliveryStatus: order.deliveryService.deliveryStatus,
                paymentStatus: order.paymentStatus,
                orderStatus: order.orderStatus
            }
        };
    } catch (error) {
        console.error('❌ Webhook handler error:', error);
        return { success: false, error: error.message };
    }
}

// ============================================================
// ✅ PATHAO WEBHOOK (UPDATED)
// ============================================================

router.post('/pathao', async (req, res) => {
    try {
        console.log('📡 Pathao webhook received');
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Body:', JSON.stringify(req.body, null, 2));

        const pathaoSignature = req.headers['x-pathao-signature'];
        const expectedSignature = process.env.PATHAO_WEBHOOK_SECRET || 'f3992ecc-59da-4cbe-a049-a13da2018d51';

        res.setHeader('X-Pathao-Merchant-Webhook-Integration-Secret', expectedSignature);

        // Skip signature verification for test event
        if (req.body.event === 'webhook_integration') {
            console.log('✅ Pathao webhook integration test successful');
            return res.status(202).json({ 
                success: true, 
                message: 'Webhook integration test successful' 
            });
        }

        if (pathaoSignature && pathaoSignature !== expectedSignature) {
            console.warn('⚠️ Invalid Pathao signature');
            return res.status(202).json({ 
                success: false, 
                error: 'Invalid signature' 
            });
        }

        // ========== EXTRACT STATUS ==========
        const status = extractStatus(req.body, 'pathao');
        const message = req.body.message || req.body.tracking_message || `Pathao: ${status}`;
        const location = req.body.location || req.body.current_location || null;
        
        // Get tracking reference
        const trackingRef = req.body.consignment_id || req.body.merchant_order_id || req.body.tracking_id;
        
        console.log(`📌 Extracted Pathao status: ${status}`);

        let order = null;
        if (trackingRef) {
            order = await Order.findOne({
                'deliveryService.trackingNumber': trackingRef
            });
        }

        if (!order && req.body.merchant_order_id) {
            order = await Order.findOne({
                'deliveryService.courierOrderId': req.body.merchant_order_id
            });
        }

        if (!order) {
            console.warn('⚠️ Order not found for Pathao webhook:', { trackingRef });
            return res.status(202).json({ 
                success: false, 
                error: 'Order not found' 
            });
        }

        const result = await handleWebhookUpdate(
            order._id,
            status,
            message,
            location,
            'pathao',
            req.body
        );

        return res.status(202).json({
            success: result.success,
            message: result.success ? 'Webhook processed' : result.error,
            data: result.order
        });

    } catch (error) {
        console.error('❌ Pathao webhook error:', error);
        return res.status(202).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============================================================
// ✅ REDX WEBHOOK (UPDATED)
// ============================================================

router.post('/redx', async (req, res) => {
    try {
        console.log('📡 RedX webhook received');
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Query:', JSON.stringify(req.query, null, 2));
        console.log('Body:', JSON.stringify(req.body, null, 2));

        const token = req.query.token || req.query.api_key || req.query.secret;
        const expectedToken = process.env.REDX_WEBHOOK_TOKEN;

        if (expectedToken && token !== expectedToken) {
            console.warn('⚠️ Invalid RedX token');
            return res.status(401).json({ 
                success: false, 
                error: 'Invalid token' 
            });
        }

        // ========== EXTRACT STATUS ==========
        const status = extractStatus(req.body, 'redx');
        const message = req.body.message_en || req.body.message_bn || `RedX: ${status}`;
        const trackingRef = req.body.tracking_number || req.body.invoice_number;
        
        console.log(`📌 Extracted RedX status: ${status}`);

        let order = null;
        if (trackingRef) {
            order = await Order.findOne({
                'deliveryService.trackingNumber': trackingRef
            });
        }

        if (!order && req.body.invoice_number) {
            order = await Order.findOne({
                'deliveryService.courierOrderId': req.body.invoice_number
            });
        }

        if (!order) {
            console.warn('⚠️ Order not found for RedX webhook:', { trackingRef });
            return res.status(404).json({ 
                success: false, 
                error: 'Order not found' 
            });
        }

        const result = await handleWebhookUpdate(
            order._id,
            status,
            message,
            null,
            'redx',
            req.body
        );

        return res.status(200).json({
            success: result.success,
            message: result.success ? 'Webhook processed successfully' : result.error,
            data: result.order
        });

    } catch (error) {
        console.error('❌ RedX webhook error:', error);
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// ============================================================
// ✅ STEADFAST WEBHOOK (UPDATED)
// ============================================================

router.post('/steadfast', async (req, res) => {
    try {
        console.log('📡 Steadfast webhook received');
        console.log('Headers:', JSON.stringify(req.headers, null, 2));
        console.log('Body:', JSON.stringify(req.body, null, 2));

        const authHeader = req.headers.authorization;
        const token = authHeader?.replace('Bearer ', '');
        const expectedToken = process.env.STEADFAST_BEARER_TOKEN;

        if (expectedToken && token !== expectedToken) {
            console.warn('⚠️ Invalid Steadfast token');
            return res.status(401).json({ 
                status: 'error', 
                message: 'Invalid authentication token' 
            });
        }

        // ========== EXTRACT STATUS ==========
        const status = extractStatus(req.body, 'steadfast');
        const message = req.body.tracking_message || req.body.message || `Steadfast: ${status}`;
        const trackingRef = req.body.consignment_id || req.body.invoice;
        
        console.log(`📌 Extracted Steadfast status: ${status}`);

        let order = null;
        if (trackingRef) {
            order = await Order.findOne({
                'deliveryService.trackingNumber': String(trackingRef)
            });
        }

        if (!order && req.body.invoice) {
            order = await Order.findOne({
                'deliveryService.courierOrderId': req.body.invoice
            });
        }

        if (!order) {
            console.warn('⚠️ Order not found for Steadfast webhook:', { trackingRef });
            return res.status(200).json({ 
                status: 'error', 
                message: 'Order not found' 
            });
        }

        const result = await handleWebhookUpdate(
            order._id,
            status,
            message,
            null,
            'steadfast',
            req.body
        );

        return res.status(200).json({
            status: result.success ? 'success' : 'error',
            message: result.success ? 'Webhook received successfully.' : result.error
        });

    } catch (error) {
        console.error('❌ Steadfast webhook error:', error);
        return res.status(500).json({ 
            status: 'error', 
            message: error.message 
        });
    }
});

// ============================================================
// ✅ TEST WEBHOOK (with detailed logging)
// ============================================================

router.post('/test', async (req, res) => {
    console.log('🧪 Test webhook received');
    console.log('Body:', JSON.stringify(req.body, null, 2));
    
    // Test status extraction
    const status = extractStatus(req.body, req.body.courier || 'test');
    const normalized = normalizeStatus(status, req.body.courier || 'test');
    
    res.json({ 
        success: true, 
        message: 'Webhook test received',
        extracted: {
            rawStatus: status,
            normalized: normalized,
            courier: req.body.courier || 'test'
        },
        data: req.body 
    });
});

// ============================================================
// ✅ STATUS ENDPOINT
// ============================================================

router.get('/status', (req, res) => {
    res.json({
        success: true,
        statusMapping: STATUS_MAP,
        endpoints: {
            pathao: 'POST /api/webhooks/courier/pathao',
            redx: 'POST /api/webhooks/courier/redx?token=YOUR_TOKEN',
            steadfast: 'POST /api/webhooks/courier/steadfast',
            test: 'POST /api/webhooks/courier/test'
        },
        configuration: {
            pathao: {
                secret: process.env.PATHAO_WEBHOOK_SECRET ? '✅ Configured' : '⚠️ Not configured',
                callback: `${process.env.WEBHOOK_BASE_URL || 'http://localhost:5000'}/api/webhooks/courier/pathao`
            },
            redx: {
                token: process.env.REDX_WEBHOOK_TOKEN ? '✅ Configured' : '⚠️ Not configured',
                callback: `${process.env.WEBHOOK_BASE_URL || 'http://localhost:5000'}/api/webhooks/courier/redx?token=${process.env.REDX_WEBHOOK_TOKEN || 'YOUR_TOKEN'}`
            },
            steadfast: {
                token: process.env.STEADFAST_BEARER_TOKEN ? '✅ Configured' : '⚠️ Not configured',
                callback: `${process.env.WEBHOOK_BASE_URL || 'http://localhost:5000'}/api/webhooks/courier/steadfast`
            }
        }
    });
});

module.exports = router;