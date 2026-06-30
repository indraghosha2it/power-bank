const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const Coupon = require('../models/Coupon');
const { 
  sendOrderPlacedEmail, 
  sendOrderNotificationToAdmin,
  sendOrderStatusUpdateEmail ,
  sendPaymentStatusUpdateEmail
} = require('../utils/orderEmailService') ;

// @desc    Create new order (or create pending order for online payment)
// @route   POST /api/orders
// @access  Public (with sessionId) or Private (with token)
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
//       orderStatus = 'pending',  // Default to pending
//       saveOrder = true  // Default to true for COD
//     } = req.body;

//     const userId = req.user?._id;
//     const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;

//     // Validate required fields
//     if (!items || items.length === 0) {
//       return res.status(400).json({ success: false, error: 'No items in order' });
//     }

//     if (!customerInfo || !customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
//       return res.status(400).json({ success: false, error: 'Customer information is incomplete' });
//     }

//     if (!paymentMethod) {
//       return res.status(400).json({ success: false, error: 'Payment method is required' });
//     }

//     // For online payment, we don't need to check stock or create order yet
//     // Just prepare the order data and return it
//     if (paymentMethod === 'online' && !saveOrder) {
//       // Just prepare the data without saving
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
//           email: customerInfo.email,
//           phone: customerInfo.phone,
//           whatsapp: customerInfo.whatsapp || '',
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
//         orderStatus: 'pending',  // Not placed yet
//         couponCode: couponCode || null,
//         couponDiscount: couponDiscount || 0,
//         freeShipping: freeShipping || false,
//         orderDate: new Date()
//       };
      
//       // Return the order data without saving
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

//     // Create order
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
//         email: customerInfo.email,
//         phone: customerInfo.phone,
//         whatsapp: customerInfo.whatsapp || '',
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

//     // Update product stock quantities
//     for (const item of items) {
//       await Product.findByIdAndUpdate(
//         item.productId,
//         { $inc: { stockQuantity: -item.quantity, purchaseCount: item.quantity } }
//       );
//     }

//     // Clear user's cart after successful order
//     if (userId) {
//       await Cart.findOneAndDelete({ userId });
//     } else if (sessionId) {
//       await Cart.findOneAndDelete({ sessionId });
//     }

//     // Record coupon usage if coupon was applied
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
//     try {
//       // Send order placed email to customer
//       await sendOrderPlacedEmail(order, order.customerInfo.email);
//       console.log('✅ Order placed email sent to customer for order:', order.orderNumber);
      
//       // Send notification email to admin
//       await sendOrderNotificationToAdmin(order, 'new');
//       console.log('✅ Admin notification email sent for order:', order.orderNumber);
//     } catch (emailError) {
//       console.error('❌ Email sending error:', emailError);
//       // Don't fail the order if email fails
//     }

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

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (with sessionId) or Private (with token)
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
      orderStatus = 'pending',
      saveOrder = true
    } = req.body;

    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;

    // Validate required fields - ADD division to validation
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

    // For online payment, we don't need to check stock or create order yet
    if (paymentMethod === 'online' && !saveOrder) {
      const orderData = {
        userId: userId || null,
        sessionId: userId ? null : sessionId,
        items: items.map(item => ({
          productId: item.productId,
          productName: item.productName,
          productSlug: item.productSlug,
          image: item.image,
          regularPrice: item.regularPrice,
          discountPrice: item.discountPrice,
          quantity: item.quantity,
          stockQuantity: item.stockQuantity
        })),
        customerInfo: {
          fullName: customerInfo.fullName,
          email: customerInfo.email || '',
          phone: customerInfo.phone,
          division: customerInfo.division, // <-- ADD THIS
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
        orderStatus: 'pending',
        couponCode: couponCode || null,
        couponDiscount: couponDiscount || 0,
        freeShipping: freeShipping || false,
        orderDate: new Date()
      };
      
      return res.status(200).json({
        success: true,
        data: orderData,
        message: 'Order data prepared'
      });
    }

    // For COD - Verify stock and create order
    for (const item of items) {
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

    // Create order - ADD division to customerInfo
    const order = new Order({
      userId: userId || null,
      sessionId: userId ? null : sessionId,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        image: item.image,
        regularPrice: item.regularPrice,
        discountPrice: item.discountPrice,
        quantity: item.quantity,
        stockQuantity: item.stockQuantity,
        unit: item.unit || 'pcs'
      })),
      customerInfo: {
        fullName: customerInfo.fullName,
        email: customerInfo.email || '',
        phone: customerInfo.phone,
        division: customerInfo.division, // <-- ADD THIS
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
      orderDate: new Date()
    });

    await order.save();

    // ========== UPDATE PRODUCT STOCK ==========
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: -item.quantity, purchaseCount: item.quantity } }
      );
    }

    // ========== CLEAR USER'S CART ==========
    if (userId) {
      await Cart.findOneAndDelete({ userId });
    } else if (sessionId) {
      await Cart.findOneAndDelete({ sessionId });
    }

    // ========== RECORD COUPON USAGE ==========
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

    // ========== SEND EMAIL NOTIFICATIONS ==========
    // Send customer email ONLY if email is provided
    if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
      try {
        await sendOrderPlacedEmail(order, order.customerInfo.email);
        console.log('✅ Order placed email sent to customer:', order.customerInfo.email, 'for order:', order.orderNumber);
      } catch (emailError) {
        console.error('❌ Customer email sending error:', emailError.message);
        // Don't fail the order if email fails
      }
    } else {
      console.log(`ℹ️ No email provided for order ${order.orderNumber}, skipping customer email notification`);
    }

    // ALWAYS send admin notification (admin email is configured in .env)
    try {
      await sendOrderNotificationToAdmin(order, 'new');
      console.log('✅ Admin notification email sent for order:', order.orderNumber);
    } catch (emailError) {
      console.error('❌ Admin email sending error:', emailError.message);
      // Don't fail the order if email fails
    }

    // ========== SEND SUCCESS RESPONSE ==========
    res.status(201).json({
      success: true,
      data: order,
      orderId: order._id,
      message: 'Order placed successfully'
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Public (with sessionId) or Private (with token)
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

// @desc    Get user's orders
// @route   GET /api/orders
// @access  Public (with sessionId) or Private (with token)
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
    
    // Add search functionality for customer orders
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

// @desc    Get single order by ID
// @route   GET /api/orders/:id
// @access  Public (with sessionId) or Private (with token)
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Check if user has permission to view this order
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


// @desc    Update order status (Admin/Moderator)
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
//       try {
//         await sendOrderStatusUpdateEmail(order, order.customerInfo.email, oldStatus, orderStatus);
//         console.log('✅ Status update email sent to customer for order:', order.orderNumber);
//       } catch (emailError) {
//         console.error('❌ Status update email error:', emailError);
//       }

//       try {
//         await sendOrderNotificationToAdmin(order, 'status_update');
//         console.log('✅ Status update notification sent to admin for order:', order.orderNumber);
//       } catch (emailError) {
//         console.error('❌ Admin notification error on status update:', emailError);
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



// @desc    Update order status (Admin/Moderator)
// @route   PUT /api/orders/:id/status
// @access  Private (Admin/Moderator)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, deliveryNote, cancellationReason } = req.body;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // ✅ Check if order is cancelled - no further actions allowed
    if (order.orderStatus === 'cancelled') {
      return res.status(400).json({ 
        success: false, 
        error: 'Order is cancelled. No further actions can be performed.' 
      });
    }
    
    // ✅ Check if order is delivered - no further actions allowed
    if (order.orderStatus === 'delivered') {
      return res.status(400).json({ 
        success: false, 
        error: 'Order is already delivered. Status cannot be changed.' 
      });
    }
    
    // ✅ Check if order has delivery created - status cannot be changed manually
    if (order.deliveryService && order.deliveryService.courierOrderId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Delivery already created for this order. Status cannot be changed manually.' 
      });
    }
    
    // ✅ Define allowed status transitions - COMPLETE FLOW
    const allowedTransitions = {
      'placed': ['confirmed', 'cancelled'],
      'confirmed': ['processing', 'cancelled'],
      'processing': ['shipped', 'cancelled'],
      'shipped': ['delivered', 'cancelled'],
      'delivered': [], // No further changes allowed
      'cancelled': []  // No further changes allowed
    };
    
    const currentStatus = order.orderStatus;
    const newStatus = orderStatus;
    
    // ✅ Validate status transition
    if (currentStatus !== newStatus) {
      const allowedNext = allowedTransitions[currentStatus] || [];
      if (!allowedNext.includes(newStatus)) {
        return res.status(400).json({ 
          success: false, 
          error: `Invalid status transition from "${currentStatus}" to "${newStatus}". Allowed: ${allowedNext.join(', ')}` 
        });
      }
    }
    
    // ✅ Store old status before updating
    const oldStatus = order.orderStatus;
    
    // ✅ Handle special cases for status changes
    
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
    
    // If order is being delivered
    if (orderStatus === 'delivered' && order.orderStatus !== 'delivered') {
      order.deliveredAt = new Date();
      
      // For COD orders, automatically mark payment as paid when delivered
      if (order.paymentMethod === 'cod' && order.paymentStatus !== 'paid') {
        order.paymentStatus = 'paid';
        console.log(`✅ COD order ${order.orderNumber} - Payment status auto-updated to Paid on delivery`);
      }
    }
    
    // ✅ Update order fields
    if (orderStatus) order.orderStatus = orderStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (deliveryNote !== undefined) order.deliveryNote = deliveryNote;
    
    // ✅ Add status history
    const userId = req.user?._id;
    const userRole = req.user?.role || 'admin';
    let statusNote = `Status updated from ${oldStatus} to ${orderStatus}`;
    
    if (orderStatus === 'cancelled' && cancellationReason) {
      statusNote = cancellationReason;
    }
    
    if (orderStatus === 'delivered') {
      statusNote = 'Order delivered successfully';
    }
    
    order.addStatusHistory(orderStatus, statusNote, userId, userRole);
    
    await order.save();
    
    // ========== SEND EMAIL NOTIFICATIONS ==========
    if (oldStatus !== orderStatus) {
      // Send to customer ONLY if email exists
      if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
        try {
          await sendOrderStatusUpdateEmail(order, order.customerInfo.email, oldStatus, orderStatus);
          console.log('✅ Status update email sent to customer for order:', order.orderNumber);
        } catch (emailError) {
          console.error('❌ Status update email error:', emailError.message);
        }
      } else {
        console.log(`ℹ️ No email provided for order ${order.orderNumber}, skipping customer status update email`);
      }

      // ALWAYS send admin notification
      try {
        await sendOrderNotificationToAdmin(order, 'status_update');
        console.log('✅ Status update notification sent to admin for order:', order.orderNumber);
      } catch (emailError) {
        console.error('❌ Admin notification error on status update:', emailError.message);
      }
    }
    
    // ✅ Prepare response message
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






// @desc    Update payment status (Admin/Moderator)
// @route   PUT /api/orders/:id/payment
// @access  Private (Admin/Moderator)
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
//       try {
//         await sendPaymentStatusUpdateEmail(order, order.customerInfo.email, oldStatus, paymentStatus);
//         console.log('✅ Payment status update email sent to customer for order:', order.orderNumber);
//       } catch (emailError) {
//         console.error('❌ Payment status update email error:', emailError);
//         // Don't fail the payment status update if email fails
//       }

//        // ========== ALSO SEND NOTIFICATION TO ADMIN ==========
//       try {
//         await sendOrderNotificationToAdmin(order, 'payment_update');
//         console.log('✅ Payment status update notification sent to admin for order:', order.orderNumber);
//       } catch (emailError) {
//         console.error('❌ Admin notification error on payment update:', emailError);
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


// @desc    Update payment status (Admin/Moderator)
// @route   PUT /api/orders/:id/payment
// @access  Private (Admin/Moderator)
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
    
    // Store old status before updating
    const oldStatus = order.paymentStatus;
    
    // Validate status transitions
    const currentStatus = order.paymentStatus;
    const orderStatus = order.orderStatus;
    
    // Pending → Paid or Failed
    if (currentStatus === 'pending') {
      if (!['paid', 'failed'].includes(paymentStatus)) {
        return res.status(400).json({ 
          success: false, 
          error: 'Pending status can only be changed to Paid or Failed' 
        });
      }
    }
    // Failed → Paid only
    else if (currentStatus === 'failed') {
      if (paymentStatus !== 'paid') {
        return res.status(400).json({ 
          success: false, 
          error: 'Failed status can only be changed to Paid' 
        });
      }
    }
    // Paid → Refunded only (allow for cancelled or delivered orders, or manual refund)
    else if (currentStatus === 'paid') {
      if (paymentStatus !== 'refunded') {
        return res.status(400).json({ 
          success: false, 
          error: 'Paid status can only be changed to Refunded' 
        });
      }
      // Optional: Add warning but still allow
      if (orderStatus !== 'cancelled' && orderStatus !== 'delivered') {
        console.log(`Warning: Changing payment to refunded for order ${order.orderNumber} with status ${orderStatus}`);
      }
    }
    // Refunded → No changes allowed
    else if (currentStatus === 'refunded') {
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
    
    // ========== SEND PAYMENT STATUS UPDATE EMAIL TO CUSTOMER ==========
    if (oldStatus !== paymentStatus) {
      // Send to customer ONLY if email exists
      if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
        try {
          await sendPaymentStatusUpdateEmail(order, order.customerInfo.email, oldStatus, paymentStatus);
          console.log('✅ Payment status update email sent to customer for order:', order.orderNumber);
        } catch (emailError) {
          console.error('❌ Payment status update email error:', emailError.message);
        }
      } else {
        console.log(`ℹ️ No email provided for order ${order.orderNumber}, skipping customer payment update email`);
      }

      // ALWAYS send admin notification
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

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all


// @desc    Cancel order (User/Admin/Moderator)
// @route   PUT /api/orders/:id/cancel
// @access  Public (with sessionId) or Private (with token)
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
    
    // Check permission
    const hasPermission = (userId && order.userId && order.userId.toString() === userId.toString()) ||
                         (sessionId && order.sessionId === sessionId) ||
                         ['admin', 'moderator'].includes(userRole);
    
    if (!hasPermission) {
      return res.status(403).json({ success: false, error: 'Unauthorized to cancel this order' });
    }
    
    // Different rules for customers vs admin/moderator
    const isAdminOrModerator = ['admin', 'moderator'].includes(userRole);
    
    if (!isAdminOrModerator) {
      // CUSTOMER RULES: Only can cancel when status is 'placed'
      if (order.orderStatus !== 'placed') {
        return res.status(400).json({ 
          success: false, 
          error: `Order cannot be cancelled. Current status: ${order.orderStatus}. Only 'Placed' orders can be cancelled by customer.` 
        });
      }
    } else {
      // ADMIN/MODERATOR RULES: Can cancel when status is placed, confirmed, processing, shipped
      const cancelableStatuses = ['placed', 'confirmed', 'processing', 'shipped'];
      
      if (!cancelableStatuses.includes(order.orderStatus)) {
        return res.status(400).json({ 
          success: false, 
          error: `Order cannot be cancelled. Current status: ${order.orderStatus}. Only 'Placed', 'Confirmed', 'Processing', or 'Shipped' orders can be cancelled.` 
        });
      }
    }
    
    const oldStatus = order.orderStatus;
    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = cancellationReason || (isAdminOrModerator ? 'Cancelled by admin' : 'Cancelled by customer');
    
    // ✅ Add status history
    order.addStatusHistory(
      'cancelled', 
      cancellationReason || 'Order cancelled',
      userId,
      isAdminOrModerator ? userRole : 'user'
    );
    
    // Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: item.quantity } }
      );
    }
    
    await order.save();
    
    // ========== SEND CANCELLATION EMAILS ==========
    // Send to customer ONLY if email exists
    if (order.customerInfo.email && order.customerInfo.email.trim() !== '') {
      try {
        // Send status update email with cancellation
        await sendOrderStatusUpdateEmail(order, order.customerInfo.email, oldStatus, 'cancelled');
        console.log('✅ Cancellation email sent to customer for order:', order.orderNumber);
      } catch (emailError) {
        console.error('❌ Cancellation email error:', emailError.message);
      }
    } else {
      console.log(`ℹ️ No email provided for order ${order.orderNumber}, skipping customer cancellation email`);
    }

    // ALWAYS send admin notification
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

// @access  Private (Admin only)
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
    
//     // Search by order number or customer name/email
//     if (search) {
//       const searchRegex = new RegExp(search, 'i');
//       query.$or = [
//         { orderNumber: searchRegex },  
//         { 'customerInfo.fullName': searchRegex },
//         { 'customerInfo.email': searchRegex },
//         { 'customerInfo.phone': searchRegex }
//       ];
//     }
    
//     // Date range filter
//     if (startDate || endDate) {
//       query.createdAt = {};
//       if (startDate) query.createdAt.$gte = new Date(startDate);
//       if (endDate) query.createdAt.$lte = new Date(endDate);
//     }
    
//     const skip = (parseInt(page) - 1) * parseInt(limit);
    
//     // Sort options - Fix the sort mapping
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

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private (Admin only)
// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin/all
// @access  Private (Admin only)
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
    
    // Search by order number or customer name/email/phone/division
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
    
    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
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
      case '-createdAt':
        sortOption = { createdAt: -1 };
        break;
      case '-total':
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
    console.error('Get all orders error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Get order statistics (Admin only)
// @route   GET /api/orders/admin/stats
// @access  Private (Admin only)
const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    // Get all status counts
    const [
      totalOrders,
      pendingPayment,
      processingOrders,
      completedOrders,
      cancelledOrders,
      todayOrders,
      monthOrders,
      totalRevenue,
      monthRevenue,
      placedOrders,
      confirmedOrders,
      shippedOrders,
      deliveredOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ paymentStatus: 'pending' }),
      Order.countDocuments({ orderStatus: { $in: ['confirmed', 'processing', 'shipped'] } }),
      Order.countDocuments({ orderStatus: 'delivered' }),
      Order.countDocuments({ orderStatus: 'cancelled' }),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ createdAt: { $gte: thisMonth } }),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: thisMonth } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.countDocuments({ orderStatus: 'placed' }),
      Order.countDocuments({ orderStatus: 'confirmed' }),
      Order.countDocuments({ orderStatus: 'shipped' }),
      Order.countDocuments({ orderStatus: 'delivered' })
    ]);
    
    res.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders: pendingPayment,
        processingOrders,
        completedOrders,
        cancelledOrders,
        todayOrders,
        monthOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthRevenue: monthRevenue[0]?.total || 0,
        placedOrders,
        confirmedOrders,
        shippedOrders,
        deliveredOrders
      }
    });
    
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// @desc    Prepare order data without saving (for online payment)
// @route   POST /api/orders/prepare
// @access  Public (with sessionId) or Private (with token)
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

//     // Validate required fields
//     if (!items || items.length === 0) {
//       return res.status(400).json({ success: false, error: 'No items in order' });
//     }

//     if (!customerInfo || !customerInfo.fullName || !customerInfo.email || !customerInfo.phone || !customerInfo.address) {
//       return res.status(400).json({ success: false, error: 'Customer information is incomplete' });
//     }

//     // Prepare order data without saving
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
//          unit: item.unit || 'pcs'
//       })),
//       customerInfo: {
//         fullName: customerInfo.fullName,
//         email: customerInfo.email,
//         phone: customerInfo.phone,
//         whatsapp: customerInfo.whatsapp || '',
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

// @desc    Prepare order data without saving (for online payment)
// @route   POST /api/orders/prepare
// @access  Public (with sessionId) or Private (with token)
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
      freeShipping
    } = req.body;

    const userId = req.user?._id;
    const sessionId = req.headers['x-session-id'] || req.cookies?.sessionId;

    // Validate required fields - ADD division
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' });
    }

    if (!customerInfo || !customerInfo.fullName || !customerInfo.phone || !customerInfo.address || !customerInfo.division) {
      return res.status(400).json({ 
        success: false, 
        error: 'Customer information is incomplete. Full name, phone, address, and division are required.' 
      });
    }

    // Prepare order data without saving - ADD division
    const orderData = {
      userId: userId || null,
      sessionId: userId ? null : sessionId,
      items: items.map(item => ({
        productId: item.productId,
        productName: item.productName,
        productSlug: item.productSlug,
        image: item.image,
        regularPrice: item.regularPrice,
        discountPrice: item.discountPrice,
        quantity: item.quantity,
        stockQuantity: item.stockQuantity,
        unit: item.unit || 'pcs'
      })),
      customerInfo: {
        fullName: customerInfo.fullName,
        email: customerInfo.email || '',
        phone: customerInfo.phone,
        division: customerInfo.division, // <-- ADD THIS
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
      orderStatus: 'pending',
      couponCode: couponCode || null,
      couponDiscount: couponDiscount || 0,
      freeShipping: freeShipping || false,
      orderDate: new Date()
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

// @desc    Delete order (Admin only)
// @route   DELETE /api/orders/:id
// @access  Private (Admin only)
const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Optional: Restore stock if order is not cancelled/delivered
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

// @desc    Update order (Admin only)
// @route   PUT /api/orders/:id
// @access  Private (Admin/Moderator)
// const updateOrder = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { customerInfo, trackingNumber, deliveryNote } = req.body;
    
//     const order = await Order.findById(id);
    
//     if (!order) {
//       return res.status(404).json({ success: false, error: 'Order not found' });
//     }
    
//     // Update customer info if provided
//     if (customerInfo) {
//       order.customerInfo = {
//         ...order.customerInfo,
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

// @desc    Update order (Admin/Moderator)
// @route   PUT /api/orders/:id
// @access  Private (Admin/Moderator)
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerInfo, trackingNumber, deliveryNote } = req.body;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Update customer info if provided - this will include division
    if (customerInfo) {
      order.customerInfo = {
        ...order.customerInfo.toObject ? order.customerInfo.toObject() : order.customerInfo,
        ...customerInfo
      };
    }
    
    // Update tracking info
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

// Add to your orderController.js or create a new file

// @desc    Create delivery order with courier service
// @route   POST /api/orders/:id/delivery
// @access  Private (Admin/Moderator)
// D:\Smart-Gadget\Gadget-backend\src\controllers\orderController.js

// @desc    Create delivery order with courier service
// @route   POST /api/orders/:id/delivery
// @access  Private (Admin/Moderator)
const createDeliveryOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { courierSlug, deliveryNote, weight } = req.body;
    
    console.log('=== CREATE DELIVERY ORDER ===');
    console.log('Order ID:', id);
    console.log('Courier Slug:', courierSlug);
    console.log('Weight:', weight);
    console.log('Delivery Note:', deliveryNote);
    
    if (!courierSlug) {
      return res.status(400).json({ 
        success: false, 
        error: 'Courier slug is required' 
      });
    }
    
    // Get the order
    const Order = require('../models/Order');
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    console.log('Order found:', {
      orderNumber: order.orderNumber,
      status: order.orderStatus,
      hasDelivery: !!order.deliveryService?.courierOrderId
    });
    
    // Check if order already has a delivery
    if (order.deliveryService && order.deliveryService.courierOrderId) {
      return res.status(400).json({ 
        success: false, 
        error: 'Order already has a delivery service assigned' 
      });
    }
    
    // Get courier integration
    const { getCourierIntegration } = require('../lib/courierCredentials');
    const integration = await getCourierIntegration(courierSlug);
    
    console.log('Integration found:', {
      id: integration?.id,
      slug: integration?.slug,
      apiEnabled: integration?.apiEnabled,
      configured: integration?.configured,
      hasCreds: !!integration?.creds
    });
    
    if (!integration || !integration.creds || !integration.apiEnabled) {
      return res.status(400).json({ 
        success: false, 
        error: 'Courier is not configured or disabled' 
      });
    }
    
    // Prepare order data for courier
    const orderData = {
      ...order.toObject(),
      orderNumber: order.orderNumber || `ORD-${order._id.toString().slice(-8)}`,
      // Add weight if provided, otherwise calculate
      items: order.items.map(item => ({
        ...item,
        weight: weight ? weight / order.items.length : 0.5
      }))
    };
    
    console.log('Prepared order data for courier:', {
      orderNumber: orderData.orderNumber,
      itemsCount: orderData.items.length,
      total: orderData.total,
      customer: orderData.customerInfo.fullName
    });
    
    // Create delivery order
    const { createCourierOrder } = require('../lib/couriers/courierFactory');
    const result = await createCourierOrder(
      courierSlug,
      integration.creds,
      integration.storeConfig,
      orderData
    );
    
    console.log('Courier result:', {
      success: result.success,
      courierOrderId: result.courierOrderId,
      trackingNumber: result.trackingNumber,
      message: result.message
    });
    
    if (!result.success) {
      return res.status(400).json({ 
        success: false, 
        error: result.message || 'Failed to create delivery order' 
      });
    }
    
    // Update order with delivery info
    order.deliveryService = {
      courierId: integration.id,
      courierName: courierSlug.charAt(0).toUpperCase() + courierSlug.slice(1),
      courierSlug: courierSlug,
      trackingNumber: result.trackingNumber,
      trackingUrl: result.trackingUrl,
      courierOrderId: result.courierOrderId,
      courierResponse: result.fullResponse,
      deliveryStatus: 'processing',
      labelUrl: result.labelUrl || '',
      invoiceUrl: result.invoiceUrl || '',
      deliveryNote: deliveryNote || '',
      weight: weight || 0.5,
      deliveryStatusHistory: [
        {
          status: 'processing',
          message: `Order created with ${courierSlug} courier service`,
          timestamp: new Date()
        }
      ]
    };
    
    // Also update the legacy tracking field
    order.trackingNumber = result.trackingNumber;
    
    await order.save();
    
    console.log('✅ Order updated with delivery info');
    
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

// @desc    Get delivery tracking status
// @route   GET /api/orders/:id/tracking
// @access  Private (Admin/Moderator)
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
    
    const { getCourierIntegration } = require('../lib/courierCredentials');
    const integration = await getCourierIntegration(courierSlug);
    
    if (!integration || !integration.creds) {
      return res.status(400).json({ 
        success: false, 
        error: 'Courier is not configured' 
      });
    }
    
    const { getCourierTracking } = require('../lib/couriers/courierFactory');
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
    
    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get tracking error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// controllers/orderController.js - Add tracking by phone

// controllers/orderController.js - Update trackOrderByPhone to return all orders

// @desc    Get all orders by phone number (for tracking)
// @route   GET /api/orders/track/:phone
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
//     .select('orderNumber orderStatus items subtotal shippingCost discount total customerInfo createdAt deliveredAt cancelledAt statusHistory trackingNumber paymentMethod paymentStatus');
    
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


// @desc    Get all orders by phone number (for tracking)
// @route   GET /api/orders/track/:phone
// @access  Public
const trackOrderByPhone = async (req, res) => {
  try {
    const { phone } = req.params;
    
    if (!phone) {
      return res.status(400).json({ 
        success: false, 
        error: 'Phone number is required' 
      });
    }
    
    // Find ALL orders for this phone number, sorted by most recent
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
    
    // Format the response
    const statusLabels = {
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
    
    // Process each order
    const formattedOrders = orders.map(order => {
      // Get status timeline
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
      
      // If no status history, create one from the current status
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
      
      // Sort timeline by timestamp
      timeline.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
      
      // Get order items summary
      const itemsSummary = order.items.map(item => ({
        name: item.productName,
        quantity: item.quantity,
        price: item.discountPrice || item.regularPrice,
        image: item.image
      }));
      
      return {
        _id: order._id,  // <-- ADD THIS - This is the key fix!
        id: order._id,   // <-- ADD THIS for compatibility
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

// @desc    Get order by ID for public invoice download
// @route   GET /api/orders/public/:id
// @access  Public (no authentication required)
const getPublicOrder = async (req, res) => {
  try {
    const { id } = req.params;
    
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    // Only return if order is not cancelled (optional)
    // if (order.orderStatus === 'cancelled') {
    //   return res.status(403).json({ success: false, error: 'This order has been cancelled' });
    // }
    
    res.json({ success: true, data: order });
    
  } catch (error) {
    console.error('Get public order error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Add this to exports
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
  getPublicOrder  
};