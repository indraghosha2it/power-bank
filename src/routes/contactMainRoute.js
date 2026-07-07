const express = require('express');
const router = express.Router();
const { protect, isModeratorOrAdmin } = require('../middleware/authMiddleware');
const {
  getPublicContact,
  getAdminContact,
  updateContact,
  resetContact,
  getRawData
} = require('../controllers/contactController');

// ============================================================
// PUBLIC ROUTES
// ============================================================

// @route   GET /api/contact/page
// @desc    Get public contact page data
// @access  Public
router.get('/page', getPublicContact);

// ============================================================
// ADMIN ROUTES
// ============================================================

router.use(protect, isModeratorOrAdmin);

// @route   GET /api/admin/contact
// @desc    Get contact data for admin
// @access  Private (Admin/Moderator)
router.get('/', getAdminContact);

// @route   GET /api/admin/contact/raw-data
// @desc    Get raw contact data from database
// @access  Private (Admin)
router.get('/raw-data', getRawData);

// @route   PUT /api/admin/contact
// @desc    Update contact page
// @access  Private (Admin/Moderator)
router.put('/', updateContact);

// @route   POST /api/admin/contact/reset
// @desc    Reset contact page to default
// @access  Private (Admin)
router.post('/reset', resetContact);

module.exports = router;