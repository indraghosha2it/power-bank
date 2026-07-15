// const Order = require('../models/Order');
// const Cart = require('../models/Cart');
// const Product = require('../models/Product');
// const Coupon = require('../models/Coupon');
// const { 
//   sendOrderPlacedEmail, 
//   sendOrderNotificationToAdmin,
//   sendOrderStatusUpdateEmail ,
//   sendPaymentStatusUpdateEmail
// } = require('../utils/orderEmailService') ;

// // @desc    Create new order (or create pending order for online payment)
// // @route   POST /api/orders
// // @access  Public (with sessionId) or Private (with token)
// // const createOrder = async (req, res) => {
// //   try {
// //     const {
// //       items,
// //       subtotal,
// //       shippingCost,
// //       discount,
// //       total,
// //       paymentMethod,
// //       customerInfo,
// //       couponCode,
// //       couponDiscount,
// //       freeShipping,
// //       orderStatus = 'pending',  // Default to pending
// //       saveOrder = true  // Default to true for COD
// //     } = req.body;

// //     const userId = req.user?._id;
// //     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;

// //     // Validate required fields
// //     if (!items || items.length === 0) {
// //       return res.status(400).json({ success: false, error: 'No items in order' });
// //     }

// //     if (!customerInfo || !customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
// //       return res.status(400).json({ success: false, error: 'Customer information is incomplete' });
// //     }

// //     if (!paymentMethod) {
// //       return res.status(400).json({ success: false, error: 'Payment method is required' });
// //     }

// //     // For online payment, we don't need to check stock or create order yet
// //     // Just prepare the order data and return it
// //     if (paymentMethod === 'online' && !saveOrder) {
// //       // Just prepare the data without saving
// //       const orderData = {
// //         userId: userId || null,
// //         sessionId: userId ? null : sessionId,
// //         items: items.map(item => ({
// //           productId: item.productId,
// //           productName: item.productName,
// //           productSlug: item.productSlug,
// //           image: item.image,
// //           regularPrice: item.regularPrice,
// //           discountPrice: item.discountPrice,
// //           quantity: item.quantity,
// //           stockQuantity: item.stockQuantity
// //         })),
// //         customerInfo: {
// //           fullName: customerInfo.fullName,
// //           email: customerInfo.email,
// //           phone: customerInfo.phone,
// //           whatsapp: customerInfo.whatsapp || '',
// //           address: customerInfo.address,
// //           city: customerInfo.city,
// //           zone: customerInfo.zone,
// //           area: customerInfo.area || '',
// //           zipCode: customerInfo.zipCode || '',
// //           country: customerInfo.country || 'Bangladesh',
// //           note: customerInfo.note || ''
// //         },
// //         subtotal,
// //         shippingCost,
// //         discount: discount || 0,
// //         total,
// //         paymentMethod,
// //         paymentStatus: 'pending',
// //         orderStatus: 'pending',  // Not placed yet
// //         couponCode: couponCode || null,
// //         couponDiscount: couponDiscount || 0,
// //         freeShipping: freeShipping || false,
// //         orderDate: new Date()
// //       };
      
// //       // Return the order data without saving
// //       return res.status(200).json({
// //         success: true,
// //         data: orderData,
// //         message: 'Order data prepared'
// //       });
// //     }

// //     // For COD - Verify stock and create order
// //     for (const item of items) {
// //       const product = await Product.findById(item.productId);
// //       if (!product) {
// //         return res.status(404).json({ success: false, error: `Product ${item.productName} not found` });
// //       }
// //       if (product.stockQuantity < item.quantity) {
// //         return res.status(400).json({ 
// //           success: false, 
// //           error: `Insufficient stock for ${product.productName}. Available: ${product.stockQuantity}` 
// //         });
// //       }
// //     }

// //     // Create order
// //     const order = new Order({
// //       userId: userId || null,
// //       sessionId: userId ? null : sessionId,
// //       items: items.map(item => ({
// //         productId: item.productId,
// //         productName: item.productName,
// //         productSlug: item.productSlug,
// //         image: item.image,
// //         regularPrice: item.regularPrice,
// //         discountPrice: item.discountPrice,
// //         quantity: item.quantity,
// //         stockQuantity: item.stockQuantity,
// //         unit: item.unit || 'pcs'
// //       })),
// //       customerInfo: {
// //         fullName: customerInfo.fullName,
// //         email: customerInfo.email,
// //         phone: customerInfo.phone,
// //         whatsapp: customerInfo.whatsapp || '',
// //         address: customerInfo.address,
// //         city: customerInfo.city,
// //         zone: customerInfo.zone,
// //         area: customerInfo.area || '',
// //         zipCode: customerInfo.zipCode || '',
// //         country: customerInfo.country || 'Bangladesh',
// //         note: customerInfo.note || ''
// //       },
// //       subtotal,
// //       shippingCost,
// //       discount: discount || 0,
// //       total,
// //       paymentMethod,
// //       paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
// //       orderStatus: orderStatus === 'pending' ? 'placed' : orderStatus,
// //       couponCode: couponCode || null,
// //       couponDiscount: couponDiscount || 0,
// //       freeShipping: freeShipping || false,
// //       orderDate: new Date()
// //     });

// //     await order.save();

// //     // Update product stock quantities
// //     for (const item of items) {
// //       await Product.findByIdAndUpdate(
// //         item.productId,
// //         { $inc: { stockQuantity: -item.quantity, purchaseCount: item.quantity } }
// //       );
// //     }

// //     // Clear user's cart after successful order
// //     if (userId) {
// //       await Cart.findOneAndDelete({ userId });
// //     } else if (sessionId) {
// //       await Cart.findOneAndDelete({ sessionId });
// //     }

// //     // Record coupon usage if coupon was applied
// //     if (couponCode) {
// //       try {
// //         const coupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
// //         if (coupon) {
// //           coupon.totalUsedCount = (coupon.totalUsedCount || 0) + 1;
// //           coupon.usageRecords = coupon.usageRecords || [];
// //           coupon.usageRecords.push({
// //             userId: userId || null,
// //             orderId: order._id,
// //             usedAt: new Date(),
// //             discountAmount: couponDiscount || discount
// //           });
// //           await coupon.save();
// //         }
// //       } catch (couponError) {
// //         console.error('Error recording coupon usage:', couponError);
// //       }
// //     }

// //     // ========== SEND EMAIL NOTIFICATIONS ==========
// //     try {
// //       // Send order placed email to customer
// //       await sendOrderPlacedEmail(order, order.customerInfo.email);
// //       console.log('✅ Order placed email sent to customer for order:', order.orderNumber);
      
// //       // Send notification email to admin
// //       await sendOrderNotificationToAdmin(order, 'new');
// //       console.log('✅ Admin notification email sent for order:', order.orderNumber);
// //     } catch (emailError) {
// //       console.error('❌ Email sending error:', emailError);
// //       // Don't fail the order if email fails
// //     }

// //     res.status(201).json({
// //       success: true,
// //       data: order,
// //       orderId: order._id,
// //       message: 'Order placed successfully'
// //     });

// //   } catch (error) {
// //     console.error('Create order error:', error);
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // @desc    Create new order
// // @route   POST /api/orders
// // @access  Public (with sessionId) or Private (with token)
// const createOrder = async (req, res) => {
//   try {
//     const {
//       items,
//       subtotal,
//       shippingCost,
//       discount,
//       total,
//       paymentMethod,
//       customerInfo,
//       couponCode,
//       couponDiscount,
//       freeShipping,
//       orderStatus = 'pending',
//       saveOrder = true
//     } = req.body;

//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;

//     // Validate required fields - ADD division to validation
//     if (!items || items.length === 0) {
//       return res.status(400).json({ success: false, error: 'No items in order' });
//     }

//     if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address || !customerInfo.division) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Customer information is incomplete. Full name, phone, address, and division are required.' 
//       });
//     }

//     if (!paymentMethod) {
//       return res.status(400).json({ success: false, error: 'Payment method is required' });
//     }

//     // For online payment, we don't need to check stock or create order yet
//     if (paymentMethod === 'online' && !saveOrder) {
//       const orderData = {
//         userId: userId || null,
//         sessionId: userId ? null : sessionId,
//         items: items.map(item => ({
//           productId: item.productId,
//           productName: item.productName,
//           productSlug: item.productSlug,
//           image: item.image,
//           regularPrice: item.regularPrice,
//           discountPrice: item.discountPrice,
//           quantity: item.quantity,
//           stockQuantity: item.stockQuantity
//         })),
//         customerInfo: {
//           fullName: customerInfo.fullName,
//           email: customerInfo.email || '',
//           phone: customerInfo.phone,
//           division: customerInfo.division, // <-- ADD THIS
//           address: customerInfo.address,
//           city: customerInfo.city,
//           zone: customerInfo.zone,
//           area: customerInfo.area || '',
//           zipCode: customerInfo.zipCode || '',
//           country: customerInfo.country || 'Bangladesh',
//           note: customerInfo.note || ''
//         },
//         subtotal,
//         shippingCost,
//         discount: discount || 0,
//         total,
//         paymentMethod,
//         paymentStatus: 'pending',
//         orderStatus: 'pending',
//         couponCode: couponCode || null,
//         couponDiscount: couponDiscount || 0,
//         freeShipping: freeShipping || false,
//         orderDate: new Date()
//       };
      
//       return res.status(200).json({
//         success: true,
//         data: orderData,
//         message: 'Order data prepared'
//       });
//     }

//     // For COD - Verify stock and create order
//     for (const item of items) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, error: `Product ${item.productName} not found` });
//       }
//       if (product.stockQuantity < item.quantity) {
//         return res.status(400).json({ 
//           success: false, 
//           error: `Insufficient stock for ${product.productName}. Available: ${product.stockQuantity}` 
//         });
//       }
//     }

//     // Create order - ADD division to customerInfo
//     const order = new Order({
//       userId: userId || null,
//       sessionId: userId ? null : sessionId,
//       items: items.map(item => ({
//         productId: item.productId,
//         productName: item.productName,
//         productSlug: item.productSlug,
//         image: item.image,
//         regularPrice: item.regularPrice,
//         discountPrice: item.discountPrice,
//         quantity: item.quantity,
//         stockQuantity: item.stockQuantity,
//         unit: item.unit || 'pcs'
//       })),
//       customerInfo: {
//         fullName: customerInfo.fullName,
//         email: customerInfo.email || '',
//         phone: customerInfo.phone,
//         division: customerInfo.division, // <-- ADD THIS
//         address: customerInfo.address,
//         city: customerInfo.city,
//         zone: customerInfo.zone,
//         area: customerInfo.area || '',
//         zipCode: customerInfo.zipCode || '',
//         country: customerInfo.country || 'Bangladesh',
//         note: customerInfo.note || ''
//       },
//       subtotal,
//       shippingCost,
//       discount: discount || 0,
//       total,
//       paymentMethod,
//       paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
//       orderStatus: orderStatus === 'pending' ? 'placed' : orderStatus,
//       couponCode: couponCode || null,
//       couponDiscount: couponDiscount || 0,
//       freeShipping: freeShipping || false,
//       orderDate: new Date()
//     });

//     await order.save();

//     // ========== UPDATE PRODUCT STOCK ==========
//     for (const item of items) {
//       await Product.findByIdAndUpdate(
//         item.productId,
//         { $inc: { stockQuantity: -item.quantity, purchaseCount: item.quantity } }
//       );
//     }

//     // ========== CLEAR USER'S CART ==========
//     if (userId) {
//       await Cart.findOneAndDelete({ userId });
//     } else if (sessionId) {
//       await Cart.findOneAndDelete({ sessionId });
//     }

//     // ========== RECORD COUPON USAGE ==========
//     if (couponCode) {
//       try {
//         const coupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
//         if (coupon) {
//           coupon.totalUsedCount = (coupon.totalUsedCount || 0) + 1;
//           coupon.usageRecords = coupon.usageRecords || [];
//           coupon.usageRecords.push({
//             userId: userId || null,
//             orderId: order._id,
//             usedAt: new Date(),
//             discountAmount: couponDiscount || discount
//           });
//           await coupon.save();
//         }
//       } catch (couponError) {
//         console.error('Error recording coupon usage:', couponError);
//       }
//     }

//     // ========== SEND EMAIL NOTIFICATIONS ==========
//     // Send customer email ONLY if email is provided
//     if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
//       try {
//         await sendOrderPlacedEmail(order, order.customerInfo.email);
//         console.log('✅ Order placed email sent to customer:', order.customerInfo.email, 'for order:', order.orderNumber);
//       } catch (emailError) {
//         console.error('❌ Customer email sending error:', emailError.message);
//         // Don't fail the order if email fails
//       }
//     } else {
//       console.log(`ℹ️ No email provided for order ${order.orderNumber}, skipping customer email notification`);
//     }

//     // ALWAYS send admin notification (admin email is configured in .env)
//     try {
//       await sendOrderNotificationToAdmin(order, 'new');
//       console.log('✅ Admin notification email sent for order:', order.orderNumber);
//     } catch (emailError) {
//       console.error('❌ Admin email sending error:', emailError.message);
//       // Don't fail the order if email fails
//     }

//     // ========== SEND SUCCESS RESPONSE ==========
//     res.status(201).json({
//       success: true,
//       data: order,
//       orderId: order._id,
//       message: 'Order placed successfully'
//     });

//   } catch (error) {
//     console.error('Create order error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Get user's orders
// // @route   GET /api/orders
// // @access  Public (with sessionId) or Private (with token)
// // const getUserOrders = async (req, res) => {
// //   try {
// //     const userId = req.user?._id;
// //     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
// //     const { page = 1, limit = 10, orderStatus, paymentStatus, paymentMethod, search } = req.query;
    
// //     const query = {};
    
// //     if (userId) {
// //       query.userId = userId;
// //     } else if (sessionId) {
// //       query.sessionId = sessionId;
// //     } else {
// //       return res.status(200).json({ 
// //         success: true, 
// //         data: [], 
// //         pagination: { total: 0, page: 1, pages: 0, limit: 10 }
// //       });
// //     }
    
// //     if (orderStatus) query.orderStatus = orderStatus;
// //     if (paymentStatus) query.paymentStatus = paymentStatus;
// //     if (paymentMethod) query.paymentMethod = paymentMethod;
    
// //     // Add search functionality for customer orders
// //     if (search) {
// //       const searchRegex = new RegExp(search, 'i');
// //       query.$or = [
// //         { orderNumber: searchRegex },
// //         { 'customerInfo.fullName': searchRegex },
// //         { 'customerInfo.email': searchRegex },
// //         { 'customerInfo.phone': searchRegex },
// //         { 'items.productName': searchRegex }
// //       ];
// //     }
    
// //     const skip = (parseInt(page) - 1) * parseInt(limit);
    
// //     const [orders, total] = await Promise.all([
// //       Order.find(query)
// //         .sort({ createdAt: -1 })
// //         .skip(skip)
// //         .limit(parseInt(limit)),
// //       Order.countDocuments(query)
// //     ]);
    
// //     res.json({
// //       success: true,
// //       data: orders,
// //       pagination: {
// //         total,
// //         page: parseInt(page),
// //         pages: Math.ceil(total / parseInt(limit)),
// //         limit: parseInt(limit)
// //       }
// //     });
    
// //   } catch (error) {
// //     console.error('Get user orders error:', error);
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // @desc    Get user's orders
// // @route   GET /api/orders
// // @access  Public (with sessionId) or Private (with token)
// const getUserOrders = async (req, res) => {
//   try {
//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
//     const { page = 1, limit = 10, orderStatus, paymentStatus, paymentMethod, search } = req.query;
    
//     const query = {};
    
//     if (userId) {
//       query.userId = userId;
//     } else if (sessionId) {
//       query.sessionId = sessionId;
//     } else {
//       return res.status(200).json({ 
//         success: true, 
//         data: [], 
//         pagination: { total: 0, page: 1, pages: 0, limit: 10 }
//       });
//     }
    
//     if (orderStatus) query.orderStatus = orderStatus;
//     if (paymentStatus) query.paymentStatus = paymentStatus;
//     if (paymentMethod) query.paymentMethod = paymentMethod;
    
//     // Add search functionality for customer orders
//     if (search) {
//       const searchRegex = new RegExp(search, 'i');
//       query.$or = [
//         { orderNumber: searchRegex },
//         { 'customerInfo.fullName': searchRegex },
//         { 'customerInfo.email': searchRegex },
//         { 'customerInfo.phone': searchRegex },
//         { 'customerInfo.division': searchRegex },
//         { 'customerInfo.city': searchRegex },
//         { 'items.productName': searchRegex }
//       ];
//     }
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     const [orders, total] = await Promise.all([
//       Order.find(query)
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Order.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: orders,
//       pagination: {
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         limit: parseInt(limit)
//       }
//     });
    
//   } catch (error) {
//     console.error('Get user orders error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Get single order by ID
// // @route   GET /api/orders/:id
// // @access  Public (with sessionId) or Private (with token)
// const getOrderById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
//     const order = await Order.findById(id);
    
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }
    
//     // Check if user has permission to view this order
//     const hasPermission = (userId && order.userId && order.userId.toString() === userId.toString()) ||
//                          (sessionId && order.sessionId === sessionId);
    
//     if (!hasPermission) {
//       return res.status(403).json({ success: false, error: 'Unauthorized to view this order' });
//     }
    
//     res.json({ success: true, data: order });
    
//   } catch (error) {
//     console.error('Get order by ID error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


// // @desc    Update order status (Admin/Moderator)
// // @route   PUT /api/orders/:id/status
// // @access  Private (Admin/Moderator)
// // const updateOrderStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { orderStatus, trackingNumber, deliveryNote, cancellationReason } = req.body;
    
// //     const order = await Order.findById(id);
    
// //     if (!order) {
// //       return res.status(404).json({ success: false, error: 'Order not found' });
// //     }
    
// //     // ✅ Check if order is cancelled - no further actions allowed
// //     if (order.orderStatus === 'cancelled') {
// //       return res.status(400).json({ 
// //         success: false, 
// //         error: 'Order is cancelled. No further actions can be performed.' 
// //       });
// //     }
    
// //     // ✅ Check if order is delivered - no further actions allowed
// //     if (order.orderStatus === 'delivered') {
// //       return res.status(400).json({ 
// //         success: false, 
// //         error: 'Order is already delivered. Status cannot be changed.' 
// //       });
// //     }
    
// //     // ✅ Check if order has delivery created - status cannot be changed manually
// //     if (order.deliveryService && order.deliveryService.courierOrderId) {
// //       return res.status(400).json({ 
// //         success: false, 
// //         error: 'Delivery already created for this order. Status cannot be changed manually.' 
// //       });
// //     }
    
// //     // ✅ Define allowed status transitions - COMPLETE FLOW
// //     const allowedTransitions = {
// //       'placed': ['confirmed', 'cancelled'],
// //       'confirmed': ['processing', 'cancelled'],
// //       'processing': ['shipped', 'cancelled'],
// //       'shipped': ['delivered', 'cancelled'],
// //       'delivered': [], // No further changes allowed
// //       'cancelled': []  // No further changes allowed
// //     };
    
// //     const currentStatus = order.orderStatus;
// //     const newStatus = orderStatus;
    
// //     // ✅ Validate status transition
// //     if (currentStatus !== newStatus) {
// //       const allowedNext = allowedTransitions[currentStatus] || [];
// //       if (!allowedNext.includes(newStatus)) {
// //         return res.status(400).json({ 
// //           success: false, 
// //           error: `Invalid status transition from "${currentStatus}" to "${newStatus}". Allowed: ${allowedNext.join(', ')}` 
// //         });
// //       }
// //     }
    
// //     // ✅ Store old status before updating
// //     const oldStatus = order.orderStatus;
    
// //     // ✅ Handle special cases for status changes
    
// //     // If order is being cancelled
// //     if (orderStatus === 'cancelled' && order.orderStatus !== 'cancelled') {
// //       order.cancelledAt = new Date();
// //       if (cancellationReason) {
// //         order.cancellationReason = cancellationReason;
// //       }
      
// //       // Restore stock for cancelled order
// //       for (const item of order.items) {
// //         await Product.findByIdAndUpdate(
// //           item.productId,
// //           { $inc: { stockQuantity: item.quantity } }
// //         );
// //       }
// //     }
    
// //     // If order is being delivered
// //     if (orderStatus === 'delivered' && order.orderStatus !== 'delivered') {
// //       order.deliveredAt = new Date();
      
// //       // For COD orders, automatically mark payment as paid when delivered
// //       if (order.paymentMethod === 'cod' && order.paymentStatus !== 'paid') {
// //         order.paymentStatus = 'paid';
// //         console.log(`✅ COD order ${order.orderNumber} - Payment status auto-updated to Paid on delivery`);
// //       }
// //     }
    
// //     // ✅ Update order fields
// //     if (orderStatus) order.orderStatus = orderStatus;
// //     if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
// //     if (deliveryNote !== undefined) order.deliveryNote = deliveryNote;
    
// //     // ✅ Add status history
// //     const userId = req.user?._id;
// //     const userRole = req.user?.role || 'admin';
// //     let statusNote = `Status updated from ${oldStatus} to ${orderStatus}`;
    
// //     if (orderStatus === 'cancelled' && cancellationReason) {
// //       statusNote = cancellationReason;
// //     }
    
// //     if (orderStatus === 'delivered') {
// //       statusNote = 'Order delivered successfully';
// //     }
    
// //     order.addStatusHistory(orderStatus, statusNote, userId, userRole);
    
// //     await order.save();
    
// //     // ========== SEND EMAIL NOTIFICATIONS ==========
// //     if (oldStatus !== orderStatus) {
// //       try {
// //         await sendOrderStatusUpdateEmail(order, order.customerInfo.email, oldStatus, orderStatus);
// //         console.log('✅ Status update email sent to customer for order:', order.orderNumber);
// //       } catch (emailError) {
// //         console.error('❌ Status update email error:', emailError);
// //       }

// //       try {
// //         await sendOrderNotificationToAdmin(order, 'status_update');
// //         console.log('✅ Status update notification sent to admin for order:', order.orderNumber);
// //       } catch (emailError) {
// //         console.error('❌ Admin notification error on status update:', emailError);
// //       }
// //     }
    
// //     // ✅ Prepare response message
// //     let responseMessage = `Order status updated to ${orderStatus}`;
// //     if (orderStatus === 'delivered' && order.paymentMethod === 'cod' && order.paymentStatus === 'paid') {
// //       responseMessage = `Order delivered and payment marked as Paid`;
// //     }
    
// //     res.json({
// //       success: true,
// //       data: order,
// //       message: responseMessage
// //     });
    
// //   } catch (error) {
// //     console.error('Update order status error:', error);
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };



// // @desc    Update order status (Admin/Moderator)
// // @route   PUT /api/orders/:id/status
// // @access  Private (Admin/Moderator)
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { orderStatus, trackingNumber, deliveryNote, cancellationReason } = req.body;
    
//     const order = await Order.findById(id);
    
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }
    
//     // ✅ Check if order is cancelled - no further actions allowed
//     if (order.orderStatus === 'cancelled') {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Order is cancelled. No further actions can be performed.' 
//       });
//     }
    
//     // ✅ Check if order is delivered - no further actions allowed
//     if (order.orderStatus === 'delivered') {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Order is already delivered. Status cannot be changed.' 
//       });
//     }
    
//     // ✅ Check if order has delivery created - status cannot be changed manually
//     if (order.deliveryService && order.deliveryService.courierOrderId) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Delivery already created for this order. Status cannot be changed manually.' 
//       });
//     }
    
//     // ✅ Define allowed status transitions - COMPLETE FLOW
//     const allowedTransitions = {
//       'placed': ['confirmed', 'cancelled'],
//       'confirmed': ['processing', 'cancelled'],
//       'processing': ['shipped', 'cancelled'],
//       'shipped': ['delivered', 'cancelled'],
//       'delivered': [], // No further changes allowed
//       'cancelled': []  // No further changes allowed
//     };
    
//     const currentStatus = order.orderStatus;
//     const newStatus = orderStatus;
    
//     // ✅ Validate status transition
//     if (currentStatus !== newStatus) {
//       const allowedNext = allowedTransitions[currentStatus] || [];
//       if (!allowedNext.includes(newStatus)) {
//         return res.status(400).json({ 
//           success: false, 
//           error: `Invalid status transition from "${currentStatus}" to "${newStatus}". Allowed: ${allowedNext.join(', ')}` 
//         });
//       }
//     }
    
//     // ✅ Store old status before updating
//     const oldStatus = order.orderStatus;
    
//     // ✅ Handle special cases for status changes
    
//     // If order is being cancelled
//     if (orderStatus === 'cancelled' && order.orderStatus !== 'cancelled') {
//       order.cancelledAt = new Date();
//       if (cancellationReason) {
//         order.cancellationReason = cancellationReason;
//       }
      
//       // Restore stock for cancelled order
//       for (const item of order.items) {
//         await Product.findByIdAndUpdate(
//           item.productId,
//           { $inc: { stockQuantity: item.quantity } }
//         );
//       }
//     }
    
//     // If order is being delivered
//     if (orderStatus === 'delivered' && order.orderStatus !== 'delivered') {
//       order.deliveredAt = new Date();
      
//       // For COD orders, automatically mark payment as paid when delivered
//       if (order.paymentMethod === 'cod' && order.paymentStatus !== 'paid') {
//         order.paymentStatus = 'paid';
//         console.log(`✅ COD order ${order.orderNumber} - Payment status auto-updated to Paid on delivery`);
//       }
//     }
    
//     // ✅ Update order fields
//     if (orderStatus) order.orderStatus = orderStatus;
//     if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
//     if (deliveryNote !== undefined) order.deliveryNote = deliveryNote;
    
//     // ✅ Add status history
//     const userId = req.user?._id;
//     const userRole = req.user?.role || 'admin';
//     let statusNote = `Status updated from ${oldStatus} to ${orderStatus}`;
    
//     if (orderStatus === 'cancelled' && cancellationReason) {
//       statusNote = cancellationReason;
//     }
    
//     if (orderStatus === 'delivered') {
//       statusNote = 'Order delivered successfully';
//     }
    
//     order.addStatusHistory(orderStatus, statusNote, userId, userRole);
    
//     await order.save();
    
//     // ========== SEND EMAIL NOTIFICATIONS ==========
//     if (oldStatus !== orderStatus) {
//       // Send to customer ONLY if email exists
//       if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
//         try {
//           await sendOrderStatusUpdateEmail(order, order.customerInfo.email, oldStatus, orderStatus);
//           console.log('✅ Status update email sent to customer for order:', order.orderNumber);
//         } catch (emailError) {
//           console.error('❌ Status update email error:', emailError.message);
//         }
//       } else {
//         console.log(`ℹ️ No email provided for order ${order.orderNumber}, skipping customer status update email`);
//       }

//       // ALWAYS send admin notification
//       try {
//         await sendOrderNotificationToAdmin(order, 'status_update');
//         console.log('✅ Status update notification sent to admin for order:', order.orderNumber);
//       } catch (emailError) {
//         console.error('❌ Admin notification error on status update:', emailError.message);
//       }
//     }
    
//     // ✅ Prepare response message
//     let responseMessage = `Order status updated to ${orderStatus}`;
//     if (orderStatus === 'delivered' && order.paymentMethod === 'cod' && order.paymentStatus === 'paid') {
//       responseMessage = `Order delivered and payment marked as Paid`;
//     }
    
//     res.json({
//       success: true,
//       data: order,
//       message: responseMessage
//     });
    
//   } catch (error) {
//     console.error('Update order status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };






// // @desc    Update payment status (Admin/Moderator)
// // @route   PUT /api/orders/:id/payment
// // @access  Private (Admin/Moderator)
// // const updatePaymentStatus = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { paymentStatus, paymentDetails } = req.body;
    
// //     const order = await Order.findById(id);
    
// //     if (!order) {
// //       return res.status(404).json({ success: false, error: 'Order not found' });
// //     }
    
// //     const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    
// //     if (!validStatuses.includes(paymentStatus)) {
// //       return res.status(400).json({ success: false, error: 'Invalid payment status' });
// //     }
    
// //     // Store old status before updating
// //     const oldStatus = order.paymentStatus;
    
// //     // Validate status transitions
// //     const currentStatus = order.paymentStatus;
// //     const orderStatus = order.orderStatus;
    
// //     // Pending → Paid or Failed
// //     if (currentStatus === 'pending') {
// //       if (!['paid', 'failed'].includes(paymentStatus)) {
// //         return res.status(400).json({ 
// //           success: false, 
// //           error: 'Pending status can only be changed to Paid or Failed' 
// //         });
// //       }
// //     }
// //     // Failed → Paid only
// //     else if (currentStatus === 'failed') {
// //       if (paymentStatus !== 'paid') {
// //         return res.status(400).json({ 
// //           success: false, 
// //           error: 'Failed status can only be changed to Paid' 
// //         });
// //       }
// //     }
// //     // Paid → Refunded only (allow for cancelled or delivered orders, or manual refund)
// //     else if (currentStatus === 'paid') {
// //       if (paymentStatus !== 'refunded') {
// //         return res.status(400).json({ 
// //           success: false, 
// //           error: 'Paid status can only be changed to Refunded' 
// //         });
// //       }
// //       // Optional: Add warning but still allow
// //       if (orderStatus !== 'cancelled' && orderStatus !== 'delivered') {
// //         console.log(`Warning: Changing payment to refunded for order ${order.orderNumber} with status ${orderStatus}`);
// //       }
// //     }
// //     // Refunded → No changes allowed
// //     else if (currentStatus === 'refunded') {
// //       return res.status(400).json({ 
// //         success: false, 
// //         error: 'Refunded status cannot be changed further' 
// //       });
// //     }
    
// //     order.paymentStatus = paymentStatus;
// //     if (paymentDetails) {
// //       order.paymentDetails = { ...order.paymentDetails, ...paymentDetails };
// //     }
    
// //     await order.save();
    
// //     // ========== SEND PAYMENT STATUS UPDATE EMAIL TO CUSTOMER ==========
// //     if (oldStatus !== paymentStatus) {
// //       try {
// //         await sendPaymentStatusUpdateEmail(order, order.customerInfo.email, oldStatus, paymentStatus);
// //         console.log('✅ Payment status update email sent to customer for order:', order.orderNumber);
// //       } catch (emailError) {
// //         console.error('❌ Payment status update email error:', emailError);
// //         // Don't fail the payment status update if email fails
// //       }

// //        // ========== ALSO SEND NOTIFICATION TO ADMIN ==========
// //       try {
// //         await sendOrderNotificationToAdmin(order, 'payment_update');
// //         console.log('✅ Payment status update notification sent to admin for order:', order.orderNumber);
// //       } catch (emailError) {
// //         console.error('❌ Admin notification error on payment update:', emailError);
// //       }
// //     }
    
// //     res.json({
// //       success: true,
// //       data: order,
// //       message: `Payment status updated to ${paymentStatus}`
// //     });
    
// //   } catch (error) {
// //     console.error('Update payment status error:', error);
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };


// // @desc    Update payment status (Admin/Moderator)
// // @route   PUT /api/orders/:id/payment
// // @access  Private (Admin/Moderator)
// const updatePaymentStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { paymentStatus, paymentDetails } = req.body;
    
//     const order = await Order.findById(id);
    
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }
    
//     const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    
//     if (!validStatuses.includes(paymentStatus)) {
//       return res.status(400).json({ success: false, error: 'Invalid payment status' });
//     }
    
//     // Store old status before updating
//     const oldStatus = order.paymentStatus;
    
//     // Validate status transitions
//     const currentStatus = order.paymentStatus;
//     const orderStatus = order.orderStatus;
    
//     // Pending → Paid or Failed
//     if (currentStatus === 'pending') {
//       if (!['paid', 'failed'].includes(paymentStatus)) {
//         return res.status(400).json({ 
//           success: false, 
//           error: 'Pending status can only be changed to Paid or Failed' 
//         });
//       }
//     }
//     // Failed → Paid only
//     else if (currentStatus === 'failed') {
//       if (paymentStatus !== 'paid') {
//         return res.status(400).json({ 
//           success: false, 
//           error: 'Failed status can only be changed to Paid' 
//         });
//       }
//     }
//     // Paid → Refunded only (allow for cancelled or delivered orders, or manual refund)
//     else if (currentStatus === 'paid') {
//       if (paymentStatus !== 'refunded') {
//         return res.status(400).json({ 
//           success: false, 
//           error: 'Paid status can only be changed to Refunded' 
//         });
//       }
//       // Optional: Add warning but still allow
//       if (orderStatus !== 'cancelled' && orderStatus !== 'delivered') {
//         console.log(`Warning: Changing payment to refunded for order ${order.orderNumber} with status ${orderStatus}`);
//       }
//     }
//     // Refunded → No changes allowed
//     else if (currentStatus === 'refunded') {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Refunded status cannot be changed further' 
//       });
//     }
    
//     order.paymentStatus = paymentStatus;
//     if (paymentDetails) {
//       order.paymentDetails = { ...order.paymentDetails, ...paymentDetails };
//     }
    
//     await order.save();
    
//     // ========== SEND PAYMENT STATUS UPDATE EMAIL TO CUSTOMER ==========
//     if (oldStatus !== paymentStatus) {
//       // Send to customer ONLY if email exists
//       if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
//         try {
//           await sendPaymentStatusUpdateEmail(order, order.customerInfo.email, oldStatus, paymentStatus);
//           console.log('✅ Payment status update email sent to customer for order:', order.orderNumber);
//         } catch (emailError) {
//           console.error('❌ Payment status update email error:', emailError.message);
//         }
//       } else {
//         console.log(`ℹ️ No email provided for order ${order.orderNumber}, skipping customer payment update email`);
//       }

//       // ALWAYS send admin notification
//       try {
//         await sendOrderNotificationToAdmin(order, 'payment_update');
//         console.log('✅ Payment status update notification sent to admin for order:', order.orderNumber);
//       } catch (emailError) {
//         console.error('❌ Admin notification error on payment update:', emailError.message);
//       }
//     }
    
//     res.json({
//       success: true,
//       data: order,
//       message: `Payment status updated to ${paymentStatus}`
//     });
    
//   } catch (error) {
//     console.error('Update payment status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };



// // const cancelOrder = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { cancellationReason } = req.body;
// //     const userId = req.user?._id;
// //     const userRole = req.user?.role;
// //     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
// //     const order = await Order.findById(id);
    
// //     if (!order) {
// //       return res.status(404).json({ success: false, error: 'Order not found' });
// //     }
    
// //     // Check permission
// //     const hasPermission = (userId && order.userId && order.userId.toString() === userId.toString()) ||
// //                          (sessionId && order.sessionId === sessionId) ||
// //                          ['admin', 'moderator'].includes(userRole);
    
// //     if (!hasPermission) {
// //       return res.status(403).json({ success: false, error: 'Unauthorized to cancel this order' });
// //     }
    
// //     // Different rules for customers vs admin/moderator
// //     const isAdminOrModerator = ['admin', 'moderator'].includes(userRole);
    
// //     if (!isAdminOrModerator) {
// //       // CUSTOMER RULES: Only can cancel when status is 'placed'
// //       if (order.orderStatus !== 'placed') {
// //         return res.status(400).json({ 
// //           success: false, 
// //           error: `Order cannot be cancelled. Current status: ${order.orderStatus}. Only 'Placed' orders can be cancelled by customer.` 
// //         });
// //       }
// //     } else {
// //       // ADMIN/MODERATOR RULES: Can cancel when status is placed, confirmed, processing, shipped
// //       const cancelableStatuses = ['placed', 'confirmed', 'processing', 'shipped'];
      
// //       if (!cancelableStatuses.includes(order.orderStatus)) {
// //         return res.status(400).json({ 
// //           success: false, 
// //           error: `Order cannot be cancelled. Current status: ${order.orderStatus}. Only 'Placed', 'Confirmed', 'Processing', or 'Shipped' orders can be cancelled.` 
// //         });
// //       }
// //     }
    
// //     const oldStatus = order.orderStatus;
// //     order.orderStatus = 'cancelled';
// //     order.cancelledAt = new Date();
// //     order.cancellationReason = cancellationReason || (isAdminOrModerator ? 'Cancelled by admin' : 'Cancelled by customer');
    
// //     // ✅ Add status history
// //     order.addStatusHistory(
// //       'cancelled', 
// //       cancellationReason || 'Order cancelled',
// //       userId,
// //       isAdminOrModerator ? userRole : 'user'
// //     );
    
// //     // Restore stock
// //     for (const item of order.items) {
// //       await Product.findByIdAndUpdate(
// //         item.productId,
// //         { $inc: { stockQuantity: item.quantity } }
// //       );
// //     }
    
// //     await order.save();
    
// //     res.json({
// //       success: true,
// //       data: order,
// //       message: 'Order cancelled successfully'
// //     });
    
// //   } catch (error) {
// //     console.error('Cancel order error:', error);
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // @desc    Get all orders (Admin only)
// // @route   GET /api/orders/admin/all


// // @desc    Cancel order (User/Admin/Moderator)
// // @route   PUT /api/orders/:id/cancel
// // @access  Public (with sessionId) or Private (with token)
// const cancelOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { cancellationReason } = req.body;
//     const userId = req.user?._id;
//     const userRole = req.user?.role;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
//     const order = await Order.findById(id);
    
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }
    
//     // Check permission
//     const hasPermission = (userId && order.userId && order.userId.toString() === userId.toString()) ||
//                          (sessionId && order.sessionId === sessionId) ||
//                          ['admin', 'moderator'].includes(userRole);
    
//     if (!hasPermission) {
//       return res.status(403).json({ success: false, error: 'Unauthorized to cancel this order' });
//     }
    
//     // Different rules for customers vs admin/moderator
//     const isAdminOrModerator = ['admin', 'moderator'].includes(userRole);
    
//     if (!isAdminOrModerator) {
//       // CUSTOMER RULES: Only can cancel when status is 'placed'
//       if (order.orderStatus !== 'placed') {
//         return res.status(400).json({ 
//           success: false, 
//           error: `Order cannot be cancelled. Current status: ${order.orderStatus}. Only 'Placed' orders can be cancelled by customer.` 
//         });
//       }
//     } else {
//       // ADMIN/MODERATOR RULES: Can cancel when status is placed, confirmed, processing, shipped
//       const cancelableStatuses = ['placed', 'confirmed', 'processing', 'shipped'];
      
//       if (!cancelableStatuses.includes(order.orderStatus)) {
//         return res.status(400).json({ 
//           success: false, 
//           error: `Order cannot be cancelled. Current status: ${order.orderStatus}. Only 'Placed', 'Confirmed', 'Processing', or 'Shipped' orders can be cancelled.` 
//         });
//       }
//     }
    
//     const oldStatus = order.orderStatus;
//     order.orderStatus = 'cancelled';
//     order.cancelledAt = new Date();
//     order.cancellationReason = cancellationReason || (isAdminOrModerator ? 'Cancelled by admin' : 'Cancelled by customer');
    
//     // ✅ Add status history
//     order.addStatusHistory(
//       'cancelled', 
//       cancellationReason || 'Order cancelled',
//       userId,
//       isAdminOrModerator ? userRole : 'user'
//     );
    
//     // Restore stock
//     for (const item of order.items) {
//       await Product.findByIdAndUpdate(
//         item.productId,
//         { $inc: { stockQuantity: item.quantity } }
//       );
//     }
    
//     await order.save();
    
//     // ========== SEND CANCELLATION EMAILS ==========
//     // Send to customer ONLY if email exists
//     if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
//       try {
//         // Send status update email with cancellation
//         await sendOrderStatusUpdateEmail(order, order.customerInfo.email, oldStatus, 'cancelled');
//         console.log('✅ Cancellation email sent to customer for order:', order.orderNumber);
//       } catch (emailError) {
//         console.error('❌ Cancellation email error:', emailError.message);
//       }
//     } else {
//       console.log(`ℹ️ No email provided for order ${order.orderNumber}, skipping customer cancellation email`);
//     }

//     // ALWAYS send admin notification
//     try {
//       await sendOrderNotificationToAdmin(order, 'status_update');
//       console.log('✅ Cancellation notification sent to admin for order:', order.orderNumber);
//     } catch (emailError) {
//       console.error('❌ Admin notification error on cancellation:', emailError.message);
//     }
    
//     res.json({
//       success: true,
//       data: order,
//       message: 'Order cancelled successfully'
//     });
    
//   } catch (error) {
//     console.error('Cancel order error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @access  Private (Admin only)
// // const getAllOrders = async (req, res) => {
// //   try {
// //     const {
// //       page = 1,
// //       limit = 20,
// //       orderStatus,
// //       paymentStatus,
// //       search,
// //       startDate,
// //       endDate,
// //       sort = '-createdAt'
// //     } = req.query;
    
// //     const query = {};
    
// //     if (orderStatus) query.orderStatus = orderStatus;
// //     if (paymentStatus) query.paymentStatus = paymentStatus;
    
// //     // Search by order number or customer name/email
// //     if (search) {
// //       const searchRegex = new RegExp(search, 'i');
// //       query.$or = [
// //         { orderNumber: searchRegex },  
// //         { 'customerInfo.fullName': searchRegex },
// //         { 'customerInfo.email': searchRegex },
// //         { 'customerInfo.phone': searchRegex }
// //       ];
// //     }
    
// //     // Date range filter
// //     if (startDate || endDate) {
// //       query.createdAt = {};
// //       if (startDate) query.createdAt.$gte = new Date(startDate);
// //       if (endDate) query.createdAt.$lte = new Date(endDate);
// //     }
    
// //     const skip = (parseInt(page) - 1) * parseInt(limit);
    
// //     // Sort options - Fix the sort mapping
// //     let sortOption = {};
// //     switch (sort) {
// //       case 'createdAt_asc':
// //         sortOption = { createdAt: 1 };
// //         break;
// //       case 'createdAt_desc':
// //         sortOption = { createdAt: -1 };
// //         break;
// //       case 'total_asc':
// //         sortOption = { total: 1 };
// //         break;
// //       case 'total_desc':
// //         sortOption = { total: -1 };
// //         break;
// //       case '-createdAt':
// //         sortOption = { createdAt: -1 };
// //         break;
// //       case '-total':
// //         sortOption = { total: -1 };
// //         break;
// //       default:
// //         sortOption = { createdAt: -1 };
// //     }
    
// //     const [orders, total] = await Promise.all([
// //       Order.find(query)
// //         .populate('userId', 'name email phone')
// //         .sort(sortOption)
// //         .skip(skip)
// //         .limit(parseInt(limit)),
// //       Order.countDocuments(query)
// //     ]);
    
// //     res.json({
// //       success: true,
// //       data: orders,
// //       pagination: {
// //         total,
// //         page: parseInt(page),
// //         pages: Math.ceil(total / parseInt(limit)),
// //         limit: parseInt(limit)
// //       }
// //     });
    
// //   } catch (error) {
// //     console.error('Get all orders error:', error);
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // @desc    Get all orders (Admin only)
// // @route   GET /api/orders/admin/all
// // @access  Private (Admin only)
// // @desc    Get all orders (Admin only)
// // @route   GET /api/orders/admin/all
// // @access  Private (Admin only)
// const getAllOrders = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 20,
//       orderStatus,
//       paymentStatus,
//       search,
//       startDate,
//       endDate,
//       sort = '-createdAt'
//     } = req.query;
    
//     const query = {};
    
//     if (orderStatus) query.orderStatus = orderStatus;
//     if (paymentStatus) query.paymentStatus = paymentStatus;
    
//     // Search by order number or customer name/email/phone/division
//     if (search) {
//       const searchRegex = new RegExp(search, 'i');
//       query.$or = [
//         { orderNumber: searchRegex },  
//         { 'customerInfo.fullName': searchRegex },
//         { 'customerInfo.email': searchRegex },
//         { 'customerInfo.phone': searchRegex },
//         { 'customerInfo.division': searchRegex },
//         { 'customerInfo.city': searchRegex },
//         { 'customerInfo.zone': searchRegex },
//         { 'items.productName': searchRegex }
//       ];
//     }
    
//     // Date range filter
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     // Sort options
//     let sortOption = {};
//     switch (sort) {
//       case 'createdAt_asc':
//         sortOption = { createdAt: 1 };
//         break;
//       case 'createdAt_desc':
//         sortOption = { createdAt: -1 };
//         break;
//       case 'total_asc':
//         sortOption = { total: 1 };
//         break;
//       case 'total_desc':
//         sortOption = { total: -1 };
//         break;
//       case '-createdAt':
//         sortOption = { createdAt: -1 };
//         break;
//       case '-total':
//         sortOption = { total: -1 };
//         break;
//       default:
//         sortOption = { createdAt: -1 };
//     }
    
//     const [orders, total] = await Promise.all([
//       Order.find(query)
//         .populate('userId', 'name email phone')
//         .sort(sortOption)
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Order.countDocuments(query)
//     ]);
    
//     res.json({
//       success: true,
//       data: orders,
//       pagination: {
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         limit: parseInt(limit)
//       }
//     });
    
//   } catch (error) {
//     console.error('Get all orders error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Get order statistics (Admin only)
// // @route   GET /api/orders/admin/stats
// // @access  Private (Admin only)
// const getOrderStats = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const thisMonth = new Date();
//     thisMonth.setDate(1);
//     thisMonth.setHours(0, 0, 0, 0);
    
//     // Get all status counts
//     const [
//       totalOrders,
//       pendingPayment,
//       processingOrders,
//       completedOrders,
//       cancelledOrders,
//       todayOrders,
//       monthOrders,
//       totalRevenue,
//       monthRevenue,
//       placedOrders,
//       confirmedOrders,
//       shippedOrders,
//       deliveredOrders
//     ] = await Promise.all([
//       Order.countDocuments(),
//       Order.countDocuments({ paymentStatus: 'pending' }),
//       Order.countDocuments({ orderStatus: { $in: ['confirmed', 'processing', 'shipped'] } }),
//       Order.countDocuments({ orderStatus: 'delivered' }),
//       Order.countDocuments({ orderStatus: 'cancelled' }),
//       Order.countDocuments({ createdAt: { $gte: today } }),
//       Order.countDocuments({ createdAt: { $gte: thisMonth } }),
//       Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
//       Order.aggregate([
//         { $match: { createdAt: { $gte: thisMonth } } },
//         { $group: { _id: null, total: { $sum: '$total' } } }
//       ]),
//       Order.countDocuments({ orderStatus: 'placed' }),
//       Order.countDocuments({ orderStatus: 'confirmed' }),
//       Order.countDocuments({ orderStatus: 'shipped' }),
//       Order.countDocuments({ orderStatus: 'delivered' })
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         totalOrders,
//         pendingOrders: pendingPayment,
//         processingOrders,
//         completedOrders,
//         cancelledOrders,
//         todayOrders,
//         monthOrders,
//         totalRevenue: totalRevenue[0]?.total || 0,
//         monthRevenue: monthRevenue[0]?.total || 0,
//         placedOrders,
//         confirmedOrders,
//         shippedOrders,
//         deliveredOrders
//       }
//     });
    
//   } catch (error) {
//     console.error('Get order stats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Prepare order data without saving (for online payment)
// // @route   POST /api/orders/prepare
// // @access  Public (with sessionId) or Private (with token)
// // const prepareOrder = async (req, res) => {
// //   try {
// //     const {
// //       items,
// //       subtotal,
// //       shippingCost,
// //       discount,
// //       total,
// //       paymentMethod,
// //       customerInfo,
// //       couponCode,
// //       couponDiscount,
// //       freeShipping
// //     } = req.body;

// //     const userId = req.user?._id;
// //     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;

// //     // Validate required fields
// //     if (!items || items.length === 0) {
// //       return res.status(400).json({ success: false, error: 'No items in order' });
// //     }

// //     if (!customerInfo || !customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
// //       return res.status(400).json({ success: false, error: 'Customer information is incomplete' });
// //     }

// //     // Prepare order data without saving
// //     const orderData = {
// //       userId: userId || null,
// //       sessionId: userId ? null : sessionId,
// //       items: items.map(item => ({
// //         productId: item.productId,
// //         productName: item.productName,
// //         productSlug: item.productSlug,
// //         image: item.image,
// //         regularPrice: item.regularPrice,
// //         discountPrice: item.discountPrice,
// //         quantity: item.quantity,
// //         stockQuantity: item.stockQuantity,
// //          unit: item.unit || 'pcs'
// //       })),
// //       customerInfo: {
// //         fullName: customerInfo.fullName,
// //         email: customerInfo.email,
// //         phone: customerInfo.phone,
// //         whatsapp: customerInfo.whatsapp || '',
// //         address: customerInfo.address,
// //         city: customerInfo.city,
// //         zone: customerInfo.zone,
// //         area: customerInfo.area || '',
// //         zipCode: customerInfo.zipCode || '',
// //         country: customerInfo.country || 'Bangladesh',
// //         note: customerInfo.note || ''
// //       },
// //       subtotal,
// //       shippingCost,
// //       discount: discount || 0,
// //       total,
// //       paymentMethod,
// //       paymentStatus: 'pending',
// //       orderStatus: 'pending',
// //       couponCode: couponCode || null,
// //       couponDiscount: couponDiscount || 0,
// //       freeShipping: freeShipping || false,
// //       orderDate: new Date()
// //     };
    
// //     res.json({
// //       success: true,
// //       data: orderData,
// //       message: 'Order data prepared'
// //     });
    
// //   } catch (error) {
// //     console.error('Prepare order error:', error);
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // @desc    Prepare order data without saving (for online payment)
// // @route   POST /api/orders/prepare
// // @access  Public (with sessionId) or Private (with token)
// const prepareOrder = async (req, res) => {
//   try {
//     const {
//       items,
//       subtotal,
//       shippingCost,
//       discount,
//       total,
//       paymentMethod,
//       customerInfo,
//       couponCode,
//       couponDiscount,
//       freeShipping
//     } = req.body;

//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;

//     // Validate required fields - ADD division
//     if (!items || items.length === 0) {
//       return res.status(400).json({ success: false, error: 'No items in order' });
//     }

//     if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address || !customerInfo.division) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Customer information is incomplete. Full name, phone, address, and division are required.' 
//       });
//     }

//     // Prepare order data without saving - ADD division
//     const orderData = {
//       userId: userId || null,
//       sessionId: userId ? null : sessionId,
//       items: items.map(item => ({
//         productId: item.productId,
//         productName: item.productName,
//         productSlug: item.productSlug,
//         image: item.image,
//         regularPrice: item.regularPrice,
//         discountPrice: item.discountPrice,
//         quantity: item.quantity,
//         stockQuantity: item.stockQuantity,
//         unit: item.unit || 'pcs'
//       })),
//       customerInfo: {
//         fullName: customerInfo.fullName,
//         email: customerInfo.email || '',
//         phone: customerInfo.phone,
//         division: customerInfo.division, // <-- ADD THIS
//         address: customerInfo.address,
//         city: customerInfo.city,
//         zone: customerInfo.zone,
//         area: customerInfo.area || '',
//         zipCode: customerInfo.zipCode || '',
//         country: customerInfo.country || 'Bangladesh',
//         note: customerInfo.note || ''
//       },
//       subtotal,
//       shippingCost,
//       discount: discount || 0,
//       total,
//       paymentMethod,
//       paymentStatus: 'pending',
//       orderStatus: 'pending',
//       couponCode: couponCode || null,
//       couponDiscount: couponDiscount || 0,
//       freeShipping: freeShipping || false,
//       orderDate: new Date()
//     };
    
//     res.json({
//       success: true,
//       data: orderData,
//       message: 'Order data prepared'
//     });
    
//   } catch (error) {
//     console.error('Prepare order error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Delete order (Admin only)
// // @route   DELETE /api/orders/:id
// // @access  Private (Admin only)
// const deleteOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const order = await Order.findById(id);
    
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }
    
//     // Optional: Restore stock if order is not cancelled/delivered
//     if (!['cancelled', 'delivered'].includes(order.orderStatus)) {
//       for (const item of order.items) {
//         await Product.findByIdAndUpdate(
//           item.productId,
//           { $inc: { stockQuantity: item.quantity } }
//         );
//       }
//     }
    
//     await order.deleteOne();
    
//     res.json({
//       success: true,
//       message: 'Order deleted successfully'
//     });
    
//   } catch (error) {
//     console.error('Delete order error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Update order (Admin only)
// // @route   PUT /api/orders/:id
// // @access  Private (Admin/Moderator)
// // const updateOrder = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const { customerInfo, trackingNumber, deliveryNote } = req.body;
    
// //     const order = await Order.findById(id);
    
// //     if (!order) {
// //       return res.status(404).json({ success: false, error: 'Order not found' });
// //     }
    
// //     // Update customer info if provided
// //     if (customerInfo) {
// //       order.customerInfo = {
// //         ...order.customerInfo,
// //         ...customerInfo
// //       };
// //     }
    
// //     // Update tracking info
// //     if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
// //     if (deliveryNote !== undefined) order.deliveryNote = deliveryNote;
    
// //     await order.save();
    
// //     res.json({
// //       success: true,
// //       data: order,
// //       message: 'Order updated successfully'
// //     });
    
// //   } catch (error) {
// //     console.error('Update order error:', error);
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };

// // @desc    Update order (Admin/Moderator)
// // @route   PUT /api/orders/:id
// // @access  Private (Admin/Moderator)
// const updateOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { customerInfo, trackingNumber, deliveryNote } = req.body;
    
//     const order = await Order.findById(id);
    
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }
    
//     // Update customer info if provided - this will include division
//     if (customerInfo) {
//       order.customerInfo = {
//         ...order.customerInfo.toObject ? order.customerInfo.toObject() : order.customerInfo,
//         ...customerInfo
//       };
//     }
    
//     // Update tracking info
//     if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
//     if (deliveryNote !== undefined) order.deliveryNote = deliveryNote;
    
//     await order.save();
    
//     res.json({
//       success: true,
//       data: order,
//       message: 'Order updated successfully'
//     });
    
//   } catch (error) {
//     console.error('Update order error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Add to your orderController.js or create a new file

// // @desc    Create delivery order with courier service
// // @route   POST /api/orders/:id/delivery
// // @access  Private (Admin/Moderator)
// // D:\Smart-Gadget\Gadget-backend\src\controllers\orderController.js

// // @desc    Create delivery order with courier service
// // @route   POST /api/orders/:id/delivery
// // @access  Private (Admin/Moderator)
// const createDeliveryOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { courierSlug, deliveryNote, weight } = req.body;
    
//     console.log('=== CREATE DELIVERY ORDER ===');
//     console.log('Order ID:', id);
//     console.log('Courier Slug:', courierSlug);
//     console.log('Weight:', weight);
//     console.log('Delivery Note:', deliveryNote);
    
//     if (!courierSlug) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Courier slug is required' 
//       });
//     }
    
//     // Get the order
//     const Order = require('../models/Order');
//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }
    
//     console.log('Order found:', {
//       orderNumber: order.orderNumber,
//       status: order.orderStatus,
//       hasDelivery: !!order.deliveryService?.courierOrderId
//     });
    
//     // Check if order already has a delivery
//     if (order.deliveryService && order.deliveryService.courierOrderId) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Order already has a delivery service assigned' 
//       });
//     }
    
//     // Get courier integration
//     const { getCourierIntegration } = require('../lib/courierCredentials');
//     const integration = await getCourierIntegration(courierSlug);
    
//     console.log('Integration found:', {
//       id: integration?.id,
//       slug: integration?.slug,
//       apiEnabled: integration?.apiEnabled,
//       configured: integration?.configured,
//       hasCreds: !!integration?.creds
//     });
    
//     if (!integration || !integration.creds || !integration.apiEnabled) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Courier is not configured or disabled' 
//       });
//     }
    
//     // Prepare order data for courier
//     const orderData = {
//       ...order.toObject(),
//       orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-8)}`,
//       // Add weight if provided, otherwise calculate
//       items: order.items.map(item => ({
//         ...item,
//         weight: weight ? weight / order.items.length : 0.5
//       }))
//     };
    
//     console.log('Prepared order data for courier:', {
//       orderNumber: orderData.orderNumber,
//       itemsCount: orderData.items.length,
//       total: orderData.total,
//       customer: orderData.customerInfo.fullName
//     });
    
//     // Create delivery order
//     const { createCourierOrder } = require('../lib/couriers/courierFactory');
//     const result = await createCourierOrder(
//       courierSlug,
//       integration.creds,
//       integration.storeConfig,
//       orderData
//     );
    
//     console.log('Courier result:', {
//       success: result.success,
//       courierOrderId: result.courierOrderId,
//       trackingNumber: result.trackingNumber,
//       message: result.message
//     });
    
//     if (!result.success) {
//       return res.status(400).json({ 
//         success: false, 
//         error: result.message || 'Failed to create delivery order' 
//       });
//     }
    
//     // Update order with delivery info
//     order.deliveryService = {
//       courierId: integration.id,
//       courierName: courierSlug.charAt(0).toUpperCase() + courierSlug.slice(1),
//       courierSlug: courierSlug,
//       trackingNumber: result.trackingNumber,
//       trackingUrl: result.trackingUrl,
//       courierOrderId: result.courierOrderId,
//       courierResponse: result.fullResponse,
//       deliveryStatus: 'processing',
//       labelUrl: result.labelUrl || '',
//       invoiceUrl: result.invoiceUrl || '',
//       deliveryNote: deliveryNote || '',
//       weight: weight || 0.5,
//       deliveryStatusHistory: [
//         {
//           status: 'processing',
//           message: `Order created with ${courierSlug} courier service`,
//           timestamp: new Date()
//         }
//       ]
//     };
    
//     // Also update the legacy tracking field
//     order.trackingNumber = result.trackingNumber;
    
//     await order.save();
    
//     console.log('✅ Order updated with delivery info');
    
//     res.json({
//       success: true,
//       data: {
//         order,
//         deliveryResult: result
//       },
//       message: `Delivery order created successfully with ${courierSlug}`
//     });
//   } catch (error) {
//     console.error('❌ Create delivery order error:', error);
//     res.status(500).json({ 
//       success: false, 
//       error: error.message || 'Failed to create delivery order' 
//     });
//   }
// };

// // @desc    Get delivery tracking status
// // @route   GET /api/orders/:id/tracking
// // @access  Private (Admin/Moderator)
// const getOrderTracking = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }
    
//     if (!order.deliveryService || !order.deliveryService.courierSlug) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'No delivery service assigned to this order' 
//       });
//     }
    
//     const { courierSlug, trackingNumber } = order.deliveryService;
    
//     const { getCourierIntegration } = require('../lib/courierCredentials');
//     const integration = await getCourierIntegration(courierSlug);
    
//     if (!integration || !integration.creds) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Courier is not configured' 
//       });
//     }
    
//     const { getCourierTracking } = require('../lib/couriers/courierFactory');
//     const result = await getCourierTracking(
//       courierSlug,
//       integration.creds,
//       trackingNumber
//     );
    
//     if (!result.success) {
//       return res.status(400).json({ 
//         success: false, 
//         error: result.message || 'Failed to get tracking info' 
//       });
//     }
    
//     res.json({
//       success: true,
//       data: result
//     });
//   } catch (error) {
//     console.error('Get tracking error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // controllers/orderController.js - Add tracking by phone

// // controllers/orderController.js - Update trackOrderByPhone to return all orders

// // @desc    Get all orders by phone number (for tracking)
// // @route   GET /api/orders/track/:phone
// // // @access  Public
// // const trackOrderByPhone = async (req, res) => {
// //   try {
// //     const { phone } = req.params;
    
// //     if (!phone) {
// //       return res.status(400).json({ 
// //         success: false, 
// //         error: 'Phone number is required' 
// //       });
// //     }
    
// //     // Find ALL orders for this phone number, sorted by most recent
// //     const orders = await Order.find({
// //       'customerInfo.phone': phone
// //     })
// //     .sort({ createdAt: -1 })
// //     .select('orderNumber orderStatus items subtotal shippingCost discount total customerInfo createdAt deliveredAt cancelledAt statusHistory trackingNumber paymentMethod paymentStatus');
    
// //     if (!orders || orders.length === 0) {
// //       return res.status(404).json({ 
// //         success: false, 
// //         error: 'No orders found for this phone number' 
// //       });
// //     }
    
// //     // Format the response
// //     const statusLabels = {
// //       'placed': 'Order Placed',
// //       'confirmed': 'Order Confirmed',
// //       'processing': 'Processing',
// //       'shipped': 'Shipped',
// //       'out_for_delivery': 'Out for Delivery',
// //       'delivered': 'Delivered',
// //       'cancelled': 'Cancelled',
// //       'refunded': 'Refunded',
// //       'failed': 'Failed'
// //     };
    
// //     // Process each order
// //     const formattedOrders = orders.map(order => {
// //       // Get status timeline
// //       const timeline = order.statusHistory ? order.statusHistory.map(entry => ({
// //         status: entry.status,
// //         label: statusLabels[entry.status] || entry.status,
// //         note: entry.note,
// //         timestamp: entry.timestamp,
// //         formattedDate: entry.timestamp ? new Date(entry.timestamp).toLocaleString('en-BD', {
// //           day: '2-digit',
// //           month: 'short',
// //           year: 'numeric',
// //           hour: '2-digit',
// //           minute: '2-digit'
// //         }) : null
// //       })) : [];
      
// //       // If no status history, create one from the current status
// //       if (timeline.length === 0) {
// //         timeline.push({
// //           status: order.orderStatus,
// //           label: statusLabels[order.orderStatus] || order.orderStatus,
// //           note: `Order ${order.orderStatus}`,
// //           timestamp: order.createdAt,
// //           formattedDate: new Date(order.createdAt).toLocaleString('en-BD', {
// //             day: '2-digit',
// //             month: 'short',
// //             year: 'numeric',
// //             hour: '2-digit',
// //             minute: '2-digit'
// //           })
// //         });
        
// //         if (order.deliveredAt) {
// //           timeline.push({
// //             status: 'delivered',
// //             label: 'Delivered',
// //             note: 'Order delivered',
// //             timestamp: order.deliveredAt,
// //             formattedDate: new Date(order.deliveredAt).toLocaleString('en-BD', {
// //               day: '2-digit',
// //               month: 'short',
// //               year: 'numeric',
// //               hour: '2-digit',
// //               minute: '2-digit'
// //             })
// //           });
// //         }
        
// //         if (order.cancelledAt) {
// //           timeline.push({
// //             status: 'cancelled',
// //             label: 'Cancelled',
// //             note: order.cancellationReason || 'Order cancelled',
// //             timestamp: order.cancelledAt,
// //             formattedDate: new Date(order.cancelledAt).toLocaleString('en-BD', {
// //               day: '2-digit',
// //               month: 'short',
// //               year: 'numeric',
// //               hour: '2-digit',
// //               minute: '2-digit'
// //             })
// //           });
// //         }
// //       }
      
// //       // Sort timeline by timestamp
// //       timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
// //       // Get order items summary
// //       const itemsSummary = order.items.map(item => ({
// //         name: item.productName,
// //         quantity: item.quantity,
// //         price: item.discountPrice || item.regularPrice,
// //         image: item.image
// //       }));
      
// //       return {
// //         orderNumber: order.orderNumber,
// //         orderStatus: order.orderStatus,
// //         statusLabel: statusLabels[order.orderStatus] || order.orderStatus,
// //         customerName: order.customerInfo?.fullName,
// //         total: order.total,
// //         subtotal: order.subtotal,
// //         shippingCost: order.shippingCost,
// //         discount: order.discount,
// //         createdAt: order.createdAt,
// //         deliveredAt: order.deliveredAt || null,
// //         cancelledAt: order.cancelledAt || null,
// //         trackingNumber: order.trackingNumber || null,
// //         paymentMethod: order.paymentMethod,
// //         paymentStatus: order.paymentStatus,
// //         items: itemsSummary,
// //         timeline: timeline,
// //         statusHistory: order.statusHistory || []
// //       };
// //     });
    
// //     res.json({
// //       success: true,
// //       data: {
// //         phone: phone,
// //         totalOrders: formattedOrders.length,
// //         orders: formattedOrders
// //       },
// //       message: `Found ${formattedOrders.length} order(s) for this phone number`
// //     });
    
// //   } catch (error) {
// //     console.error('Track order error:', error);
// //     res.status(500).json({ success: false, error: error.message });
// //   }
// // };


// // @desc    Get all orders by phone number (for tracking)
// // @route   GET /api/orders/track/:phone
// // @access  Public
// const trackOrderByPhone = async (req, res) => {
//   try {
//     const { phone } = req.params;
    
//     if (!phone) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Phone number is required' 
//       });
//     }
    
//     // Find ALL orders for this phone number, sorted by most recent
//     const orders = await Order.find({
//       'customerInfo.phone': phone
//     })
//     .sort({ createdAt: -1 })
//     .select('_id orderNumber orderStatus items subtotal shippingCost discount total customerInfo createdAt deliveredAt cancelledAt statusHistory trackingNumber paymentMethod paymentStatus');
    
//     if (!orders || orders.length === 0) {
//       return res.status(404).json({ 
//         success: false, 
//         error: 'No orders found for this phone number' 
//       });
//     }
    
//     // Format the response
//     const statusLabels = {
//       'placed': 'Order Placed',
//       'confirmed': 'Order Confirmed',
//       'processing': 'Processing',
//       'shipped': 'Shipped',
//       'out_for_delivery': 'Out for Delivery',
//       'delivered': 'Delivered',
//       'cancelled': 'Cancelled',
//       'refunded': 'Refunded',
//       'failed': 'Failed'
//     };
    
//     // Process each order
//     const formattedOrders = orders.map(order => {
//       // Get status timeline
//       const timeline = order.statusHistory ? order.statusHistory.map(entry => ({
//         status: entry.status,
//         label: statusLabels[entry.status] || entry.status,
//         note: entry.note,
//         timestamp: entry.timestamp,
//         formattedDate: entry.timestamp ? new Date(entry.timestamp).toLocaleString('en-BD', {
//           day: '2-digit',
//           month: 'short',
//           year: 'numeric',
//           hour: '2-digit',
//           minute: '2-digit'
//         }) : null
//       })) : [];
      
//       // If no status history, create one from the current status
//       if (timeline.length === 0) {
//         timeline.push({
//           status: order.orderStatus,
//           label: statusLabels[order.orderStatus] || order.orderStatus,
//           note: `Order ${order.orderStatus}`,
//           timestamp: order.createdAt,
//           formattedDate: new Date(order.createdAt).toLocaleString('en-BD', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit'
//           })
//         });
        
//         if (order.deliveredAt) {
//           timeline.push({
//             status: 'delivered',
//             label: 'Delivered',
//             note: 'Order delivered',
//             timestamp: order.deliveredAt,
//             formattedDate: new Date(order.deliveredAt).toLocaleString('en-BD', {
//               day: '2-digit',
//               month: 'short',
//               year: 'numeric',
//               hour: '2-digit',
//               minute: '2-digit'
//             })
//           });
//         }
        
//         if (order.cancelledAt) {
//           timeline.push({
//             status: 'cancelled',
//             label: 'Cancelled',
//             note: order.cancellationReason || 'Order cancelled',
//             timestamp: order.cancelledAt,
//             formattedDate: new Date(order.cancelledAt).toLocaleString('en-BD', {
//               day: '2-digit',
//               month: 'short',
//               year: 'numeric',
//               hour: '2-digit',
//               minute: '2-digit'
//             })
//           });
//         }
//       }
      
//       // Sort timeline by timestamp
//       timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
//       // Get order items summary
//       const itemsSummary = order.items.map(item => ({
//         name: item.productName,
//         quantity: item.quantity,
//         price: item.discountPrice || item.regularPrice,
//         image: item.image
//       }));
      
//       return {
//         _id: order._id,  // <-- ADD THIS - This is the key fix!
//         id: order._id,   // <-- ADD THIS for compatibility
//         orderNumber: order.orderNumber,
//         orderStatus: order.orderStatus,
//         statusLabel: statusLabels[order.orderStatus] || order.orderStatus,
//         customerName: order.customerInfo?.fullName,
//         total: order.total,
//         subtotal: order.subtotal,
//         shippingCost: order.shippingCost,
//         discount: order.discount,
//         createdAt: order.createdAt,
//         deliveredAt: order.deliveredAt || null,
//         cancelledAt: order.cancelledAt || null,
//         trackingNumber: order.trackingNumber || null,
//         paymentMethod: order.paymentMethod,
//         paymentStatus: order.paymentStatus,
//         items: itemsSummary,
//         timeline: timeline,
//         statusHistory: order.statusHistory || []
//       };
//     });
    
//     res.json({
//       success: true,
//       data: {
//         phone: phone,
//         totalOrders: formattedOrders.length,
//         orders: formattedOrders
//       },
//       message: `Found ${formattedOrders.length} order(s) for this phone number`
//     });
    
//   } catch (error) {
//     console.error('Track order error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // @desc    Get order by ID for public invoice download
// // @route   GET /api/orders/public/:id
// // @access  Public (no authentication required)
// const getPublicOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const order = await Order.findById(id);
    
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }
    
//     // Only return if order is not cancelled (optional)
//     // if (order.orderStatus === 'cancelled') {
//     //   return res.status(403).json({ success: false, error: 'This order has been cancelled' });
//     // }
    
//     res.json({ success: true, data: order });
    
//   } catch (error) {
//     console.error('Get public order error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// // Add this to exports
// module.exports = {
//   createOrder,
//   getUserOrders,
//   getOrderById,
//   updateOrderStatus,
//   updatePaymentStatus,
//   cancelOrder,
//   getAllOrders,
//   getOrderStats,
//   prepareOrder,
//   deleteOrder,
//   updateOrder,
//   createDeliveryOrder,
//   getOrderTracking,
//   trackOrderByPhone,
//   getPublicOrder  
// };


// controllers/orderController.js

const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const OrderRestriction = require('../models/OrderRestriction');
const { getCourierIntegration } = require('../lib/couriers/credentials');
const { createCourierOrder, getCourierTracking } = require('../lib/couriers/factory');
const { 
  sendOrderPlacedEmail, 
  sendOrderNotificationToAdmin,
  sendOrderStatusUpdateEmail,
  sendPaymentStatusUpdateEmail
} = require('../utils/orderEmailService');

// ========== HELPER: GET ACCURATE DEVICE INFO ==========
const getAccurateDeviceInfo = (req, clientDeviceInfo = {}) => {
  const userAgent = req.headers['user-agent'] || '';
  
  // ========== DETECT OS WITH VERSION ==========
  let os = 'unknown';
  let osVersion = 'unknown';
  
  const osPatterns = [
    { pattern: /windows nt 10.0/i, name: 'Windows', version: '10' },
    { pattern: /windows nt 6.3/i, name: 'Windows', version: '8.1' },
    { pattern: /windows nt 6.2/i, name: 'Windows', version: '8' },
    { pattern: /windows nt 6.1/i, name: 'Windows', version: '7' },
    { pattern: /windows nt 6.0/i, name: 'Windows', version: 'Vista' },
    { pattern: /windows nt 5.1/i, name: 'Windows', version: 'XP' },
    { pattern: /mac os x 10_15_7/i, name: 'macOS', version: 'Catalina' },
    { pattern: /mac os x 10_15/i, name: 'macOS', version: 'Catalina' },
    { pattern: /mac os x 10_14/i, name: 'macOS', version: 'Mojave' },
    { pattern: /mac os x 10_13/i, name: 'macOS', version: 'High Sierra' },
    { pattern: /mac os x 10_12/i, name: 'macOS', version: 'Sierra' },
    { pattern: /mac os x 10_11/i, name: 'macOS', version: 'El Capitan' },
    { pattern: /mac os x/i, name: 'macOS', version: 'Unknown' },
    { pattern: /iphone|ipad|ipod/i, name: 'iOS', version: 'Unknown' },
    { pattern: /android (\d+\.\d+)/i, name: 'Android', version: '$1' },
    { pattern: /android/i, name: 'Android', version: 'Unknown' },
    { pattern: /linux/i, name: 'Linux', version: 'Unknown' },
    { pattern: /chrome os/i, name: 'Chrome OS', version: 'Unknown' },
    { pattern: /ubuntu/i, name: 'Ubuntu', version: 'Unknown' },
    { pattern: /fedora/i, name: 'Fedora', version: 'Unknown' }
  ];
  
  for (const osPattern of osPatterns) {
    if (osPattern.pattern.test(userAgent)) {
      os = osPattern.name;
      if (osPattern.version !== 'Unknown' && osPattern.version !== '$1') {
        osVersion = osPattern.version;
      } else if (osPattern.version === '$1') {
        const match = userAgent.match(osPattern.pattern);
        if (match && match[1]) {
          osVersion = match[1];
        }
      }
      break;
    }
  }
  
  // ========== DETECT BROWSER WITH VERSION ==========
  let browser = 'unknown';
  let browserVersion = 'unknown';
  
  const browserPatterns = [
    { pattern: /edg\/(\d+\.\d+)/i, name: 'Edge' },
    { pattern: /opr\/(\d+\.\d+)/i, name: 'Opera' },
    { pattern: /chrome\/(\d+\.\d+)/i, name: 'Chrome' },
    { pattern: /safari\/(\d+\.\d+)/i, name: 'Safari' },
    { pattern: /firefox\/(\d+\.\d+)/i, name: 'Firefox' },
    { pattern: /msie (\d+\.\d+)/i, name: 'Internet Explorer' },
    { pattern: /trident\/.*rv:(\d+\.\d+)/i, name: 'Internet Explorer' }
  ];
  
  for (const browserPattern of browserPatterns) {
    if (browserPattern.pattern.test(userAgent)) {
      browser = browserPattern.name;
      const match = userAgent.match(browserPattern.pattern);
      if (match && match[1]) {
        browserVersion = match[1];
      }
      break;
    }
  }
  
  // Special case for Safari (Chrome also contains safari)
  if (browser === 'Chrome' && /safari/i.test(userAgent) && !/chrome/i.test(userAgent)) {
    browser = 'Safari';
  }
  
  // ========== DETECT DEVICE TYPE ==========
  let deviceType = 'unknown';
  
  if (/mobile|android|iphone|ipad|ipod|blackberry|windows phone|opera mini|iemobile/i.test(userAgent)) {
    deviceType = 'mobile';
  } else if (/tablet|ipad|playbook|silk/i.test(userAgent)) {
    deviceType = 'tablet';
  } else if (/windows|mac|linux|cros|ubuntu|debian|fedora|centos|arch/i.test(userAgent)) {
    deviceType = 'desktop';
  }
  
  // ========== DETECT PLATFORM ==========
  let platform = 'unknown';
  
  if (/windows/i.test(userAgent)) {
    platform = 'Windows';
  } else if (/macintosh|mac os x/i.test(userAgent)) {
    platform = 'Mac';
  } else if (/linux/i.test(userAgent)) {
    platform = 'Linux';
  } else if (/android/i.test(userAgent)) {
    platform = 'Android';
  } else if (/iphone|ipad|ipod/i.test(userAgent)) {
    platform = 'iOS';
  } else if (/chrome os/i.test(userAgent)) {
    platform = 'Chrome OS';
  }
  
  // ========== GET IP ADDRESS ==========
  let ipAddress = req.clientIP || req.publicIP || 
                  req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                  req.headers['x-real-ip'] ||
                  req.connection?.remoteAddress ||
                  req.socket?.remoteAddress ||
                  req.ip ||
                  'unknown';
  
  // Clean up IP
  if (ipAddress === '::1' || ipAddress === '::ffff:127.0.0.1') {
    ipAddress = '127.0.0.1';
  }
  if (ipAddress && ipAddress.startsWith('::ffff:')) {
    ipAddress = ipAddress.replace('::ffff:', '');
  }
  
  // ========== GET CLIENT-SIDE INFO ==========
  const screenResolution = clientDeviceInfo.screenResolution || null;
  const viewportSize = clientDeviceInfo.viewportSize || null;
  const colorDepth = clientDeviceInfo.colorDepth || null;
  const pixelRatio = clientDeviceInfo.pixelRatio || null;
  const timezone = clientDeviceInfo.timezone || null;
  const language = clientDeviceInfo.language || 
                   req.headers['accept-language']?.split(',')[0] || 
                   null;
  const referrer = clientDeviceInfo.referrer || 
                   req.headers['referer'] || 
                   req.headers['referrer'] || 
                   null;
  const doNotTrack = clientDeviceInfo.doNotTrack || null;
  const vendor = clientDeviceInfo.vendor || null;
  
  // ========== DETECT CONNECTION TYPE ==========
  let connectionType = 'unknown';
  let connectionSpeed = 'unknown';
  
  if (clientDeviceInfo.connection) {
    connectionType = clientDeviceInfo.connection.effectiveType || 'unknown';
    connectionSpeed = clientDeviceInfo.connection.downlink ? 
                      `${clientDeviceInfo.connection.downlink} Mbps` : 
                      'unknown';
  }
  
  // ========== BUILD DEVICE INFO OBJECT ==========
  const deviceInfo = {
    // Server-side detected
    ipAddress: ipAddress,
    userAgent: userAgent,
    deviceType: deviceType,
    browser: browser,
    browserVersion: browserVersion,
    os: os,
    osVersion: osVersion,
    platform: platform,
    
    // Client-side provided
    screenResolution: screenResolution,
    viewportSize: viewportSize,
    colorDepth: colorDepth,
    pixelRatio: pixelRatio,
    timezone: timezone,
    language: language,
    referrer: referrer,
    
    // Connection info
    connectionType: connectionType,
    connectionSpeed: connectionSpeed,
    
    // Additional
    doNotTrack: doNotTrack,
    vendor: vendor
  };
  
  // Log device info for debugging
  console.log('📱 Accurate Device Info:', {
    ip: deviceInfo.ipAddress,
    deviceType: deviceInfo.deviceType,
    os: deviceInfo.os,
    osVersion: deviceInfo.osVersion,
    browser: deviceInfo.browser,
    browserVersion: deviceInfo.browserVersion,
    platform: deviceInfo.platform,
    connectionType: deviceInfo.connectionType
  });
  
  return deviceInfo;
};

// ========== GET CLIENT DEVICE INFO FROM REQUEST ==========
const getClientDeviceInfoFromBody = (req) => {
  const { clientDeviceInfo } = req.body || {};
  
  return {
    screenResolution: clientDeviceInfo?.screenResolution || null,
    viewportSize: clientDeviceInfo?.viewportSize || null,
    colorDepth: clientDeviceInfo?.colorDepth || null,
    pixelRatio: clientDeviceInfo?.pixelRatio || null,
    timezone: clientDeviceInfo?.timezone || null,
    language: clientDeviceInfo?.language || null,
    referrer: clientDeviceInfo?.referrer || null,
    doNotTrack: clientDeviceInfo?.doNotTrack || null,
    vendor: clientDeviceInfo?.vendor || null,
    connection: clientDeviceInfo?.connection || null
  };
};

// ========== CHECK ORDER RESTRICTIONS ==========
const checkOrderRestrictions = async (req, customerInfo) => {
  try {
    // Get IP address
    const ipAddress = req.clientIP || 
                      req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                      req.headers['x-real-ip'] ||
                      req.connection?.remoteAddress ||
                      req.socket?.remoteAddress ||
                      req.ip ||
                      'unknown';
    
    // Clean up IP
    let cleanIp = ipAddress;
    if (cleanIp === '::1' || cleanIp === '::ffff:127.0.0.1') {
      cleanIp = '127.0.0.1';
    }
    if (cleanIp && cleanIp.startsWith('::ffff:')) {
      cleanIp = cleanIp.replace('::ffff:', '');
    }
    
    const restrictions = await OrderRestriction.getRestrictions();
    const violations = [];

    // ========== CHECK IP BLOCKING ==========
    const isIPBlocked = restrictions.ipRestrictions.blockedIPs.some(b => b.ip === cleanIp);
    if (isIPBlocked) {
      violations.push({
        type: 'ip_blocked',
        message: 'Your IP address has been blocked from placing orders'
      });
    }

    // ========== CHECK IP TIME INTERVAL ==========
    if (restrictions.ipRestrictions.timeInterval.enabled) {
      const timeValue = restrictions.ipRestrictions.timeInterval.value;
      const timeUnit = restrictions.ipRestrictions.timeInterval.unit;
      const timeInMs = timeUnit === 'min' ? timeValue * 60 * 1000 : timeValue * 60 * 60 * 1000;
      
      const recentOrder = await Order.findOne({
        'deviceInfo.ipAddress': cleanIp,
        createdAt: { $gte: new Date(Date.now() - timeInMs) }
      }).sort({ createdAt: -1 });

      if (recentOrder) {
        const timeLeft = Math.ceil((timeInMs - (Date.now() - new Date(recentOrder.createdAt).getTime())) / (timeUnit === 'min' ? 60 * 1000 : 60 * 60 * 1000));
        violations.push({
          type: 'ip_time_interval',
          message: `You must wait ${timeLeft} more ${timeUnit === 'min' ? 'minute(s)' : 'hour(s)'} before placing another order from this IP`
        });
      }
    }

    // ========== CHECK PHONE BLOCKING ==========
    if (customerInfo?.phone) {
      const isPhoneBlocked = restrictions.phoneRestrictions.blockedPhones.some(b => b.phone === customerInfo.phone);
      if (isPhoneBlocked) {
        violations.push({
          type: 'phone_blocked',
          message: 'This phone number has been blocked from placing orders'
        });
      }

      // ========== CHECK PHONE TIME INTERVAL ==========
      if (restrictions.phoneRestrictions.timeInterval.enabled) {
        const timeValue = restrictions.phoneRestrictions.timeInterval.value;
        const timeUnit = restrictions.phoneRestrictions.timeInterval.unit;
        const timeInMs = timeUnit === 'min' ? timeValue * 60 * 1000 : timeValue * 60 * 60 * 1000;
        
        const recentOrder = await Order.findOne({
          'customerInfo.phone': customerInfo.phone,
          createdAt: { $gte: new Date(Date.now() - timeInMs) }
        }).sort({ createdAt: -1 });

        if (recentOrder) {
          const timeLeft = Math.ceil((timeInMs - (Date.now() - new Date(recentOrder.createdAt).getTime())) / (timeUnit === 'min' ? 60 * 1000 : 60 * 60 * 1000));
          violations.push({
            type: 'phone_time_interval',
            message: `You must wait ${timeLeft} more ${timeUnit === 'min' ? 'minute(s)' : 'hour(s)'} before placing another order with this phone number`
          });
        }
      }
    }

    // ========== CHECK EMAIL BLOCKING ==========
    if (customerInfo?.email) {
      const isEmailBlocked = restrictions.emailRestrictions.blockedEmails.some(b => b.email === customerInfo.email);
      if (isEmailBlocked) {
        violations.push({
          type: 'email_blocked',
          message: 'This email address has been blocked from placing orders'
        });
      }
    }

    return {
      allowed: violations.length === 0,
      violations,
      ipAddress: cleanIp
    };
  } catch (error) {
    console.error('Check order restrictions error:', error);
    // If there's an error checking restrictions, allow the order to proceed
    // but log the error
    return {
      allowed: true,
      violations: [],
      ipAddress: 'unknown'
    };
  }
};

// ========== CREATE ORDER ==========
// controllers/orderController.js - Update createOrder function

// const createOrder = async (req, res) => {
//   try {
//     const {
//       items,
//       subtotal,
//       shippingCost,
//       discount,
//       total,
//       paymentMethod,
//       customerInfo,
//       couponCode,
//       couponDiscount,
//       freeShipping,
//       orderStatus = 'placed',
//       saveOrder = true,
//       clientDeviceInfo = {}
//     } = req.body;

//     const userId = req.user?._id;
    
//     // IMPORTANT: Get sessionId from multiple sources
//     let sessionId = req.headers['x-session-id'] || 
//                     req.cookies?.sessionId || 
//                     req.body.sessionId || 
//                     null;
    
//     // If no sessionId and user is not logged in, generate one
//     if (!sessionId && !userId) {
//       sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
//       console.log('🆕 Generated new session ID for guest:', sessionId);
//     }

//     // Log session info for debugging
//     console.log('📝 Order Creation - Session Info:', {
//       userId: userId || 'guest',
//       sessionId: sessionId || 'none',
//       hasSessionHeader: !!req.headers['x-session-id'],
//       hasCookie: !!req.cookies?.sessionId
//     });

//     // Validate required fields
//     if (!items || items.length === 0) {
//       return res.status(400).json({ success: false, error: 'No items in order' });
//     }

//     if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address || !customerInfo.division) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Customer information is incomplete. Full name, phone, address, and division are required.' 
//       });
//     }

//     if (!paymentMethod) {
//       return res.status(400).json({ success: false, error: 'Payment method is required' });
//     }

//     // Process items
//     const processedItems = items.map(item => {
//       const hasColors = item.colors && item.colors.length > 0;
//       let totalQuantity = item.quantity || 0;
//       if (hasColors) {
//         totalQuantity = item.colors.reduce((sum, color) => sum + (color.quantity || 0), 0);
//       }
      
//       return {
//         productId: item.productId,
//         productName: item.productName,
//         productSlug: item.productSlug,
//         image: item.image,
//         regularPrice: item.regularPrice,
//         discountPrice: item.discountPrice || 0,
//         quantity: totalQuantity,
//         stockQuantity: item.stockQuantity || 0,
//         unit: item.unit || 'pcs',
//         selectedColor: item.selectedColor || null,
//         colors: item.colors || []
//       };
//     });

//     // Validate stock
//     for (const item of processedItems) {
//       const product = await Product.findById(item.productId);
//       if (!product) {
//         return res.status(404).json({ success: false, error: `Product ${item.productName} not found` });
//       }
//       if (product.stockQuantity < item.quantity) {
//         return res.status(400).json({ 
//           success: false, 
//           error: `Insufficient stock for ${product.productName}. Available: ${product.stockQuantity}` 
//         });
//       }
//     }

//     // Get device info
//     const clientInfo = getClientDeviceInfoFromBody(req);
//     const deviceInfo = getAccurateDeviceInfo(req, clientInfo);

//     // For online payment, prepare order data without saving
//     if (paymentMethod === 'online' && !saveOrder) {
//       const orderData = {
//         userId: userId || null,
//         sessionId: userId ? null : sessionId,
//         items: processedItems,
//         customerInfo: {
//           fullName: customerInfo.fullName,
//           email: customerInfo.email || '',
//           phone: customerInfo.phone,
//           division: customerInfo.division,
//           address: customerInfo.address,
//           city: customerInfo.city,
//           zone: customerInfo.zone,
//           area: customerInfo.area || '',
//           zipCode: customerInfo.zipCode || '',
//           country: customerInfo.country || 'Bangladesh',
//           note: customerInfo.note || ''
//         },
//         subtotal,
//         shippingCost,
//         discount: discount || 0,
//         total,
//         paymentMethod,
//         paymentStatus: 'pending',
//         orderStatus: 'placed',
//         couponCode: couponCode || null,
//         couponDiscount: couponDiscount || 0,
//         freeShipping: freeShipping || false,
//         orderDate: new Date(),
//         deviceInfo: deviceInfo
//       };
      
//       return res.status(200).json({
//         success: true,
//         data: orderData,
//         message: 'Order data prepared',
//         sessionId: sessionId // Return session ID to frontend
//       });
//     }

//     // Create order with session ID
//     const order = new Order({
//       userId: userId || null,
//       sessionId: userId ? null : sessionId, // Store sessionId for guest users
//       items: processedItems,
//       customerInfo: {
//         fullName: customerInfo.fullName,
//         email: customerInfo.email || '',
//         phone: customerInfo.phone,
//         division: customerInfo.division,
//         address: customerInfo.address,
//         city: customerInfo.city,
//         zone: customerInfo.zone,
//         area: customerInfo.area || '',
//         zipCode: customerInfo.zipCode || '',
//         country: customerInfo.country || 'Bangladesh',
//         note: customerInfo.note || ''
//       },
//       subtotal,
//       shippingCost,
//       discount: discount || 0,
//       total,
//       paymentMethod,
//       paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
//       orderStatus: orderStatus === 'pending' ? 'placed' : orderStatus,
//       couponCode: couponCode || null,
//       couponDiscount: couponDiscount || 0,
//       freeShipping: freeShipping || false,
//       orderDate: new Date(),
//       placedAt: new Date(),
//       deviceInfo: deviceInfo
//     });

//     await order.save();

//     console.log('✅ Order saved with sessionId:', order.sessionId || 'none');

//     // Update product stock
//     for (const item of processedItems) {
//       await Product.findByIdAndUpdate(
//         item.productId,
//         { $inc: { stockQuantity: -item.quantity, purchaseCount: item.quantity } }
//       );
//     }

//     // ========== CLEAR CART ==========
//     // IMPORTANT: Clear cart using the correct identifier
//     if (userId) {
//       // Logged in user - clear by userId
//       await Cart.findOneAndDelete({ userId });
//       console.log('🗑️ Cart cleared for user:', userId);
//     } else if (sessionId) {
//       // Guest user - clear by sessionId
//       const deletedCart = await Cart.findOneAndDelete({ sessionId });
//       console.log('🗑️ Cart cleared for session:', sessionId, deletedCart ? '✅' : '❌ Not found');
//     } else {
//       console.log('⚠️ No userId or sessionId to clear cart');
//     }

//     // Record coupon usage
//     if (couponCode) {
//       try {
//         const coupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
//         if (coupon) {
//           coupon.totalUsedCount = (coupon.totalUsedCount || 0) + 1;
//           coupon.usageRecords = coupon.usageRecords || [];
//           coupon.usageRecords.push({
//             userId: userId || null,
//             orderId: order._id,
//             usedAt: new Date(),
//             discountAmount: couponDiscount || discount
//           });
//           await coupon.save();
//         }
//       } catch (couponError) {
//         console.error('Error recording coupon usage:', couponError);
//       }
//     }

//     // Send emails
//     if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
//       try {
//         await sendOrderPlacedEmail(order, order.customerInfo.email);
//         console.log('✅ Order placed email sent to customer:', order.customerInfo.email);
//       } catch (emailError) {
//         console.error('❌ Customer email error:', emailError.message);
//       }
//     }

//     try {
//       await sendOrderNotificationToAdmin(order, 'new');
//       console.log('✅ Admin notification sent for order:', order.orderNumber);
//     } catch (emailError) {
//       console.error('❌ Admin email error:', emailError.message);
//     }

//     res.status(201).json({
//       success: true,
//       data: order,
//       orderId: order._id,
//       sessionId: sessionId, // Return session ID to frontend
//       message: 'Order placed successfully'
//     });

//   } catch (error) {
//     console.error('Create order error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// ========== CREATE ORDER ==========
const createOrder = async (req, res) => {
  try {
    const {
      items,
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod,
      customerInfo,
      couponCode,
      couponDiscount,
      freeShipping,
      orderStatus = 'placed',
      saveOrder = true,
      clientDeviceInfo = {}
    } = req.body;

    const userId = req.user?._id;
    
    // Get sessionId from multiple sources
    let sessionId = req.headers['x-session-id'] || 
                    req.cookies?.sessionId || 
                    req.body.sessionId || 
                    null;
    
    if (!sessionId && !userId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      console.log('🆕 Generated new session ID for guest:', sessionId);
    }

    console.log('📝 Order Creation - Session Info:', {
      userId: userId || 'guest',
      sessionId: sessionId || 'none',
      hasSessionHeader: !!req.headers['x-session-id'],
      hasCookie: !!req.cookies?.sessionId
    });

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' });
    }

    if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address || !customerInfo.division) {
      return res.status(400).json({ 
        success: false, 
        error: 'Customer information is incomplete. Full name, phone, address, and division are required.' 
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({ success: false, error: 'Payment method is required' });
    }

    // ========== CHECK ORDER RESTRICTIONS (FRAUD DETECTION) ==========
    const restrictionCheck = await checkOrderRestrictions(req, customerInfo);
    
    if (!restrictionCheck.allowed) {
      console.log('🚫 Order restricted:', {
        customer: customerInfo.fullName,
        phone: customerInfo.phone,
        ip: restrictionCheck.ipAddress,
        violations: restrictionCheck.violations
      });
      
      return res.status(403).json({
        success: false,
        error: restrictionCheck.violations[0].message,
        violations: restrictionCheck.violations,
        restrictionType: restrictionCheck.violations[0].type
      });
    }

    // Process items
    const processedItems = items.map(item => {
      const hasColors = item.colors && item.colors.length > 0;
      let totalQuantity = item.quantity || 0;
      if (hasColors) {
        totalQuantity = item.colors.reduce((sum, color) => sum + (color.quantity || 0), 0);
      }
      
      return {
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        image: item.image,
        regularPrice: item.regularPrice,
        discountPrice: item.discountPrice || 0,
        quantity: totalQuantity,
        stockQuantity: item.stockQuantity || 0,
        unit: item.unit || 'pcs',
        selectedColor: item.selectedColor || null,
        colors: item.colors || []
      };
    });

    // Validate stock
    for (const item of processedItems) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(404).json({ success: false, error: `Product ${item.productName} not found` });
      }
      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({ 
          success: false, 
          error: `Insufficient stock for ${product.productName}. Available: ${product.stockQuantity}` 
        });
      }
    }

    // Get device info
    const clientInfo = getClientDeviceInfoFromBody(req);
    const deviceInfo = getAccurateDeviceInfo(req, clientInfo);

    // For online payment, prepare order data without saving
    if (paymentMethod === 'online' && !saveOrder) {
      const orderData = {
        userId: userId || null,
        sessionId: userId ? null : sessionId,
        items: processedItems,
        customerInfo: {
          fullName: customerInfo.fullName,
          email: customerInfo.email || '',
          phone: customerInfo.phone,
          division: customerInfo.division,
          address: customerInfo.address,
          city: customerInfo.city,
          zone: customerInfo.zone,
          area: customerInfo.area || '',
          zipCode: customerInfo.zipCode || '',
          country: customerInfo.country || 'Bangladesh',
          note: customerInfo.note || ''
        },
        subtotal,
        shippingCost,
        discount: discount || 0,
        total,
        paymentMethod,
        paymentStatus: 'pending',
        orderStatus: 'placed',
        couponCode: couponCode || null,
        couponDiscount: couponDiscount || 0,
        freeShipping: freeShipping || false,
        orderDate: new Date(),
        deviceInfo: deviceInfo,
        restrictionViolation: 'none'
      };
      
      return res.status(200).json({
        success: true,
        data: orderData,
        message: 'Order data prepared',
        sessionId: sessionId
      });
    }

    // Create order with session ID
    const order = new Order({
      userId: userId || null,
      sessionId: userId ? null : sessionId,
      items: processedItems,
      customerInfo: {
        fullName: customerInfo.fullName,
        email: customerInfo.email || '',
        phone: customerInfo.phone,
        division: customerInfo.division,
        address: customerInfo.address,
        city: customerInfo.city,
        zone: customerInfo.zone,
        area: customerInfo.area || '',
        zipCode: customerInfo.zipCode || '',
        country: customerInfo.country || 'Bangladesh',
        note: customerInfo.note || ''
      },
      subtotal,
      shippingCost,
      discount: discount || 0,
      total,
      paymentMethod,
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      orderStatus: orderStatus === 'pending' ? 'placed' : orderStatus,
      couponCode: couponCode || null,
      couponDiscount: couponDiscount || 0,
      freeShipping: freeShipping || false,
      orderDate: new Date(),
      placedAt: new Date(),
      deviceInfo: deviceInfo,
      restrictionViolation: 'none' // All restrictions passed
    });

    await order.save();

    console.log('✅ Order saved with sessionId:', order.sessionId || 'none');

    // Update product stock
    for (const item of processedItems) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: -item.quantity, purchaseCount: item.quantity } }
      );
    }

    // Clear cart
    if (userId) {
      await Cart.findOneAndDelete({ userId });
      console.log('🗑️ Cart cleared for user:', userId);
    } else if (sessionId) {
      const deletedCart = await Cart.findOneAndDelete({ sessionId });
      console.log('🗑️ Cart cleared for session:', sessionId, deletedCart ? '✅' : '❌ Not found');
    }

    // Record coupon usage
    if (couponCode) {
      try {
        const coupon = await Coupon.findOne({ couponCode: couponCode.toUpperCase() });
        if (coupon) {
          coupon.totalUsedCount = (coupon.totalUsedCount || 0) + 1;
          coupon.usageRecords = coupon.usageRecords || [];
          coupon.usageRecords.push({
            userId: userId || null,
            orderId: order._id,
            usedAt: new Date(),
            discountAmount: couponDiscount || discount
          });
          await coupon.save();
        }
      } catch (couponError) {
        console.error('Error recording coupon usage:', couponError);
      }
    }

    // Send emails
    if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
      try {
        await sendOrderPlacedEmail(order, order.customerInfo.email);
        console.log('✅ Order placed email sent to customer:', order.customerInfo.email);
      } catch (emailError) {
        console.error('❌ Customer email error:', emailError.message);
      }
    }

    try {
      await sendOrderNotificationToAdmin(order, 'new');
      console.log('✅ Admin notification sent for order:', order.orderNumber);
    } catch (emailError) {
      console.error('❌ Admin email error:', emailError.message);
    }

    res.status(201).json({
      success: true,
      data: order,
      orderId: order._id,
      sessionId: sessionId,
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== GET USER ORDERS ==========
const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    const { page = 1, limit = 10, orderStatus, paymentStatus, paymentMethod, search } = req.query;
    
    const query = {};
    
    if (userId) {
      query.userId = userId;
    } else if (sessionId) {
      query.sessionId = sessionId;
    } else {
      return res.status(200).json({ 
        success: true, 
        data: [], 
        pagination: { total: 0, page: 1, pages: 0, limit: 10 }
      });
    }
    
    if (orderStatus) query.orderStatus = orderStatus;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (paymentMethod) query.paymentMethod = paymentMethod;
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { orderNumber: searchRegex },
        { 'customerInfo.fullName': searchRegex },
        { 'customerInfo.email': searchRegex },
        { 'customerInfo.phone': searchRegex },
        { 'customerInfo.division': searchRegex },
        { 'customerInfo.city': searchRegex },
        { 'items.productName': searchRegex }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== GET ORDER BY ID ==========
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    const order = await Order.findById(id)
     .populate('statusHistory.updatedBy', 'email name contactPerson');
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    const hasPermission = (userId && order.userId && order.userId.toString() === userId.toString()) ||
                         (sessionId && order.sessionId === sessionId);
    
    if (!hasPermission) {
      return res.status(403).json({ success: false, error: 'Unauthorized to view this order' });
    }
    
    res.json({ success: true, data: order });
    
  } catch (error) {
    console.error('Get order by ID error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// ========== UPDATE ORDER STATUS ==========
// @desc    Update order status (Admin/Moderator/Call Center)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Moderator)
// const updateOrderStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { orderStatus, trackingNumber, deliveryNote, cancellationReason } = req.body;
    
//     const order = await Order.findById(id);
    
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }
    
//     // Check if order is cancelled - no further actions allowed
//     if (order.orderStatus === 'cancelled') {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Order is cancelled. No further actions can be performed.' 
//       });
//     }
    
//     // Check if order is delivered - no further actions allowed
//     if (order.orderStatus === 'delivered') {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Order is already delivered. Status cannot be changed.' 
//       });
//     }
    
//     // Define allowed status transitions
//     const allowedTransitions = {
//       'placed': ['follow_up', 'cancelled'],
//       'follow_up': ['accepted', 'cancelled', 'reminder'],
//       'reminder': ['accepted', 'cancelled'],
//       'accepted': ['processing', 'cancelled'],
//       'processing': ['shipped', 'cancelled'],
//       'shipped': ['out_for_delivery', 'delivered', 'cancelled'],
//       'out_for_delivery': ['delivered', 'cancelled'],
//       'delivered': [], // No further changes allowed
//       'cancelled': []  // No further changes allowed
//     };
    
//     const currentStatus = order.orderStatus;
//     const newStatus = orderStatus;
    
//     // Validate status transition
//     if (currentStatus !== newStatus) {
//       const allowedNext = allowedTransitions[currentStatus] || [];
//       if (!allowedNext.includes(newStatus)) {
//         return res.status(400).json({ 
//           success: false, 
//           error: `Invalid status transition from "${currentStatus}" to "${newStatus}". Allowed: ${allowedNext.join(', ')}` 
//         });
//       }
//     }
    
//     const oldStatus = order.orderStatus;
    
//     // Handle special cases for status changes
    
//     // If order is being cancelled
//     if (orderStatus === 'cancelled' && order.orderStatus !== 'cancelled') {
//       order.cancelledAt = new Date();
//       if (cancellationReason) {
//         order.cancellationReason = cancellationReason;
//       }
      
//       // Restore stock for cancelled order
//       for (const item of order.items) {
//         await Product.findByIdAndUpdate(
//           item.productId,
//           { $inc: { stockQuantity: item.quantity } }
//         );
//       }
//     }
    
//     // If order is being delivered
//     if (orderStatus === 'delivered' && order.orderStatus !== 'delivered') {
//       order.deliveredAt = new Date();
      
//       // For COD orders, automatically mark payment as paid when delivered
//       if (order.paymentMethod === 'cod' && order.paymentStatus !== 'paid') {
//         order.paymentStatus = 'paid';
//         console.log(`✅ COD order ${order.orderNumber} - Payment auto-updated to Paid on delivery`);
//       }
//     }
    
//     // Update order fields
//     if (orderStatus) order.orderStatus = orderStatus;
//     if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
//     if (deliveryNote !== undefined) order.deliveryNote = deliveryNote;
    
//     // Update timestamp based on status
//     switch(orderStatus) {
//       case 'placed':
//         order.placedAt = new Date();
//         break;
//       case 'follow_up':
//         order.followUpAt = new Date();
//         break;
//       case 'accepted':
//         order.acceptedAt = new Date();
//         break;
//       case 'processing':
//         order.processingAt = new Date();
//         break;
//       case 'shipped':
//         order.shippedAt = new Date();
//         break;
//       case 'delivered':
//         order.deliveredAt = new Date();
//         break;
//       case 'cancelled':
//         order.cancelledAt = new Date();
//         break;
//       case 'reminder':
//         order.reminderAt = new Date();
//         break;
//     }
    
//     // ========== FIX: Map user role to valid enum value ==========
//     const userId = req.user?._id;
//     let userRole = req.user?.role || 'admin';
    
//     // Map call_center_agent to call_center (valid enum value)
//     if (userRole === 'call_center_agent') {
//       userRole = 'call_center';
//     }
    
//     // Map customer to user (valid enum value)
//     if (userRole === 'customer') {
//       userRole = 'user';
//     }
    
//     // Map super_admin to super_admin (already valid)
//     // Map admin to admin (already valid)
//     // Map moderator to moderator (already valid)
    
//     // Create status note
//     let statusNote = `Status updated from ${oldStatus} to ${orderStatus}`;
    
//     if (orderStatus === 'cancelled' && cancellationReason) {
//       statusNote = cancellationReason;
//     }
    
//     if (orderStatus === 'delivered') {
//       statusNote = 'Order delivered successfully';
//     }
    
//     if (orderStatus === 'follow_up') {
//       statusNote = 'Order sent to call center for follow up';
//     }
    
//     if (orderStatus === 'accepted') {
//       statusNote = 'Order accepted by call center';
//     }
    
//     if (orderStatus === 'reminder') {
//       statusNote = 'Reminder sent to customer';
//     }
    
//     // Add status history with mapped role
//     order.addStatusHistory(orderStatus, statusNote, userId, userRole);
    
//     await order.save();
    
//     // Send email notifications
//     if (oldStatus !== orderStatus) {
//       // Send to customer ONLY if email exists
//       if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
//         try {
//           await sendOrderStatusUpdateEmail(order, order.customerInfo.email, oldStatus, orderStatus);
//           console.log('✅ Status update email sent to customer for order:', order.orderNumber);
//         } catch (emailError) {
//           console.error('❌ Status update email error:', emailError.message);
//         }
//       }

//       // ALWAYS send admin notification
//       try {
//         await sendOrderNotificationToAdmin(order, 'status_update');
//         console.log('✅ Status update notification sent to admin for order:', order.orderNumber);
//       } catch (emailError) {
//         console.error('❌ Admin notification error on status update:', emailError.message);
//       }
//     }
    
//     // Prepare response message
//     let responseMessage = `Order status updated to ${orderStatus}`;
//     if (orderStatus === 'delivered' && order.paymentMethod === 'cod' && order.paymentStatus === 'paid') {
//       responseMessage = `Order delivered and payment marked as Paid`;
//     }
    
//     res.json({
//       success: true,
//       data: order,
//       message: responseMessage
//     });
    
//   } catch (error) {
//     console.error('Update order status error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };


// controllers/orderController.js - Update updateOrderStatus

// ========== UPDATE ORDER STATUS - FULL FLOW ==========
// @desc    Update order status (Admin/Moderator/Super Admin)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Moderator/Super Admin)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      orderStatus, 
      trackingNumber, 
      deliveryNote, 
      cancellationReason, 
      rejectionReason,
      courierService 
    } = req.body;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Check if order is cancelled - no further actions allowed
    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        error: 'Order is cancelled. No further actions can be performed.' 
      });
    }
    
    // Check if order is delivered - no further actions allowed
    if (order.orderStatus === 'delivered') {
      return res.status(400).json({ 
        success: false, 
        error: 'Order is already delivered. Status cannot be changed.' 
      });
    }
    
    // Check if order has courier assigned - no manual changes allowed
    if (order.orderStatus === 'courier_assigned') {
      return res.status(400).json({ 
        success: false, 
        error: 'Order is with courier. Status cannot be changed manually.' 
      });
    }
    
    // Check if order is in courier statuses - no manual changes
    if (['processing', 'shipped', 'out_for_delivery'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Order is being handled by courier service. Status cannot be changed manually.' 
      });
    }
    
    // Define allowed status transitions - COMPLETE FLOW
    const allowedTransitions = {
      'placed': ['follow_up', 'cancelled'],
      'follow_up': ['accepted', 'rejected', 'cancelled', 'reminder'],
      'reminder': ['accepted', 'rejected', 'cancelled'],
      'accepted': ['approved', 'cancelled'],
      'approved': ['ready_to_ship', 'cancelled'],
      'ready_to_ship': ['courier_assigned', 'cancelled'],
      'rejected': ['cancelled'],
      'courier_assigned': [], // No manual changes (courier handles it)
      'processing': [], // Courier handles
      'shipped': [], // Courier handles
      'out_for_delivery': [], // Courier handles
      'delivered': [], // No further changes allowed
      'cancelled': []  // No further changes allowed
    };
    
    const currentStatus = order.orderStatus;
    const newStatus = orderStatus;
    const userRole = req.user?.role || 'admin';
    
    // Validate status transition
    if (currentStatus !== newStatus) {
      const allowedNext = allowedTransitions[currentStatus] || [];
      if (!allowedNext.includes(newStatus)) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid status transition from "${currentStatus}" to "${newStatus}". Allowed: ${allowedNext.join(', ')}` 
        });
      }
    }
    
    const oldStatus = order.orderStatus;
    
    // Handle special cases for status changes
    
    // If order is being cancelled
    if (orderStatus === 'cancelled' && order.orderStatus !== 'cancelled') {
      order.cancelledAt = new Date();
      if (cancellationReason) {
        order.cancellationReason = cancellationReason;
      }
      
      // Restore stock for cancelled order
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stockQuantity: item.quantity } }
        );
      }
    }
    
    // If order is being rejected
    if (orderStatus === 'rejected' && order.orderStatus !== 'rejected') {
      order.cancelledAt = new Date();
      if (rejectionReason) {
        order.rejectionReason = rejectionReason;
      }
      
      // Restore stock for rejected order
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stockQuantity: item.quantity } }
        );
      }
    }
    
    // If order is being delivered
    if (orderStatus === 'delivered' && order.orderStatus !== 'delivered') {
      order.deliveredAt = new Date();
      
      // For COD orders, automatically mark payment as paid when delivered
      if (order.paymentMethod === 'cod' && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        console.log(`✅ COD order ${order.orderNumber} - Payment auto-updated to Paid on delivery`);
      }
    }
    
    // If order is being assigned to courier
    if (orderStatus === 'courier_assigned' && courierService) {
      // Set delivery service info
      order.setDeliveryService({
        courierName: courierService,
        courierSlug: courierService.toLowerCase(),
        deliveryStatus: 'processing',
        trackingNumber: trackingNumber || null
      });
    }
    
    // Update order fields
    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (deliveryNote !== undefined) order.deliveryNote = deliveryNote;
    
    // Update timestamp based on status
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
    
    if (timestampMap[orderStatus]) {
      order[timestampMap[orderStatus]] = new Date();
    }
    
    // ========== FIX: Map user role to valid enum value ==========
    const userId = req.user?._id;
    let userRoleMapped = userRole;
    
    // Map call_center_agent to call_center (valid enum value)
    if (userRoleMapped === 'call_center_agent') {
      userRoleMapped = 'call_center';
    }
    
    // Map customer to user (valid enum value)
    if (userRoleMapped === 'customer') {
      userRoleMapped = 'user';
    }
    
    // Create status note
    let statusNote = `Status updated from ${oldStatus} to ${orderStatus}`;
    
    if (orderStatus === 'cancelled' && cancellationReason) {
      statusNote = `Cancelled: ${cancellationReason}`;
    }
    
    if (orderStatus === 'rejected' && rejectionReason) {
      statusNote = `Rejected: ${rejectionReason}`;
    }
    
    if (orderStatus === 'delivered') {
      statusNote = 'Order delivered successfully';
    }
    
    if (orderStatus === 'follow_up') {
      statusNote = 'Order sent to call center for follow up';
    }
    
    if (orderStatus === 'accepted') {
      statusNote = 'Order accepted';
    }
    
    if (orderStatus === 'approved') {
      statusNote = 'Order approved';
    }
    
    if (orderStatus === 'ready_to_ship') {
      statusNote = 'Order ready to ship';
    }
    
    if (orderStatus === 'courier_assigned') {
      statusNote = `Order assigned to ${courierService || 'courier'}`;
    }
    
    if (orderStatus === 'reminder') {
      statusNote = 'Reminder sent to customer';
    }
    
    // Add status history with mapped role
    order.addStatusHistory(orderStatus, statusNote, userId, userRoleMapped);
    
    await order.save();
    
    // Send email notifications
    if (oldStatus !== orderStatus) {
      if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
        try {
          await sendOrderStatusUpdateEmail(order, order.customerInfo.email, oldStatus, orderStatus);
          console.log('✅ Status update email sent to customer for order:', order.orderNumber);
        } catch (emailError) {
          console.error('❌ Status update email error:', emailError.message);
        }
      }

      try {
        await sendOrderNotificationToAdmin(order, 'status_update');
        console.log('✅ Status update notification sent to admin for order:', order.orderNumber);
      } catch (emailError) {
        console.error('❌ Admin notification error on status update:', emailError.message);
      }
    }
    
    // Prepare response message
    let responseMessage = `Order status updated to ${orderStatus}`;
    if (orderStatus === 'delivered' && order.paymentMethod === 'cod' && order.paymentStatus === 'paid') {
      responseMessage = `Order delivered and payment marked as Paid`;
    }
    
    res.json({
      success: true,
      data: order,
      message: responseMessage
    });
    
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== UPDATE PAYMENT STATUS ==========
const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentDetails } = req.body;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    const validStatuses = ['pending', 'paid', 'failed', 'refunded'];
    
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ success: false, error: 'Invalid payment status' });
    }
    
    const oldStatus = order.paymentStatus;
    const currentStatus = order.paymentStatus;
    
    if (currentStatus === 'pending') {
      if (!['paid', 'failed'].includes(paymentStatus)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Pending status can only be changed to Paid or Failed' 
        });
      }
    } else if (currentStatus === 'failed') {
      if (paymentStatus !== 'paid') {
        return res.status(400).json({ 
          success: false, 
          error: 'Failed status can only be changed to Paid' 
        });
      }
    } else if (currentStatus === 'paid') {
      if (paymentStatus !== 'refunded') {
        return res.status(400).json({ 
          success: false, 
          error: 'Paid status can only be changed to Refunded' 
        });
      }
    } else if (currentStatus === 'refunded') {
      return res.status(400).json({ 
        success: false, 
        error: 'Refunded status cannot be changed further' 
      });
    }
    
    order.paymentStatus = paymentStatus;
    if (paymentDetails) {
      order.paymentDetails = { ...order.paymentDetails, ...paymentDetails };
    }
    
    await order.save();
    
    if (oldStatus !== paymentStatus) {
      if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
        try {
          await sendPaymentStatusUpdateEmail(order, order.customerInfo.email, oldStatus, paymentStatus);
          console.log('✅ Payment status update email sent to customer for order:', order.orderNumber);
        } catch (emailError) {
          console.error('❌ Payment status update email error:', emailError.message);
        }
      }

      try {
        await sendOrderNotificationToAdmin(order, 'payment_update');
        console.log('✅ Payment status update notification sent to admin for order:', order.orderNumber);
      } catch (emailError) {
        console.error('❌ Admin notification error on payment update:', emailError.message);
      }
    }
    
    res.json({
      success: true,
      data: order,
      message: `Payment status updated to ${paymentStatus}`
    });
    
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== CANCEL ORDER ==========
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { cancellationReason } = req.body;
    const userId = req.user?._id;
    const userRole = req.user?.role;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    const hasPermission = (userId && order.userId && order.userId.toString() === userId.toString()) ||
                         (sessionId && order.sessionId === sessionId) ||
                         ['admin', 'moderator'].includes(userRole);
    
    if (!hasPermission) {
      return res.status(403).json({ success: false, error: 'Unauthorized to cancel this order' });
    }
    
    const isAdminOrModerator = ['admin', 'moderator'].includes(userRole);
    
    if (!isAdminOrModerator) {
      if (order.orderStatus !== 'placed') {
        return res.status(400).json({ 
          success: false, 
          error: `Order cannot be cancelled. Current status: ${order.orderStatus}. Only 'Placed' orders can be cancelled by customer.` 
        });
      }
    } else {
      const cancelableStatuses = ['placed', 'follow_up', 'accepted', 'processing', 'shipped', 'out_for_delivery'];
      
      if (!cancelableStatuses.includes(order.orderStatus)) {
        return res.status(400).json({ 
          success: false, 
          error: `Order cannot be cancelled. Current status: ${order.orderStatus}. Only 'Placed', 'Follow Up', 'Accepted', 'Processing', 'Shipped', or 'Out for Delivery' orders can be cancelled.` 
        });
      }
    }
    
    const oldStatus = order.orderStatus;
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = cancellationReason || (isAdminOrModerator ? 'Cancelled by admin' : 'Cancelled by customer');
    
    order.addStatusHistory(
      'cancelled', 
      cancellationReason || 'Order cancelled',
      userId,
      isAdminOrModerator ? userRole : 'user'
    );
    
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: item.quantity } }
      );
    }
    
    await order.save();
    
    if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
      try {
        await sendOrderStatusUpdateEmail(order, order.customerInfo.email, oldStatus, 'cancelled');
        console.log('✅ Cancellation email sent to customer for order:', order.orderNumber);
      } catch (emailError) {
        console.error('❌ Cancellation email error:', emailError.message);
      }
    }

    try {
      await sendOrderNotificationToAdmin(order, 'status_update');
      console.log('✅ Cancellation notification sent to admin for order:', order.orderNumber);
    } catch (emailError) {
      console.error('❌ Admin notification error on cancellation:', emailError.message);
    }
    
    res.json({
      success: true,
      data: order,
      message: 'Order cancelled successfully'
    });
    
  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== GET ALL ORDERS ==========
const getAllOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      orderStatus,
      paymentStatus,
      search,
      startDate,
      endDate,
      sort = '-createdAt'
    } = req.query;
    
    const query = {};
    
    if (orderStatus) query.orderStatus = orderStatus;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { orderNumber: searchRegex },  
        { 'customerInfo.fullName': searchRegex },
        { 'customerInfo.email': searchRegex },
        { 'customerInfo.phone': searchRegex },
        { 'customerInfo.division': searchRegex },
        { 'customerInfo.city': searchRegex },
        { 'customerInfo.zone': searchRegex },
        { 'items.productName': searchRegex }
      ];
    }
    
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    let sortOption = {};
    switch (sort) {
      case 'createdAt_asc': sortOption = { createdAt: 1 }; break;
      case 'createdAt_desc': sortOption = { createdAt: -1 }; break;
      case 'total_asc': sortOption = { total: 1 }; break;
      case 'total_desc': sortOption = { total: -1 }; break;
      case '-createdAt': sortOption = { createdAt: -1 }; break;
      case '-total': sortOption = { total: -1 }; break;
      default: sortOption = { createdAt: -1 };
    }
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('userId', 'name email phone')
        .populate('statusHistory.updatedBy', 'email name contactPerson')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};



// controllers/orderController.js - Update getOrderStats

// const getOrderStats = async (req, res) => {
//   try {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
    
//     const thisMonth = new Date();
//     thisMonth.setDate(1);
//     thisMonth.setHours(0, 0, 0, 0);
    
//     const [
//       totalOrders,
//       pendingPayment,
//       placedOrders,
//       followUpOrders,
//       acceptedOrders,
//       approvedOrders,
//       readyToShipOrders,
//       courierAssignedOrders,
//       rejectedOrders,
//       processingOrders,
//       shippedOrders,
//       outForDeliveryOrders,
//       deliveredOrders,
//       cancelledOrders,
//       reminderOrders,
//       todayOrders,
//       monthOrders,
//       totalRevenue,
//       monthRevenue
//     ] = await Promise.all([
//       Order.countDocuments(),
//       Order.countDocuments({ paymentStatus: 'pending' }),
//       Order.countDocuments({ orderStatus: 'placed' }),
//       Order.countDocuments({ orderStatus: 'follow_up' }),
//       Order.countDocuments({ orderStatus: 'accepted' }),
//       Order.countDocuments({ orderStatus: 'approved' }),
//       Order.countDocuments({ orderStatus: 'ready_to_ship' }),
//       Order.countDocuments({ orderStatus: 'courier_assigned' }),
//       Order.countDocuments({ orderStatus: 'rejected' }),
//       Order.countDocuments({ orderStatus: 'processing' }),
//       Order.countDocuments({ orderStatus: 'shipped' }),
//       Order.countDocuments({ orderStatus: 'out_for_delivery' }),
//       Order.countDocuments({ orderStatus: 'delivered' }),
//       Order.countDocuments({ orderStatus: 'cancelled' }),
//       Order.countDocuments({ orderStatus: 'reminder' }),
//       Order.countDocuments({ createdAt: { $gte: today } }),
//       Order.countDocuments({ createdAt: { $gte: thisMonth } }),
//       Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
//       Order.aggregate([
//         { $match: { createdAt: { $gte: thisMonth } } },
//         { $group: { _id: null, total: { $sum: '$total' } } }
//       ])
//     ]);
    
//     const statusDistribution = await Order.aggregate([
//       { $group: { _id: '$orderStatus', count: { $sum: 1 }, totalValue: { $sum: '$total' } } },
//       { $sort: { count: -1 } }
//     ]);
    
//     res.json({
//       success: true,
//       data: {
//         totalOrders,
//         pendingPayment,
//         placedOrders,
//         followUpOrders,
//         acceptedOrders,
//         approvedOrders,
//         readyToShipOrders,
//         courierAssignedOrders,
//         rejectedOrders,
//         processingOrders,
//         shippedOrders,
//         outForDeliveryOrders,
//         deliveredOrders,
//         cancelledOrders,
//         reminderOrders,
//         todayOrders,
//         monthOrders,
//         totalRevenue: totalRevenue[0]?.total || 0,
//         monthRevenue: monthRevenue[0]?.total || 0,
//         statusDistribution
//       }
//     });
    
//   } catch (error) {
//     console.error('Get order stats error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// controllers/orderController.js - Updated getOrderStats (Moderator sees all)

// ========== GET ORDER STATISTICS ==========
// @desc    Get order statistics based on user role
// @route   GET /api/orders/admin/stats
// @access  Private (Admin/Moderator/Super Admin)
const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const userRole = req.user?.role || 'admin';
    
    // ========== BUILD QUERY BASED ON ROLE ==========
    let statusQuery = {};
    
    // Super Admin, Admin, Moderator: Can see all orders
    if (['super_admin', 'admin', 'moderator'].includes(userRole)) {
      statusQuery = {}; // No filter - see all orders
    } 
    // Call Center Agent: Can only see agent-specific statuses
    else if (userRole === 'call_center_agent') {
      statusQuery = {
        orderStatus: { $in: ['follow_up', 'reminder', 'accepted', 'cancelled'] }
      };
    }
    // Default: Only placed, follow_up, reminder, accepted
    else {
      statusQuery = {
        orderStatus: { $in: ['placed', 'follow_up', 'reminder', 'accepted'] }
      };
    }
    
    // ========== GET ALL ORDER COUNTS ==========
    const [
      totalOrders,
      pendingPayment,
      placedOrders,
      followUpOrders,
      reminderOrders,
      acceptedOrders,
      approvedOrders,
      readyToShipOrders,
      courierAssignedOrders,
      rejectedOrders,
      processingOrders,
      shippedOrders,
      outForDeliveryOrders,
      deliveredOrders,
      cancelledOrders,
      todayOrders,
      monthOrders,
      totalRevenue,
      monthRevenue
    ] = await Promise.all([
      Order.countDocuments(statusQuery),
      Order.countDocuments({ ...statusQuery, paymentStatus: 'pending' }),
      Order.countDocuments({ ...statusQuery, orderStatus: 'placed' }),
      Order.countDocuments({ ...statusQuery, orderStatus: 'follow_up' }),
      Order.countDocuments({ ...statusQuery, orderStatus: 'reminder' }),
      Order.countDocuments({ ...statusQuery, orderStatus: 'accepted' }),
      Order.countDocuments({ ...statusQuery, orderStatus: 'approved' }),
      Order.countDocuments({ ...statusQuery, orderStatus: 'ready_to_ship' }),
      Order.countDocuments({ ...statusQuery, orderStatus: 'courier_assigned' }),
      Order.countDocuments({ ...statusQuery, orderStatus: 'rejected' }),
      Order.countDocuments({ ...statusQuery, orderStatus: 'processing' }),
      Order.countDocuments({ ...statusQuery, orderStatus: 'shipped' }),
      Order.countDocuments({ ...statusQuery, orderStatus: 'out_for_delivery' }),
      Order.countDocuments({ ...statusQuery, orderStatus: 'delivered' }),
      Order.countDocuments({ ...statusQuery, orderStatus: 'cancelled' }),
      Order.countDocuments({ ...statusQuery, createdAt: { $gte: today } }),
      Order.countDocuments({ ...statusQuery, createdAt: { $gte: thisMonth } }),
      Order.aggregate([{ $match: statusQuery }, { $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([
        { $match: { ...statusQuery, createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);
    
    // ========== GET STATUS DISTRIBUTION ==========
    const statusDistribution = await Order.aggregate([
      { $match: statusQuery },
      { $group: { _id: '$orderStatus', count: { $sum: 1 }, totalValue: { $sum: '$total' } } },
      { $sort: { count: -1 } }
    ]);
    
    // ========== RESPONSE ==========
    res.json({
      success: true,
      data: {
        totalOrders,
        pendingPayment,
        placedOrders,
        followUpOrders,
        reminderOrders,
        acceptedOrders,
        approvedOrders,
        readyToShipOrders,
        courierAssignedOrders,
        rejectedOrders,
        processingOrders,
        shippedOrders,
        outForDeliveryOrders,
        deliveredOrders,
        cancelledOrders,
        todayOrders,
        monthOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthRevenue: monthRevenue[0]?.total || 0,
        statusDistribution
      }
    });
    
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== PREPARE ORDER ==========
const prepareOrder = async (req, res) => {
  try {
    const {
      items,
      subtotal,
      shippingCost,
      discount,
      total,
      paymentMethod,
      customerInfo,
      couponCode,
      couponDiscount,
      freeShipping,
      clientDeviceInfo = {}
    } = req.body;

    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' });
    }

    if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address || !customerInfo.division) {
      return res.status(400).json({ 
        success: false, 
        error: 'Customer information is incomplete. Full name, phone, address, and division are required.' 
      });
    }

    const processedItems = items.map(item => {
      const hasColors = item.colors && item.colors.length > 0;
      let totalQuantity = item.quantity || 0;
      if (hasColors) {
        totalQuantity = item.colors.reduce((sum, color) => sum + (color.quantity || 0), 0);
      }
      
      return {
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        image: item.image,
        regularPrice: item.regularPrice,
        discountPrice: item.discountPrice || 0,
        quantity: totalQuantity,
        stockQuantity: item.stockQuantity || 0,
        unit: item.unit || 'pcs',
        selectedColor: item.selectedColor || null,
        colors: item.colors || []
      };
    });

    const clientInfo = getClientDeviceInfoFromBody(req);
    const deviceInfo = getAccurateDeviceInfo(req, clientInfo);

    const orderData = {
      userId: userId || null,
      sessionId: userId ? null : sessionId,
      items: processedItems,
      customerInfo: {
        fullName: customerInfo.fullName,
        email: customerInfo.email || '',
        phone: customerInfo.phone,
        division: customerInfo.division,
        address: customerInfo.address,
        city: customerInfo.city,
        zone: customerInfo.zone,
        area: customerInfo.area || '',
        zipCode: customerInfo.zipCode || '',
        country: customerInfo.country || 'Bangladesh',
        note: customerInfo.note || ''
      },
      subtotal,
      shippingCost,
      discount: discount || 0,
      total,
      paymentMethod,
      paymentStatus: 'pending',
      orderStatus: 'placed',
      couponCode: couponCode || null,
      couponDiscount: couponDiscount || 0,
      freeShipping: freeShipping || false,
      orderDate: new Date(),
      deviceInfo: deviceInfo
    };
    
    res.json({
      success: true,
      data: orderData,
      message: 'Order data prepared'
    });
    
  } catch (error) {
    console.error('Prepare order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== DELETE ORDER ==========
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    if (!['cancelled', 'delivered'].includes(order.orderStatus)) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stockQuantity: item.quantity } }
        );
      }
    }
    
    await order.deleteOne();
    
    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== UPDATE ORDER ==========
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerInfo, trackingNumber, deliveryNote } = req.body;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    if (customerInfo) {
      order.customerInfo = {
        ...order.customerInfo.toObject ? order.customerInfo.toObject() : order.customerInfo,
        ...customerInfo
      };
    }
    
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (deliveryNote !== undefined) order.deliveryNote = deliveryNote;
    
    await order.save();
    
    res.json({
      success: true,
      data: order,
      message: 'Order updated successfully'
    });
    
  } catch (error) {
    console.error('Update order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== CREATE DELIVERY ORDER - UPDATED TO ALLOW READY_TO_SHIP ==========
// ========== CREATE DELIVERY ORDER - UPDATED TO ALLOW READY_TO_SHIP ==========
// const createDeliveryOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { courierSlug, deliveryNote, weight } = req.body;
    
//     if (!courierSlug) {
//       return res.status(400).json({ success: false, error: 'Courier slug is required' });
//     }
    
//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }
    
//     // ========== CHECK IF ORDER IS CANCELLED ==========
//     if (order.orderStatus === 'cancelled') {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Order is cancelled. Cannot create delivery.' 
//       });
//     }
    
//     // ========== CHECK IF ORDER ALREADY HAS DELIVERY ==========
//     if (order.deliveryService && order.deliveryService.courierOrderId) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Order already has a delivery service assigned' 
//       });
//     }
    
//     // ========== ALLOW READY_TO_SHIP, ACCEPTED, AND PROCESSING ==========
//     const allowedStatuses = ['accepted', 'processing', 'ready_to_ship'];
//     if (!allowedStatuses.includes(order.orderStatus)) {
//       return res.status(400).json({ 
//         success: false, 
//         error: `Order status is ${order.orderStatus}. Only 'Accepted', 'Processing', or 'Ready to Ship' orders can create delivery.` 
//       });
//     }
    
//     // ========== GET COURIER INTEGRATION ==========
//     const integration = await getCourierIntegration(courierSlug);
    
//     if (!integration || !integration.creds || !integration.apiEnabled) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Courier is not configured or disabled' 
//       });
//     }
    
//     // ========== PREPARE ORDER DATA ==========
//     const orderData = {
//       ...order.toObject(),
//       orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-8)}`,
//       items: order.items.map(item => ({
//         ...item,
//         weight: weight ? weight / order.items.length : 0.5
//       }))
//     };
    
//     // ========== CREATE DELIVERY ORDER WITH COURIER ==========
//     const result = await createCourierOrder(
//       courierSlug,
//       integration.creds,
//       integration.storeConfig,
//       orderData
//     );
    
//     if (!result.success) {
//       return res.status(400).json({ 
//         success: false, 
//         error: result.message || 'Failed to create delivery order' 
//       });
//     }
    
//     // ========== UPDATE ORDER WITH DELIVERY INFO ==========
//     order.deliveryService = {
//       courierId: integration.id,
//       courierName: courierSlug.charAt(0).toUpperCase() + courierSlug.slice(1),
//       courierSlug: courierSlug,
//       trackingNumber: result.trackingNumber,
//       trackingUrl: result.trackingUrl,
//       courierOrderId: result.courierOrderId,
//       courierResponse: result.fullResponse,
//       deliveryStatus: 'processing',
//       labelUrl: result.labelUrl || '',
//       invoiceUrl: result.invoiceUrl || '',
//       deliveryNote: deliveryNote || '',
//       weight: weight || 0.5,
//       deliveryStatusHistory: [
//         {
//           status: 'processing',
//           message: `Delivery order created with ${courierSlug} courier service`,
//           timestamp: new Date()
//         }
//       ]
//     };
    
//     // ========== UPDATE ORDER STATUS ==========
//     order.trackingNumber = result.trackingNumber;
//     order.orderStatus = 'processing';
//     order.processingAt = new Date();
    
//     order.addStatusHistory(
//       'processing', 
//       `Order assigned to ${courierSlug} courier for delivery`,
//       req.user?._id,
//       req.user?.role || 'admin'
//     );
    
//     await order.save();
    
//     res.json({
//       success: true,
//       data: {
//         order,
//         deliveryResult: result
//       },
//       message: `Delivery order created successfully with ${courierSlug}`
//     });
//   } catch (error) {
//     console.error('❌ Create delivery order error:', error);
//     res.status(500).json({ 
//       success: false, 
//       error: error.message || 'Failed to create delivery order' 
//     });
//   }
// };

// ========== CREATE DELIVERY ORDER ==========
// ========== CREATE DELIVERY ORDER ==========
const createDeliveryOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { courierSlug, deliveryNote, weight } = req.body;
    
    if (!courierSlug) {
      return res.status(400).json({ success: false, error: 'Courier slug is required' });
    }
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Check if order is cancelled
    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        error: 'Order is cancelled. Cannot create delivery.' 
      });
    }
    
    // Check if order already has delivery
    if (order.deliveryService && order.deliveryService.courierOrderId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Order already has a delivery service assigned' 
      });
    }
    
    // ========== ALLOW READY_TO_SHIP, ACCEPTED, AND PROCESSING ==========
    const allowedStatuses = ['accepted', 'processing', 'ready_to_ship'];
    if (!allowedStatuses.includes(order.orderStatus)) {
      return res.status(400).json({ 
        success: false, 
        error: `Order status is ${order.orderStatus}. Only 'Accepted', 'Processing', or 'Ready to Ship' orders can create delivery.` 
      });
    }
    
    // ========== GET COURIER INTEGRATION ==========
    const { getCourierIntegration } = require('../lib/couriers/credentials');
    const integration = await getCourierIntegration(courierSlug);
    
    if (!integration || !integration.creds || !integration.apiEnabled) {
      return res.status(400).json({ 
        success: false, 
        error: 'Courier is not configured or disabled' 
      });
    }
    
    // ========== PREPARE ORDER DATA ==========
    const orderData = {
      ...order.toObject(),
      orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-8)}`,
      items: order.items.map(item => ({
        ...item,
        weight: weight ? weight / order.items.length : 0.5
      }))
    };
    
    // ========== CREATE DELIVERY ORDER WITH COURIER ==========
    const { createCourierOrder } = require('../lib/couriers/factory');
    const result = await createCourierOrder(
      courierSlug,
      integration.creds,
      integration.storeConfig,
      orderData
    );
    
    // ========== LOG THE RESULT FROM COURIER API ==========
    console.log('✅ Courier API result:', {
      success: result.success,
      courierOrderId: result.courierOrderId,
      trackingNumber: result.trackingNumber,
      trackingUrl: result.trackingUrl,
      message: result.message
    });
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        error: result.message || 'Failed to create delivery order' 
      });
    }
    
    // ========== UPDATE ORDER WITH DELIVERY INFO ==========
    order.deliveryService = {
      courierId: integration.id,
      courierName: courierSlug.charAt(0).toUpperCase() + courierSlug.slice(1),
      courierSlug: courierSlug,
      trackingNumber: result.trackingNumber || null,
      trackingUrl: result.trackingUrl || '',
      courierOrderId: result.courierOrderId || null,
      courierResponse: result.fullResponse || {},
      deliveryStatus: 'processing',
      labelUrl: result.labelUrl || '',
      invoiceUrl: result.invoiceUrl || '',
      deliveryNote: deliveryNote || '',
      weight: weight || 0.5,
      deliveryStatusHistory: [
        {
          status: 'processing',
          message: `Delivery order created with ${courierSlug} courier service`,
          timestamp: new Date()
        }
      ]
    };
    
    // ========== UPDATE ORDER STATUS ==========
    order.trackingNumber = result.trackingNumber || null;
    order.orderStatus = 'processing';
    order.processingAt = new Date();
    
    // Add status history
    order.addStatusHistory(
      'processing', 
      `Order assigned to ${courierSlug} courier for delivery`,
      req.user?._id,
      req.user?.role || 'admin'
    );
    
    // ========== 🔴 DEBUG LOGS - BEFORE SAVE 🔴 ==========
    console.log('📦 Order deliveryService before save:', JSON.stringify(order.deliveryService, null, 2));
    console.log('📦 Tracking number:', order.deliveryService?.trackingNumber);
    console.log('📦 Courier name:', order.deliveryService?.courierName);
    console.log('📦 Courier slug:', order.deliveryService?.courierSlug);
    console.log('📦 Courier order ID:', order.deliveryService?.courierOrderId);
    console.log('📦 Tracking URL:', order.deliveryService?.trackingUrl);
    console.log('📦 Result from courier:', {
      trackingNumber: result.trackingNumber,
      courierOrderId: result.courierOrderId,
      trackingUrl: result.trackingUrl
    });
    
    // ========== SAVE THE ORDER ==========
    await order.save();
    
    // ========== 🔴 DEBUG LOGS - AFTER SAVE 🔴 ==========
    console.log('✅ Order saved successfully!');
    console.log('📦 Saved deliveryService:', JSON.stringify(order.deliveryService, null, 2));
    console.log('📦 Saved tracking number:', order.deliveryService?.trackingNumber);
    console.log('📦 Saved courier name:', order.deliveryService?.courierName);
    
    res.json({
      success: true,
      data: {
        order,
        deliveryResult: result
      },
      message: `Delivery order created successfully with ${courierSlug}`
    });
  } catch (error) {
    console.error('❌ Create delivery order error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create delivery order' 
    });
  }
};

// ========== GET ORDER TRACKING ==========
// const getOrderTracking = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const order = await Order.findById(id);
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }
    
//     if (!order.deliveryService || !order.deliveryService.courierSlug) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'No delivery service assigned to this order' 
//       });
//     }
    
//     const { courierSlug, trackingNumber } = order.deliveryService;
    
//     const { getCourierIntegration } = require('../lib/credentials');
//     const integration = await getCourierIntegration(courierSlug);
    
//     if (!integration || !integration.creds) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Courier is not configured' 
//       });
//     }
    
//     const { getCourierTracking } = require('../lib/couriers/factory');
//     const result = await getCourierTracking(
//       courierSlug,
//       integration.creds,
//       trackingNumber
//     );
    
//     if (!result.success) {
//       return res.status(400).json({ 
//         success: false, 
//         error: result.message || 'Failed to get tracking info' 
//       });
//     }
    
//     res.json({
//       success: true,
//       data: result
//     });
//   } catch (error) {
//     console.error('Get tracking error:', error);
//     res.status(500).json({ success: false, error: error.message });
//   }
// };

// ========== GET ORDER TRACKING ==========
const getOrderTracking = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    if (!order.deliveryService || !order.deliveryService.courierSlug) {
      return res.status(400).json({ 
        success: false, 
        error: 'No delivery service assigned to this order' 
      });
    }
    
    const { courierSlug, trackingNumber } = order.deliveryService;
    
    const { getCourierIntegration } = require('../lib/couriers/credentials');
    const integration = await getCourierIntegration(courierSlug);
    
    if (!integration || !integration.creds) {
      return res.status(400).json({ 
        success: false, 
        error: 'Courier is not configured' 
      });
    }
    
    const { getCourierTracking } = require('../lib/couriers/factory');
    const result = await getCourierTracking(
      courierSlug,
      integration.creds,
      trackingNumber
    );
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        error: result.message || 'Failed to get tracking info' 
      });
    }
    
    // ========== AUTO-UPDATE PAYMENT STATUS ON DELIVERY ==========
    // Check if tracking status indicates delivered
    const trackingStatus = (result.status || result.data?.status || '').toLowerCase();
    const deliveredKeywords = ['delivered', 'completed', 'success'];
    const isDelivered = deliveredKeywords.some(keyword => 
      trackingStatus === keyword || trackingStatus.includes(keyword)
    );
    
    // If delivered and not already marked
    if (isDelivered && order.deliveryService.deliveryStatus !== 'delivered') {
      const oldPaymentStatus = order.paymentStatus;
      
      // Update delivery status (auto-payment logic inside)
      order.updateDeliveryStatus(
        'delivered', 
        result.message || 'Order delivered successfully',
        result.location || ''
      );
      
      await order.save();
      
      console.log(`✅ Order ${order.orderNumber} - Auto-updated on tracking: Delivered`);
      if (oldPaymentStatus !== order.paymentStatus) {
        console.log(`💰 Order ${order.orderNumber} - Payment: ${oldPaymentStatus} → ${order.paymentStatus}`);
      }
    }
    
    res.json({
      success: true,
      data: {
        ...result,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus,
        deliveryStatus: order.deliveryService.deliveryStatus
      }
    });
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== TRACK ORDER BY PHONE ==========
const trackOrderByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    
    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number is required' 
      });
    }
    
    const orders = await Order.find({
      'customerInfo.phone': phone
    })
    .sort({ createdAt: -1 })
    .select('_id orderNumber orderStatus items subtotal shippingCost discount total customerInfo createdAt deliveredAt cancelledAt statusHistory trackingNumber paymentMethod paymentStatus');
    
    if (!orders || orders.length === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'No orders found for this phone number' 
      });
    }
    
    const statusLabels = {
      'placed': 'Order Placed',
      'follow_up': 'Follow Up',
      'accepted': 'Accepted',
      'processing': 'Processing',
      'shipped': 'Shipped',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'cancelled': 'Cancelled',
      'reminder': 'Reminder',
      'refunded': 'Refunded',
      'failed': 'Failed'
    };
    
    const formattedOrders = orders.map(order => {
      const timeline = order.statusHistory ? order.statusHistory.map(entry => ({
        status: entry.status,
        label: statusLabels[entry.status] || entry.status,
        note: entry.note,
        timestamp: entry.timestamp,
        formattedDate: entry.timestamp ? new Date(entry.timestamp).toLocaleString('en-BD', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : null
      })) : [];
      
      if (timeline.length === 0) {
        timeline.push({
          status: order.orderStatus,
          label: statusLabels[order.orderStatus] || order.orderStatus,
          note: `Order ${order.orderStatus}`,
          timestamp: order.createdAt,
          formattedDate: new Date(order.createdAt).toLocaleString('en-BD', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        });
        
        if (order.deliveredAt) {
          timeline.push({
            status: 'delivered',
            label: 'Delivered',
            note: 'Order delivered',
            timestamp: order.deliveredAt,
            formattedDate: new Date(order.deliveredAt).toLocaleString('en-BD', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          });
        }
        
        if (order.cancelledAt) {
          timeline.push({
            status: 'cancelled',
            label: 'Cancelled',
            note: order.cancellationReason || 'Order cancelled',
            timestamp: order.cancelledAt,
            formattedDate: new Date(order.cancelledAt).toLocaleString('en-BD', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          });
        }
      }
      
      timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      const itemsSummary = order.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.discountPrice || item.regularPrice,
        image: item.image
      }));
      
      return {
        _id: order._id,
        id: order._id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        statusLabel: statusLabels[order.orderStatus] || order.orderStatus,
        customerName: order.customerInfo?.fullName,
        total: order.total,
        subtotal: order.subtotal,
        shippingCost: order.shippingCost,
        discount: order.discount,
        createdAt: order.createdAt,
        deliveredAt: order.deliveredAt || null,
        cancelledAt: order.cancelledAt || null,
        trackingNumber: order.trackingNumber || null,
        paymentMethod: order.paymentMethod,
        paymentStatus: order.paymentStatus,
        items: itemsSummary,
        timeline: timeline,
        statusHistory: order.statusHistory || []
      };
    });
    
    res.json({
      success: true,
      data: {
        phone: phone,
        totalOrders: formattedOrders.length,
        orders: formattedOrders
      },
      message: `Found ${formattedOrders.length} order(s) for this phone number`
    });
    
  } catch (error) {
    console.error('Track order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== GET PUBLIC ORDER ==========
const getPublicOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    res.json({ success: true, data: order });
    
  } catch (error) {
    console.error('Get public order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};


// controllers/orderController.js - Add these functions after the existing ones

// ========== GET AGENT ORDERS ==========
// @desc    Get orders for call center agent (follow_up, reminder, accepted, cancelled)
// @route   GET /api/orders/agent/orders
// @access  Private (Call Center Agent only)
const getAgentOrders = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      orderStatus,
      search,
      sort = '-createdAt'
    } = req.query;
    
    const query = {
      orderStatus: { $in: ['follow_up', 'reminder', 'accepted', 'cancelled'] }
    };
    
    if (orderStatus) {
      query.orderStatus = orderStatus;
    }
    
    // Search by order number or customer name/email/phone
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { orderNumber: searchRegex },  
        { 'customerInfo.fullName': searchRegex },
        { 'customerInfo.email': searchRegex },
        { 'customerInfo.phone': searchRegex },
        { 'customerInfo.division': searchRegex },
        { 'customerInfo.city': searchRegex },
        { 'customerInfo.zone': searchRegex },
        { 'items.productName': searchRegex }
      ];
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'createdAt_asc':
        sortOption = { createdAt: 1 };
        break;
      case 'createdAt_desc':
        sortOption = { createdAt: -1 };
        break;
      case 'total_asc':
        sortOption = { total: 1 };
        break;
      case 'total_desc':
        sortOption = { total: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }
    
    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('userId', 'name email phone')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Order.countDocuments(query)
    ]);
    
    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
    
  } catch (error) {
    console.error('Get agent orders error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== UPDATE AGENT ORDER STATUS ==========
const updateAgentOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, cancellationReason, statusNote } = req.body;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Check if order is in agent-accessible statuses
    if (!['follow_up', 'reminder', 'accepted', 'cancelled'].includes(order.orderStatus)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Order is not in agent-accessible status' 
      });
    }
    
    // If order is already cancelled or accepted, prevent further changes
    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        error: 'Order is already rejected. No further changes allowed.' 
      });
    }
    
    if (order.orderStatus === 'accepted') {
      return res.status(400).json({ 
        success: false, 
        error: 'Order is already accepted. No further changes allowed.' 
      });
    }
    
    // Define allowed transitions for agent
    const allowedTransitions = {
      'follow_up': ['accepted', 'cancelled', 'reminder'],
      'reminder': ['accepted', 'cancelled']
    };
    
    const currentStatus = order.orderStatus;
    
    // Validate status transition
    if (currentStatus !== orderStatus) {
      const allowedNext = allowedTransitions[currentStatus] || [];
      if (!allowedNext.includes(orderStatus)) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid status transition from "${currentStatus}" to "${orderStatus}". Allowed: ${allowedNext.join(', ')}` 
        });
      }
    }
    
    const oldStatus = order.orderStatus;
    
    // Handle cancellation
    if (orderStatus === 'cancelled') {
      if (!cancellationReason) {
        return res.status(400).json({ 
          success: false, 
          error: 'Cancellation reason is required' 
        });
      }
      order.cancelledAt = new Date();
      order.cancellationReason = cancellationReason;
      
      // Restore stock for cancelled order
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { stockQuantity: item.quantity } }
        );
      }
    }
    
    // Update order status
    order.orderStatus = orderStatus;
    
    // Update timestamp based on status
    switch(orderStatus) {
      case 'follow_up':
        order.followUpAt = new Date();
        break;
      case 'accepted':
        order.acceptedAt = new Date();
        break;
      case 'cancelled':
        order.cancelledAt = new Date();
        break;
      case 'reminder':
        order.reminderAt = new Date();
        break;
    }
    
    // Add status history with note
    const userId = req.user?._id;
    let userRole = req.user?.role || 'call_center';
    if (userRole === 'call_center_agent') {
      userRole = 'call_center';
    }
    
    // Build status note with optional note and cancellation reason
    let statusNoteText = `Status updated from ${oldStatus} to ${orderStatus}`;
    
    if (orderStatus === 'cancelled' && cancellationReason) {
      statusNoteText = `Rejected: ${cancellationReason}`;
    }
    
    if (orderStatus === 'accepted') {
      statusNoteText = 'Order accepted by call center agent';
    }
    
    if (orderStatus === 'reminder') {
      statusNoteText = 'Reminder set by call center agent';
    }
    
    // Append custom note if provided
    if (statusNote && statusNote.trim() !== '') {
      statusNoteText += ` | Note: ${statusNote.trim()}`;
    }
    
    order.addStatusHistory(orderStatus, statusNoteText, userId, userRole);
    
    await order.save();
    
    // Send email notification for status change
    if (oldStatus !== orderStatus) {
      if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
        try {
          await sendOrderStatusUpdateEmail(order, order.customerInfo.email, oldStatus, orderStatus);
          console.log('✅ Status update email sent to customer for order:', order.orderNumber);
        } catch (emailError) {
          console.error('❌ Status update email error:', emailError.message);
        }
      }

      try {
        await sendOrderNotificationToAdmin(order, 'status_update');
        console.log('✅ Status update notification sent to admin for order:', order.orderNumber);
      } catch (emailError) {
        console.error('❌ Admin notification error on status update:', emailError.message);
      }
    }
    
    res.json({
      success: true,
      data: order,
      message: `Order status updated to ${orderStatus}`
    });
    
  } catch (error) {
    console.error('Update agent order status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
// ========== GET AGENT DASHBOARD DATA ==========
// @desc    Get dashboard data for call center agent with month/year filter
// @route   GET /api/orders/agent/dashboard
// @access  Private (Call Center Agent only)
const getAgentDashboard = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    // Build date filter
    let dateFilter = {};
    if (month && year) {
      const startDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      const endDate = new Date(parseInt(year), parseInt(month), 0, 23, 59, 59);
      dateFilter = {
        createdAt: { $gte: startDate, $lte: endDate }
      };
    } else {
      // Default to current month
      const now = new Date();
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
      dateFilter = {
        createdAt: { $gte: startDate, $lte: endDate }
      };
    }
    
    // Query for agent-relevant statuses
    const agentStatuses = ['follow_up', 'reminder', 'accepted', 'cancelled'];
    const query = {
      orderStatus: { $in: agentStatuses },
      ...dateFilter
    };
    
    // Get all orders for stats
    const allOrders = await Order.find(query);
    
    // Calculate stats
    const stats = {
      total: allOrders.length,
      followUp: allOrders.filter(o => o.orderStatus === 'follow_up').length,
      reminder: allOrders.filter(o => o.orderStatus === 'reminder').length,
      accepted: allOrders.filter(o => o.orderStatus === 'accepted').length,
      cancelled: allOrders.filter(o => o.orderStatus === 'cancelled').length
    };
    
    // Get follow-up orders (sorted by newest first)
    const followUpOrders = await Order.find({
      orderStatus: 'follow_up',
      ...dateFilter
    })
    .sort({ createdAt: -1 })
    .limit(50);
    
    // Get reminder orders (sorted by newest first)
    const reminderOrders = await Order.find({
      orderStatus: 'reminder',
      ...dateFilter
    })
    .sort({ createdAt: -1 })
    .limit(50);
    
    res.json({
      success: true,
      stats,
      followUpOrders,
      reminderOrders,
      filter: {
        month: parseInt(month) || new Date().getMonth() + 1,
        year: parseInt(year) || new Date().getFullYear()
      }
    });
    
  } catch (error) {
    console.error('Get agent dashboard error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== UPDATE DELIVERY STATUS ==========
// @desc    Update delivery status from courier tracking
// @route   PUT /api/orders/:id/delivery-status
// @access  Private (User/Admin)
// ========== UPDATE DELIVERY STATUS ==========
// @desc    Update delivery status from courier tracking
// @route   PUT /api/orders/:id/delivery-status
// @access  Private (User/Admin)
const updateDeliveryStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, message, location } = req.body;
    
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Check permission
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    const hasPermission = (userId && order.userId && order.userId.toString() === userId.toString()) ||
                         (sessionId && order.sessionId === sessionId) ||
                         ['admin', 'moderator', 'super_admin'].includes(req.user?.role);
    
    if (!hasPermission) {
      return res.status(403).json({ success: false, error: 'Unauthorized to update this order' });
    }
    
    if (!order.deliveryService) {
      return res.status(400).json({ success: false, error: 'No delivery service found for this order' });
    }
    
    // Store old status before update
    const oldDeliveryStatus = order.deliveryService.deliveryStatus;
    const oldPaymentStatus = order.paymentStatus;
    
    // ========== UPDATE DELIVERY STATUS (AUTO-PAYMENT LOGIC INSIDE) ==========
    order.updateDeliveryStatus(status, message || `Status updated to ${status}`, location || '');
    
    await order.save();
    
    // Log changes
    console.log(`📦 Order ${order.orderNumber}: Delivery status ${oldDeliveryStatus} → ${status}`);
    if (oldPaymentStatus !== order.paymentStatus) {
      console.log(`💰 Order ${order.orderNumber}: Payment status ${oldPaymentStatus} → ${order.paymentStatus} (Auto-updated on delivery)`);
    }
    
    res.json({
      success: true,
      data: {
        deliveryStatus: order.deliveryService.deliveryStatus,
        deliveryStatusHistory: order.deliveryService.deliveryStatusHistory,
        paymentStatus: order.paymentStatus,
        orderStatus: order.orderStatus
      },
      message: `Delivery status updated to ${status}${order.paymentStatus === 'paid' ? ' and payment marked as Paid' : ''}`
    });
  } catch (error) {
    console.error('Update delivery status error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// ========== EXPORTS ==========
module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  getAllOrders,
  getOrderStats,
  prepareOrder,
  deleteOrder,
  updateOrder,
  createDeliveryOrder,
  getOrderTracking,
  trackOrderByPhone,
  getPublicOrder,
  getAgentOrders,        
  updateAgentOrderStatus,
  getAgentDashboard,
  checkOrderRestrictions,
  updateDeliveryStatus
};