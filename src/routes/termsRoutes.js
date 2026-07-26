// const express = require('express');
// const router = express.Router();
// const { protect, isModeratorOrAdmin } = require('../middleware/authMiddleware');
// const {
//   getPublicTerms,
//   getAdminTerms,
//   updateTerms,
//   resetTerms,
//   getRawData,
//   getAdminTermsAll
// } = require('../controllers/termsController');

// // ============================================================
// // PUBLIC ROUTES
// // ============================================================

// // @route   GET /api/terms
// // @desc    Get public terms data (only active sections)
// // @access  Public
// router.get('/', getPublicTerms);

// // ============================================================
// // ADMIN ROUTES
// // ============================================================

// router.use(protect, isModeratorOrAdmin);

// // @route   GET /api/admin/terms
// // @desc    Get terms data for admin (ALL sections)
// // @access  Private (Admin/Moderator)
// router.get('/', getAdminTerms);

// // @route   GET /api/admin/terms/all
// // @desc    Get terms data for admin - FORCED ALL SECTIONS
// // @access  Private (Admin/Moderator)
// router.get('/all', getAdminTermsAll);

// // @route   GET /api/admin/terms/raw-data
// // @desc    Get raw terms data from database
// // @access  Private (Admin)
// router.get('/raw-data', getRawData);

// // @route   PUT /api/admin/terms
// // @desc    Update terms
// // @access  Private (Admin/Moderator)
// router.put('/', updateTerms);

// // @route   POST /api/admin/terms/reset
// // @desc    Reset terms to default
// // @access  Private (Admin)
// router.post('/reset', resetTerms);

// module.exports = router;


// backend/src/routes/termsRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isModeratorOrAdmin } = require('../middleware/authMiddleware');
const {
  getPublicTerms,
  getAdminTerms,
  updateTerms,
  resetTerms,
  getRawData,
  getAdminTermsAll
} = require('../controllers/termsController');

// ============================================================
// PUBLIC ROUTES
// ============================================================

// @route   GET /api/terms
// @desc    Get public terms data (only active sections)
// @access  Public
router.get('/', getPublicTerms);

// ============================================================
// ADMIN ROUTES
// ============================================================

// ✅ IMPORTANT: /all MUST come before root / route
router.get('/admin/all', protect, isModeratorOrAdmin, getAdminTermsAll);
router.get('/admin', protect, isModeratorOrAdmin, getAdminTerms);
router.get('/admin/raw-data', protect, isModeratorOrAdmin, getRawData);
router.put('/admin', protect, isModeratorOrAdmin, updateTerms);
router.post('/admin/reset', protect, isModeratorOrAdmin, resetTerms);

module.exports = router;