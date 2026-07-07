const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  updateUserRole,
  getRoleStats,
  getDashboardAccess,
  getAvailablePermissions
} = require('../controllers/roleController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All role routes require authentication
// Super Admin only routes
router.get('/users', protect, authorize('super_admin'), getAllUsers);
router.put('/update/:userId', protect, authorize('super_admin'), updateUserRole);
router.get('/stats', protect, authorize('super_admin'), getRoleStats);
router.get('/permissions', protect, authorize('super_admin'), getAvailablePermissions);

// Any authenticated user can get their own dashboard access
router.get('/dashboard-access', protect, getDashboardAccess);

module.exports = router;