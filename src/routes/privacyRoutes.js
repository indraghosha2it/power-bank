const express = require('express');
const router = express.Router();
const { protect, isModeratorOrAdmin } = require('../middleware/authMiddleware');
const {
  getPublicPrivacy,
  getAdminPrivacy,
  updatePrivacy,
  resetPrivacy,
  getRawData,
  getAdminPrivacyAll
} = require('../controllers/privacyController');

// ============================================================
// PUBLIC ROUTES
// ============================================================

// @route   GET /api/privacy
// @desc    Get public privacy policy data (only active sections)
// @access  Public
router.get('/', getPublicPrivacy);

// ============================================================
// ADMIN ROUTES
// ============================================================

router.use(protect, isModeratorOrAdmin);

// @route   GET /api/admin/privacy
// @desc    Get privacy policy data for admin (ALL sections)
// @access  Private (Admin/Moderator)
router.get('/', getAdminPrivacy);

// @route   GET /api/admin/privacy/all
// @desc    Get privacy policy data for admin - FORCED ALL SECTIONS
// @access  Private (Admin/Moderator)
router.get('/all', getAdminPrivacyAll);

// @route   GET /api/admin/privacy/raw-data
// @desc    Get raw privacy data from database
// @access  Private (Admin)
router.get('/raw-data', getRawData);

// @route   PUT /api/admin/privacy
// @desc    Update privacy policy
// @access  Private (Admin/Moderator)
router.put('/', updatePrivacy);

// @route   POST /api/admin/privacy/reset
// @desc    Reset privacy policy to default
// @access  Private (Admin)
router.post('/reset', resetPrivacy);

module.exports = router;