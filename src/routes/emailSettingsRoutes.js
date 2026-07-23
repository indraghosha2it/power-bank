// routes/emailSettingsRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isAdmin } = require('../middleware/authMiddleware');
const {
  getEmailSettings,
  updateEmailSettings,
  testEmailSettings,
  getEmailStatus
} = require('../controllers/emailSettingsController');

// All routes require authentication and admin access
router.use(protect);
router.use(isAdmin);

// Email settings routes with type parameter
router.get('/:type', getEmailSettings);
router.put('/:type', updateEmailSettings);
router.post('/:type/test', testEmailSettings);
router.get('/:type/status', getEmailStatus);

module.exports = router;