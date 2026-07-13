

// // routes/orderRoutes.js

// const express = require('express');
// const router = express.Router();
// const { protect, optionalProtect, isAdmin, isModeratorOrAdmin } = require('../middleware/authMiddleware');
// const ipMiddleware = require('../middleware/ipMiddleware');
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
//   getPublicOrder,
//    getAgentOrders,           
//   updateAgentOrderStatus 
// } = require('../controllers/orderController');

// // Apply IP middleware to all order routes
// router.use(ipMiddleware);

// // ============= PUBLIC ROUTES =============
// router.post('/', optionalProtect, createOrder);
// router.get('/', optionalProtect, getUserOrders);
// router.get('/:id', optionalProtect, getOrderById);
// router.put('/:id/cancel', optionalProtect, cancelOrder);
// router.post('/prepare', optionalProtect, prepareOrder);

// // ============= PROTECTED ROUTES =============
// router.get('/admin/all', protect, isModeratorOrAdmin, getAllOrders);
// router.get('/admin/stats', protect, isAdmin, getOrderStats);
// router.put('/:id/status', protect, isModeratorOrAdmin, updateOrderStatus);
// router.put('/:id/payment', protect, isModeratorOrAdmin, updatePaymentStatus);
// router.put('/:id', protect, isModeratorOrAdmin, updateOrder);

// // Delivery routes
// router.post('/:id/delivery', protect, isModeratorOrAdmin, createDeliveryOrder);
// router.get('/:id/tracking', protect, isModeratorOrAdmin, getOrderTracking);




// // Public tracking
// router.get('/track/:phone', trackOrderByPhone);
// router.get('/public/:id', getPublicOrder);

// // Delete (Admin only)
// router.delete('/:id', protect, isAdmin, deleteOrder);

// module.exports = router;


// routes/orderRoutes.js

const express = require('express');
const router = express.Router();
const { protect, optionalProtect, isAdmin, isModeratorOrAdmin, isAgent } = require('../middleware/authMiddleware'); // ✅ ADD isAgent here
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
  getPublicOrder,
  getAgentOrders,           // ✅ ADD THIS
  updateAgentOrderStatus ,
  getAgentDashboard
} = require('../controllers/orderController');

// Apply IP middleware to all order routes
router.use(ipMiddleware);

// ============= PUBLIC ROUTES =============
router.post('/', optionalProtect, createOrder);
router.get('/', optionalProtect, getUserOrders);
router.get('/:id', optionalProtect, getOrderById);
router.put('/:id/cancel', optionalProtect, cancelOrder);
router.post('/prepare', optionalProtect, prepareOrder);

// ============= ADMIN ROUTES =============
router.get('/admin/all', protect, isModeratorOrAdmin, getAllOrders);
router.get('/admin/stats', protect, isModeratorOrAdmin, getOrderStats);
router.put('/:id/status', protect, isModeratorOrAdmin, updateOrderStatus);
router.put('/:id/payment', protect, isModeratorOrAdmin, updatePaymentStatus);
router.put('/:id', protect, isModeratorOrAdmin, updateOrder);

// Delivery routes
router.post('/:id/delivery', protect, isModeratorOrAdmin, createDeliveryOrder);
router.get('/:id/tracking', protect, isModeratorOrAdmin, getOrderTracking);

// ============= AGENT ROUTES (Call Center Agent) =============
router.get('/agent/orders', protect, isAgent, getAgentOrders);
router.put('/agent/:id/status', protect, isAgent, updateAgentOrderStatus);
router.get('/agent/dashboard', protect, isAgent, getAgentDashboard);

// Public tracking
router.get('/track/:phone', trackOrderByPhone);
router.get('/public/:id', getPublicOrder);

// Delete (Admin only)
router.delete('/:id', protect, isAdmin, deleteOrder);

module.exports = router;