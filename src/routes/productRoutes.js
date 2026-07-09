

// // backend/src/routes/productRoutes.js
// const express = require('express');
// const router = express.Router();
// const { protect, isModeratorOrAdmin, isAdmin } = require('../middleware/authMiddleware');
// const { generateUniqueSku, validateSku } = require('../controllers/skuController');
// const {
//   createProduct,
//   getProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
//   addProductReview,
//   getFeaturedProducts,
//   getBannerProducts,
//   getFlashSaleProducts,
//   getTrendingProducts,
//   toggleProductStatus,
//   getAdminProducts,
//   getUniqueUnits
// } = require('../controllers/productController');

// // ============= PUBLIC ROUTES =============
// router.get('/', getProducts);
// router.get('/featured', getFeaturedProducts);
// router.get('/banner', getBannerProducts);
// router.get('/flash-sale', getFlashSaleProducts);
// router.get('/trending', getTrendingProducts);
// router.get('/:id', getProductById);
// router.get('/units/all', getUniqueUnits);

// // ============= PROTECTED ROUTES =============
// // All routes below require authentication
// router.use(protect);

// // Review route
// router.post('/:id/review', addProductReview);

// // Generate unique SKU (for admin/moderator)
// router.post('/generate-sku', isModeratorOrAdmin, generateUniqueSku);

// // Validate SKU uniqueness
// router.get('/validate-sku/:skuCode', isModeratorOrAdmin, validateSku);

// router.put('/:id/toggle', protect, isModeratorOrAdmin, toggleProductStatus);

// // Moderator/Admin routes
// router.post('/', isModeratorOrAdmin, createProduct);
// router.put('/:id', isModeratorOrAdmin, updateProduct);
// router.get('/admin/all', protect, isModeratorOrAdmin, getAdminProducts);

// // Admin only routes
// router.delete('/:id', isAdmin, deleteProduct);

// // ============= BARCODE & SKU SEARCH ROUTES (PUBLIC) =============
// router.get('/barcode/:barcode', async (req, res) => {
//   try {
//     const { barcode } = req.params;
//     const Product = require('../models/Product');
    
//     console.log('Searching for barcode/SKU:', barcode);
    
//     const product = await Product.findOne({ 
//       $or: [
//         { barcode: barcode },
//         { skuCode: barcode }
//       ]
//     }).populate('category', 'name slug');
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found for this barcode/SKU'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: product
//     });
//   } catch (error) {
//     console.error('Get product by barcode error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// router.get('/sku/:sku', async (req, res) => {
//   try {
//     const { sku } = req.params;
//     const Product = require('../models/Product');
    
//     const product = await Product.findOne({ skuCode: sku })
//       .populate('category', 'name slug');
    
//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found for this SKU'
//       });
//     }
    
//     res.json({
//       success: true,
//       data: product
//     });
//   } catch (error) {
//     console.error('Get product by SKU error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// router.get('/validate-barcode/:barcodeNumber', async (req, res) => {
//   try {
//     const { barcodeNumber } = req.params;
//     const Barcode = require('../models/Barcode');
//     const Product = require('../models/Product');
    
//     const existingProduct = await Product.findOne({ barcode: barcodeNumber });
//     const existingBarcode = await Barcode.findOne({ barcodeNumber });
    
//     let isAvailable = true;
//     let message = 'Barcode is available';
    
//     if (existingProduct) {
//       isAvailable = false;
//       message = `Barcode already assigned to: ${existingProduct.productName}`;
//     } else if (existingBarcode && existingBarcode.status === 'assigned') {
//       isAvailable = false;
//       message = `Barcode already assigned to: ${existingBarcode.productName}`;
//     } else if (existingBarcode && existingBarcode.status !== 'available') {
//       isAvailable = false;
//       message = `Barcode is ${existingBarcode.status}`;
//     }
    
//     res.json({
//       success: true,
//       data: { isAvailable, message, existsInSystem: !!existingBarcode }
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, error: error.message });
//   }
// });

// module.exports = router;

// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const { protect, isModeratorOrAdmin, isAdmin } = require('../middleware/authMiddleware');
const { generateUniqueSku, validateSku } = require('../controllers/skuController');
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview,
  getFeaturedProducts,
  getBannerProducts,
  getFlashSaleProducts,
  getTrendingProducts,
  toggleProductStatus,
  getAdminProducts,
  getUniqueUnits
} = require('../controllers/productController');

// ============= PUBLIC ROUTES =============
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/banner', getBannerProducts);
router.get('/flash-sale', getFlashSaleProducts);
router.get('/trending', getTrendingProducts);
router.get('/:id', getProductById);
router.get('/units/all', getUniqueUnits);

// ============= PROTECTED ROUTES =============
// All routes below require authentication
router.use(protect);

// Review route
router.post('/:id/review', addProductReview);

// Generate unique SKU (for admin/moderator)
router.post('/generate-sku', isModeratorOrAdmin, generateUniqueSku);

// Validate SKU uniqueness
router.get('/validate-sku/:skuCode', isModeratorOrAdmin, validateSku);

// Toggle product status (activate/deactivate)
router.put('/:id/toggle', isModeratorOrAdmin, toggleProductStatus);

// Moderator/Admin routes
router.post('/', isModeratorOrAdmin, createProduct);
router.put('/:id', isModeratorOrAdmin, updateProduct);
router.delete('/:id', isModeratorOrAdmin, deleteProduct);
router.get('/admin/all', isModeratorOrAdmin, getAdminProducts);

// ============= BARCODE & SKU SEARCH ROUTES (PUBLIC) =============
router.get('/barcode/:barcode', async (req, res) => {
  try {
    const { barcode } = req.params;
    const Product = require('../models/Product');
    
    console.log('Searching for barcode/SKU:', barcode);
    
    const product = await Product.findOne({ 
      $or: [
        { barcode: barcode },
        { skuCode: barcode }
      ]
    }).populate('category', 'name slug').populate('tags', 'name image');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found for this barcode/SKU'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by barcode error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/sku/:sku', async (req, res) => {
  try {
    const { sku } = req.params;
    const Product = require('../models/Product');
    
    const product = await Product.findOne({ skuCode: sku })
      .populate('category', 'name slug')
      .populate('tags', 'name image');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found for this SKU'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get product by SKU error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/validate-barcode/:barcodeNumber', async (req, res) => {
  try {
    const { barcodeNumber } = req.params;
    const Barcode = require('../models/Barcode');
    const Product = require('../models/Product');
    
    const existingProduct = await Product.findOne({ barcode: barcodeNumber });
    const existingBarcode = await Barcode.findOne({ barcodeNumber });
    
    let isAvailable = true;
    let message = 'Barcode is available';
    
    if (existingProduct) {
      isAvailable = false;
      message = `Barcode already assigned to: ${existingProduct.productName}`;
    } else if (existingBarcode && existingBarcode.status === 'assigned') {
      isAvailable = false;
      message = `Barcode already assigned to: ${existingBarcode.productName}`;
    } else if (existingBarcode && existingBarcode.status !== 'available') {
      isAvailable = false;
      message = `Barcode is ${existingBarcode.status}`;
    }
    
    res.json({
      success: true,
      data: { isAvailable, message, existsInSystem: !!existingBarcode }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;