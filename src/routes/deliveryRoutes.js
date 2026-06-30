// const express = require('express');
// const router = express.Router();
// const { protect, isAdmin } = require('../middleware/authMiddleware');
// const {
//   getDeliverySettings,
//   updateDeliverySettings
// } = require('../controllers/deliveryController');

// // Public route - get delivery settings
// router.get('/settings', getDeliverySettings);

// // Admin only route - update delivery settings
// router.put('/settings', protect, isAdmin, updateDeliverySettings);

// module.exports = router;


const express = require('express');
const router = express.Router();
const { protect, isModeratorOrAdmin } = require('../middleware/authMiddleware');
const {
  getDeliverySettings,
  updateDeliverySettings
} = require('../controllers/deliveryController');

// Public route - get delivery settings
router.get('/settings', getDeliverySettings);

// Updated: Allow both admin and moderator to update
router.put('/settings', protect, isModeratorOrAdmin, updateDeliverySettings);

module.exports = router;