const express = require('express');
const router = express.Router();
const { protect, isModeratorOrAdmin } = require('../middleware/authMiddleware');
const {
  getPublicAbout,
  getAdminAbout,
  updateAbout,
  resetAbout
} = require('../controllers/aboutController');

// ============================================================
// PUBLIC ROUTES
// ============================================================

// @route   GET /api/about/page
// @desc    Get public about page data
// @access  Public
router.get('/page', getPublicAbout);

// ============================================================
// ADMIN ROUTES
// ============================================================

router.use(protect, isModeratorOrAdmin);

// @route   GET /api/admin/about
// @desc    Get about data for admin
// @access  Private (Admin/Moderator)
router.get('/', getAdminAbout);

// @route   PUT /api/admin/about
// @desc    Update about page
// @access  Private (Admin/Moderator)
router.put('/', updateAbout);

// @route   POST /api/admin/about/reset
// @desc    Reset about page to default
// @access  Private (Admin)
router.post('/reset', resetAbout);

module.exports = router;