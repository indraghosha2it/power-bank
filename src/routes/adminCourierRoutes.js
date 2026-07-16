const express = require('express');
const router = express.Router();
const { protect, isModeratorOrAdmin } = require('../middleware/authMiddleware');
const {
  getCouriers,
  getCourier,
  updateCourierIntegration,
  testCourierConnectionHandler,
  createDeliveryOrder,
  getOrderTrackingHandler,
  cancelDeliveryOrder,
  
} = require('../controllers/adminCourierController');

const {
  getCourierScoresForPhone,
  getCourierScoresForOrder
} = require('../controllers/courierScoreController');

// ========== GET ALL COURIERS ==========
router.get('/couriers', protect, isModeratorOrAdmin, getCouriers);

// ========== GET SINGLE COURIER ==========
router.get('/couriers/:id', protect, isModeratorOrAdmin, getCourier);

// ========== UPDATE COURIER INTEGRATION ==========
router.put('/couriers/:id/integration', protect, isModeratorOrAdmin, updateCourierIntegration);

// ========== TEST COURIER CONNECTION ==========
router.post('/couriers/:id/test-connection', protect, isModeratorOrAdmin, testCourierConnectionHandler);

// ========== CREATE DELIVERY ORDER ==========
router.post('/couriers/:slug/create-order', protect, isModeratorOrAdmin, createDeliveryOrder);

// ========== GET ORDER TRACKING ==========
router.get('/couriers/:slug/track/:trackingNumber', protect, isModeratorOrAdmin, getOrderTrackingHandler);
router.get('/courier-scores/phone/:phone', protect, isModeratorOrAdmin, getCourierScoresForPhone);
router.get('/courier-scores/order/:orderId', protect, isModeratorOrAdmin, getCourierScoresForOrder);

// ========== CANCEL DELIVERY ORDER ==========
router.post('/couriers/:slug/cancel-order/:courierOrderId', protect, isModeratorOrAdmin, cancelDeliveryOrder);

module.exports = router;