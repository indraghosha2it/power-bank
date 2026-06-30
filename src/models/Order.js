

// models/Order.js

const mongoose = require('mongoose');

// ========== ORDER ITEM SCHEMA ==========
const orderItemSchema = new mongoose.Schema({
  productId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product', 
    required: true 
  },
  productName: { 
    type: String, 
    required: true 
  },
  productSlug: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, 
    required: true 
  },
  regularPrice: { 
    type: Number, 
    required: true 
  },
  discountPrice: { 
    type: Number, 
    default: 0 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1, 
    default: 1 
  },
  stockQuantity: { 
    type: Number, 
    default: 0 
  },
  unit: {  
    type: String,
    default: 'pcs'
  }
});

// ========== CUSTOMER INFO SCHEMA ==========
const customerInfoSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
  },
   email: { 
    type: String, 
    required: false,  // Changed from true to false
    default: '' 
  },
  phone: { 
    type: String, 
    required: true 
  },
    division: {  // <-- ADD THIS
    type: String, 
    required: true 
  },

  address: { 
    type: String, 
    required: true 
  },
  city: { 
    type: String, 
    required: true 
  },
  zone: { 
    type: String, 
    required: true 
  },
  area: { 
    type: String, 
    default: '' 
  },
  zipCode: { 
    type: String, 
    default: '' 
  },
  country: { 
    type: String, 
    default: 'Bangladesh' 
  },
  note: { 
    type: String, 
    default: '' 
  }
});

// ========== ORDER STATUS HISTORY SCHEMA (NEW) ==========
const orderStatusHistorySchema = new mongoose.Schema({
  status: { 
    type: String, 
    enum: ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded', 'failed'],
    required: true 
  },
  note: { 
    type: String, 
    default: '' 
  },
  updatedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null 
  },
  updatedByRole: { 
    type: String,
    enum: ['user', 'admin', 'moderator', 'system', 'courier'],
    default: 'system'
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: true });

// ========== DELIVERY STATUS HISTORY SCHEMA ==========
const deliveryStatusHistorySchema = new mongoose.Schema({
  status: { 
    type: String, 
    enum: ['pending', 'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed', 'returned'],
    required: true 
  },
  message: { 
    type: String, 
    default: '' 
  },
  location: { 
    type: String, 
    default: '' 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, { _id: true });

// ========== DELIVERY SERVICE SCHEMA ==========
const deliveryServiceSchema = new mongoose.Schema({
  // Courier information
  courierId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Courier' 
  },
  courierName: { 
    type: String, 
    default: '' 
  },
  courierSlug: { 
    type: String, 
    default: '' 
  },
  
  // Tracking information
  trackingNumber: { 
    type: String, 
    default: null 
  },
  trackingUrl: { 
    type: String, 
    default: '' 
  },
  courierOrderId: { 
    type: String, 
    default: '' 
  },
  
  // Delivery documents
  labelUrl: { 
    type: String, 
    default: '' 
  },
  invoiceUrl: { 
    type: String, 
    default: '' 
  },
  
  // Delivery status
  deliveryStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed', 'returned'],
    default: 'pending' 
  },
  deliveryStatusHistory: [deliveryStatusHistorySchema],
  
  // Delivery charges
  deliveryCharge: { 
    type: Number, 
    default: 0 
  },
  codCharge: { 
    type: Number, 
    default: 0 
  },
  totalDeliveryCharge: { 
    type: Number, 
    default: 0 
  },
  
  // Delivery notes
  deliveryNote: { 
    type: String, 
    default: '' 
  },
  
  // Weight and dimensions
  weight: { 
    type: Number, 
    default: 0 
  },
  dimensions: {
    length: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 }
  },
  
  // Delivery time
  estimatedDeliveryDate: { 
    type: Date, 
    default: null 
  },
  actualDeliveryDate: { 
    type: Date, 
    default: null 
  },
  pickedUpDate: { 
    type: Date, 
    default: null 
  },
  
  // Courier response
  courierResponse: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },
  
  // Additional metadata
  metadata: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  }
}, { _id: false });

// ========== MAIN ORDER SCHEMA ==========
const orderSchema = new mongoose.Schema({
  // User information
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    sparse: true, 
    index: true 
  },
  sessionId: { 
    type: String, 
    sparse: true, 
    index: true 
  },
  
  // Order items
  items: [orderItemSchema],
  
  // Customer information
  customerInfo: customerInfoSchema,
  
  // Pricing
  subtotal: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  shippingCost: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  discount: { 
    type: Number, 
    default: 0 
  },
  total: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  
  // Coupon information
  couponCode: { 
    type: String, 
    default: null 
  },
  couponDiscount: { 
    type: Number, 
    default: 0 
  },
  freeShipping: { 
    type: Boolean, 
    default: false 
  },
  
  // Payment information
  paymentMethod: { 
    type: String, 
    enum: ['cod', 'online', 'bkash', 'nagad', 'rocket'], 
    required: true, 
    default: 'cod' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed', 'refunded', 'partial'], 
    default: 'pending' 
  },
  paymentDetails: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },
  transactionId: { 
    type: String, 
    default: null, 
    index: true 
  },
  paymentSession: { 
    sessionKey: String, 
    gatewayUrl: String, 
    initiatedAt: Date 
  },
  
  // ========== ORDER STATUS ==========
  orderStatus: { 
    type: String, 
    enum: ['placed', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'refunded', 'failed'],
    default: 'placed' 
  },
  
  // ========== ORDER STATUS HISTORY (NEW) ==========
  statusHistory: [orderStatusHistorySchema],
  
  // ========== DELIVERY SERVICE ==========
  deliveryService: deliveryServiceSchema,
  
  // ========== LEGACY FIELDS (Keep for backward compatibility) ==========
  trackingNumber: { 
    type: String, 
    default: null 
  },
  deliveryNote: { 
    type: String, 
    default: '' 
  },
  
  // Order timeline
  orderNumber: { 
    type: String, 
    unique: true 
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  deliveredAt: { 
    type: Date, 
    default: null 
  },
  cancelledAt: { 
    type: Date, 
    default: null 
  },
  cancellationReason: { 
    type: String, 
    default: '' 
  },
  
  // Metadata
  metadata: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  }

}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ========== INDEXES ==========
orderSchema.index({ createdAt: -1 });
orderSchema.index({ orderStatus: 1, createdAt: -1 });
orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ 'deliveryService.trackingNumber': 1 });
orderSchema.index({ 'deliveryService.courierOrderId': 1 });
orderSchema.index({ 'customerInfo.phone': 1 }); // For tracking by phone




// // ========== PRE-SAVE HOOK - FIXED ==========
// orderSchema.pre('save', async function() {
//   // Generate order number if not exists
//   if (!this.orderNumber) {
//     try {
//       const now = new Date();
//       const year = now.getFullYear().toString().slice(-2);
//       const month = (now.getMonth() + 1).toString().padStart(2, '0');
      
//       const Order = mongoose.model('Order');
      
//       // Get the current maximum order number for this month
//       const lastOrder = await Order.findOne({
//         orderNumber: { $regex: `^GadS${year}${month}` }
//       })
//       .sort({ orderNumber: -1 })
//       .lean();
      
//       let sequenceNumber = 1;
      
//       if (lastOrder && lastOrder.orderNumber) {
//         // Extract the sequence number from the last order
//         const match = lastOrder.orderNumber.match(/GadS\d{4}(\d{4})/);
//         if (match) {
//           sequenceNumber = parseInt(match[1]) + 1;
//         }
//       }
      
//       // Pad the sequence number
//       const paddedNumber = sequenceNumber.toString().padStart(4, '0');
      
//       // Generate order number
//       const newOrderNumber = `GadS${year}${month}${paddedNumber}`;
      
//       // Double-check this order number doesn't exist (race condition prevention)
//       const existingOrder = await Order.findOne({ orderNumber: newOrderNumber });
//       if (existingOrder) {
//         // If it exists, increment by 1 and try again
//         const nextSeq = sequenceNumber + 1;
//         const nextPadded = nextSeq.toString().padStart(4, '0');
//         this.orderNumber = `GadS${year}${month}${nextPadded}`;
//       } else {
//         this.orderNumber = newOrderNumber;
//       }
      
//       console.log(`✅ Generated Order Number: ${this.orderNumber}`);
//     } catch (error) {
//       console.error('Error generating order number:', error);
//       // Fallback: use timestamp-based unique ID
//       const timestamp = Date.now().toString().slice(-6);
//       this.orderNumber = `GadS${timestamp}`;
//     }
//   }


// ========== PRE-SAVE HOOK - FIXED ==========
orderSchema.pre('save', async function() {
  // Generate order number if not exists
  if (!this.orderNumber) {
    try {
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      
      const Order = mongoose.model('Order');
      
      // Get the current maximum order number for this month
      const lastOrder = await Order.findOne({
        orderNumber: { $regex: `^BBuc${year}${month}` }  // Changed from GadS to BBuc
      })
      .sort({ orderNumber: -1 })
      .lean();
      
      let sequenceNumber = 1;
      
      if (lastOrder && lastOrder.orderNumber) {
        // Extract the sequence number from the last order
        const match = lastOrder.orderNumber.match(/BBuc\d{4}(\d{4})/);  // Changed from GadS to BBuc
        if (match) {
          sequenceNumber = parseInt(match[1]) + 1;
        }
      }
      
      // Pad the sequence number
      const paddedNumber = sequenceNumber.toString().padStart(4, '0');
      
      // Generate order number
      const newOrderNumber = `BBuc${year}${month}${paddedNumber}`;  // Changed from GadS to BBuc
      
      // Double-check this order number doesn't exist (race condition prevention)
      const existingOrder = await Order.findOne({ orderNumber: newOrderNumber });
      if (existingOrder) {
        // If it exists, increment by 1 and try again
        const nextSeq = sequenceNumber + 1;
        const nextPadded = nextSeq.toString().padStart(4, '0');
        this.orderNumber = `BBuc${year}${month}${nextPadded}`;  // Changed from GadS to BBuc
      } else {
        this.orderNumber = newOrderNumber;
      }
      
      console.log(`✅ Generated Order Number: ${this.orderNumber}`);
    } catch (error) {
      console.error('Error generating order number:', error);
      // Fallback: use timestamp-based unique ID
      const timestamp = Date.now().toString().slice(-6);
      this.orderNumber = `BBuc${timestamp}`;  // Changed from GadS to BBuc
    }
  }
  
  // ========== AUTO-ADD STATUS HISTORY ON STATUS CHANGE ==========
  if (this.isNew && this.orderStatus) {
    this.addStatusHistory(
      this.orderStatus, 
      'Order placed successfully', 
      this.userId || null, 
      'system'
    );
  }
  
  if (this.isModified('orderStatus')) {
    const previousStatus = this._originalStatus || this.orderStatus;
    if (previousStatus !== this.orderStatus) {
      this.addStatusHistory(
        this.orderStatus, 
        `Status changed from ${previousStatus} to ${this.orderStatus}`,
        this.userId || null,
        'system'
      );
    }
  }
  
  this._originalStatus = this.orderStatus;
});

// ========== METHODS ==========

/**
 * Add status history entry
 * @param {string} status - Order status
 * @param {string} note - Optional note about the status change
 * @param {ObjectId} updatedBy - User ID who updated the status
 * @param {string} updatedByRole - Role of the user who updated the status
 * @returns {Object} This order instance
 */
orderSchema.methods.addStatusHistory = function(status, note = '', updatedBy = null, updatedByRole = 'system') {
  if (!this.statusHistory) {
    this.statusHistory = [];
  }
  
  // Check if the last status is the same to avoid duplicates
  const lastEntry = this.statusHistory[this.statusHistory.length - 1];
  if (lastEntry && lastEntry.status === status && lastEntry.note === note) {
    return this;
  }
  
  this.statusHistory.push({
    status,
    note: note || `Status: ${status}`,
    updatedBy,
    updatedByRole: updatedByRole || 'system',
    timestamp: new Date()
  });
  
  return this;
};

/**
 * Update order status with history
 * @param {string} newStatus - New order status
 * @param {string} note - Optional note
 * @param {ObjectId} updatedBy - User ID who updated the status
 * @param {string} updatedByRole - Role of the user who updated the status
 * @returns {Object} This order instance
 */
orderSchema.methods.updateOrderStatus = function(newStatus, note = '', updatedBy = null, updatedByRole = 'system') {
  const oldStatus = this.orderStatus;
  
  if (oldStatus === newStatus) {
    return this;
  }
  
  this.orderStatus = newStatus;
  
  // Add to history
  this.addStatusHistory(newStatus, note || `Status changed from ${oldStatus} to ${newStatus}`, updatedBy, updatedByRole);
  
  // Update deliveredAt if status is delivered
  if (newStatus === 'delivered') {
    this.deliveredAt = new Date();
  }
  
  // Update cancelledAt if status is cancelled
  if (newStatus === 'cancelled') {
    this.cancelledAt = new Date();
  }
  
  return this;
};

/**
 * Update delivery status with history
 */
orderSchema.methods.updateDeliveryStatus = function(status, message = '', location = '') {
  if (!this.deliveryService) {
    this.deliveryService = {};
  }
  
  const validStatuses = ['pending', 'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed', 'returned'];
  
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid delivery status: ${status}`);
  }
  
  // Update delivery status
  this.deliveryService.deliveryStatus = status;
  
  // Add to history
  if (!this.deliveryService.deliveryStatusHistory) {
    this.deliveryService.deliveryStatusHistory = [];
  }
  
  this.deliveryService.deliveryStatusHistory.push({
    status,
    message: message || `Status updated to ${status}`,
    location,
    timestamp: new Date()
  });
  
  // Update actual delivery date if delivered
  if (status === 'delivered') {
    this.deliveryService.actualDeliveryDate = new Date();
  }
  
  // Update picked up date if picked up
  if (status === 'picked_up' && !this.deliveryService.pickedUpDate) {
    this.deliveryService.pickedUpDate = new Date();
  }
  
  // Sync order status with delivery status
  if (status === 'delivered') {
    this.orderStatus = 'delivered';
    this.deliveredAt = new Date();
    this.addStatusHistory('delivered', 'Order delivered by courier', null, 'courier');
  }
  
  return this;
};

/**
 * Set delivery service information
 */
orderSchema.methods.setDeliveryService = function(courierData) {
  this.deliveryService = {
    courierId: courierData.courierId || null,
    courierName: courierData.courierName || '',
    courierSlug: courierData.courierSlug || '',
    trackingNumber: courierData.trackingNumber || null,
    trackingUrl: courierData.trackingUrl || '',
    courierOrderId: courierData.courierOrderId || '',
    labelUrl: courierData.labelUrl || '',
    invoiceUrl: courierData.invoiceUrl || '',
    deliveryStatus: courierData.deliveryStatus || 'processing',
    deliveryCharge: courierData.deliveryCharge || 0,
    codCharge: courierData.codCharge || 0,
    totalDeliveryCharge: courierData.totalDeliveryCharge || 0,
    weight: courierData.weight || 0,
    dimensions: courierData.dimensions || { length: 0, width: 0, height: 0 },
    estimatedDeliveryDate: courierData.estimatedDeliveryDate || null,
    courierResponse: courierData.courierResponse || {},
    deliveryStatusHistory: [
      {
        status: 'processing',
        message: `Delivery order created with ${courierData.courierName}`,
        timestamp: new Date()
      }
    ]
  };
  
  // Update legacy tracking field
  this.trackingNumber = courierData.trackingNumber || null;
  
  // Update order status to processing when delivery is created
  this.updateOrderStatus('processing', 'Delivery order created with courier', null, 'system');
  
  return this;
};

/**
 * Get delivery status history formatted
 */
orderSchema.methods.getDeliveryTimeline = function() {
  if (!this.deliveryService?.deliveryStatusHistory) {
    return [];
  }
  
  return this.deliveryService.deliveryStatusHistory.map(entry => ({
    status: entry.status,
    message: entry.message,
    location: entry.location,
    timestamp: entry.timestamp,
    formattedDate: entry.timestamp ? entry.timestamp.toLocaleString('en-BD', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : null
  }));
};

/**
 * Get complete order timeline (combines order status history and delivery history)
 */
orderSchema.methods.getCompleteTimeline = function() {
  const timeline = [];
  
  // Add order status history
  if (this.statusHistory && this.statusHistory.length > 0) {
    this.statusHistory.forEach(entry => {
      timeline.push({
        type: 'order_status',
        status: entry.status,
        note: entry.note,
        updatedBy: entry.updatedBy,
        updatedByRole: entry.updatedByRole,
        timestamp: entry.timestamp,
        formattedDate: entry.timestamp ? entry.timestamp.toLocaleString('en-BD', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : null
      });
    });
  }
  
  // Add delivery status history
  if (this.deliveryService?.deliveryStatusHistory) {
    this.deliveryService.deliveryStatusHistory.forEach(entry => {
      timeline.push({
        type: 'delivery_status',
        status: entry.status,
        note: entry.message,
        location: entry.location,
        timestamp: entry.timestamp,
        formattedDate: entry.timestamp ? entry.timestamp.toLocaleString('en-BD', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : null
      });
    });
  }
  
  // Sort by timestamp
  timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  return timeline;
};

/**
 * Check if delivery can be cancelled
 */
orderSchema.methods.canCancelDelivery = function() {
  const cancellableStatuses = ['pending', 'processing', 'picked_up'];
  return this.deliveryService && 
         cancellableStatuses.includes(this.deliveryService.deliveryStatus) &&
         !['delivered', 'cancelled'].includes(this.orderStatus);
};

/**
 * Check if order can be cancelled
 */
orderSchema.methods.canBeCancelled = function() {
  const cancelableStatuses = ['placed', 'confirmed'];
  return cancelableStatuses.includes(this.orderStatus);
};

// ========== VIRTUALS ==========

// orderSchema.virtual('formattedOrderNumber').get(function() {
//   if (this.orderNumber) {
//     const match = this.orderNumber.match(/(GadS)(\d{2})(\d{2})(\d{4})/);
//     if (match) {
//       return `${match[1]}-${match[2]}${match[3]}-${match[4]}`;
//     }
//   }
//   return this.orderNumber;
// });


// ========== VIRTUALS ==========
orderSchema.virtual('formattedOrderNumber').get(function() {
  if (this.orderNumber) {
    const match = this.orderNumber.match(/(BBuc)(\d{2})(\d{2})(\d{4})/);  // Changed from GadS to BBuc
    if (match) {
      return `${match[1]}-${match[2]}${match[3]}-${match[4]}`;
    }
  }
  return this.orderNumber;
});

orderSchema.virtual('hasDeliveryService').get(function() {
  return !!(this.deliveryService && this.deliveryService.courierOrderId);
});

orderSchema.virtual('isDelivered').get(function() {
  return this.orderStatus === 'delivered';
});

orderSchema.virtual('isCancelled').get(function() {
  return this.orderStatus === 'cancelled';
});

orderSchema.virtual('canCreateDelivery').get(function() {
  const canCreateStatuses = ['confirmed'];
  return canCreateStatuses.includes(this.orderStatus) && 
         !this.deliveryService?.courierOrderId;
});

orderSchema.virtual('deliveryTrackingLink').get(function() {
  if (this.deliveryService?.trackingUrl) {
    return this.deliveryService.trackingUrl;
  }
  if (this.deliveryService?.trackingNumber) {
    return `https://steadfast.com.bd/track/${this.deliveryService.trackingNumber}`;
  }
  return null;
});

orderSchema.virtual('deliveryStatusLabel').get(function() {
  const statusMap = {
    'pending': 'Pending',
    'processing': 'Processing',
    'picked_up': 'Picked Up',
    'in_transit': 'In Transit',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'failed': 'Failed',
    'returned': 'Returned'
  };
  return statusMap[this.deliveryService?.deliveryStatus] || 'Unknown';
});

orderSchema.virtual('statusLabels').get(function() {
  const statusMap = {
    'placed': 'Order Placed',
    'confirmed': 'Order Confirmed',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled',
    'refunded': 'Refunded',
    'failed': 'Failed'
  };
  return statusMap[this.orderStatus] || this.orderStatus;
});

orderSchema.virtual('statusTimeline').get(function() {
  if (!this.statusHistory || this.statusHistory.length === 0) {
    return [];
  }
  
  return this.statusHistory.map(entry => ({
    status: entry.status,
    label: entry.status,
    note: entry.note,
    updatedBy: entry.updatedBy,
    updatedByRole: entry.updatedByRole,
    timestamp: entry.timestamp,
    formattedDate: entry.timestamp ? entry.timestamp.toLocaleString('en-BD', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }) : null
  }));
});

// ========== STATIC METHODS ==========

/**
 * Find orders by tracking number
 */
orderSchema.statics.findByTrackingNumber = function(trackingNumber) {
  return this.findOne({ 
    $or: [
      { 'deliveryService.trackingNumber': trackingNumber },
      { 'deliveryService.courierOrderId': trackingNumber }
    ]
  });
};

/**
 * Find orders by phone number (for tracking)
 */
orderSchema.statics.findByPhone = function(phone) {
  return this.find({ 'customerInfo.phone': phone })
    .sort({ createdAt: -1 });
};

/**
 * Get delivery statistics
 */
orderSchema.statics.getDeliveryStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$deliveryService.deliveryStatus',
        count: { $sum: 1 },
        totalAmount: { $sum: '$total' }
      }
    }
  ]);
};

/**
 * Get courier usage statistics
 */
orderSchema.statics.getCourierStats = async function() {
  return await this.aggregate([
    {
      $match: {
        'deliveryService.courierSlug': { $exists: true, $ne: '' }
      }
    },
    {
      $group: {
        _id: '$deliveryService.courierSlug',
        count: { $sum: 1 },
        totalAmount: { $sum: '$total' },
        totalDeliveryCharge: { $sum: '$deliveryService.totalDeliveryCharge' }
      }
    },
    {
      $project: {
        courier: '$_id',
        count: 1,
        totalAmount: 1,
        totalDeliveryCharge: 1,
        averageDeliveryCharge: { $divide: ['$totalDeliveryCharge', '$count'] }
      }
    }
  ]);
};

/**
 * Get order status distribution
 */
orderSchema.statics.getStatusDistribution = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: '$orderStatus',
        count: { $sum: 1 },
        totalValue: { $sum: '$total' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);
};

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);