const express = require('express');
const router = express.Router();
const { protect, isModeratorOrAdmin } = require('../middleware/authMiddleware');
const {
  getPublicNavbar,
  getAdminNavbar,
  updateNavbar,
  resetNavbar
} = require('../controllers/navbarController');

// ============================================================
// PUBLIC ROUTES
// ============================================================

// @route   GET /api/navbar
// @desc    Get public navbar data
// @access  Public
router.get('/', getPublicNavbar);

// ============================================================
// ADMIN ROUTES (Protected)
// ============================================================

// All routes below require authentication and admin/moderator role
router.use(protect, isModeratorOrAdmin);

// @route   GET /api/admin/navbar
// @desc    Get navbar data for admin
// @access  Private (Admin/Moderator)
router.get('/', getAdminNavbar);

// @route   PUT /api/admin/navbar
// @desc    Update navbar
// @access  Private (Admin/Moderator)
router.put('/', updateNavbar);

// @route   POST /api/admin/navbar/reset
// @desc    Reset navbar to default
// @access  Private (Admin)
router.post('/reset', resetNavbar);

module.exports = router;