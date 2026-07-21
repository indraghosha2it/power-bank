
// // models/Order.js

// const mongoose = require('mongoose');

// // ========== ORDER ITEM SCHEMA ==========
// const orderItemSchema = new mongoose.Schema({
//   productId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Product', 
//     required: true 
//   },
//   productName: { 
//     type: String, 
//     required: true 
//   },
//   productSlug: { 
//     type: String, 
//     required: true 
//   },
//   image: { 
//     type: String, 
//     required: true 
//   },
//   regularPrice: { 
//     type: Number, 
//     required: true 
//   },
//   discountPrice: { 
//     type: Number, 
//     default: 0 
//   },
//   quantity: { 
//     type: Number, 
//     required: true, 
//     min: 0,
//     default: 1 
//   },
//   stockQuantity: { 
//     type: Number, 
//     default: 0 
//   },
//   unit: {  
//     type: String,
//     default: 'pcs'
//   },
//   selectedColor: {
//     type: String,
//     default: null
//   },
//   colors: [{
//     color: String,
//     quantity: Number,
//     price: Number
//   }]
// });

// // ========== CUSTOMER INFO SCHEMA ==========
// const customerInfoSchema = new mongoose.Schema({
//   fullName: { 
//     type: String, 
//     required: true 
//   },
//   email: { 
//     type: String, 
//     required: false,
//     default: '' 
//   },
//   phone: { 
//     type: String, 
//     required: true 
//   },
//   division: { 
//     type: String, 
//     required: true 
//   },
//   address: { 
//     type: String, 
//     required: true 
//   },
//   city: { 
//     type: String, 
//     required: true 
//   },
//   zone: { 
//     type: String, 
//     required: true 
//   },
//   area: { 
//     type: String, 
//     default: '' 
//   },
//   zipCode: { 
//     type: String, 
//     default: '' 
//   },
//   country: { 
//     type: String, 
//     default: 'Bangladesh' 
//   },
//   note: { 
//     type: String, 
//     default: '' 
//   }
// });

// // ========== ORDER STATUS HISTORY SCHEMA ==========
// const orderStatusHistorySchema = new mongoose.Schema({
//   status: { 
//     type: String, 
//     enum: ['placed', 'follow_up', 'accepted', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'reminder', 'refunded', 'failed'],
//     required: true 
//   },
//   note: { 
//     type: String, 
//     default: '' 
//   },
//   updatedBy: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User',
//     default: null 
//   },
//   updatedByRole: { 
//     type: String,
//     enum: ['user', 'admin', 'moderator', 'system', 'courier', 'call_center'],
//     default: 'system'
//   },
//   timestamp: { 
//     type: Date, 
//     default: Date.now 
//   }
// }, { _id: true });

// // ========== DELIVERY STATUS HISTORY SCHEMA ==========
// const deliveryStatusHistorySchema = new mongoose.Schema({
//   status: { 
//     type: String, 
//     enum: ['pending', 'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed', 'returned'],
//     required: true 
//   },
//   message: { 
//     type: String, 
//     default: '' 
//   },
//   location: { 
//     type: String, 
//     default: '' 
//   },
//   timestamp: { 
//     type: Date, 
//     default: Date.now 
//   }
// }, { _id: true });

// // ========== DELIVERY SERVICE SCHEMA ==========
// const deliveryServiceSchema = new mongoose.Schema({
//   courierId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'Courier' 
//   },
//   courierName: { 
//     type: String, 
//     default: '' 
//   },
//   courierSlug: { 
//     type: String, 
//     default: '' 
//   },
//   trackingNumber: { 
//     type: String, 
//     default: null 
//   },
//   trackingUrl: { 
//     type: String, 
//     default: '' 
//   },
//   courierOrderId: { 
//     type: String, 
//     default: '' 
//   },
//   labelUrl: { 
//     type: String, 
//     default: '' 
//   },
//   invoiceUrl: { 
//     type: String, 
//     default: '' 
//   },
//   deliveryStatus: { 
//     type: String, 
//     enum: ['pending', 'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed', 'returned'],
//     default: 'pending' 
//   },
//   deliveryStatusHistory: [deliveryStatusHistorySchema],
//   deliveryCharge: { 
//     type: Number, 
//     default: 0 
//   },
//   codCharge: { 
//     type: Number, 
//     default: 0 
//   },
//   totalDeliveryCharge: { 
//     type: Number, 
//     default: 0 
//   },
//   deliveryNote: { 
//     type: String, 
//     default: '' 
//   },
//   weight: { 
//     type: Number, 
//     default: 0 
//   },
//   dimensions: {
//     length: { type: Number, default: 0 },
//     width: { type: Number, default: 0 },
//     height: { type: Number, default: 0 }
//   },
//   estimatedDeliveryDate: { 
//     type: Date, 
//     default: null 
//   },
//   actualDeliveryDate: { 
//     type: Date, 
//     default: null 
//   },
//   pickedUpDate: { 
//     type: Date, 
//     default: null 
//   },
//   courierResponse: { 
//     type: mongoose.Schema.Types.Mixed, 
//     default: {} 
//   },
//   metadata: { 
//     type: mongoose.Schema.Types.Mixed, 
//     default: {} 
//   }
// }, { _id: false });

// // ========== DEVICE INFO SCHEMA ==========
// const deviceInfoSchema = new mongoose.Schema({
//   // Server-side detected
//   ipAddress: { type: String, default: null },
//   userAgent: { type: String, default: null },
//   deviceType: { type: String, enum: ['mobile', 'tablet', 'desktop', 'unknown'], default: 'unknown' },
//   browser: { type: String, default: null },
//   browserVersion: { type: String, default: null },
//   os: { type: String, default: null },
//   osVersion: { type: String, default: null },
//   platform: { type: String, default: null },
  
//   // Client-side provided
//   screenResolution: { type: String, default: null },
//   viewportSize: { type: String, default: null },
//   colorDepth: { type: Number, default: null },
//   pixelRatio: { type: Number, default: null },
//   timezone: { type: String, default: null },
//   language: { type: String, default: null },
//   referrer: { type: String, default: null },
  
//   // Connection info
//   connectionType: { type: String, default: null },
//   connectionSpeed: { type: String, default: null },
  
//   // Additional
//   doNotTrack: { type: String, default: null },
//   vendor: { type: String, default: null }
// }, { _id: false });

// // ========== MAIN ORDER SCHEMA ==========
// const orderSchema = new mongoose.Schema({
//   // User information
//   userId: { 
//     type: mongoose.Schema.Types.ObjectId, 
//     ref: 'User', 
//     sparse: true, 
//     index: true 
//   },
//   sessionId: { 
//     type: String, 
//     sparse: true, 
//     index: true 
//   },
  
//   // Order items
//   items: [orderItemSchema],
  
//   // Customer information
//   customerInfo: customerInfoSchema,
  
//   // Pricing
//   subtotal: { 
//     type: Number, 
//     required: true, 
//     min: 0 
//   },
//   shippingCost: { 
//     type: Number, 
//     required: true, 
//     default: 0 
//   },
//   discount: { 
//     type: Number, 
//     default: 0 
//   },
//   total: { 
//     type: Number, 
//     required: true, 
//     min: 0 
//   },
  
//   // Coupon information
//   couponCode: { 
//     type: String, 
//     default: null 
//   },
//   couponDiscount: { 
//     type: Number, 
//     default: 0 
//   },
//   freeShipping: { 
//     type: Boolean, 
//     default: false 
//   },
  
//   // Payment information
//   paymentMethod: { 
//     type: String, 
//     enum: ['cod', 'online', 'bkash', 'nagad', 'rocket'], 
//     required: true, 
//     default: 'cod' 
//   },
//   paymentStatus: { 
//     type: String, 
//     enum: ['pending', 'paid', 'failed', 'refunded', 'partial'], 
//     default: 'pending' 
//   },
//   paymentDetails: { 
//     type: mongoose.Schema.Types.Mixed, 
//     default: {} 
//   },
//   transactionId: { 
//     type: String, 
//     default: null, 
//     index: true 
//   },
//   paymentSession: { 
//     sessionKey: String, 
//     gatewayUrl: String, 
//     initiatedAt: Date 
//   },
  
//   // Order Status
//   orderStatus: { 
//     type: String, 
//     enum: ['placed', 'follow_up', 'accepted', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'reminder', 'refunded', 'failed'],
//     default: 'placed' 
//   },
  
//   // Status History
//   statusHistory: [orderStatusHistorySchema],
  
//   // Delivery Service
//   deliveryService: deliveryServiceSchema,
  
//   // Legacy fields
//   trackingNumber: { 
//     type: String, 
//     default: null 
//   },
//   deliveryNote: { 
//     type: String, 
//     default: '' 
//   },
  
//   // Device & Location Information
//   deviceInfo: deviceInfoSchema,
  
//   // Order Timeline
//   orderNumber: { 
//     type: String, 
//     unique: true 
//   },
//   orderDate: { 
//     type: Date, 
//     default: Date.now 
//   },
//   placedAt: { 
//     type: Date, 
//     default: Date.now 
//   },
//   followUpAt: { 
//     type: Date, 
//     default: null 
//   },
//   acceptedAt: { 
//     type: Date, 
//     default: null 
//   },
//   processingAt: { 
//     type: Date, 
//     default: null 
//   },
//   shippedAt: { 
//     type: Date, 
//     default: null 
//   },
//   deliveredAt: { 
//     type: Date, 
//     default: null 
//   },
//   cancelledAt: { 
//     type: Date, 
//     default: null 
//   },
//   reminderAt: { 
//     type: Date, 
//     default: null 
//   },
//   cancellationReason: { 
//     type: String, 
//     default: '' 
//   },
  
//   // Metadata
//   metadata: { 
//     type: mongoose.Schema.Types.Mixed, 
//     default: {} 
//   }

// }, { 
//   timestamps: true,
//   toJSON: { virtuals: true },
//   toObject: { virtuals: true }
// });

// // ========== INDEXES ==========
// orderSchema.index({ createdAt: -1 });
// orderSchema.index({ orderStatus: 1, createdAt: -1 });
// orderSchema.index({ userId: 1, createdAt: -1 });
// orderSchema.index({ orderNumber: 1 });
// orderSchema.index({ 'deliveryService.trackingNumber': 1 });
// orderSchema.index({ 'deliveryService.courierOrderId': 1 });
// orderSchema.index({ 'customerInfo.phone': 1 });
// orderSchema.index({ placedAt: -1 });

// // ========== PRE-SAVE HOOK ==========
// orderSchema.pre('save', async function() {
//   // Generate order number if not exists
//   if (!this.orderNumber) {
//     try {
//       const now = new Date();
//       const year = now.getFullYear().toString().slice(-2);
//       const month = (now.getMonth() + 1).toString().padStart(2, '0');
      
//       const Order = mongoose.model('Order');
      
//       const lastOrder = await Order.findOne({
//         orderNumber: { $regex: `^BBuc${year}${month}` }
//       })
//       .sort({ orderNumber: -1 })
//       .lean();
      
//       let sequenceNumber = 1;
      
//       if (lastOrder && lastOrder.orderNumber) {
//         const match = lastOrder.orderNumber.match(/BBuc\d{4}(\d{4})/);
//         if (match) {
//           sequenceNumber = parseInt(match[1]) + 1;
//         }
//       }
      
//       const paddedNumber = sequenceNumber.toString().padStart(4, '0');
//       const newOrderNumber = `BBuc${year}${month}${paddedNumber}`;
      
//       const existingOrder = await Order.findOne({ orderNumber: newOrderNumber });
//       if (existingOrder) {
//         const nextSeq = sequenceNumber + 1;
//         const nextPadded = nextSeq.toString().padStart(4, '0');
//         this.orderNumber = `BBuc${year}${month}${nextPadded}`;
//       } else {
//         this.orderNumber = newOrderNumber;
//       }
      
//       console.log(`✅ Generated Order Number: ${this.orderNumber}`);
//     } catch (error) {
//       console.error('Error generating order number:', error);
//       const timestamp = Date.now().toString().slice(-6);
//       this.orderNumber = `BBuc${timestamp}`;
//     }
//   }
  
//   // Set placedAt if order is new and status is placed
//   if (this.isNew && this.orderStatus === 'placed') {
//     this.placedAt = new Date();
//   }
  
//   // Auto-add status history on status change
//   if (this.isNew && this.orderStatus) {
//     this.addStatusHistory(
//       this.orderStatus, 
//       'Order placed successfully', 
//       this.userId || null, 
//       'system'
//     );
//   }
  
//   if (this.isModified('orderStatus')) {
//     const previousStatus = this._originalStatus || this.orderStatus;
//     if (previousStatus !== this.orderStatus) {
//       this.addStatusHistory(
//         this.orderStatus, 
//         `Status changed from ${previousStatus} to ${this.orderStatus}`,
//         this.userId || null,
//         'system'
//       );
//     }
//   }
  
//   this._originalStatus = this.orderStatus;
// });

// // ========== METHODS ==========

// /**
//  * Add status history entry
//  */
// orderSchema.methods.addStatusHistory = function(status, note = '', updatedBy = null, updatedByRole = 'system') {
//   if (!this.statusHistory) {
//     this.statusHistory = [];
//   }
  
//   const lastEntry = this.statusHistory[this.statusHistory.length - 1];
//   if (lastEntry && lastEntry.status === status && lastEntry.note === note) {
//     return this;
//   }
  
//   this.statusHistory.push({
//     status,
//     note: note || `Status: ${status}`,
//     updatedBy,
//     updatedByRole: updatedByRole || 'system',
//     timestamp: new Date()
//   });
  
//   return this;
// };

// /**
//  * Update order status with history
//  */
// orderSchema.methods.updateOrderStatus = function(newStatus, note = '', updatedBy = null, updatedByRole = 'system') {
//   const oldStatus = this.orderStatus;
  
//   if (oldStatus === newStatus) {
//     return this;
//   }
  
//   this.orderStatus = newStatus;
  
//   // Update timestamps based on status
//   switch(newStatus) {
//     case 'placed':
//       this.placedAt = new Date();
//       break;
//     case 'follow_up':
//       this.followUpAt = new Date();
//       break;
//     case 'accepted':
//       this.acceptedAt = new Date();
//       break;
//     case 'processing':
//       this.processingAt = new Date();
//       break;
//     case 'shipped':
//       this.shippedAt = new Date();
//       break;
//     case 'delivered':
//       this.deliveredAt = new Date();
//       break;
//     case 'cancelled':
//       this.cancelledAt = new Date();
//       break;
//     case 'reminder':
//       this.reminderAt = new Date();
//       break;
//   }
  
//   this.addStatusHistory(newStatus, note || `Status changed from ${oldStatus} to ${newStatus}`, updatedBy, updatedByRole);
  
//   return this;
// };

// /**
//  * Update delivery status with history
//  */
// orderSchema.methods.updateDeliveryStatus = function(status, message = '', location = '') {
//   if (!this.deliveryService) {
//     this.deliveryService = {};
//   }
  
//   const validStatuses = ['pending', 'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed', 'returned'];
  
//   if (!validStatuses.includes(status)) {
//     throw new Error(`Invalid delivery status: ${status}`);
//   }
  
//   this.deliveryService.deliveryStatus = status;
  
//   if (!this.deliveryService.deliveryStatusHistory) {
//     this.deliveryService.deliveryStatusHistory = [];
//   }
  
//   this.deliveryService.deliveryStatusHistory.push({
//     status,
//     message: message || `Status updated to ${status}`,
//     location,
//     timestamp: new Date()
//   });
  
//   if (status === 'delivered') {
//     this.deliveryService.actualDeliveryDate = new Date();
//   }
  
//   if (status === 'picked_up' && !this.deliveryService.pickedUpDate) {
//     this.deliveryService.pickedUpDate = new Date();
//   }
  
//   if (status === 'delivered') {
//     this.orderStatus = 'delivered';
//     this.deliveredAt = new Date();
//     this.addStatusHistory('delivered', 'Order delivered by courier', null, 'courier');
//   }
  
//   return this;
// };

// /**
//  * Set delivery service information
//  */
// orderSchema.methods.setDeliveryService = function(courierData) {
//   this.deliveryService = {
//     courierId: courierData.courierId || null,
//     courierName: courierData.courierName || '',
//     courierSlug: courierData.courierSlug || '',
//     trackingNumber: courierData.trackingNumber || null,
//     trackingUrl: courierData.trackingUrl || '',
//     courierOrderId: courierData.courierOrderId || '',
//     labelUrl: courierData.labelUrl || '',
//     invoiceUrl: courierData.invoiceUrl || '',
//     deliveryStatus: courierData.deliveryStatus || 'processing',
//     deliveryCharge: courierData.deliveryCharge || 0,
//     codCharge: courierData.codCharge || 0,
//     totalDeliveryCharge: courierData.totalDeliveryCharge || 0,
//     weight: courierData.weight || 0,
//     dimensions: courierData.dimensions || { length: 0, width: 0, height: 0 },
//     estimatedDeliveryDate: courierData.estimatedDeliveryDate || null,
//     courierResponse: courierData.courierResponse || {},
//     deliveryStatusHistory: [
//       {
//         status: 'processing',
//         message: `Delivery order created with ${courierData.courierName}`,
//         timestamp: new Date()
//       }
//     ]
//   };
  
//   this.trackingNumber = courierData.trackingNumber || null;
  
//   return this;
// };

// // ========== VIRTUALS ==========
// orderSchema.virtual('formattedOrderNumber').get(function() {
//   if (this.orderNumber) {
//     const match = this.orderNumber.match(/(BBuc)(\d{2})(\d{2})(\d{4})/);
//     if (match) {
//       return `${match[1]}-${match[2]}${match[3]}-${match[4]}`;
//     }
//   }
//   return this.orderNumber;
// });

// orderSchema.virtual('hasDeliveryService').get(function() {
//   return !!(this.deliveryService && this.deliveryService.courierOrderId);
// });

// orderSchema.virtual('isDelivered').get(function() {
//   return this.orderStatus === 'delivered';
// });

// orderSchema.virtual('isCancelled').get(function() {
//   return this.orderStatus === 'cancelled';
// });

// orderSchema.virtual('canCreateDelivery').get(function() {
//   const canCreateStatuses = ['accepted'];
//   return canCreateStatuses.includes(this.orderStatus) && 
//          !this.deliveryService?.courierOrderId;
// });

// orderSchema.virtual('statusLabels').get(function() {
//   const statusMap = {
//     'placed': 'Order Placed',
//     'follow_up': 'Follow Up',
//     'accepted': 'Accepted',
//     'processing': 'Processing',
//     'shipped': 'Shipped',
//     'out_for_delivery': 'Out for Delivery',
//     'delivered': 'Delivered',
//     'cancelled': 'Cancelled',
//     'reminder': 'Reminder',
//     'refunded': 'Refunded',
//     'failed': 'Failed'
//   };
//   return statusMap[this.orderStatus] || this.orderStatus;
// });

// module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);



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
  costPerItem: { 
    type: Number, 
    default: 0 
  },
  buyingPrice: { 
    type: Number, 
    default: 0 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 0,
    default: 1 
  },
  stockQuantity: { 
    type: Number, 
    default: 0 
  },
  unit: {  
    type: String,
    default: 'pcs'
  },
  selectedColor: {
    type: String,
    default: null
  },
  colors: [{
    color: String,
    quantity: Number,
    price: Number
  }]
});

// ========== CUSTOMER INFO SCHEMA ==========
const customerInfoSchema = new mongoose.Schema({
  fullName: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: false,
    default: '' 
  },
  phone: { 
    type: String, 
    required: true 
  },
  division: { 
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

// ========== ORDER STATUS HISTORY SCHEMA ==========
const orderStatusHistorySchema = new mongoose.Schema({
  status: { 
    type: String, 
     enum: ['placed', 'follow_up', 'accepted', 'approved', 'ready_to_ship', 'courier_assigned', 'rejected', 'cancelled', 'reminder', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'refunded', 'failed', 'returned'],
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
    enum: ['user','super_admin', 'admin', 'moderator', 'system', 'courier', 'call_center'],
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
  labelUrl: { 
    type: String, 
    default: '' 
  },
  invoiceUrl: { 
    type: String, 
    default: '' 
  },
  deliveryStatus: { 
    type: String, 
    enum: ['pending', 'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed', 'returned'],
    default: 'pending' 
  },
  deliveryStatusHistory: [deliveryStatusHistorySchema],
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
  deliveryNote: { 
    type: String, 
    default: '' 
  },
  weight: { 
    type: Number, 
    default: 0 
  },
  dimensions: {
    length: { type: Number, default: 0 },
    width: { type: Number, default: 0 },
    height: { type: Number, default: 0 }
  },
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
  courierResponse: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  },
  metadata: { 
    type: mongoose.Schema.Types.Mixed, 
    default: {} 
  }
}, { _id: false });

// ========== DEVICE INFO SCHEMA ==========
const deviceInfoSchema = new mongoose.Schema({
  // Server-side detected
  ipAddress: { type: String, default: null },
  userAgent: { type: String, default: null },
  deviceType: { type: String, enum: ['mobile', 'tablet', 'desktop', 'unknown'], default: 'unknown' },
  browser: { type: String, default: null },
  browserVersion: { type: String, default: null },
  os: { type: String, default: null },
  osVersion: { type: String, default: null },
  platform: { type: String, default: null },
  
  // Client-side provided
  screenResolution: { type: String, default: null },
  viewportSize: { type: String, default: null },
  colorDepth: { type: Number, default: null },
  pixelRatio: { type: Number, default: null },
  timezone: { type: String, default: null },
  language: { type: String, default: null },
  referrer: { type: String, default: null },
  
  // Connection info
  connectionType: { type: String, default: null },
  connectionSpeed: { type: String, default: null },
  
  // Additional
  doNotTrack: { type: String, default: null },
  vendor: { type: String, default: null }
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
  
  // Order Status
  orderStatus: { 
    type: String, 
     enum: ['placed', 'follow_up', 'accepted', 'approved', 'ready_to_ship', 'courier_assigned', 'rejected', 'cancelled', 'reminder', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'refunded', 'returned', 'failed'],
    default: 'placed' 
  },
  
  // Status History
  statusHistory: [orderStatusHistorySchema],
  
  // Delivery Service
  deliveryService: deliveryServiceSchema,
  
  // Legacy fields
  trackingNumber: { 
    type: String, 
    default: null 
  },
  deliveryNote: { 
    type: String, 
    default: '' 
  },
  
  // Device & Location Information
  deviceInfo: deviceInfoSchema,
  
  // Order Timeline
  orderNumber: { 
    type: String, 
    unique: true 
  },
  orderDate: { 
    type: Date, 
    default: Date.now 
  },
  placedAt: { 
    type: Date, 
    default: Date.now 
  },
  followUpAt: { 
    type: Date, 
    default: null 
  },
  acceptedAt: { 
    type: Date, 
    default: null 
  },
  processingAt: { 
    type: Date, 
    default: null 
  },
  shippedAt: { 
    type: Date, 
    default: null 
  },
  deliveredAt: { 
    type: Date, 
    default: null 
  },
  cancelledAt: { 
    type: Date, 
    default: null 
  },
  reminderAt: { 
    type: Date, 
    default: null 
  },
   approvedAt: { 
    type: Date, 
    default: null 
  },
  returnedAt: { 
  type: Date, 
  default: null 
},
  
  rejectionReason: { 
    type: String, 
    default: '' 
  },
  cancellationReason: { 
    type: String, 
    default: '' 
  },
  restrictionViolation: {
  type: String,
  enum: ['ip_blocked', 'phone_blocked', 'email_blocked', 'ip_time_interval', 'phone_time_interval', 'none'],
  default: 'none'
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
orderSchema.index({ 'customerInfo.phone': 1 });
orderSchema.index({ placedAt: -1 });

// ========== PRE-SAVE HOOK ==========
orderSchema.pre('save', async function() {
  // Generate order number if not exists
  if (!this.orderNumber) {
    try {
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      
      const Order = mongoose.model('Order');
      
      const lastOrder = await Order.findOne({
        orderNumber: { $regex: `^HV${year}${month}` }
      })
      .sort({ orderNumber: -1 })
      .lean();
      
      let sequenceNumber = 1;
      
      if (lastOrder && lastOrder.orderNumber) {
        const match = lastOrder.orderNumber.match(/HV\d{4}(\d{4})/);
        if (match) {
          sequenceNumber = parseInt(match[1]) + 1;
        }
      }
      
      const paddedNumber = sequenceNumber.toString().padStart(4, '0');
      const newOrderNumber = `HV${year}${month}${paddedNumber}`;
      
      const existingOrder = await Order.findOne({ orderNumber: newOrderNumber });
      if (existingOrder) {
        const nextSeq = sequenceNumber + 1;
        const nextPadded = nextSeq.toString().padStart(4, '0');
        this.orderNumber = `HV${year}${month}${nextPadded}`;
      } else {
        this.orderNumber = newOrderNumber;
      }
      
      console.log(`✅ Generated Order Number: ${this.orderNumber}`);
    } catch (error) {
      console.error('Error generating order number:', error);
      const timestamp = Date.now().toString().slice(-6);
      this.orderNumber = `HV${timestamp}`;
    }
  }
  
  // Set placedAt if order is new and status is placed
  if (this.isNew && this.orderStatus === 'placed') {
    this.placedAt = new Date();
  }
  
  // Auto-add status history on status change
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
 */
orderSchema.methods.addStatusHistory = function(status, note = '', updatedBy = null, updatedByRole = 'system') {
  if (!this.statusHistory) {
    this.statusHistory = [];
  }
  
  const lastEntry = this.statusHistory[this.statusHistory.length - 1];
  if (lastEntry && lastEntry.status === status && lastEntry.note === note) {
    return this;
  }

  // Map roles to valid enum values
  let validRole = updatedByRole || 'system';
  
  // Map call_center_agent to call_center
  if (validRole === 'call_center_agent') {
    validRole = 'call_center';
  }
  
  // Ensure the role is valid - if not, default to 'system'
  const validRoles = ['user', 'admin', 'moderator', 'super_admin', 'system', 'courier', 'call_center'];
  if (!validRoles.includes(validRole)) {
    validRole = 'system';
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

// ========== UPDATE updateOrderStatus METHOD ==========
orderSchema.methods.updateOrderStatus = function(newStatus, note = '', updatedBy = null, updatedByRole = 'system') {
  const oldStatus = this.orderStatus;
  
  if (oldStatus === newStatus) {
    return this;
  }
  
  this.orderStatus = newStatus;
  
  // Update timestamps based on status
  const timestampMap = {
    'placed': 'placedAt',
    'follow_up': 'followUpAt',
    'accepted': 'acceptedAt',
    'approved': 'approvedAt',
    'ready_to_ship': 'shippedAt',
    'courier_assigned': 'shippedAt',
    'rejected': 'cancelledAt',
    'cancelled': 'cancelledAt',
    'reminder': 'reminderAt',
    'delivered': 'deliveredAt'
  };
  
  if (timestampMap[newStatus]) {
    this[timestampMap[newStatus]] = new Date();
  }
  
  this.addStatusHistory(newStatus, note || `Status changed from ${oldStatus} to ${newStatus}`, updatedBy, updatedByRole);
  
  return this;
};

/**
 * Update delivery status with history
 */
// orderSchema.methods.updateDeliveryStatus = function(status, message = '', location = '') {
//   if (!this.deliveryService) {
//     this.deliveryService = {};
//   }
  
//   const validStatuses = ['pending', 'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed', 'returned'];
  
//   if (!validStatuses.includes(status)) {
//     throw new Error(`Invalid delivery status: ${status}`);
//   }
  
//   this.deliveryService.deliveryStatus = status;
  
//   if (!this.deliveryService.deliveryStatusHistory) {
//     this.deliveryService.deliveryStatusHistory = [];
//   }
  
//   this.deliveryService.deliveryStatusHistory.push({
//     status,
//     message: message || `Status updated to ${status}`,
//     location,
//     timestamp: new Date()
//   });
  
//   if (status === 'delivered') {
//     this.deliveryService.actualDeliveryDate = new Date();
//   }
  
//   if (status === 'picked_up' && !this.deliveryService.pickedUpDate) {
//     this.deliveryService.pickedUpDate = new Date();
//   }
  
//   if (status === 'delivered') {
//     this.orderStatus = 'delivered';
//     this.deliveredAt = new Date();
//     this.addStatusHistory('delivered', 'Order delivered by courier', null, 'courier');
//   }
  
//   return this;
// };

// In Order.js - Update the updateDeliveryStatus method

// ========== UPDATE DELIVERY STATUS METHOD ==========
/**
 * Update delivery status with history
 * Auto-updates payment status for COD orders when delivered
 */
orderSchema.methods.updateDeliveryStatus = function(status, message = '', location = '') {
  if (!this.deliveryService) {
    this.deliveryService = {};
  }
  
  const validStatuses = ['pending', 'processing', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered', 'cancelled', 'failed', 'returned'];
  
  if (!validStatuses.includes(status)) {
    throw new Error(`Invalid delivery status: ${status}`);
  }
  
  const oldStatus = this.deliveryService.deliveryStatus || 'pending';
  
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
  
  // ========== AUTO-UPDATE ON DELIVERY ==========
  if (status === 'delivered') {
    // 1. Update order status
    this.orderStatus = 'delivered';
    this.deliveredAt = new Date();
    this.addStatusHistory('delivered', 'Order delivered by courier', null, 'courier');
    
    // 2. ========== AUTO-UPDATE PAYMENT STATUS FOR COD ==========
    if (this.paymentMethod === 'cod' && this.paymentStatus !== 'paid') {
      this.paymentStatus = 'paid';
      console.log(`✅ COD order ${this.orderNumber} - Payment auto-updated to Paid on delivery`);
      
      // Update payment details with timestamp
      if (!this.paymentDetails) {
        this.paymentDetails = {};
      }
      this.paymentDetails.paidAt = new Date();
      this.paymentDetails.paidBy = 'System (Auto-updated on delivery)';
    }
  }
  
  // Handle other statuses
  if (status === 'picked_up' && !this.deliveryService.pickedUpDate) {
    this.deliveryService.pickedUpDate = new Date();
  }
  
  if (status === 'delivered') {
    this.deliveryService.actualDeliveryDate = new Date();
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
  
  this.trackingNumber = courierData.trackingNumber || null;
  
  return this;
};

// ========== VIRTUALS ==========
orderSchema.virtual('formattedOrderNumber').get(function() {
  if (this.orderNumber) {
    const match = this.orderNumber.match(/(HV)(\d{2})(\d{2})(\d{4})/);
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
  const canCreateStatuses = ['accepted'];
  return canCreateStatuses.includes(this.orderStatus) && 
         !this.deliveryService?.courierOrderId;
});

orderSchema.virtual('statusLabels').get(function() {
  const statusMap = {
    'placed': 'Order Placed',
    'follow_up': 'Follow Up',
    'accepted': 'Accepted',
    'approved': 'Approved',
    'ready_to_ship': 'Ready to Ship',
    'courier_assigned': 'Courier Assigned',
    'rejected': 'Rejected',
    'cancelled': 'Cancelled',
    'reminder': 'Reminder',
    'processing': 'Processing',
    'shipped': 'Shipped',
    'out_for_delivery': 'Out for Delivery',
    'delivered': 'Delivered',
    'refunded': 'Refunded',
    'failed': 'Failed',
    'returned': 'Returned' 
  };
  return statusMap[this.orderStatus] || this.orderStatus;
});


module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);