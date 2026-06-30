// SmartBuy-BD-backend/routes/adminCourierRoutes.js

const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const Courier = require('../models/Courier');
const { 
  saveCourierCredentials, 
  getCourierIntegration,
  getCourierDocBySlug
} = require('../lib/courierCredentials');
const { 
  testCourierConnection,
  createCourierOrder
} = require('../lib/couriers/courierFactory');

// ========== GET available couriers ==========
router.get('/couriers', protect, isAdmin, async (req, res) => {
  try {
    const couriers = await Courier.find({ isActive: true }).sort({ name: 1 });
    
    // Get integration status for each courier
    const courierStatus = await Promise.all(
      couriers.map(async (courier) => {
        const integration = await getCourierIntegration(courier.slug);
        return {
          ...courier.toObject(),
          integrationStatus: integration?.integrationStatus || null,
          configured: integration?.configured || false,
          apiEnabled: courier.apiEnabled
        };
      })
    );
    
    res.json({
      success: true,
      data: courierStatus
    });
  } catch (error) {
    console.error('Get couriers error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== GET single courier ==========
router.get('/couriers/:id', protect, isAdmin, async (req, res) => {
  try {
    const courier = await Courier.findById(req.params.id);
    if (!courier) {
      return res.status(404).json({ success: false, error: 'Courier not found' });
    }
    
    const integration = await getCourierIntegration(courier.slug);
    
    res.json({
      success: true,
      data: {
        ...courier.toObject(),
        integrationStatus: integration?.integrationStatus || null,
        configured: integration?.configured || false,
        credentialFields: require('../lib/courierCredentials').courierCredentialFields[courier.slug] || []
      }
    });
  } catch (error) {
    console.error('Get courier error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== UPDATE courier integration ==========
router.put('/couriers/:id/integration', protect, isAdmin, async (req, res) => {
  try {
    const { apiEnabled, credentials, storeConfig, capabilities } = req.body || {};
    
    const courier = await saveCourierCredentials(req.params.id, {
      apiEnabled,
      credentials,
      storeConfig,
      capabilities
    });
    
    if (!courier) {
      return res.status(404).json({ success: false, error: 'Courier not found' });
    }
    
    res.json({
      success: true,
      data: courier,
      message: 'Courier integration updated successfully'
    });
  } catch (error) {
    console.error('Update courier integration error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== TEST courier connection ==========
router.post('/couriers/:id/test-connection', protect, isAdmin, async (req, res) => {
  try {
    const courier = await Courier.findById(req.params.id);
    if (!courier) {
      return res.status(404).json({ success: false, error: 'Courier not found' });
    }
    
    const integration = await getCourierIntegration(courier.slug);
    if (!integration || !integration.creds) {
      return res.status(400).json({ 
        success: false, 
        error: 'Credentials not configured for this courier' 
      });
    }
    
    const result = await testCourierConnection(
      courier.slug,
      integration.creds,
      integration.storeConfig
    );
    
    // Update integration status
    courier.integrationStatus = {
      lastTestedAt: new Date(),
      lastTestOk: result.success,
      lastTestMessage: result.message || (result.success ? 'Connected successfully' : 'Connection failed')
    };
    await courier.save();
    
    res.json({
      success: true,
      data: result,
      message: result.success ? 'Connection test successful' : 'Connection test failed'
    });
  } catch (error) {
    console.error('Test connection error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== CREATE delivery order with courier ==========
router.post('/couriers/:slug/create-order', protect, isAdmin, async (req, res) => {
  try {
    const { slug } = req.params;
    const { orderId } = req.body;
    
    if (!orderId) {
      return res.status(400).json({ success: false, error: 'Order ID is required' });
    }
    
    // Get courier integration
    const integration = await getCourierIntegration(slug);
    if (!integration || !integration.creds || !integration.apiEnabled) {
      return res.status(400).json({ 
        success: false, 
        error: 'Courier is not configured or disabled' 
      });
    }
    
    // Get the order
    const Order = require('../models/Order');
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Create delivery order
    const result = await createCourierOrder(
      slug,
      integration.creds,
      integration.storeConfig,
      {
        ...order.toObject(),
        orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-8)}`
      }
    );
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        error: result.message || 'Failed to create delivery order' 
      });
    }
    
    // Update order with delivery info
    order.deliveryService = {
      courierId: integration.id,
      courierName: slug.charAt(0).toUpperCase() + slug.slice(1),
      courierSlug: slug,
      trackingNumber: result.trackingNumber,
      trackingUrl: result.trackingUrl,
      courierOrderId: result.courierOrderId,
      courierResponse: result.fullResponse,
      deliveryStatus: 'processing',
      labelUrl: result.labelUrl || '',
      invoiceUrl: result.invoiceUrl || '',
      deliveryStatusHistory: [
        {
          status: 'processing',
          message: `Order created with ${slug} courier service`,
          timestamp: new Date()
        }
      ]
    };
    
    // Also update the legacy tracking field
    order.trackingNumber = result.trackingNumber;
    
    await order.save();
    
    res.json({
      success: true,
      data: {
        order,
        deliveryResult: result
      },
      message: `Delivery order created successfully with ${slug}`
    });
  } catch (error) {
    console.error('Create delivery order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== GET tracking status ==========
router.get('/couriers/:slug/track/:trackingNumber', protect, isAdmin, async (req, res) => {
  try {
    const { slug, trackingNumber } = req.params;
    
    const integration = await getCourierIntegration(slug);
    if (!integration || !integration.creds) {
      return res.status(400).json({ 
        success: false, 
        error: 'Courier is not configured' 
      });
    }
    
    const { getCourierTracking } = require('../lib/couriers/courierFactory');
    const result = await getCourierTracking(
      slug,
      integration.creds,
      trackingNumber
    );
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        error: result.message || 'Failed to get tracking info' 
      });
    }
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== CANCEL delivery order ==========
router.post('/couriers/:slug/cancel-order/:courierOrderId', protect, isAdmin, async (req, res) => {
  try {
    const { slug, courierOrderId } = req.params;
    
    const integration = await getCourierIntegration(slug);
    if (!integration || !integration.creds) {
      return res.status(400).json({ 
        success: false, 
        error: 'Courier is not configured' 
      });
    }
    
    const { cancelCourierOrder } = require('../lib/couriers/courierFactory');
    const result = await cancelCourierOrder(
      slug,
      integration.creds,
      integration.storeConfig,
      courierOrderId
    );
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        error: result.message || 'Failed to cancel delivery order' 
      });
    }
    
    // Update the order's delivery status
    const Order = require('../models/Order');
    const order = await Order.findOne({ 'deliveryService.courierOrderId': courierOrderId });
    if (order) {
      order.deliveryService.deliveryStatus = 'cancelled';
      order.deliveryService.deliveryStatusHistory.push({
        status: 'cancelled',
        message: `Order cancelled with ${slug} courier service`,
        timestamp: new Date()
      });
      await order.save();
    }
    
    res.json({
      success: true,
      data: result,
      message: 'Delivery order cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel delivery order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;