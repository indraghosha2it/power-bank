// const express = require('express');
// const router = express.Router();
// const { protect, optionalProtect, isAdmin, isModeratorOrAdmin } = require('../middleware/authMiddleware');
// const {
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
// } = require('../controllers/orderController');

// // ============= PUBLIC ROUTES (with optional auth) =============
// router.post('/', optionalProtect, createOrder);
// router.get('/', optionalProtect, getUserOrders);
// router.get('/:id', optionalProtect, getOrderById);
// router.put('/:id/cancel', optionalProtect, cancelOrder);
// router.post('/prepare', optionalProtect, prepareOrder);

// // ============= PROTECTED ROUTES (Admin/Moderator only) =============
// router.get('/admin/all', protect, isModeratorOrAdmin, getAllOrders);
// router.get('/admin/stats', protect, isAdmin, getOrderStats);
// router.put('/:id/status', protect, isModeratorOrAdmin, updateOrderStatus);
// router.put('/:id/payment', protect, isModeratorOrAdmin, updatePaymentStatus);
// router.put('/:id', protect, isModeratorOrAdmin, updateOrder);
// // Delivery order routes
// router.post('/:id/delivery', protect, isModeratorOrAdmin, createDeliveryOrder);
// router.get('/:id/tracking', protect, isModeratorOrAdmin, getOrderTracking);
// router.get('/track/:phone', trackOrderByPhone);
// router.get('/public/:id', getPublicOrder);
// // Add this with the other protected routes
// // router.delete('/:id', protect, isModeratorOrAdmin, deleteOrder);
// router.delete('/:id', protect, isAdmin, deleteOrder);

// module.exports = router;

// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const { protect, optionalProtect, isAdmin, isModeratorOrAdmin } = require('../middleware/authMiddleware');
const ipMiddleware = require('../middleware/ipMiddleware');
const {
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
} = require('../controllers/orderController');

// Apply IP middleware to all order routes
router.use(ipMiddleware);

// ============= PUBLIC ROUTES =============
router.post('/', optionalProtect, createOrder);
router.get('/', optionalProtect, getUserOrders);
router.get('/:id', optionalProtect, getOrderById);
router.put('/:id/cancel', optionalProtect, cancelOrder);
router.post('/prepare', optionalProtect, prepareOrder);

// ============= PROTECTED ROUTES =============
router.get('/admin/all', protect, isModeratorOrAdmin, getAllOrders);
router.get('/admin/stats', protect, isAdmin, getOrderStats);
router.put('/:id/status', protect, isModeratorOrAdmin, updateOrderStatus);
router.put('/:id/payment', protect, isModeratorOrAdmin, updatePaymentStatus);
router.put('/:id', protect, isModeratorOrAdmin, updateOrder);

// Delivery routes
router.post('/:id/delivery', protect, isModeratorOrAdmin, createDeliveryOrder);
router.get('/:id/tracking', protect, isModeratorOrAdmin, getOrderTracking);

// Public tracking
router.get('/track/:phone', trackOrderByPhone);
router.get('/public/:id', getPublicOrder);

// Delete (Admin only)
router.delete('/:id', protect, isAdmin, deleteOrder);

module.exports = router;