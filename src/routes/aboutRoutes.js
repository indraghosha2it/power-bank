// const express = require('express');
// const router = express.Router();
// const { protect, isModeratorOrAdmin } = require('../middleware/authMiddleware');
// const {
//   getPublicAbout,
//   getAdminAbout,
//   updateAbout,
//   resetAbout
// } = require('../controllers/aboutController');

// // ============================================================
// // PUBLIC ROUTES
// // ============================================================

// // @route   GET /api/about/page
// // @desc    Get public about page data
// // @access  Public
// router.get('/page', getPublicAbout);

// // ============================================================
// // ADMIN ROUTES
// // ============================================================

// router.use(protect, isModeratorOrAdmin);

// // @route   GET /api/admin/about
// // @desc    Get about data for admin
// // @access  Private (Admin/Moderator)
// router.get('/', getAdminAbout);

// // @route   PUT /api/admin/about
// // @desc    Update about page
// // @access  Private (Admin/Moderator)
// router.put('/', updateAbout);

// // @route   POST /api/admin/about/reset
// // @desc    Reset about page to default
// // @access  Private (Admin)
// router.post('/reset', resetAbout);

// module.exports = router;



// backend/src/routes/aboutRoutes.js
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
// ADMIN ROUTES (Protected)
// ============================================================

// ✅ IMPORTANT: Define all admin routes with explicit paths

// @route   GET /api/about/admin
// @desc    Get about data for admin
// @access  Private (Admin/Moderator)
router.get('/admin', protect, isModeratorOrAdmin, getAdminAbout);

// @route   PUT /api/about/admin
// @desc    Update about page
// @access  Private (Admin/Moderator)
router.put('/admin', protect, isModeratorOrAdmin, updateAbout);

// @route   POST /api/about/admin/reset
// @desc    Reset about page to default
// @access  Private (Admin/Moderator) - ✅ Changed to allow moderators
router.post('/admin/reset', protect, isModeratorOrAdmin, resetAbout);

module.exports = router;