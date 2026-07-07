const Navbar = require('../models/Navbar');

// ============================================================
// 1. GET NAVBAR DATA
// ============================================================

// @desc    Get navbar data (public)
// @route   GET /api/navbar
// @access  Public
const getPublicNavbar = async (req, res) => {
  try {
    let navbar = await Navbar.findOne({ isActive: true });
    
    if (!navbar) {
      // Create default navbar if none exists
      navbar = await createDefaultNavbar();
    }

    // Filter items based on user role (if user is authenticated)
    const user = req.user;
    let filteredItems = navbar.items || [];
    
    if (user) {
      // Show all items for authenticated users
      filteredItems = navbar.items.filter(item => item.isActive !== false);
    } else {
      // For guests, show only items with requiredRole: 'all'
      filteredItems = navbar.items.filter(item => 
        item.isActive !== false && 
        (item.requiredRole === 'all' || !item.requiredRole)
      );
    }

    // Sort by order
    filteredItems = filteredItems.sort((a, b) => (a.order || 0) - (b.order || 0));

    res.json({
      success: true,
      data: {
        items: filteredItems,
        logo: navbar.logo || {
          text: 'HyperVolt',
          highlightText: 'Volt',
          icon: 'Zap',
          logoUrl: ''
        }
      }
    });
  } catch (error) {
    console.error('Get public navbar error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching navbar'
    });
  }
};

// @desc    Get navbar data (admin)
// @route   GET /api/admin/navbar
// @access  Private (Admin/Moderator)
const getAdminNavbar = async (req, res) => {
  try {
    let navbar = await Navbar.findOne();
    
    if (!navbar) {
      navbar = await createDefaultNavbar();
    }

    res.json({
      success: true,
      data: navbar
    });
  } catch (error) {
    console.error('Get admin navbar error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching navbar'
    });
  }
};

// ============================================================
// 2. UPDATE NAVBAR
// ============================================================

// @desc    Update navbar
// @route   PUT /api/admin/navbar
// @access  Private (Admin/Moderator)
const updateNavbar = async (req, res) => {
  try {
    let navbar = await Navbar.findOne();
    
    if (!navbar) {
      navbar = await createDefaultNavbar();
    }

    const { items, logo, isActive } = req.body;

    if (items) {
      navbar.items = items;
    }

    if (logo) {
      navbar.logo = {
        ...navbar.logo,
        ...logo
      };
    }

    if (isActive !== undefined) {
      navbar.isActive = isActive;
    }

    navbar.updatedBy = req.user.id;
    await navbar.save();

    res.json({
      success: true,
      data: navbar,
      message: 'Navbar updated successfully'
    });
  } catch (error) {
    console.error('Update navbar error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while updating navbar'
    });
  }
};

// ============================================================
// 3. RESET NAVBAR
// ============================================================

// @desc    Reset navbar to default
// @route   POST /api/admin/navbar/reset
// @access  Private (Admin)
const resetNavbar = async (req, res) => {
  try {
    await Navbar.deleteOne({});
    const navbar = await createDefaultNavbar();

    res.json({
      success: true,
      data: navbar,
      message: 'Navbar reset to default successfully'
    });
  } catch (error) {
    console.error('Reset navbar error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while resetting navbar'
    });
  }
};

// ============================================================
// 4. HELPER FUNCTIONS
// ============================================================

// Helper: Generate unique ID
const generateId = () => `id_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

// Helper: Create default navbar
const createDefaultNavbar = async () => {
  const defaultNavbar = {
    items: [
      {
        id: generateId(),
        name: 'Home',
        href: '/',
        icon: 'Home',
        order: 0,
        isActive: true,
        requiredRole: 'all'
      },
      {
        id: generateId(),
        name: 'Products',
        href: '/products',
        icon: 'Zap',
        order: 1,
        isActive: true,
        requiredRole: 'all'
      },
      {
        id: generateId(),
        name: 'Track Order',
        href: '/track',
        icon: 'MapPin',
        order: 2,
        isActive: true,
        requiredRole: 'all'
      },
      {
        id: generateId(),
        name: 'About',
        href: '/about',
        icon: 'Info',
        order: 3,
        isActive: true,
        requiredRole: 'all'
      },
      {
        id: generateId(),
        name: 'Contact',
        href: '/contact',
        icon: 'Phone',
        order: 4,
        isActive: true,
        requiredRole: 'all'
      }
    ],
    logo: {
      text: 'HyperVolt',
      highlightText: 'Volt',
      icon: 'Zap',
      logoUrl: ''
    },
    isActive: true
  };

  return await Navbar.create(defaultNavbar);
};

// ============================================================
// 5. EXPORT CONTROLLERS
// ============================================================

module.exports = {
  getPublicNavbar,
  getAdminNavbar,
  updateNavbar,
  resetNavbar
};