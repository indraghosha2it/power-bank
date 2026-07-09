
// // backend/src/controllers/productController.js
// const mongoose = require('mongoose');
// const Product = require('../models/Product');
// const Category = require('../models/Category');

// // Helper function to extract public ID from Cloudinary URL
// const extractPublicIdFromUrl = (url) => {
//   if (!url) return null;
//   try {
//     const parts = url.split('/');
//     const uploadIndex = parts.findIndex(part => part === 'upload');
//     if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
//       const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
//       const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
//       return publicId;
//     }
//   } catch (error) {
//     console.error('Error extracting public ID from URL:', error);
//   }
//   return null;
// };

// // Helper function to update embedded product in category
// const updateEmbeddedProductInCategory = async (categoryId, productId, updateData) => {
//   try {
//     await Category.findOneAndUpdate(
//       { 
//         _id: categoryId,
//         'products.productId': productId 
//       },
//       {
//         $set: {
//           'products.$.productName': updateData.productName,
//           'products.$.shortDescription': updateData.shortDescription,
//           'products.$.fullDescription': updateData.fullDescription,
//           'products.$.brand': updateData.brand,
//           'products.$.regularPrice': updateData.regularPrice,
//           'products.$.discountPrice': updateData.discountPrice,
//           'products.$.costPerItem': updateData.costPerItem,
//           'products.$.stockQuantity': updateData.stockQuantity,
//           'products.$.stockAlertQuantity': updateData.stockAlertQuantity,
//           'products.$.skuCode': updateData.skuCode,
//           'products.$.unit': updateData.unit,
//           'products.$.colors': updateData.colors,
//           'products.$.deliveryInfo': updateData.deliveryInfo,
//           'products.$.tags': updateData.tags,
//           'products.$.isFeatured': updateData.isFeatured,
//           'products.$.showOnBanner': updateData.showOnBanner,
//           'products.$.rating': updateData.rating,
//           'products.$.additionalInfo': updateData.additionalInfo,
//           'products.$.images': updateData.images,
//           'products.$.subcategoryId': updateData.subcategoryId,
//           'products.$.subcategoryName': updateData.subcategoryName,
//           'products.$.childSubcategoryId': updateData.childSubcategoryId,
//           'products.$.childSubcategoryName': updateData.childSubcategoryName,
//           'products.$.isActive': updateData.isActive,
//           'products.$.updatedAt': new Date()
//         }
//       }
//     );
//   } catch (error) {
//     console.error('Error updating embedded product:', error);
//     throw error;
//   }
// };

// // @desc    Create new product
// // @route   POST /api/products
// // @access  Private (Moderator/Admin)
// const createProduct = async (req, res) => {
//   try {
//     console.log('Create product request received');
//     console.log('Body:', req.body);

//     const {
//       productName,
//       shortDescription,
//       fullDescription,
//       category,
//       subcategory,
//       childSubcategory,
//       brand,
//       stockQuantity,
//       stockAlertQuantity,
//       skuCode,
//       regularPrice,
//       costPerItem,
//       discountPrice,
//       unit,
//       colors,
//       deliveryInfo,
//       tags,
//       isFeatured,
//       showOnBanner,
//       rating,
//       additionalInfo,
//       metaSettings,
//       images,
//       barcode
//     } = req.body;

//     // Validation
//     if (!productName) {
//       return res.status(400).json({ success: false, error: 'Product name is required' });
//     }
    
//     const existingProduct = await Product.findOne({ 
//       productName: { $regex: new RegExp(`^${productName}$`, 'i') } 
//     });
    
//     if (existingProduct) {
//       return res.status(400).json({ 
//         success: false, 
//         error: `Product name "${productName}" already exists. Please use a different product name.` 
//       });
//     }

//     // Barcode validation
//     if (barcode) {
//       const existingProductWithBarcode = await Product.findOne({ barcode });
//       if (existingProductWithBarcode) {
//         return res.status(400).json({
//           success: false,
//           error: `Barcode "${barcode}" is already assigned to product: ${existingProductWithBarcode.productName}`
//         });
//       }
      
//       const Barcode = require('../models/Barcode');
//       const barcodeDoc = await Barcode.findOne({ barcodeNumber: barcode });
//       if (barcodeDoc && barcodeDoc.status === 'assigned') {
//         return res.status(400).json({
//           success: false,
//           error: `Barcode "${barcode}" is already assigned to another product`
//         });
//       }
      
//       if (!/^[0-9]{8,13}$/.test(barcode)) {
//         return res.status(400).json({
//           success: false,
//           error: 'Barcode must be 8-13 digits only'
//         });
//       }
//     }
    
//     // Validate required fields
//     if (!fullDescription || fullDescription === '<p></p>') {
//       return res.status(400).json({ success: false, error: 'Full description is required' });
//     }
//     if (!category) {
//       return res.status(400).json({ success: false, error: 'Category is required' });
//     }
//     if (!brand) {
//       return res.status(400).json({ success: false, error: 'Brand is required' });
//     }
//     if (regularPrice <= 0) {
//       return res.status(400).json({ success: false, error: 'Regular price must be greater than 0' });
//     }
//     if (discountPrice > regularPrice) {
//       return res.status(400).json({ success: false, error: 'Discount price cannot exceed regular price' });
//     }
//     if (!unit) {
//       return res.status(400).json({ success: false, error: 'Unit is required' });
//     }
//     if (!images || !Array.isArray(images) || images.length === 0) {
//       return res.status(400).json({ success: false, error: 'At least one product image is required' });
//     }

//     // Check if category exists
//     const categoryExists = await Category.findById(category);
//     if (!categoryExists) {
//       return res.status(400).json({ success: false, error: 'Invalid category' });
//     }

//     let categoryName = categoryExists.name;
//     let subcategoryName = '';
//     let childSubcategoryName = '';

//     // Get subcategory name if provided
//     if (subcategory) {
//       const subcategoryDoc = categoryExists.subcategories.id(subcategory);
//       if (subcategoryDoc) {
//         subcategoryName = subcategoryDoc.name;
//       }
//     }

//     // Get child subcategory name if provided
//     if (childSubcategory && subcategory) {
//       const subcategoryDoc = categoryExists.subcategories.id(subcategory);
//       if (subcategoryDoc) {
//         const childDoc = subcategoryDoc.children.id(childSubcategory);
//         if (childDoc) {
//           childSubcategoryName = childDoc.name;
//         }
//       }
//     }

//     // Process images
//     const processedImages = images.map((url, index) => ({
//       url: url,
//       publicId: extractPublicIdFromUrl(url),
//       isPrimary: index === 0
//     }));

//     // Process additional info
//     let processedAdditionalInfo = [];
//     if (additionalInfo && Array.isArray(additionalInfo)) {
//       processedAdditionalInfo = additionalInfo;
//     }

//     // Process meta settings
//     let processedMetaSettings = {};
//     if (metaSettings) {
//       processedMetaSettings = {
//         metaTitle: metaSettings.metaTitle || '',
//         metaDescription: metaSettings.metaDescription || '',
//         metaKeywords: metaSettings.metaKeywords || []
//       };
//     }

//     // Create product
//     const product = await Product.create({
//       productName,
//       shortDescription: shortDescription || '',
//       fullDescription,
//       category,
//       categoryName,
//       subcategory: subcategory || null,
//       subcategoryName,
//       childSubcategory: childSubcategory || null,
//       childSubcategoryName,
//       brand,
//       stockQuantity: stockQuantity || 0,
//       stockAlertQuantity: stockAlertQuantity || 0,
//       regularPrice: Number(regularPrice),
//       costPerItem: costPerItem ? Number(costPerItem) : 0,
//       discountPrice: Number(discountPrice) || 0,
//       unit: unit || 'pcs',
//       colors: colors || [],
//       deliveryInfo: deliveryInfo || '',
//       tags: tags || [],
//       isFeatured: isFeatured || false,
//       showOnBanner: showOnBanner || false,
//       rating: rating || 0,
//       additionalInfo: processedAdditionalInfo,
//       metaSettings: processedMetaSettings,
//       images: processedImages,
//       barcode: barcode || undefined,
//       skuCode: skuCode || undefined,
//       createdBy: req.user.id,
//       isActive: true
//     });

//     // Prepare embedded product data
//     const embeddedProductData = {
//       productId: product._id,
//       productName: product.productName,
//       slug: product.slug,
//       shortDescription: product.shortDescription,
//       fullDescription: product.fullDescription,
//       brand: product.brand,
//       images: processedImages,
//       regularPrice: product.regularPrice,
//       discountPrice: product.discountPrice,
//       costPerItem: product.costPerItem,
//       stockQuantity: product.stockQuantity,
//       stockAlertQuantity: product.stockAlertQuantity,
//       skuCode: product.skuCode,
//       unit: product.unit,
//       colors: product.colors,
//       deliveryInfo: product.deliveryInfo,
//       tags: product.tags,
//       isFeatured: product.isFeatured,
//       showOnBanner: product.showOnBanner,
//       rating: product.rating,
//       additionalInfo: processedAdditionalInfo,
//       subcategoryId: subcategory || null,
//       subcategoryName: subcategoryName,
//       childSubcategoryId: childSubcategory || null,
//       childSubcategoryName: childSubcategoryName,
//       isActive: true,
//       createdBy: req.user.id,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     // Add product to category's products array
//     await Category.findByIdAndUpdate(
//       category,
//       {
//         $push: { products: embeddedProductData },
//         $inc: { productCount: 1 }
//       },
//       { new: true }
//     );

//     // If subcategory is selected, increment the subcategory's product count
//     if (subcategory && subcategoryName) {
//       await Category.findOneAndUpdate(
//         { 
//           _id: category,
//           'subcategories._id': subcategory
//         },
//         {
//           $inc: { 'subcategories.$.productCount': 1 }
//         }
//       );
//     }

//     // If child subcategory is selected, increment its product count
//     if (childSubcategory && childSubcategoryName && subcategory) {
//       await Category.findOneAndUpdate(
//         { 
//           _id: category,
//           'subcategories._id': subcategory,
//           'subcategories.children._id': childSubcategory
//         },
//         {
//           $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 }
//         },
//         {
//           arrayFilters: [
//             { 'sub._id': subcategory },
//             { 'child._id': childSubcategory }
//           ]
//         }
//       );
//     }

//     // Populate references for response
//     await product.populate([
//       { path: 'category', select: 'name slug' },
//       { path: 'createdBy', select: 'name email role' }
//     ]);

//     res.status(201).json({
//       success: true,
//       data: product,
//       message: 'Product created successfully'
//     });
//   } catch (error) {
//     console.error('Create product error:', error);

//     if (error.code === 11000) {
//       if (error.keyPattern && error.keyPattern.slug) {
//         return res.status(400).json({
//           success: false,
//           error: `Product name "${req.body.productName}" already exists. Please use a different product name.`
//         });
//       }
//       if (error.keyPattern && error.keyPattern.skuCode) {
//         return res.status(400).json({
//           success: false,
//           error: `SKU code already exists. Please try again.`
//         });
//       }
//       return res.status(400).json({
//         success: false,
//         error: 'Duplicate entry found. Please check your data and try again.'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while creating product'
//     });
//   }
// };

// // @desc    Get all products with filters
// // @route   GET /api/products
// // @access  Public
// // const getProducts = async (req, res) => {
// //   try {
// //     const {
// //       page = 1,
// //       limit = 12,
// //       category,
// //       subcategory,
// //       childSubcategory,
// //       brand,
// //       minPrice,
// //       maxPrice,
// //       tags,
// //       isFeatured,
// //       showOnBanner,
// //       unit,
// //       search,
// //       sort = '-createdAt',
// //       minRating,
// //       minStock,
// //       maxStock
// //     } = req.query;

// //     const query = { isActive: true };

// //     // Category filter
// //     if (category) {
// //       query.category = category;
// //     }

// //     // Subcategory filter
// //     if (subcategory) {
// //       query.subcategory = subcategory;
// //     }

// //     // Child subcategory filter
// //     if (childSubcategory) {
// //       query.childSubcategory = childSubcategory;
// //     }

// //     // Brand filter
// //     if (brand) {
// //       query.brand = { $regex: brand, $options: 'i' };
// //     }

// //     // Price range filter
// //     if (minPrice || maxPrice) {
// //       query.$or = [
// //         { regularPrice: {} },
// //         { discountPrice: {} }
// //       ];
// //       if (minPrice) {
// //         query.$or[0].regularPrice.$gte = parseFloat(minPrice);
// //         query.$or[1].discountPrice.$gte = parseFloat(minPrice);
// //       }
// //       if (maxPrice) {
// //         query.$or[0].regularPrice.$lte = parseFloat(maxPrice);
// //         query.$or[1].discountPrice.$lte = parseFloat(maxPrice);
// //       }
// //     }

// //     // Tags filter
// //     if (tags) {
// //       const tagArray = Array.isArray(tags) ? tags : [tags];
// //       query.tags = { $in: tagArray };
// //     }

// //     // Featured filter
// //     if (isFeatured === 'true') {
// //       query.isFeatured = true;
// //     }

// //     // Show on banner filter
// //     if (showOnBanner === 'true') {
// //       query.showOnBanner = true;
// //     }

// //     // Unit filter
// //     if (unit) {
// //       query.unit = unit;
// //     }

// //     // Rating filter
// //     if (minRating) {
// //       query.rating = { $gte: parseFloat(minRating) };
// //     }

// //     // Stock range filter
// //     if (minStock) {
// //       query.stockQuantity = { $gte: parseFloat(minStock) };
// //     }
// //     if (maxStock) {
// //       query.stockQuantity = { ...query.stockQuantity, $lte: parseFloat(maxStock) };
// //     }

// //     // Search filter
// //     if (search && search.trim()) {
// //       const searchTerm = search.trim();
// //       const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
// //       query.$or = [
// //         { productName: regex },
// //         { brand: regex },
// //         { fullDescription: regex },
// //         { skuCode: regex },
// //         { barcode: regex }
// //       ];
// //     }

// //     // Sort options
// //     let sortOption = {};
// //     switch (sort) {
// //       case 'price_asc':
// //         sortOption = { regularPrice: 1 };
// //         break;
// //       case 'price_desc':
// //         sortOption = { regularPrice: -1 };
// //         break;
// //       case 'rating_desc':
// //         sortOption = { rating: -1 };
// //         break;
// //       case 'name_asc':
// //         sortOption = { productName: 1 };
// //         break;
// //       case 'newest':
// //         sortOption = { createdAt: -1 };
// //         break;
// //       case 'popular':
// //         sortOption = { purchaseCount: -1 };
// //         break;
// //       default:
// //         sortOption = { createdAt: -1 };
// //     }

// //     const skip = (parseInt(page) - 1) * parseInt(limit);

// //     const [products, total] = await Promise.all([
// //       Product.find(query)
// //         .populate('category', 'name slug')
// //         .sort(sortOption)
// //         .skip(skip)
// //         .limit(parseInt(limit)),
// //       Product.countDocuments(query)
// //     ]);

// //     res.json({
// //       success: true,
// //       data: products,
// //       pagination: {
// //         total,
// //         page: parseInt(page),
// //         pages: Math.ceil(total / parseInt(limit)),
// //         limit: parseInt(limit)
// //       }
// //     });
// //   } catch (error) {
// //     console.error('Get products error:', error);
// //     res.status(500).json({
// //       success: false,
// //       error: error.message || 'Server error while fetching products'
// //     });
// //   }
// // };

// // @desc    Get all products with filters
// // @route   GET /api/products
// // @access  Public
// // @desc    Get all products with filters
// // @route   GET /api/products
// // @access  Public
// const getProducts = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 12,
//       category,
//       subcategory,
//       childSubcategory,
//       brand,
//       minPrice,
//       maxPrice,
//       tags,
//       isFeatured,
//       showOnBanner,
//       unit,
//       search,
//       sort = '-createdAt',
//       minRating,
//       minStock,
//       maxStock,
//       isActive  // Only use this when explicitly provided
//     } = req.query;

//     let query = {};

//     // ============ CHANGE HERE ============
//     // By default, ONLY show active products for public users
//     // Only show inactive products if explicitly requested via isActive=false
//     if (isActive === 'false') {
//       query.isActive = false;
//     } else {
//       // Default: show only active products (isActive: true)
//       query.isActive = true;
//     }
//     // ============ END OF CHANGE ============

//     // Category filter
//     if (category) {
//       query.category = category;
//     }

//     // Subcategory filter
//     if (subcategory) {
//       query.subcategory = subcategory;
//     }

//     // Child subcategory filter
//     if (childSubcategory) {
//       query.childSubcategory = childSubcategory;
//     }

//     // Brand filter
//     if (brand) {
//       query.brand = { $regex: brand, $options: 'i' };
//     }

//     // Price range filter
//     if (minPrice || maxPrice) {
//       query.$or = [
//         { regularPrice: {} },
//         { discountPrice: {} }
//       ];
//       if (minPrice) {
//         query.$or[0].regularPrice.$gte = parseFloat(minPrice);
//         query.$or[1].discountPrice.$gte = parseFloat(minPrice);
//       }
//       if (maxPrice) {
//         query.$or[0].regularPrice.$lte = parseFloat(maxPrice);
//         query.$or[1].discountPrice.$lte = parseFloat(maxPrice);
//       }
//     }

//     // Tags filter
//     if (tags) {
//       const tagArray = Array.isArray(tags) ? tags : [tags];
//       query.tags = { $in: tagArray };
//     }

//     // Featured filter
//     if (isFeatured === 'true') {
//       query.isFeatured = true;
//     }

//     // Show on banner filter
//     if (showOnBanner === 'true') {
//       query.showOnBanner = true;
//     }

//     // Unit filter
//     if (unit) {
//       query.unit = unit;
//     }

//     // Rating filter
//     if (minRating) {
//       query.rating = { $gte: parseFloat(minRating) };
//     }

//     // Stock range filter
//     if (minStock) {
//       query.stockQuantity = { $gte: parseFloat(minStock) };
//     }
//     if (maxStock) {
//       query.stockQuantity = { ...query.stockQuantity, $lte: parseFloat(maxStock) };
//     }

//     // Search filter
//     if (search && search.trim()) {
//       const searchTerm = search.trim();
//       const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
//       query.$or = [
//         { productName: regex },
//         { brand: regex },
//         { fullDescription: regex },
//         { skuCode: regex },
//         { barcode: regex }
//       ];
//     }

//     // Sort options
//     let sortOption = {};
//     switch (sort) {
//       case 'price_asc':
//         sortOption = { regularPrice: 1 };
//         break;
//       case 'price_desc':
//         sortOption = { regularPrice: -1 };
//         break;
//       case 'rating_desc':
//         sortOption = { rating: -1 };
//         break;
//       case 'name_asc':
//         sortOption = { productName: 1 };
//         break;
//       case 'newest':
//         sortOption = { createdAt: -1 };
//         break;
//       case 'popular':
//         sortOption = { purchaseCount: -1 };
//         break;
//       default:
//         sortOption = { createdAt: -1 };
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [products, total] = await Promise.all([
//       Product.find(query)
//         .populate('category', 'name slug')
//          .populate('tags', 'name image') 
//         .sort(sortOption)
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Product.countDocuments(query)
//     ]);

//     res.json({
//       success: true,
//       data: products,
//       pagination: {
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         limit: parseInt(limit)
//       }
//     });
//   } catch (error) {
//     console.error('Get products error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching products'
//     });
//   }
// };

// // backend/src/controllers/productController.js

// // Add this after getTrendingProducts and before module.exports

// // @desc    Get all products for Admin/Moderator (including inactive)
// // @route   GET /api/products/admin/all
// // @access  Private (Admin/Moderator)
// const getAdminProducts = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 12,
//       category,
//       subcategory,
//       childSubcategory,
//       brand,
//       minPrice,
//       maxPrice,
//       tags,
//       isFeatured,
//       showOnBanner,
//       unit,
//       search,
//       sort = '-createdAt',
//       minRating,
//       minStock,
//       maxStock,
//       isActive  // Explicit filter for admin
//     } = req.query;

//     let query = {};

//     // Only apply isActive filter if explicitly requested by admin
//     if (isActive === 'true') {
//       query.isActive = true;
//     } else if (isActive === 'false') {
//       query.isActive = false;
//     }
//     // If isActive is not provided, show ALL products (both active and inactive)

//     // Category filter
//     if (category) {
//       query.category = category;
//     }

//     // Subcategory filter
//     if (subcategory) {
//       query.subcategory = subcategory;
//     }

//     // Child subcategory filter
//     if (childSubcategory) {
//       query.childSubcategory = childSubcategory;
//     }

//     // Brand filter
//     if (brand) {
//       query.brand = { $regex: brand, $options: 'i' };
//     }

//     // Price range filter
//     if (minPrice || maxPrice) {
//       query.$or = [
//         { regularPrice: {} },
//         { discountPrice: {} }
//       ];
//       if (minPrice) {
//         query.$or[0].regularPrice.$gte = parseFloat(minPrice);
//         query.$or[1].discountPrice.$gte = parseFloat(minPrice);
//       }
//       if (maxPrice) {
//         query.$or[0].regularPrice.$lte = parseFloat(maxPrice);
//         query.$or[1].discountPrice.$lte = parseFloat(maxPrice);
//       }
//     }

//     // Tags filter
//     if (tags) {
//       const tagArray = Array.isArray(tags) ? tags : [tags];
//       query.tags = { $in: tagArray };
//     }

//     // Featured filter
//     if (isFeatured === 'true') {
//       query.isFeatured = true;
//     }

//     // Show on banner filter
//     if (showOnBanner === 'true') {
//       query.showOnBanner = true;
//     }

//     // Unit filter
//     if (unit) {
//       query.unit = unit;
//     }

//     // Rating filter
//     if (minRating) {
//       query.rating = { $gte: parseFloat(minRating) };
//     }

//     // Stock range filter
//     if (minStock) {
//       query.stockQuantity = { $gte: parseFloat(minStock) };
//     }
//     if (maxStock) {
//       query.stockQuantity = { ...query.stockQuantity, $lte: parseFloat(maxStock) };
//     }

//     // Search filter
//     if (search && search.trim()) {
//       const searchTerm = search.trim();
//       const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
//       query.$or = [
//         { productName: regex },
//         { brand: regex },
//         { fullDescription: regex },
//         { skuCode: regex },
//         { barcode: regex }
//       ];
//     }

//     // Sort options
//     let sortOption = {};
//     switch (sort) {
//       case 'price_asc':
//         sortOption = { regularPrice: 1 };
//         break;
//       case 'price_desc':
//         sortOption = { regularPrice: -1 };
//         break;
//       case 'rating_desc':
//         sortOption = { rating: -1 };
//         break;
//       case 'name_asc':
//         sortOption = { productName: 1 };
//         break;
//       case 'newest':
//         sortOption = { createdAt: -1 };
//         break;
//       case 'popular':
//         sortOption = { purchaseCount: -1 };
//         break;
//       default:
//         sortOption = { createdAt: -1 };
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [products, total] = await Promise.all([
//       Product.find(query)
//         .populate('category', 'name slug')
//         .populate('tags', 'name image')
//         .sort(sortOption)
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Product.countDocuments(query)
//     ]);

//     res.json({
//       success: true,
//       data: products,
//       pagination: {
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         limit: parseInt(limit)
//       }
//     });
//   } catch (error) {
//     console.error('Get admin products error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching products'
//     });
//   }
// };

// // @desc    Get single product by ID or slug
// // @route   GET /api/products/:id
// // @access  Public
// const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
//     const query = isObjectId ? { _id: id } : { slug: id };

//     const product = await Product.findOne(query)
//       .populate('category', 'name slug')
//        .populate('tags', 'name image')
//       .populate('createdBy', 'name email');

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found'
//       });
//     }

//     // Increment view count
//     product.views += 1;
//     await product.save();

//     // Get related products (same category)
//     const relatedProducts = await Product.find({
//       category: product.category,
//       _id: { $ne: product._id },
//       isActive: true
//     })
//       .limit(8)
//       .populate('category', 'name slug')
//        .populate('tags', 'name image')
//       .select('productName slug regularPrice discountPrice images rating stockQuantity tags category categoryName subcategoryName childSubcategoryName brand unit');

//     res.json({
//       success: true,
//       data: {
//         product,
//         relatedProducts
//       }
//     });
//   } catch (error) {
//     console.error('Get product error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching product'
//     });
//   }
// };

// // @desc    Update product
// // @route   PUT /api/products/:id
// // @access  Private (Moderator/Admin)
// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ success: false, error: 'Product not found' });
//     }

//     if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
//       return res.status(403).json({ success: false, error: 'Permission denied' });
//     }

//     const {
//       productName,
//       shortDescription,
//       fullDescription,
//       category,
//       subcategory,
//       childSubcategory,
//       brand,
//       stockQuantity,
//       stockAlertQuantity,
//       skuCode,
//       regularPrice,
//       costPerItem,
//       discountPrice,
//       unit,
//       colors,
//       deliveryInfo,
//       tags,
//       isFeatured,
//       showOnBanner,
//       rating,
//       additionalInfo,
//       metaSettings,
//       images,
//       barcode
//     } = req.body;

//     // Store old values for count updates
//     const oldCategory = product.category.toString();
//     const oldSubcategoryId = product.subcategory ? product.subcategory.toString() : null;
//     const oldChildSubcategoryId = product.childSubcategory ? product.childSubcategory.toString() : null;
    
//     const newCategory = category || oldCategory;
//     let newSubcategoryId = subcategory || null;
//     let newSubcategoryName = '';
//     let newChildSubcategoryId = childSubcategory || null;
//     let newChildSubcategoryName = '';

//     // Handle category change validation
//     if (category && category !== oldCategory) {
//       const categoryExists = await Category.findById(category);
//       if (!categoryExists) {
//         return res.status(400).json({ success: false, error: 'Invalid category' });
//       }
//     }

//     // Get subcategory names if provided
//     if (newSubcategoryId) {
//       const categoryDoc = await Category.findById(newCategory);
//       if (categoryDoc) {
//         const subcategoryDoc = categoryDoc.subcategories.id(newSubcategoryId);
//         if (subcategoryDoc) {
//           newSubcategoryName = subcategoryDoc.name;
          
//           if (newChildSubcategoryId) {
//             const childDoc = subcategoryDoc.children.id(newChildSubcategoryId);
//             if (childDoc) {
//               newChildSubcategoryName = childDoc.name;
//             }
//           }
//         }
//       }
//     }

//     // Process images if provided
//     let processedImages = product.images;
//     if (images && Array.isArray(images) && images.length > 0) {
//       processedImages = images.map((url, index) => ({
//         url: url,
//         publicId: extractPublicIdFromUrl(url),
//         isPrimary: index === 0
//       }));
//     }

//     // Process additional info
//     let processedAdditionalInfo = product.additionalInfo;
//     if (additionalInfo && Array.isArray(additionalInfo)) {
//       processedAdditionalInfo = additionalInfo;
//     }

//     // Process meta settings
//     let processedMetaSettings = product.metaSettings;
//     if (metaSettings) {
//       processedMetaSettings = {
//         metaTitle: metaSettings.metaTitle || product.metaSettings?.metaTitle || '',
//         metaDescription: metaSettings.metaDescription || product.metaSettings?.metaDescription || '',
//         metaKeywords: metaSettings.metaKeywords || product.metaSettings?.metaKeywords || []
//       };
//     }

//     // Update product fields
//     if (productName) product.productName = productName;
//     if (shortDescription !== undefined) product.shortDescription = shortDescription || '';
//     if (fullDescription && fullDescription !== '<p></p>') product.fullDescription = fullDescription;
//     if (brand) product.brand = brand;
//     if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
//     if (stockAlertQuantity !== undefined) product.stockAlertQuantity = stockAlertQuantity || 0;
//     if (skuCode) product.skuCode = skuCode;
//     if (regularPrice !== undefined) product.regularPrice = regularPrice;
//     if (costPerItem !== undefined) product.costPerItem = costPerItem || 0;
//     if (discountPrice !== undefined) product.discountPrice = discountPrice;
//     if (unit) product.unit = unit;
//     if (colors !== undefined) product.colors = colors || [];
//     if (deliveryInfo !== undefined) product.deliveryInfo = deliveryInfo || '';
//     if (tags) product.tags = tags;
//     if (isFeatured !== undefined) product.isFeatured = isFeatured;
//     if (showOnBanner !== undefined) product.showOnBanner = showOnBanner;
//     if (rating !== undefined) product.rating = rating;
//     if (additionalInfo) product.additionalInfo = processedAdditionalInfo;
//     if (metaSettings) product.metaSettings = processedMetaSettings;
//     if (images && Array.isArray(images) && images.length > 0) product.images = processedImages;
    
//     // Handle barcode update
//     if (barcode !== undefined) {
//       const Barcode = mongoose.model('Barcode');
//       const oldBarcode = product.barcode;
      
//       if (barcode === '') {
//         if (oldBarcode) {
//           const barcodeDoc = await Barcode.findOne({ barcodeNumber: oldBarcode });
//           if (barcodeDoc) {
//             barcodeDoc.productId = null;
//             barcodeDoc.productSku = '';
//             barcodeDoc.productName = '';
//             barcodeDoc.status = 'available';
//             await barcodeDoc.save();
//           }
//         }
//         product.barcode = undefined;
//       } else if (barcode !== oldBarcode) {
//         const existingProductWithBarcode = await Product.findOne({ 
//           barcode: barcode,
//           _id: { $ne: product._id }
//         });
//         if (existingProductWithBarcode) {
//           return res.status(400).json({
//             success: false,
//             error: `Barcode "${barcode}" is already assigned to product: ${existingProductWithBarcode.productName}`
//           });
//         }
        
//         if (oldBarcode) {
//           const oldBarcodeDoc = await Barcode.findOne({ barcodeNumber: oldBarcode });
//           if (oldBarcodeDoc) {
//             oldBarcodeDoc.productId = null;
//             oldBarcodeDoc.productSku = '';
//             oldBarcodeDoc.productName = '';
//             oldBarcodeDoc.status = 'available';
//             await oldBarcodeDoc.save();
//           }
//         }
        
//         let barcodeDoc = await Barcode.findOne({ barcodeNumber: barcode });
//         if (barcodeDoc) {
//           barcodeDoc.productId = product._id;
//           barcodeDoc.productSku = product.skuCode;
//           barcodeDoc.productName = product.productName;
//           barcodeDoc.status = 'assigned';
//           await barcodeDoc.save();
//         } else {
//           const { generateAndUploadBarcodeImage } = require('../utils/generateBarcodeImage');
//           let barcodeImageUrl = '';
          
//           try {
//             const result = await generateAndUploadBarcodeImage(barcode);
//             barcodeImageUrl = result.url;
//           } catch (imgError) {
//             console.error('Failed to generate barcode image:', imgError);
//           }
          
//           barcodeDoc = await Barcode.create({
//             barcodeNumber: barcode,
//             format: 'CODE-128',
//             productId: product._id,
//             productSku: product.skuCode,
//             productName: product.productName,
//             status: 'assigned',
//             generatedBy: req.user.id,
//             barcodeImageUrl: barcodeImageUrl,
//             metadata: {
//               sequence: parseInt(barcode.slice(1, 9)) || 0
//             }
//           });
//         }
//         product.barcode = barcode;
//       }
//     }

//     // Update category if changed
//     if (category && category !== oldCategory) {
//       product.category = category;
//       const categoryExists = await Category.findById(category);
//       if (categoryExists) {
//         product.categoryName = categoryExists.name;
//       }
//       product.subcategory = newSubcategoryId;
//       product.subcategoryName = newSubcategoryName;
//       product.childSubcategory = newChildSubcategoryId;
//       product.childSubcategoryName = newChildSubcategoryName;
//     } else {
//       if (subcategory !== undefined) {
//         product.subcategory = newSubcategoryId;
//         product.subcategoryName = newSubcategoryName;
//       }
//       if (childSubcategory !== undefined) {
//         product.childSubcategory = newChildSubcategoryId;
//         product.childSubcategoryName = newChildSubcategoryName;
//       }
//     }

//     await product.save();

//     // Prepare data for embedded product update
//     const embeddedUpdateData = {
//       productName: product.productName,
//       shortDescription: product.shortDescription,
//       fullDescription: product.fullDescription,
//       brand: product.brand,
//       images: processedImages,
//       regularPrice: product.regularPrice,
//       discountPrice: product.discountPrice,
//       costPerItem: product.costPerItem,
//       stockQuantity: product.stockQuantity,
//       stockAlertQuantity: product.stockAlertQuantity,
//       skuCode: product.skuCode,
//       unit: product.unit,
//       colors: product.colors,
//       deliveryInfo: product.deliveryInfo,
//       tags: product.tags,
//       isFeatured: product.isFeatured,
//       showOnBanner: product.showOnBanner,
//       rating: product.rating,
//       additionalInfo: processedAdditionalInfo,
//       subcategoryId: product.subcategory,
//       subcategoryName: product.subcategoryName,
//       childSubcategoryId: product.childSubcategory,
//       childSubcategoryName: product.childSubcategoryName,
//       isActive: product.isActive,
//       updatedAt: new Date()
//     };

//     // Handle category change
//     if (category && category !== oldCategory) {
//       await Category.findByIdAndUpdate(
//         oldCategory,
//         {
//           $pull: { products: { productId: product._id } },
//           $inc: { productCount: -1 }
//         }
//       );
      
//       if (oldSubcategoryId) {
//         await Category.findOneAndUpdate(
//           { 
//             _id: oldCategory,
//             'subcategories._id': oldSubcategoryId
//           },
//           { $inc: { 'subcategories.$.productCount': -1 } }
//         );
//       }
      
//       if (oldChildSubcategoryId && oldSubcategoryId) {
//         await Category.findOneAndUpdate(
//           { 
//             _id: oldCategory,
//             'subcategories._id': oldSubcategoryId,
//             'subcategories.children._id': oldChildSubcategoryId
//           },
//           { $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 } },
//           {
//             arrayFilters: [
//               { 'sub._id': oldSubcategoryId },
//               { 'child._id': oldChildSubcategoryId }
//             ]
//           }
//         );
//       }
      
//       const newEmbeddedProduct = {
//         productId: product._id,
//         ...embeddedUpdateData,
//         createdBy: req.user.id,
//         createdAt: product.createdAt
//       };
      
//       await Category.findByIdAndUpdate(
//         newCategory,
//         {
//           $push: { products: newEmbeddedProduct },
//           $inc: { productCount: 1 }
//         }
//       );
      
//       if (newSubcategoryId) {
//         await Category.findOneAndUpdate(
//           { 
//             _id: newCategory,
//             'subcategories._id': newSubcategoryId
//           },
//           { $inc: { 'subcategories.$.productCount': 1 } }
//         );
//       }
      
//       if (newChildSubcategoryId && newSubcategoryId) {
//         await Category.findOneAndUpdate(
//           { 
//             _id: newCategory,
//             'subcategories._id': newSubcategoryId,
//             'subcategories.children._id': newChildSubcategoryId
//           },
//           { $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 } },
//           {
//             arrayFilters: [
//               { 'sub._id': newSubcategoryId },
//               { 'child._id': newChildSubcategoryId }
//             ]
//           }
//         );
//       }
//     } else {
//       await updateEmbeddedProductInCategory(oldCategory, product._id, embeddedUpdateData);
      
//       if (oldSubcategoryId !== newSubcategoryId) {
//         if (oldSubcategoryId) {
//           await Category.findOneAndUpdate(
//             { 
//               _id: oldCategory,
//               'subcategories._id': oldSubcategoryId
//             },
//             { $inc: { 'subcategories.$.productCount': -1 } }
//           );
//         }
//         if (newSubcategoryId) {
//           await Category.findOneAndUpdate(
//             { 
//               _id: oldCategory,
//               'subcategories._id': newSubcategoryId
//             },
//             { $inc: { 'subcategories.$.productCount': 1 } }
//           );
//         }
//       }
      
//       if (oldChildSubcategoryId !== newChildSubcategoryId) {
//         if (oldChildSubcategoryId && oldSubcategoryId) {
//           await Category.findOneAndUpdate(
//             { 
//               _id: oldCategory,
//               'subcategories._id': oldSubcategoryId,
//               'subcategories.children._id': oldChildSubcategoryId
//             },
//             { $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 } },
//             {
//               arrayFilters: [
//                 { 'sub._id': oldSubcategoryId },
//                 { 'child._id': oldChildSubcategoryId }
//               ]
//             }
//           );
//         }
//         if (newChildSubcategoryId && newSubcategoryId) {
//           await Category.findOneAndUpdate(
//             { 
//               _id: oldCategory,
//               'subcategories._id': newSubcategoryId,
//               'subcategories.children._id': newChildSubcategoryId
//             },
//             { $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 } },
//             {
//               arrayFilters: [
//                 { 'sub._id': newSubcategoryId },
//                 { 'child._id': newChildSubcategoryId }
//               ]
//             }
//           );
//         }
//       }
//     }

//     res.json({
//       success: true,
//       data: product,
//       message: 'Product updated successfully'
//     });
//   } catch (error) {
//     console.error('Update product error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while updating product'
//     });
//   }
// };

// // @desc    Delete product
// // @route   DELETE /api/products/:id
// // @access  Private (Admin only)
// const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ success: false, error: 'Product not found' });
//     }

//     if (req.user.role !== 'admin') {
//       return res.status(403).json({ success: false, error: 'Only admins can delete products' });
//     }

//     await Category.findByIdAndUpdate(
//       product.category,
//       {
//         $pull: { products: { productId: product._id } },
//         $inc: { productCount: -1 }
//       }
//     );

//     if (product.subcategory) {
//       await Category.findOneAndUpdate(
//         { 
//           _id: product.category,
//           'subcategories._id': product.subcategory
//         },
//         { $inc: { 'subcategories.$.productCount': -1 } }
//       );
//     }

//     if (product.childSubcategory && product.subcategory) {
//       await Category.findOneAndUpdate(
//         { 
//           _id: product.category,
//           'subcategories._id': product.subcategory,
//           'subcategories.children._id': product.childSubcategory
//         },
//         { $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 } },
//         {
//           arrayFilters: [
//             { 'sub._id': product.subcategory },
//             { 'child._id': product.childSubcategory }
//           ]
//         }
//       );
//     }

//     await product.deleteOne();

//     res.json({
//       success: true,
//       message: 'Product deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete product error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while deleting product'
//     });
//   }
// };

// // @desc    Add review to product
// // @route   POST /api/products/:id/review
// // @access  Private
// const addProductReview = async (req, res) => {
//   try {
//     const { rating, title, comment } = req.body;
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ success: false, error: 'Product not found' });
//     }

//     const alreadyReviewed = product.reviews.some(
//       review => review.userId && review.userId.toString() === req.user.id
//     );

//     if (alreadyReviewed) {
//       return res.status(400).json({ success: false, error: 'Product already reviewed' });
//     }

//     const review = {
//       userId: req.user.id,
//       userName: req.user.name || req.user.email,
//       rating: Number(rating),
//       title: title || '',
//       comment,
//       isVerifiedPurchase: true,
//       createdAt: new Date()
//     };

//     product.reviews.push(review);
    
//     const totalReviews = product.reviews.length;
//     const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
//     product.rating = Math.round(avgRating * 10) / 10;
    
//     const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
//     product.reviews.forEach(r => {
//       distribution[r.rating]++;
//     });
//     product.reviewStats = {
//       averageRating: product.rating,
//       totalReviews,
//       ratingDistribution: distribution
//     };

//     await product.save();

//     res.status(201).json({
//       success: true,
//       data: review,
//       message: 'Review added successfully'
//     });
//   } catch (error) {
//     console.error('Add review error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while adding review'
//     });
//   }
// };

// // @desc    Get featured products
// // @route   GET /api/products/featured
// // @access  Public
// const getFeaturedProducts = async (req, res) => {
//   try {
//     const { limit = 8 } = req.query;

//     const products = await Product.find({
//       isFeatured: true,
//       isActive: true
//     })
//       .limit(parseInt(limit))
//       .select('productName slug regularPrice discountPrice images rating unit');

//     res.json({
//       success: true,
//       data: products
//     });
//   } catch (error) {
//     console.error('Get featured products error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Get banner products (show on banner)
// // @route   GET /api/products/banner
// // @access  Public
// const getBannerProducts = async (req, res) => {
//   try {
//     const { limit = 5 } = req.query;

//     const products = await Product.find({
//       showOnBanner: true,
//       isActive: true
//     })
//       .limit(parseInt(limit))
//       .select('productName slug regularPrice discountPrice images rating unit');

//     res.json({
//       success: true,
//       data: products
//     });
//   } catch (error) {
//     console.error('Get banner products error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Get flash sale products
// // @route   GET /api/products/flash-sale
// // @access  Public
// const getFlashSaleProducts = async (req, res) => {
//   try {
//     const { limit = 10 } = req.query;

//     const products = await Product.find({
//       tags: 'Flash Sale',
//       isActive: true,
//       discountPrice: { $gt: 0 }
//     })
//       .populate('category', 'name slug')
//       .limit(parseInt(limit))
//       .select('productName slug regularPrice discountPrice images rating stockQuantity category unit');

//     res.json({
//       success: true,
//       data: products
//     });
//   } catch (error) {
//     console.error('Get flash sale products error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Get trending products (by purchase count)
// // @route   GET /api/products/trending
// // @access  Public
// const getTrendingProducts = async (req, res) => {
//   try {
//     const { limit = 8 } = req.query;

//     const products = await Product.find({ isActive: true })
//       .sort({ purchaseCount: -1, views: -1 })
//       .limit(parseInt(limit))
//       .select('productName slug regularPrice discountPrice images rating purchaseCount unit');

//     res.json({
//       success: true,
//       data: products
//     });
//   } catch (error) {
//     console.error('Get trending products error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// // @desc    Toggle product active status (activate/deactivate)
// // @route   PUT /api/products/:id/toggle
// // @access  Private (Admin/Moderator)
// const toggleProductStatus = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ success: false, error: 'Product not found' });
//     }

//     // Check permissions - allow both admin and moderator
//     if (req.user.role !== 'admin' && req.user.role !== 'moderator') {
//       return res.status(403).json({ success: false, error: 'Permission denied. Only admins and moderators can change product status.' });
//     }

//     // Toggle the status
//     product.isActive = !product.isActive;
//     await product.save();

//     // Update embedded product in category
//     await Category.findOneAndUpdate(
//       { 
//         _id: product.category,
//         'products.productId': product._id 
//       },
//       {
//         $set: {
//           'products.$.isActive': product.isActive,
//           'products.$.updatedAt': new Date()
//         }
//       }
//     );

//     // If there's a subcategory, update its embedded product as well
//     if (product.subcategory) {
//       await Category.findOneAndUpdate(
//         { 
//           _id: product.category,
//           'subcategories._id': product.subcategory,
//           'subcategories.products.productId': product._id
//         },
//         {
//           $set: {
//             'subcategories.$[sub].products.$[prod].isActive': product.isActive,
//             'subcategories.$[sub].products.$[prod].updatedAt': new Date()
//           }
//         },
//         {
//           arrayFilters: [
//             { 'sub._id': product.subcategory },
//             { 'prod.productId': product._id }
//           ]
//         }
//       );
//     }

//     res.json({
//       success: true,
//       data: product,
//       message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`
//     });
//   } catch (error) {
//     console.error('Toggle product status error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while toggling product status'
//     });
//   }
// };

// // backend/src/controllers/productController.js
// // Add this function after the other functions

// // @desc    Get all unique units from products
// // @route   GET /api/products/units/all
// // @access  Public
// const getUniqueUnits = async (req, res) => {
//   try {
//     // Get all distinct units from products
//     const units = await Product.distinct('unit', { isActive: true });
    
//     // Filter out null/undefined/empty values and sort
//     const filteredUnits = units
//       .filter(unit => unit && unit.trim() !== '')
//       .sort();
    
//     // Format units for display
//     const unitLabels = {
//       'pcs': 'Pieces (pcs)',
//       'ton': 'Ton (ton)'
//     };
    
//     const formattedUnits = filteredUnits.map(unit => ({
//       value: unit,
//       label: unitLabels[unit] || unit.charAt(0).toUpperCase() + unit.slice(1)
//     }));
    
//     res.json({
//       success: true,
//       data: formattedUnits
//     });
//   } catch (error) {
//     console.error('Get unique units error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching units'
//     });
//   }
// };

// module.exports = {
//   createProduct,
//   getProducts,
//   getAdminProducts,
//   getProductById,
//   updateProduct,
//   deleteProduct,
//   addProductReview,
//   getFeaturedProducts,
//   getBannerProducts,
//   getFlashSaleProducts,
//   getTrendingProducts,
//   toggleProductStatus,
//   getUniqueUnits
// };


// backend/src/controllers/productController.js
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');

// Helper function to extract public ID from Cloudinary URL
const extractPublicIdFromUrl = (url) => {
  if (!url) return null;
  try {
    const parts = url.split('/');
    const uploadIndex = parts.findIndex(part => part === 'upload');
    if (uploadIndex !== -1 && uploadIndex + 2 < parts.length) {
      const publicIdWithExt = parts.slice(uploadIndex + 2).join('/');
      const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.'));
      return publicId;
    }
  } catch (error) {
    console.error('Error extracting public ID from URL:', error);
  }
  return null;
};

// Helper function to update embedded product in category
// const updateEmbeddedProductInCategory = async (categoryId, productId, updateData) => {
//   try {
//     await Category.findOneAndUpdate(
//       { 
//         _id: categoryId,
//         'products.productId': productId 
//       },
//       {
//         $set: {
//           'products.$.productName': updateData.productName,
//           'products.$.shortDescription': updateData.shortDescription,
//           'products.$.fullDescription': updateData.fullDescription,
//           'products.$.brand': updateData.brand,
//           'products.$.regularPrice': updateData.regularPrice,
//           'products.$.discountPrice': updateData.discountPrice,
//           'products.$.costPerItem': updateData.costPerItem,
//           'products.$.stockQuantity': updateData.stockQuantity,
//           'products.$.stockAlertQuantity': updateData.stockAlertQuantity,
//           'products.$.skuCode': updateData.skuCode,
//           'products.$.unit': updateData.unit,
//           'products.$.colors': updateData.colors,
//           'products.$.deliveryInfo': updateData.deliveryInfo,
//           'products.$.tags': updateData.tags,
//           'products.$.isFeatured': updateData.isFeatured,
//           'products.$.showOnBanner': updateData.showOnBanner,
//           'products.$.rating': updateData.rating,
//           'products.$.additionalInfo': updateData.additionalInfo,
//           'products.$.images': updateData.images,
//           'products.$.subcategoryId': updateData.subcategoryId,
//           'products.$.subcategoryName': updateData.subcategoryName,
//           'products.$.childSubcategoryId': updateData.childSubcategoryId,
//           'products.$.childSubcategoryName': updateData.childSubcategoryName,
//           'products.$.isActive': updateData.isActive,
//           'products.$.updatedAt': new Date()
//         }
//       }
//     );
//   } catch (error) {
//     console.error('Error updating embedded product:', error);
//     throw error;
//   }
// };

// backend/src/controllers/productController.js

const updateEmbeddedProductInCategory = async (categoryId, productId, updateData) => {
  try {
    await Category.findOneAndUpdate(
      { 
        _id: categoryId,
        'products.productId': productId 
      },
      {
        $set: {
          'products.$.productName': updateData.productName,
          'products.$.shortDescription': updateData.shortDescription,
          'products.$.fullDescription': updateData.fullDescription,
          'products.$.brand': updateData.brand,
          'products.$.regularPrice': updateData.regularPrice,
          'products.$.discountPrice': updateData.discountPrice,
          'products.$.costPerItem': updateData.costPerItem,
          'products.$.stockQuantity': updateData.stockQuantity,
          'products.$.stockAlertQuantity': updateData.stockAlertQuantity,
          'products.$.skuCode': updateData.skuCode,
          'products.$.unit': updateData.unit,
          'products.$.colors': updateData.colors,
          'products.$.deliveryInfo': updateData.deliveryInfo,
          'products.$.tags': updateData.tags,
          'products.$.isFeatured': updateData.isFeatured,
          'products.$.showOnBanner': updateData.showOnBanner,
          'products.$.rating': updateData.rating,
          'products.$.additionalInfo': updateData.additionalInfo,
          'products.$.faqs': updateData.faqs,
          'products.$.images': updateData.images,
          'products.$.subcategoryId': updateData.subcategoryId,
          'products.$.subcategoryName': updateData.subcategoryName,
          'products.$.childSubcategoryId': updateData.childSubcategoryId,
          'products.$.childSubcategoryName': updateData.childSubcategoryName,
          'products.$.isActive': updateData.isActive,
          'products.$.updatedBy': updateData.updatedBy, // ADD THIS
          'products.$.lastUpdatedAt': updateData.lastUpdatedAt, // ADD THIS
          'products.$.updatedAt': new Date()
        }
      }
    );
  } catch (error) {
    console.error('Error updating embedded product:', error);
    throw error;
  }
};



// backend/src/controllers/productController.js



// @desc    Create new product
// @route   POST /api/products
// @access  Private (Super Admin/Admin/Moderator)
// const createProduct = async (req, res) => {
//   try {
//     console.log('Create product request received');
//     console.log('Body:', req.body);

//     const {
//       productName,
//       shortDescription,
//       fullDescription,
//       category,
//       subcategory,
//       childSubcategory,
//       brand,
//       stockQuantity,
//       stockAlertQuantity,
//       skuCode,
//       regularPrice,
//       costPerItem,
//       discountPrice,
//       unit,
//       colors,
//       deliveryInfo,
//       tags,
//       isFeatured,
//       showOnBanner,
//       rating,
//       additionalInfo,
//       faqs, // ADD THIS
//       metaSettings,
//       images,
//       barcode,
//       videoUrl,
//       videoPublicId,
//       videoType
//     } = req.body;

//     // Check permissions
//     if (!['super_admin', 'admin', 'moderator'].includes(req.user.role)) {
//       return res.status(403).json({ 
//         success: false, 
//         error: 'Permission denied. Only super admins, admins, and moderators can create products.' 
//       });
//     }

//     // Validation
//     if (!productName) {
//       return res.status(400).json({ success: false, error: 'Product name is required' });
//     }
    
//     const existingProduct = await Product.findOne({ 
//       productName: { $regex: new RegExp(`^${productName}$`, 'i') } 
//     });
    
//     if (existingProduct) {
//       return res.status(400).json({ 
//         success: false, 
//         error: `Product name "${productName}" already exists. Please use a different product name.` 
//       });
//     }

//     // Barcode validation
//     if (barcode) {
//       const existingProductWithBarcode = await Product.findOne({ barcode });
//       if (existingProductWithBarcode) {
//         return res.status(400).json({
//           success: false,
//           error: `Barcode "${barcode}" is already assigned to product: ${existingProductWithBarcode.productName}`
//         });
//       }
      
//       const Barcode = require('../models/Barcode');
//       const barcodeDoc = await Barcode.findOne({ barcodeNumber: barcode });
//       if (barcodeDoc && barcodeDoc.status === 'assigned') {
//         return res.status(400).json({
//           success: false,
//           error: `Barcode "${barcode}" is already assigned to another product`
//         });
//       }
      
//       if (!/^[0-9]{8,13}$/.test(barcode)) {
//         return res.status(400).json({
//           success: false,
//           error: 'Barcode must be 8-13 digits only'
//         });
//       }
//     }
    
//     // Validate required fields
//     if (!fullDescription || fullDescription === '<p></p>') {
//       return res.status(400).json({ success: false, error: 'Full description is required' });
//     }
//     if (!category) {
//       return res.status(400).json({ success: false, error: 'Category is required' });
//     }
//     if (!brand) {
//       return res.status(400).json({ success: false, error: 'Brand is required' });
//     }
//     if (regularPrice <= 0) {
//       return res.status(400).json({ success: false, error: 'Regular price must be greater than 0' });
//     }
//     if (discountPrice > regularPrice) {
//       return res.status(400).json({ success: false, error: 'Discount price cannot exceed regular price' });
//     }
//     if (!unit) {
//       return res.status(400).json({ success: false, error: 'Unit is required' });
//     }
//     if (!images || !Array.isArray(images) || images.length === 0) {
//       return res.status(400).json({ success: false, error: 'At least one product image is required' });
//     }

//     // Check if category exists
//     const categoryExists = await Category.findById(category);
//     if (!categoryExists) {
//       return res.status(400).json({ success: false, error: 'Invalid category' });
//     }

//     let categoryName = categoryExists.name;
//     let subcategoryName = '';
//     let childSubcategoryName = '';

//     // Get subcategory name if provided
//     if (subcategory) {
//       const subcategoryDoc = categoryExists.subcategories.id(subcategory);
//       if (subcategoryDoc) {
//         subcategoryName = subcategoryDoc.name;
//       }
//     }

//     // Get child subcategory name if provided
//     if (childSubcategory && subcategory) {
//       const subcategoryDoc = categoryExists.subcategories.id(subcategory);
//       if (subcategoryDoc) {
//         const childDoc = subcategoryDoc.children.id(childSubcategory);
//         if (childDoc) {
//           childSubcategoryName = childDoc.name;
//         }
//       }
//     }

//     // Get brand name from brand ID
//     let brandName = brand;
//     if (brand && mongoose.Types.ObjectId.isValid(brand)) {
//       try {
//         const Brand = require('../models/Brand');
//         const brandDoc = await Brand.findById(brand);
//         if (brandDoc) {
//           brandName = brandDoc.name;
//           console.log(`Brand found: ${brandName} for ID: ${brand}`);
//         } else {
//           console.warn(`Brand not found for ID: ${brand}`);
//           brandName = brand;
//         }
//       } catch (brandError) {
//         console.error('Error fetching brand:', brandError);
//         brandName = brand;
//       }
//     }
//     console.log(`Final brand name: ${brandName}`);

//     // Process images
//     const processedImages = images.map((url, index) => ({
//       url: url,
//       publicId: extractPublicIdFromUrl(url),
//       isPrimary: index === 0
//     }));

//     // Process additional info
//     let processedAdditionalInfo = [];
//     if (additionalInfo && Array.isArray(additionalInfo)) {
//       processedAdditionalInfo = additionalInfo;
//     }

//     // Process FAQs - ADD THIS
//     let processedFaqs = [];
//     if (faqs && Array.isArray(faqs)) {
//       processedFaqs = faqs.filter(faq => 
//         faq.question && faq.question.trim() && 
//         faq.answer && faq.answer.trim()
//       );
//     }

//     // Process meta settings
//     let processedMetaSettings = {};
//     if (metaSettings) {
//       processedMetaSettings = {
//         metaTitle: metaSettings.metaTitle || '',
//         metaDescription: metaSettings.metaDescription || '',
//         metaKeywords: metaSettings.metaKeywords || []
//       };
//     }

//     // Validate tags (only one tag)
//     if (tags && tags.length > 1) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Only one tag can be selected per product' 
//       });
//     }

//     // Create product
//     const product = await Product.create({
//       productName,
//       shortDescription: shortDescription || '',
//       fullDescription,
//       category,
//       categoryName,
//       subcategory: subcategory || null,
//       subcategoryName,
//       childSubcategory: childSubcategory || null,
//       childSubcategoryName,
//       brand: brandName,
//       stockQuantity: stockQuantity || 0,
//       stockAlertQuantity: stockAlertQuantity || 0,
//       regularPrice: Number(regularPrice),
//       costPerItem: costPerItem ? Number(costPerItem) : 0,
//       discountPrice: Number(discountPrice) || 0,
//       unit: unit || 'pcs',
//       colors: colors || [],
//       deliveryInfo: deliveryInfo || '',
//       tags: tags || [],
//       isFeatured: isFeatured || false,
//       showOnBanner: showOnBanner || false,
//       rating: rating || 0,
//       additionalInfo: processedAdditionalInfo,
//       faqs: processedFaqs, // ADD THIS
//       metaSettings: processedMetaSettings,
//       images: processedImages,
//       videoUrl: videoUrl || '',
//       videoPublicId: videoPublicId || '',
//       videoType: videoType || 'upload',
//       barcode: barcode || undefined,
//       skuCode: skuCode || undefined,
//       createdBy: req.user.id,
//       isActive: true
//     });

//     // Prepare embedded product data
//     const embeddedProductData = {
//       productId: product._id,
//       productName: product.productName,
//       slug: product.slug,
//       shortDescription: product.shortDescription,
//       fullDescription: product.fullDescription,
//       brand: product.brand,
//       images: processedImages,
//       regularPrice: product.regularPrice,
//       discountPrice: product.discountPrice,
//       costPerItem: product.costPerItem,
//       stockQuantity: product.stockQuantity,
//       stockAlertQuantity: product.stockAlertQuantity,
//       skuCode: product.skuCode,
//       unit: product.unit,
//       colors: product.colors,
//       deliveryInfo: product.deliveryInfo,
//       tags: product.tags,
//       isFeatured: product.isFeatured,
//       showOnBanner: product.showOnBanner,
//       rating: product.rating,
//       additionalInfo: processedAdditionalInfo,
//       faqs: processedFaqs, // ADD THIS
//       subcategoryId: subcategory || null,
//       subcategoryName: subcategoryName,
//       childSubcategoryId: childSubcategory || null,
//       childSubcategoryName: childSubcategoryName,
//       isActive: true,
//       createdBy: req.user.id,
//       createdAt: new Date(),
//       updatedAt: new Date()
//     };

//     // Add product to category's products array
//     await Category.findByIdAndUpdate(
//       category,
//       {
//         $push: { products: embeddedProductData },
//         $inc: { productCount: 1 }
//       },
//       { new: true }
//     );

//     // If subcategory is selected, increment the subcategory's product count
//     if (subcategory && subcategoryName) {
//       await Category.findOneAndUpdate(
//         { 
//           _id: category,
//           'subcategories._id': subcategory
//         },
//         {
//           $inc: { 'subcategories.$.productCount': 1 }
//         }
//       );
//     }

//     // If child subcategory is selected, increment its product count
//     if (childSubcategory && childSubcategoryName && subcategory) {
//       await Category.findOneAndUpdate(
//         { 
//           _id: category,
//           'subcategories._id': subcategory,
//           'subcategories.children._id': childSubcategory
//         },
//         {
//           $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 }
//         },
//         {
//           arrayFilters: [
//             { 'sub._id': subcategory },
//             { 'child._id': childSubcategory }
//           ]
//         }
//       );
//     }

//     // Populate references for response
//     await product.populate([
//       { path: 'category', select: 'name slug' },
//       { path: 'tags', select: 'name image' },
//       { path: 'createdBy', select: 'name email role' }
//     ]);

//     res.status(201).json({
//       success: true,
//       data: product,
//       message: 'Product created successfully'
//     });
//   } catch (error) {
//     console.error('Create product error:', error);

//     if (error.code === 11000) {
//       if (error.keyPattern && error.keyPattern.slug) {
//         return res.status(400).json({
//           success: false,
//           error: `Product name "${req.body.productName}" already exists. Please use a different product name.`
//         });
//       }
//       if (error.keyPattern && error.keyPattern.skuCode) {
//         return res.status(400).json({
//           success: false,
//           error: `SKU code already exists. Please try again.`
//         });
//       }
//       return res.status(400).json({
//         success: false,
//         error: 'Duplicate entry found. Please check your data and try again.'
//       });
//     }

//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while creating product'
//     });
//   }
// };

// backend/src/controllers/productController.js

// backend/src/controllers/productController.js

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Super Admin/Admin/Moderator)
const createProduct = async (req, res) => {
  try {
    console.log('Create product request received');
    console.log('Body:', req.body);

    const {
      productName,
      shortDescription,
      fullDescription,
      category,
      subcategory,
      childSubcategory,
      brand,
      stockQuantity,
      stockAlertQuantity,
      skuCode,
      regularPrice,
      costPerItem,
      discountPrice,
      unit,
      colors,
      deliveryInfo,
      tags,
      isFeatured,
      showOnBanner,
      rating,
      additionalInfo,
      faqs,
      metaSettings,
      images,
      barcode,
      videoUrl,
      videoPublicId,
      videoType
    } = req.body;

    // Check permissions
    if (!['super_admin', 'admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Permission denied. Only super admins, admins, and moderators can create products.' 
      });
    }

    // Validation
    if (!productName) {
      return res.status(400).json({ success: false, error: 'Product name is required' });
    }
    
    const existingProduct = await Product.findOne({ 
      productName: { $regex: new RegExp(`^${productName}$`, 'i') } 
    });
    
    if (existingProduct) {
      return res.status(400).json({ 
        success: false, 
        error: `Product name "${productName}" already exists. Please use a different product name.` 
      });
    }

    // Barcode validation
    if (barcode) {
      const existingProductWithBarcode = await Product.findOne({ barcode });
      if (existingProductWithBarcode) {
        return res.status(400).json({
          success: false,
          error: `Barcode "${barcode}" is already assigned to product: ${existingProductWithBarcode.productName}`
        });
      }
      
      const Barcode = require('../models/Barcode');
      const barcodeDoc = await Barcode.findOne({ barcodeNumber: barcode });
      if (barcodeDoc && barcodeDoc.status === 'assigned') {
        return res.status(400).json({
          success: false,
          error: `Barcode "${barcode}" is already assigned to another product`
        });
      }
      
      if (!/^[0-9]{8,13}$/.test(barcode)) {
        return res.status(400).json({
          success: false,
          error: 'Barcode must be 8-13 digits only'
        });
      }
    }
    
    // Validate required fields
    if (!fullDescription || fullDescription === '<p></p>') {
      return res.status(400).json({ success: false, error: 'Full description is required' });
    }
    if (!category) {
      return res.status(400).json({ success: false, error: 'Category is required' });
    }
    if (!brand) {
      return res.status(400).json({ success: false, error: 'Brand is required' });
    }
    if (regularPrice <= 0) {
      return res.status(400).json({ success: false, error: 'Regular price must be greater than 0' });
    }
    if (discountPrice > regularPrice) {
      return res.status(400).json({ success: false, error: 'Discount price cannot exceed regular price' });
    }
    if (!unit) {
      return res.status(400).json({ success: false, error: 'Unit is required' });
    }
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one product image is required' });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ success: false, error: 'Invalid category' });
    }

    let categoryName = categoryExists.name;
    let subcategoryName = '';
    let childSubcategoryName = '';

    // Get subcategory name if provided
    if (subcategory) {
      const subcategoryDoc = categoryExists.subcategories.id(subcategory);
      if (subcategoryDoc) {
        subcategoryName = subcategoryDoc.name;
      }
    }

    // Get child subcategory name if provided
    if (childSubcategory && subcategory) {
      const subcategoryDoc = categoryExists.subcategories.id(subcategory);
      if (subcategoryDoc) {
        const childDoc = subcategoryDoc.children.id(childSubcategory);
        if (childDoc) {
          childSubcategoryName = childDoc.name;
        }
      }
    }

    // Get brand name from brand ID
    let brandName = brand;
    if (brand && mongoose.Types.ObjectId.isValid(brand)) {
      try {
        const Brand = require('../models/Brand');
        const brandDoc = await Brand.findById(brand);
        if (brandDoc) {
          brandName = brandDoc.name;
          console.log(`Brand found: ${brandName} for ID: ${brand}`);
        } else {
          console.warn(`Brand not found for ID: ${brand}`);
          brandName = brand;
        }
      } catch (brandError) {
        console.error('Error fetching brand:', brandError);
        brandName = brand;
      }
    }
    console.log(`Final brand name: ${brandName}`);

    // Process images
    const processedImages = images.map((url, index) => ({
      url: url,
      publicId: extractPublicIdFromUrl(url),
      isPrimary: index === 0
    }));

    // Process additional info
    let processedAdditionalInfo = [];
    if (additionalInfo && Array.isArray(additionalInfo)) {
      processedAdditionalInfo = additionalInfo;
    }

    // Process FAQs
    let processedFaqs = [];
    if (faqs && Array.isArray(faqs)) {
      processedFaqs = faqs.filter(faq => 
        faq.question && faq.question.trim() && 
        faq.answer && faq.answer.trim()
      );
    }

    // Process meta settings
    let processedMetaSettings = {};
    if (metaSettings) {
      processedMetaSettings = {
        metaTitle: metaSettings.metaTitle || '',
        metaDescription: metaSettings.metaDescription || '',
        metaKeywords: metaSettings.metaKeywords || []
      };
    }

    // Validate tags (only one tag)
    if (tags && tags.length > 1) {
      return res.status(400).json({ 
        success: false, 
        error: 'Only one tag can be selected per product' 
      });
    }

    // Create product with updatedBy tracking
    const product = await Product.create({
      productName,
      shortDescription: shortDescription || '',
      fullDescription,
      category,
      categoryName,
      subcategory: subcategory || null,
      subcategoryName,
      childSubcategory: childSubcategory || null,
      childSubcategoryName,
      brand: brandName,
      stockQuantity: stockQuantity || 0,
      stockAlertQuantity: stockAlertQuantity || 0,
      regularPrice: Number(regularPrice),
      costPerItem: costPerItem ? Number(costPerItem) : 0,
      discountPrice: Number(discountPrice) || 0,
      unit: unit || 'pcs',
      colors: colors || [],
      deliveryInfo: deliveryInfo || '',
      tags: tags || [],
      isFeatured: isFeatured || false,
      showOnBanner: showOnBanner || false,
      rating: rating || 0,
      additionalInfo: processedAdditionalInfo,
      faqs: processedFaqs,
      metaSettings: processedMetaSettings,
      images: processedImages,
      videoUrl: videoUrl || '',
      videoPublicId: videoPublicId || '',
      videoType: videoType || 'upload',
      barcode: barcode || undefined,
      skuCode: skuCode || undefined,
      createdBy: req.user.id,
      updatedBy: null, // Initially null when product is created
      lastUpdatedAt: null, // Initially null when product is created
      isActive: true
    });

    // Prepare embedded product data
    const embeddedProductData = {
      productId: product._id,
      productName: product.productName,
      slug: product.slug,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      brand: product.brand,
      images: processedImages,
      regularPrice: product.regularPrice,
      discountPrice: product.discountPrice,
      costPerItem: product.costPerItem,
      stockQuantity: product.stockQuantity,
      stockAlertQuantity: product.stockAlertQuantity,
      skuCode: product.skuCode,
      unit: product.unit,
      colors: product.colors,
      deliveryInfo: product.deliveryInfo,
      tags: product.tags,
      isFeatured: product.isFeatured,
      showOnBanner: product.showOnBanner,
      rating: product.rating,
      additionalInfo: processedAdditionalInfo,
      faqs: processedFaqs,
      subcategoryId: subcategory || null,
      subcategoryName: subcategoryName,
      childSubcategoryId: childSubcategory || null,
      childSubcategoryName: childSubcategoryName,
      isActive: true,
      createdBy: req.user.id,
      updatedBy: null,
      lastUpdatedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Add product to category's products array
    await Category.findByIdAndUpdate(
      category,
      {
        $push: { products: embeddedProductData },
        $inc: { productCount: 1 }
      },
      { new: true }
    );

    // If subcategory is selected, increment the subcategory's product count
    if (subcategory && subcategoryName) {
      await Category.findOneAndUpdate(
        { 
          _id: category,
          'subcategories._id': subcategory
        },
        {
          $inc: { 'subcategories.$.productCount': 1 }
        }
      );
    }

    // If child subcategory is selected, increment its product count
    if (childSubcategory && childSubcategoryName && subcategory) {
      await Category.findOneAndUpdate(
        { 
          _id: category,
          'subcategories._id': subcategory,
          'subcategories.children._id': childSubcategory
        },
        {
          $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 }
        },
        {
          arrayFilters: [
            { 'sub._id': subcategory },
            { 'child._id': childSubcategory }
          ]
        }
      );
    }

    // Populate references for response
    await product.populate([
      { path: 'category', select: 'name slug' },
      { path: 'tags', select: 'name image' },
      { path: 'createdBy', select: 'name email role' },
      { path: 'updatedBy', select: 'name email role' }
    ]);

    res.status(201).json({
      success: true,
      data: product,
      message: 'Product created successfully'
    });
  } catch (error) {
    console.error('Create product error:', error);

    if (error.code === 11000) {
      if (error.keyPattern && error.keyPattern.slug) {
        return res.status(400).json({
          success: false,
          error: `Product name "${req.body.productName}" already exists. Please use a different product name.`
        });
      }
      if (error.keyPattern && error.keyPattern.skuCode) {
        return res.status(400).json({
          success: false,
          error: `SKU code already exists. Please try again.`
        });
      }
      return res.status(400).json({
        success: false,
        error: 'Duplicate entry found. Please check your data and try again.'
      });
    }

    res.status(500).json({
      success: false,
      error: error.message || 'Server error while creating product'
    });
  }
};


// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
// const getProducts = async (req, res) => {
//   try {
//     const {
//       page = 1,
//       limit = 12,
//       category,
//       subcategory,
//       childSubcategory,
//       brand,
//       minPrice,
//       maxPrice,
//       tags,
//       isFeatured,
//       showOnBanner,
//       unit,
//       search,
//       sort = '-createdAt',
//       minRating,
//       minStock,
//       maxStock,
//       isActive
//     } = req.query;

//     let query = {};

//     // Only show active products for public users
//     if (isActive === 'false') {
//       query.isActive = false;
//     } else {
//       query.isActive = true;
//     }

//     // Category filter
//     if (category) {
//       query.category = category;
//     }

//     // Subcategory filter
//     if (subcategory) {
//       query.subcategory = subcategory;
//     }

//     // Child subcategory filter
//     if (childSubcategory) {
//       query.childSubcategory = childSubcategory;
//     }

//     // Brand filter
//     if (brand) {
//       query.brand = { $regex: brand, $options: 'i' };
//     }

//     // Price range filter
//     if (minPrice || maxPrice) {
//       query.$or = [
//         { regularPrice: {} },
//         { discountPrice: {} }
//       ];
//       if (minPrice) {
//         query.$or[0].regularPrice.$gte = parseFloat(minPrice);
//         query.$or[1].discountPrice.$gte = parseFloat(minPrice);
//       }
//       if (maxPrice) {
//         query.$or[0].regularPrice.$lte = parseFloat(maxPrice);
//         query.$or[1].discountPrice.$lte = parseFloat(maxPrice);
//       }
//     }

//     // Tags filter
//     if (tags) {
//       const tagArray = Array.isArray(tags) ? tags : [tags];
//       query.tags = { $in: tagArray };
//     }

//     // Featured filter
//     if (isFeatured === 'true') {
//       query.isFeatured = true;
//     }

//     // Show on banner filter
//     if (showOnBanner === 'true') {
//       query.showOnBanner = true;
//     }

//     // Unit filter
//     if (unit) {
//       query.unit = unit;
//     }

//     // Rating filter
//     if (minRating) {
//       query.rating = { $gte: parseFloat(minRating) };
//     }

//     // Stock range filter
//     if (minStock) {
//       query.stockQuantity = { $gte: parseFloat(minStock) };
//     }
//     if (maxStock) {
//       query.stockQuantity = { ...query.stockQuantity, $lte: parseFloat(maxStock) };
//     }

//     // Search filter
//     if (search && search.trim()) {
//       const searchTerm = search.trim();
//       const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
//       query.$or = [
//         { productName: regex },
//         { brand: regex },
//         { fullDescription: regex },
//         { skuCode: regex },
//         { barcode: regex }
//       ];
//     }

//     // Sort options
//     let sortOption = {};
//     switch (sort) {
//       case 'price_asc':
//         sortOption = { regularPrice: 1 };
//         break;
//       case 'price_desc':
//         sortOption = { regularPrice: -1 };
//         break;
//       case 'rating_desc':
//         sortOption = { rating: -1 };
//         break;
//       case 'name_asc':
//         sortOption = { productName: 1 };
//         break;
//       case 'newest':
//         sortOption = { createdAt: -1 };
//         break;
//       case 'popular':
//         sortOption = { purchaseCount: -1 };
//         break;
//       default:
//         sortOption = { createdAt: -1 };
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [products, total] = await Promise.all([
//       Product.find(query)
//         .populate('category', 'name slug')
//         .populate('tags', 'name image')
//         .sort(sortOption)
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Product.countDocuments(query)
//     ]);

//     res.json({
//       success: true,
//       data: products,
//       pagination: {
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         limit: parseInt(limit)
//       }
//     });
//   } catch (error) {
//     console.error('Get products error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching products'
//     });
//   }
// };
// backend/src/controllers/productController.js

// @desc    Get all products with filters
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      childSubcategory,
      brand,
      minPrice,
      maxPrice,
      tags,
      isFeatured,
      showOnBanner,
      unit,
      search,
      sort = '-createdAt',
      minRating,
      minStock,
      maxStock,
      isActive
    } = req.query;

    let query = {};

    // Only show active products for public users
    if (isActive === 'false') {
      query.isActive = false;
    } else {
      query.isActive = true;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Subcategory filter
    if (subcategory) {
      query.subcategory = subcategory;
    }

    // Child subcategory filter
    if (childSubcategory) {
      query.childSubcategory = childSubcategory;
    }

    // Brand filter
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.$or = [
        { regularPrice: {} },
        { discountPrice: {} }
      ];
      if (minPrice) {
        query.$or[0].regularPrice.$gte = parseFloat(minPrice);
        query.$or[1].discountPrice.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.$or[0].regularPrice.$lte = parseFloat(maxPrice);
        query.$or[1].discountPrice.$lte = parseFloat(maxPrice);
      }
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Featured filter
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // Show on banner filter
    if (showOnBanner === 'true') {
      query.showOnBanner = true;
    }

    // Unit filter
    if (unit) {
      query.unit = unit;
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Stock range filter
    if (minStock) {
      query.stockQuantity = { $gte: parseFloat(minStock) };
    }
    if (maxStock) {
      query.stockQuantity = { ...query.stockQuantity, $lte: parseFloat(maxStock) };
    }

    // Search filter
    if (search && search.trim()) {
      const searchTerm = search.trim();
      const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { productName: regex },
        { brand: regex },
        { fullDescription: regex },
        { skuCode: regex },
        { barcode: regex }
      ];
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { regularPrice: 1 };
        break;
      case 'price_desc':
        sortOption = { regularPrice: -1 };
        break;
      case 'rating_desc':
        sortOption = { rating: -1 };
        break;
      case 'name_asc':
        sortOption = { productName: 1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { purchaseCount: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('tags', 'name image')
        .populate('createdBy', 'name email role')
        .populate('updatedBy', 'name email role') // ADD THIS - Populate updatedBy
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching products'
    });
  }
};

// @desc    Get all products for Admin/Moderator (including inactive)
// @route   GET /api/products/admin/all
// @access  Private (Super Admin/Admin/Moderator)
const getAdminProducts = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      subcategory,
      childSubcategory,
      brand,
      minPrice,
      maxPrice,
      tags,
      isFeatured,
      showOnBanner,
      unit,
      search,
      sort = '-createdAt',
      minRating,
      minStock,
      maxStock,
      isActive
    } = req.query;

    let query = {};

    // Only apply isActive filter if explicitly requested by admin
    if (isActive === 'true') {
      query.isActive = true;
    } else if (isActive === 'false') {
      query.isActive = false;
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Subcategory filter
    if (subcategory) {
      query.subcategory = subcategory;
    }

    // Child subcategory filter
    if (childSubcategory) {
      query.childSubcategory = childSubcategory;
    }

    // Brand filter
    if (brand) {
      query.brand = { $regex: brand, $options: 'i' };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.$or = [
        { regularPrice: {} },
        { discountPrice: {} }
      ];
      if (minPrice) {
        query.$or[0].regularPrice.$gte = parseFloat(minPrice);
        query.$or[1].discountPrice.$gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        query.$or[0].regularPrice.$lte = parseFloat(maxPrice);
        query.$or[1].discountPrice.$lte = parseFloat(maxPrice);
      }
    }

    // Tags filter
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Featured filter
    if (isFeatured === 'true') {
      query.isFeatured = true;
    }

    // Show on banner filter
    if (showOnBanner === 'true') {
      query.showOnBanner = true;
    }

    // Unit filter
    if (unit) {
      query.unit = unit;
    }

    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }

    // Stock range filter
    if (minStock) {
      query.stockQuantity = { $gte: parseFloat(minStock) };
    }
    if (maxStock) {
      query.stockQuantity = { ...query.stockQuantity, $lte: parseFloat(maxStock) };
    }

    // Search filter
    if (search && search.trim()) {
      const searchTerm = search.trim();
      const regex = new RegExp(searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
      query.$or = [
        { productName: regex },
        { brand: regex },
        { fullDescription: regex },
        { skuCode: regex },
        { barcode: regex }
      ];
    }

    // Sort options
    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { regularPrice: 1 };
        break;
      case 'price_desc':
        sortOption = { regularPrice: -1 };
        break;
      case 'rating_desc':
        sortOption = { rating: -1 };
        break;
      case 'name_asc':
        sortOption = { productName: 1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'popular':
        sortOption = { purchaseCount: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .populate('tags', 'name image')
        .sort(sortOption)
        .skip(skip)
        .limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get admin products error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching products'
    });
  }
};

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
// const getProductById = async (req, res) => {
//   try {
//     const { id } = req.params;
    
//     const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
//     const query = isObjectId ? { _id: id } : { slug: id };

//     const product = await Product.findOne(query)
//       .populate('category', 'name slug')
//       .populate('tags', 'name image')
//       .populate('createdBy', 'name email');

//     if (!product) {
//       return res.status(404).json({
//         success: false,
//         error: 'Product not found'
//       });
//     }

//     // Increment view count
//     product.views += 1;
//     await product.save();

//     // Get related products (same category)
//     const relatedProducts = await Product.find({
//       category: product.category,
//       _id: { $ne: product._id },
//       isActive: true
//     })
//       .limit(8)
//       .populate('category', 'name slug')
//       .populate('tags', 'name image')
//       .select('productName slug regularPrice discountPrice images rating stockQuantity tags category categoryName subcategoryName childSubcategoryName brand unit');

//     res.json({
//       success: true,
//       data: {
//         product,
//         relatedProducts
//       }
//     });
//   } catch (error) {
//     console.error('Get product error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching product'
//     });
//   }
// };

// backend/src/controllers/productController.js

// backend/src/controllers/productController.js

// @desc    Get single product by ID or slug
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    const query = isObjectId ? { _id: id } : { slug: id };

    const product = await Product.findOne(query)
      .populate('category', 'name slug')
      .populate('tags', 'name image')
      .populate('createdBy', 'name email role')
      .populate('updatedBy', 'name email role'); // ADD THIS - Populate updatedBy

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Increment view count
    product.views += 1;
    await product.save();

    // Get related products (same category)
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true
    })
      .limit(8)
      .populate('category', 'name slug')
      .populate('tags', 'name image')
      .select('productName slug regularPrice discountPrice images rating stockQuantity tags category categoryName subcategoryName childSubcategoryName brand unit');

    res.json({
      success: true,
      data: {
        product,
        relatedProducts
      }
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching product'
    });
  }
};



// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Super Admin/Admin/Moderator)
// const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       return res.status(404).json({ success: false, error: 'Product not found' });
//     }

//     // Check permissions - allow super_admin, admin, and moderator
//     if (!['super_admin', 'admin', 'moderator'].includes(req.user.role)) {
//       return res.status(403).json({ 
//         success: false, 
//         error: 'Permission denied. Only super admins, admins, and moderators can update products.' 
//       });
//     }

//     const {
//       productName,
//       shortDescription,
//       fullDescription,
//       category,
//       subcategory,
//       childSubcategory,
//       brand,
//       stockQuantity,
//       stockAlertQuantity,
//       skuCode,
//       regularPrice,
//       costPerItem,
//       discountPrice,
//       unit,
//       colors,
//       deliveryInfo,
//       tags,
//       isFeatured,
//       showOnBanner,
//       rating,
//       additionalInfo,
//       faqs, // ADD THIS
//       metaSettings,
//       images,
//       barcode,
//       videoUrl,
//       videoPublicId,
//       videoType
//     } = req.body;

//     // ============================================
//     // FIX: Get brand name from brand ID
//     // ============================================
//     let brandName = brand;
//     // If brand is an ObjectId (from selection), get the brand name
//     if (brand && mongoose.Types.ObjectId.isValid(brand)) {
//       try {
//         const Brand = require('../models/Brand');
//         const brandDoc = await Brand.findById(brand);
//         if (brandDoc) {
//           brandName = brandDoc.name;
//           console.log(`Brand found: ${brandName} for ID: ${brand}`);
//         } else {
//           console.warn(`Brand not found for ID: ${brand}`);
//           brandName = brand;
//         }
//       } catch (brandError) {
//         console.error('Error fetching brand:', brandError);
//         brandName = brand;
//       }
//     }
//     console.log(`Final brand name: ${brandName}`);

//     // Store old values for count updates
//     const oldCategory = product.category.toString();
//     const oldSubcategoryId = product.subcategory ? product.subcategory.toString() : null;
//     const oldChildSubcategoryId = product.childSubcategory ? product.childSubcategory.toString() : null;
    
//     const newCategory = category || oldCategory;
//     let newSubcategoryId = subcategory || null;
//     let newSubcategoryName = '';
//     let newChildSubcategoryId = childSubcategory || null;
//     let newChildSubcategoryName = '';

//     // Handle category change validation
//     if (category && category !== oldCategory) {
//       const categoryExists = await Category.findById(category);
//       if (!categoryExists) {
//         return res.status(400).json({ success: false, error: 'Invalid category' });
//       }
//     }

//     // Get subcategory names if provided
//     if (newSubcategoryId) {
//       const categoryDoc = await Category.findById(newCategory);
//       if (categoryDoc) {
//         const subcategoryDoc = categoryDoc.subcategories.id(newSubcategoryId);
//         if (subcategoryDoc) {
//           newSubcategoryName = subcategoryDoc.name;
          
//           if (newChildSubcategoryId) {
//             const childDoc = subcategoryDoc.children.id(newChildSubcategoryId);
//             if (childDoc) {
//               newChildSubcategoryName = childDoc.name;
//             }
//           }
//         }
//       }
//     }

//     // Process images if provided
//     let processedImages = product.images;
//     if (images && Array.isArray(images) && images.length > 0) {
//       processedImages = images.map((url, index) => ({
//         url: url,
//         publicId: extractPublicIdFromUrl(url),
//         isPrimary: index === 0
//       }));
//     }

//     // Process additional info
//     let processedAdditionalInfo = product.additionalInfo;
//     if (additionalInfo && Array.isArray(additionalInfo)) {
//       processedAdditionalInfo = additionalInfo;
//     }

//     // ============================================
//     // Process FAQs - ADD THIS
//     // ============================================
//     let processedFaqs = product.faqs || [];
//     if (faqs !== undefined) {
//       if (Array.isArray(faqs)) {
//         processedFaqs = faqs.filter(faq => 
//           faq.question && faq.question.trim() && 
//           faq.answer && faq.answer.trim()
//         );
//       } else {
//         processedFaqs = [];
//       }
//     }

//     // Process meta settings
//     let processedMetaSettings = product.metaSettings;
//     if (metaSettings) {
//       processedMetaSettings = {
//         metaTitle: metaSettings.metaTitle || product.metaSettings?.metaTitle || '',
//         metaDescription: metaSettings.metaDescription || product.metaSettings?.metaDescription || '',
//         metaKeywords: metaSettings.metaKeywords || product.metaSettings?.metaKeywords || []
//       };
//     }

//     // Validate tags (only one tag)
//     if (tags && tags.length > 1) {
//       return res.status(400).json({ 
//         success: false, 
//         error: 'Only one tag can be selected per product' 
//       });
//     }

//     // Update product fields
//     if (productName) product.productName = productName;
//     if (shortDescription !== undefined) product.shortDescription = shortDescription || '';
//     if (fullDescription && fullDescription !== '<p></p>') product.fullDescription = fullDescription;
//     if (brandName) product.brand = brandName; // Store brand name
//     if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
//     if (stockAlertQuantity !== undefined) product.stockAlertQuantity = stockAlertQuantity || 0;
//     if (skuCode) product.skuCode = skuCode;
//     if (regularPrice !== undefined) product.regularPrice = regularPrice;
//     if (costPerItem !== undefined) product.costPerItem = costPerItem || 0;
//     if (discountPrice !== undefined) product.discountPrice = discountPrice;
//     if (unit) product.unit = unit;
//     if (colors !== undefined) product.colors = colors || [];
//     if (deliveryInfo !== undefined) product.deliveryInfo = deliveryInfo || '';
//     if (tags) product.tags = tags;
//     if (isFeatured !== undefined) product.isFeatured = isFeatured;
//     if (showOnBanner !== undefined) product.showOnBanner = showOnBanner;
//     if (rating !== undefined) product.rating = rating;
//     if (additionalInfo) product.additionalInfo = processedAdditionalInfo;
//     if (faqs !== undefined) product.faqs = processedFaqs; // ADD THIS
//     if (metaSettings) product.metaSettings = processedMetaSettings;
//     if (images && Array.isArray(images) && images.length > 0) product.images = processedImages;
//     if (videoUrl !== undefined) product.videoUrl = videoUrl || '';
//     if (videoPublicId !== undefined) product.videoPublicId = videoPublicId || '';
//     if (videoType !== undefined) product.videoType = videoType || 'upload';
    
//     // Handle barcode update
//     if (barcode !== undefined) {
//       const Barcode = mongoose.model('Barcode');
//       const oldBarcode = product.barcode;
      
//       if (barcode === '') {
//         if (oldBarcode) {
//           const barcodeDoc = await Barcode.findOne({ barcodeNumber: oldBarcode });
//           if (barcodeDoc) {
//             barcodeDoc.productId = null;
//             barcodeDoc.productSku = '';
//             barcodeDoc.productName = '';
//             barcodeDoc.status = 'available';
//             await barcodeDoc.save();
//           }
//         }
//         product.barcode = undefined;
//       } else if (barcode !== oldBarcode) {
//         const existingProductWithBarcode = await Product.findOne({ 
//           barcode: barcode,
//           _id: { $ne: product._id }
//         });
//         if (existingProductWithBarcode) {
//           return res.status(400).json({
//             success: false,
//             error: `Barcode "${barcode}" is already assigned to product: ${existingProductWithBarcode.productName}`
//           });
//         }
        
//         if (oldBarcode) {
//           const oldBarcodeDoc = await Barcode.findOne({ barcodeNumber: oldBarcode });
//           if (oldBarcodeDoc) {
//             oldBarcodeDoc.productId = null;
//             oldBarcodeDoc.productSku = '';
//             oldBarcodeDoc.productName = '';
//             oldBarcodeDoc.status = 'available';
//             await oldBarcodeDoc.save();
//           }
//         }
        
//         let barcodeDoc = await Barcode.findOne({ barcodeNumber: barcode });
//         if (barcodeDoc) {
//           barcodeDoc.productId = product._id;
//           barcodeDoc.productSku = product.skuCode;
//           barcodeDoc.productName = product.productName;
//           barcodeDoc.status = 'assigned';
//           await barcodeDoc.save();
//         } else {
//           const { generateAndUploadBarcodeImage } = require('../utils/generateBarcodeImage');
//           let barcodeImageUrl = '';
          
//           try {
//             const result = await generateAndUploadBarcodeImage(barcode);
//             barcodeImageUrl = result.url;
//           } catch (imgError) {
//             console.error('Failed to generate barcode image:', imgError);
//           }
          
//           barcodeDoc = await Barcode.create({
//             barcodeNumber: barcode,
//             format: 'CODE-128',
//             productId: product._id,
//             productSku: product.skuCode,
//             productName: product.productName,
//             status: 'assigned',
//             generatedBy: req.user.id,
//             barcodeImageUrl: barcodeImageUrl,
//             metadata: {
//               sequence: parseInt(barcode.slice(1, 9)) || 0
//             }
//           });
//         }
//         product.barcode = barcode;
//       }
//     }

//     // Update category if changed
//     if (category && category !== oldCategory) {
//       product.category = category;
//       const categoryExists = await Category.findById(category);
//       if (categoryExists) {
//         product.categoryName = categoryExists.name;
//       }
//       product.subcategory = newSubcategoryId;
//       product.subcategoryName = newSubcategoryName;
//       product.childSubcategory = newChildSubcategoryId;
//       product.childSubcategoryName = newChildSubcategoryName;
//     } else {
//       if (subcategory !== undefined) {
//         product.subcategory = newSubcategoryId;
//         product.subcategoryName = newSubcategoryName;
//       }
//       if (childSubcategory !== undefined) {
//         product.childSubcategory = newChildSubcategoryId;
//         product.childSubcategoryName = newChildSubcategoryName;
//       }
//     }

//     await product.save();

//     // Prepare data for embedded product update
//     const embeddedUpdateData = {
//       productName: product.productName,
//       shortDescription: product.shortDescription,
//       fullDescription: product.fullDescription,
//       brand: product.brand,
//       images: processedImages,
//       regularPrice: product.regularPrice,
//       discountPrice: product.discountPrice,
//       costPerItem: product.costPerItem,
//       stockQuantity: product.stockQuantity,
//       stockAlertQuantity: product.stockAlertQuantity,
//       skuCode: product.skuCode,
//       unit: product.unit,
//       colors: product.colors,
//       deliveryInfo: product.deliveryInfo,
//       tags: product.tags,
//       isFeatured: product.isFeatured,
//       showOnBanner: product.showOnBanner,
//       rating: product.rating,
//       additionalInfo: processedAdditionalInfo,
//       faqs: processedFaqs, // ADD THIS
//       subcategoryId: product.subcategory,
//       subcategoryName: product.subcategoryName,
//       childSubcategoryId: product.childSubcategory,
//       childSubcategoryName: product.childSubcategoryName,
//       isActive: product.isActive,
//       updatedAt: new Date()
//     };

//     // Handle category change
//     if (category && category !== oldCategory) {
//       await Category.findByIdAndUpdate(
//         oldCategory,
//         {
//           $pull: { products: { productId: product._id } },
//           $inc: { productCount: -1 }
//         }
//       );
      
//       if (oldSubcategoryId) {
//         await Category.findOneAndUpdate(
//           { 
//             _id: oldCategory,
//             'subcategories._id': oldSubcategoryId
//           },
//           { $inc: { 'subcategories.$.productCount': -1 } }
//         );
//       }
      
//       if (oldChildSubcategoryId && oldSubcategoryId) {
//         await Category.findOneAndUpdate(
//           { 
//             _id: oldCategory,
//             'subcategories._id': oldSubcategoryId,
//             'subcategories.children._id': oldChildSubcategoryId
//           },
//           { $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 } },
//           {
//             arrayFilters: [
//               { 'sub._id': oldSubcategoryId },
//               { 'child._id': oldChildSubcategoryId }
//             ]
//           }
//         );
//       }
      
//       const newEmbeddedProduct = {
//         productId: product._id,
//         ...embeddedUpdateData,
//         createdBy: req.user.id,
//         createdAt: product.createdAt
//       };
      
//       await Category.findByIdAndUpdate(
//         newCategory,
//         {
//           $push: { products: newEmbeddedProduct },
//           $inc: { productCount: 1 }
//         }
//       );
      
//       if (newSubcategoryId) {
//         await Category.findOneAndUpdate(
//           { 
//             _id: newCategory,
//             'subcategories._id': newSubcategoryId
//           },
//           { $inc: { 'subcategories.$.productCount': 1 } }
//         );
//       }
      
//       if (newChildSubcategoryId && newSubcategoryId) {
//         await Category.findOneAndUpdate(
//           { 
//             _id: newCategory,
//             'subcategories._id': newSubcategoryId,
//             'subcategories.children._id': newChildSubcategoryId
//           },
//           { $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 } },
//           {
//             arrayFilters: [
//               { 'sub._id': newSubcategoryId },
//               { 'child._id': newChildSubcategoryId }
//             ]
//           }
//         );
//       }
//     } else {
//       await updateEmbeddedProductInCategory(oldCategory, product._id, embeddedUpdateData);
      
//       if (oldSubcategoryId !== newSubcategoryId) {
//         if (oldSubcategoryId) {
//           await Category.findOneAndUpdate(
//             { 
//               _id: oldCategory,
//               'subcategories._id': oldSubcategoryId
//             },
//             { $inc: { 'subcategories.$.productCount': -1 } }
//           );
//         }
//         if (newSubcategoryId) {
//           await Category.findOneAndUpdate(
//             { 
//               _id: oldCategory,
//               'subcategories._id': newSubcategoryId
//             },
//             { $inc: { 'subcategories.$.productCount': 1 } }
//           );
//         }
//       }
      
//       if (oldChildSubcategoryId !== newChildSubcategoryId) {
//         if (oldChildSubcategoryId && oldSubcategoryId) {
//           await Category.findOneAndUpdate(
//             { 
//               _id: oldCategory,
//               'subcategories._id': oldSubcategoryId,
//               'subcategories.children._id': oldChildSubcategoryId
//             },
//             { $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 } },
//             {
//               arrayFilters: [
//                 { 'sub._id': oldSubcategoryId },
//                 { 'child._id': oldChildSubcategoryId }
//               ]
//             }
//           );
//         }
//         if (newChildSubcategoryId && newSubcategoryId) {
//           await Category.findOneAndUpdate(
//             { 
//               _id: oldCategory,
//               'subcategories._id': newSubcategoryId,
//               'subcategories.children._id': newChildSubcategoryId
//             },
//             { $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 } },
//             {
//               arrayFilters: [
//                 { 'sub._id': newSubcategoryId },
//                 { 'child._id': newChildSubcategoryId }
//               ]
//             }
//           );
//         }
//       }
//     }

//     // Populate references for response
//     await product.populate([
//       { path: 'category', select: 'name slug' },
//       { path: 'tags', select: 'name image' },
//       { path: 'createdBy', select: 'name email role' }
//     ]);

//     res.json({
//       success: true,
//       data: product,
//       message: 'Product updated successfully'
//     });
//   } catch (error) {
//     console.error('Update product error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while updating product'
//     });
//   }
// };



// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Super Admin/Admin/Moderator)
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Check permissions - allow super_admin, admin, and moderator
    if (!['super_admin', 'admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Permission denied. Only super admins, admins, and moderators can update products.' 
      });
    }

    const {
      productName,
      shortDescription,
      fullDescription,
      category,
      subcategory,
      childSubcategory,
      brand,
      stockQuantity,
      stockAlertQuantity,
      skuCode,
      regularPrice,
      costPerItem,
      discountPrice,
      unit,
      colors,
      deliveryInfo,
      tags,
      isFeatured,
      showOnBanner,
      rating,
      additionalInfo,
      faqs,
      metaSettings,
      images,
      barcode,
      videoUrl,
      videoPublicId,
      videoType
    } = req.body;

    // Get brand name from brand ID
    let brandName = brand;
    if (brand && mongoose.Types.ObjectId.isValid(brand)) {
      try {
        const Brand = require('../models/Brand');
        const brandDoc = await Brand.findById(brand);
        if (brandDoc) {
          brandName = brandDoc.name;
          console.log(`Brand found: ${brandName} for ID: ${brand}`);
        } else {
          console.warn(`Brand not found for ID: ${brand}`);
          brandName = brand;
        }
      } catch (brandError) {
        console.error('Error fetching brand:', brandError);
        brandName = brand;
      }
    }
    console.log(`Final brand name: ${brandName}`);

    // Store old values for count updates
    const oldCategory = product.category.toString();
    const oldSubcategoryId = product.subcategory ? product.subcategory.toString() : null;
    const oldChildSubcategoryId = product.childSubcategory ? product.childSubcategory.toString() : null;
    
    const newCategory = category || oldCategory;
    let newSubcategoryId = subcategory || null;
    let newSubcategoryName = '';
    let newChildSubcategoryId = childSubcategory || null;
    let newChildSubcategoryName = '';

    // Handle category change validation
    if (category && category !== oldCategory) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(400).json({ success: false, error: 'Invalid category' });
      }
    }

    // Get subcategory names if provided
    if (newSubcategoryId) {
      const categoryDoc = await Category.findById(newCategory);
      if (categoryDoc) {
        const subcategoryDoc = categoryDoc.subcategories.id(newSubcategoryId);
        if (subcategoryDoc) {
          newSubcategoryName = subcategoryDoc.name;
          
          if (newChildSubcategoryId) {
            const childDoc = subcategoryDoc.children.id(newChildSubcategoryId);
            if (childDoc) {
              newChildSubcategoryName = childDoc.name;
            }
          }
        }
      }
    }

    // Process images if provided
    let processedImages = product.images;
    if (images && Array.isArray(images) && images.length > 0) {
      processedImages = images.map((url, index) => ({
        url: url,
        publicId: extractPublicIdFromUrl(url),
        isPrimary: index === 0
      }));
    }

    // Process additional info
    let processedAdditionalInfo = product.additionalInfo;
    if (additionalInfo && Array.isArray(additionalInfo)) {
      processedAdditionalInfo = additionalInfo;
    }

    // Process FAQs
    let processedFaqs = product.faqs || [];
    if (faqs !== undefined) {
      if (Array.isArray(faqs)) {
        processedFaqs = faqs.filter(faq => 
          faq.question && faq.question.trim() && 
          faq.answer && faq.answer.trim()
        );
      } else {
        processedFaqs = [];
      }
    }

    // Process meta settings
    let processedMetaSettings = product.metaSettings;
    if (metaSettings) {
      processedMetaSettings = {
        metaTitle: metaSettings.metaTitle || product.metaSettings?.metaTitle || '',
        metaDescription: metaSettings.metaDescription || product.metaSettings?.metaDescription || '',
        metaKeywords: metaSettings.metaKeywords || product.metaSettings?.metaKeywords || []
      };
    }

    // Validate tags (only one tag)
    if (tags && tags.length > 1) {
      return res.status(400).json({ 
        success: false, 
        error: 'Only one tag can be selected per product' 
      });
    }

    // Update product fields
    if (productName) product.productName = productName;
    if (shortDescription !== undefined) product.shortDescription = shortDescription || '';
    if (fullDescription && fullDescription !== '<p></p>') product.fullDescription = fullDescription;
    if (brandName) product.brand = brandName;
    if (stockQuantity !== undefined) product.stockQuantity = stockQuantity;
    if (stockAlertQuantity !== undefined) product.stockAlertQuantity = stockAlertQuantity || 0;
    if (skuCode) product.skuCode = skuCode;
    if (regularPrice !== undefined) product.regularPrice = regularPrice;
    if (costPerItem !== undefined) product.costPerItem = costPerItem || 0;
    if (discountPrice !== undefined) product.discountPrice = discountPrice;
    if (unit) product.unit = unit;
    if (colors !== undefined) product.colors = colors || [];
    if (deliveryInfo !== undefined) product.deliveryInfo = deliveryInfo || '';
    if (tags) product.tags = tags;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (showOnBanner !== undefined) product.showOnBanner = showOnBanner;
    if (rating !== undefined) product.rating = rating;
    if (additionalInfo) product.additionalInfo = processedAdditionalInfo;
    if (faqs !== undefined) product.faqs = processedFaqs;
    if (metaSettings) product.metaSettings = processedMetaSettings;
    if (images && Array.isArray(images) && images.length > 0) product.images = processedImages;
    if (videoUrl !== undefined) product.videoUrl = videoUrl || '';
    if (videoPublicId !== undefined) product.videoPublicId = videoPublicId || '';
    if (videoType !== undefined) product.videoType = videoType || 'upload';
    
    // ============================================
    // UPDATED BY TRACKING - Set updatedBy and lastUpdatedAt
    // ============================================
    product.updatedBy = req.user.id;
    product.lastUpdatedAt = new Date();
    
    // Handle barcode update
    if (barcode !== undefined) {
      const Barcode = mongoose.model('Barcode');
      const oldBarcode = product.barcode;
      
      if (barcode === '') {
        if (oldBarcode) {
          const barcodeDoc = await Barcode.findOne({ barcodeNumber: oldBarcode });
          if (barcodeDoc) {
            barcodeDoc.productId = null;
            barcodeDoc.productSku = '';
            barcodeDoc.productName = '';
            barcodeDoc.status = 'available';
            await barcodeDoc.save();
          }
        }
        product.barcode = undefined;
      } else if (barcode !== oldBarcode) {
        const existingProductWithBarcode = await Product.findOne({ 
          barcode: barcode,
          _id: { $ne: product._id }
        });
        if (existingProductWithBarcode) {
          return res.status(400).json({
            success: false,
            error: `Barcode "${barcode}" is already assigned to product: ${existingProductWithBarcode.productName}`
          });
        }
        
        if (oldBarcode) {
          const oldBarcodeDoc = await Barcode.findOne({ barcodeNumber: oldBarcode });
          if (oldBarcodeDoc) {
            oldBarcodeDoc.productId = null;
            oldBarcodeDoc.productSku = '';
            oldBarcodeDoc.productName = '';
            oldBarcodeDoc.status = 'available';
            await oldBarcodeDoc.save();
          }
        }
        
        let barcodeDoc = await Barcode.findOne({ barcodeNumber: barcode });
        if (barcodeDoc) {
          barcodeDoc.productId = product._id;
          barcodeDoc.productSku = product.skuCode;
          barcodeDoc.productName = product.productName;
          barcodeDoc.status = 'assigned';
          await barcodeDoc.save();
        } else {
          const { generateAndUploadBarcodeImage } = require('../utils/generateBarcodeImage');
          let barcodeImageUrl = '';
          
          try {
            const result = await generateAndUploadBarcodeImage(barcode);
            barcodeImageUrl = result.url;
          } catch (imgError) {
            console.error('Failed to generate barcode image:', imgError);
          }
          
          barcodeDoc = await Barcode.create({
            barcodeNumber: barcode,
            format: 'CODE-128',
            productId: product._id,
            productSku: product.skuCode,
            productName: product.productName,
            status: 'assigned',
            generatedBy: req.user.id,
            barcodeImageUrl: barcodeImageUrl,
            metadata: {
              sequence: parseInt(barcode.slice(1, 9)) || 0
            }
          });
        }
        product.barcode = barcode;
      }
    }

    // Update category if changed
    if (category && category !== oldCategory) {
      product.category = category;
      const categoryExists = await Category.findById(category);
      if (categoryExists) {
        product.categoryName = categoryExists.name;
      }
      product.subcategory = newSubcategoryId;
      product.subcategoryName = newSubcategoryName;
      product.childSubcategory = newChildSubcategoryId;
      product.childSubcategoryName = newChildSubcategoryName;
    } else {
      if (subcategory !== undefined) {
        product.subcategory = newSubcategoryId;
        product.subcategoryName = newSubcategoryName;
      }
      if (childSubcategory !== undefined) {
        product.childSubcategory = newChildSubcategoryId;
        product.childSubcategoryName = newChildSubcategoryName;
      }
    }

    await product.save();

    // Prepare data for embedded product update
    const embeddedUpdateData = {
      productName: product.productName,
      shortDescription: product.shortDescription,
      fullDescription: product.fullDescription,
      brand: product.brand,
      images: processedImages,
      regularPrice: product.regularPrice,
      discountPrice: product.discountPrice,
      costPerItem: product.costPerItem,
      stockQuantity: product.stockQuantity,
      stockAlertQuantity: product.stockAlertQuantity,
      skuCode: product.skuCode,
      unit: product.unit,
      colors: product.colors,
      deliveryInfo: product.deliveryInfo,
      tags: product.tags,
      isFeatured: product.isFeatured,
      showOnBanner: product.showOnBanner,
      rating: product.rating,
      additionalInfo: processedAdditionalInfo,
      faqs: processedFaqs,
      subcategoryId: product.subcategory,
      subcategoryName: product.subcategoryName,
      childSubcategoryId: product.childSubcategory,
      childSubcategoryName: product.childSubcategoryName,
      isActive: product.isActive,
      updatedBy: req.user.id, // ADD THIS - Track who updated
      lastUpdatedAt: new Date(), // ADD THIS - Track when updated
      updatedAt: new Date()
    };

    // Handle category change
    if (category && category !== oldCategory) {
      await Category.findByIdAndUpdate(
        oldCategory,
        {
          $pull: { products: { productId: product._id } },
          $inc: { productCount: -1 }
        }
      );
      
      if (oldSubcategoryId) {
        await Category.findOneAndUpdate(
          { 
            _id: oldCategory,
            'subcategories._id': oldSubcategoryId
          },
          { $inc: { 'subcategories.$.productCount': -1 } }
        );
      }
      
      if (oldChildSubcategoryId && oldSubcategoryId) {
        await Category.findOneAndUpdate(
          { 
            _id: oldCategory,
            'subcategories._id': oldSubcategoryId,
            'subcategories.children._id': oldChildSubcategoryId
          },
          { $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 } },
          {
            arrayFilters: [
              { 'sub._id': oldSubcategoryId },
              { 'child._id': oldChildSubcategoryId }
            ]
          }
        );
      }
      
      const newEmbeddedProduct = {
        productId: product._id,
        ...embeddedUpdateData,
        createdBy: req.user.id,
        createdAt: product.createdAt
      };
      
      await Category.findByIdAndUpdate(
        newCategory,
        {
          $push: { products: newEmbeddedProduct },
          $inc: { productCount: 1 }
        }
      );
      
      if (newSubcategoryId) {
        await Category.findOneAndUpdate(
          { 
            _id: newCategory,
            'subcategories._id': newSubcategoryId
          },
          { $inc: { 'subcategories.$.productCount': 1 } }
        );
      }
      
      if (newChildSubcategoryId && newSubcategoryId) {
        await Category.findOneAndUpdate(
          { 
            _id: newCategory,
            'subcategories._id': newSubcategoryId,
            'subcategories.children._id': newChildSubcategoryId
          },
          { $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 } },
          {
            arrayFilters: [
              { 'sub._id': newSubcategoryId },
              { 'child._id': newChildSubcategoryId }
            ]
          }
        );
      }
    } else {
      await updateEmbeddedProductInCategory(oldCategory, product._id, embeddedUpdateData);
      
      if (oldSubcategoryId !== newSubcategoryId) {
        if (oldSubcategoryId) {
          await Category.findOneAndUpdate(
            { 
              _id: oldCategory,
              'subcategories._id': oldSubcategoryId
            },
            { $inc: { 'subcategories.$.productCount': -1 } }
          );
        }
        if (newSubcategoryId) {
          await Category.findOneAndUpdate(
            { 
              _id: oldCategory,
              'subcategories._id': newSubcategoryId
            },
            { $inc: { 'subcategories.$.productCount': 1 } }
          );
        }
      }
      
      if (oldChildSubcategoryId !== newChildSubcategoryId) {
        if (oldChildSubcategoryId && oldSubcategoryId) {
          await Category.findOneAndUpdate(
            { 
              _id: oldCategory,
              'subcategories._id': oldSubcategoryId,
              'subcategories.children._id': oldChildSubcategoryId
            },
            { $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 } },
            {
              arrayFilters: [
                { 'sub._id': oldSubcategoryId },
                { 'child._id': oldChildSubcategoryId }
              ]
            }
          );
        }
        if (newChildSubcategoryId && newSubcategoryId) {
          await Category.findOneAndUpdate(
            { 
              _id: oldCategory,
              'subcategories._id': newSubcategoryId,
              'subcategories.children._id': newChildSubcategoryId
            },
            { $inc: { 'subcategories.$[sub].children.$[child].productCount': 1 } },
            {
              arrayFilters: [
                { 'sub._id': newSubcategoryId },
                { 'child._id': newChildSubcategoryId }
              ]
            }
          );
        }
      }
    }

    // Populate references for response
    await product.populate([
      { path: 'category', select: 'name slug' },
      { path: 'tags', select: 'name image' },
      { path: 'createdBy', select: 'name email role' },
      { path: 'updatedBy', select: 'name email role' } // ADD THIS
    ]);

    res.json({
      success: true,
      data: product,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while updating product'
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Super Admin/Admin/Moderator)
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Check permissions - allow super_admin, admin, and moderator
    if (!['super_admin', 'admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Permission denied. Only super admins, admins, and moderators can delete products.' 
      });
    }

    // Store references for cleanup
    const categoryId = product.category;
    const subcategoryId = product.subcategory;
    const childSubcategoryId = product.childSubcategory;

    // Remove from category's products array
    await Category.findByIdAndUpdate(
      categoryId,
      {
        $pull: { products: { productId: product._id } },
        $inc: { productCount: -1 }
      }
    );

    // Update subcategory product count if exists
    if (subcategoryId) {
      await Category.findOneAndUpdate(
        { 
          _id: categoryId,
          'subcategories._id': subcategoryId
        },
        { $inc: { 'subcategories.$.productCount': -1 } }
      );
    }

    // Update child subcategory product count if exists
    if (childSubcategoryId && subcategoryId) {
      await Category.findOneAndUpdate(
        { 
          _id: categoryId,
          'subcategories._id': subcategoryId,
          'subcategories.children._id': childSubcategoryId
        },
        { $inc: { 'subcategories.$[sub].children.$[child].productCount': -1 } },
        {
          arrayFilters: [
            { 'sub._id': subcategoryId },
            { 'child._id': childSubcategoryId }
          ]
        }
      );
    }

    // If product has a barcode, update barcode status
    if (product.barcode) {
      const Barcode = mongoose.model('Barcode');
      const barcodeDoc = await Barcode.findOne({ barcodeNumber: product.barcode });
      if (barcodeDoc) {
        barcodeDoc.productId = null;
        barcodeDoc.productSku = '';
        barcodeDoc.productName = '';
        barcodeDoc.status = 'available';
        await barcodeDoc.save();
      }
    }

    // Delete the product
    await product.deleteOne();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while deleting product'
    });
  }
};

// @desc    Add review to product
// @route   POST /api/products/:id/review
// @access  Private
const addProductReview = async (req, res) => {
  try {
    const { rating, title, comment } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const alreadyReviewed = product.reviews.some(
      review => review.userId && review.userId.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({ success: false, error: 'Product already reviewed' });
    }

    const review = {
      userId: req.user.id,
      userName: req.user.name || req.user.email,
      rating: Number(rating),
      title: title || '',
      comment,
      isVerifiedPurchase: true,
      createdAt: new Date()
    };

    product.reviews.push(review);
    
    const totalReviews = product.reviews.length;
    const avgRating = product.reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews;
    product.rating = Math.round(avgRating * 10) / 10;
    
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    product.reviews.forEach(r => {
      distribution[r.rating]++;
    });
    product.reviewStats = {
      averageRating: product.rating,
      totalReviews,
      ratingDistribution: distribution
    };

    await product.save();

    res.status(201).json({
      success: true,
      data: review,
      message: 'Review added successfully'
    });
  } catch (error) {
    console.error('Add review error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while adding review'
    });
  }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({
      isFeatured: true,
      isActive: true
    })
      .limit(parseInt(limit))
      .select('productName slug regularPrice discountPrice images rating unit tags');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get banner products (show on banner)
// @route   GET /api/products/banner
// @access  Public
const getBannerProducts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const products = await Product.find({
      showOnBanner: true,
      isActive: true
    })
      .limit(parseInt(limit))
      .select('productName slug regularPrice discountPrice images rating unit tags');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get banner products error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get flash sale products
// @route   GET /api/products/flash-sale
// @access  Public
const getFlashSaleProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.find({
      tags: 'Flash Sale',
      isActive: true,
      discountPrice: { $gt: 0 }
    })
      .populate('category', 'name slug')
      .limit(parseInt(limit))
      .select('productName slug regularPrice discountPrice images rating stockQuantity category unit tags');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get flash sale products error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get trending products (by purchase count)
// @route   GET /api/products/trending
// @access  Public
const getTrendingProducts = async (req, res) => {
  try {
    const { limit = 8 } = req.query;

    const products = await Product.find({ isActive: true })
      .sort({ purchaseCount: -1, views: -1 })
      .limit(parseInt(limit))
      .select('productName slug regularPrice discountPrice images rating purchaseCount unit tags');

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    console.error('Get trending products error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Toggle product active status (activate/deactivate)
// @route   PUT /api/products/:id/toggle
// @access  Private (Super Admin/Admin/Moderator)
const toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    // Check permissions - allow super_admin, admin, and moderator
    if (!['super_admin', 'admin', 'moderator'].includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        error: 'Permission denied. Only super admins, admins, and moderators can change product status.' 
      });
    }

    // Toggle the status
    product.isActive = !product.isActive;
    await product.save();

    // Update embedded product in category
    await Category.findOneAndUpdate(
      { 
        _id: product.category,
        'products.productId': product._id 
      },
      {
        $set: {
          'products.$.isActive': product.isActive,
          'products.$.updatedAt': new Date()
        }
      }
    );

    // If there's a subcategory, update its embedded product as well
    if (product.subcategory) {
      await Category.findOneAndUpdate(
        { 
          _id: product.category,
          'subcategories._id': product.subcategory,
          'subcategories.products.productId': product._id
        },
        {
          $set: {
            'subcategories.$[sub].products.$[prod].isActive': product.isActive,
            'subcategories.$[sub].products.$[prod].updatedAt': new Date()
          }
        },
        {
          arrayFilters: [
            { 'sub._id': product.subcategory },
            { 'prod.productId': product._id }
          ]
        }
      );
    }

    res.json({
      success: true,
      data: product,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Toggle product status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while toggling product status'
    });
  }
};

// @desc    Get all unique units from products
// @route   GET /api/products/units/all
// @access  Public
const getUniqueUnits = async (req, res) => {
  try {
    // Get all distinct units from products
    const units = await Product.distinct('unit', { isActive: true });
    
    // Filter out null/undefined/empty values and sort
    const filteredUnits = units
      .filter(unit => unit && unit.trim() !== '')
      .sort();
    
    // Format units for display
    const unitLabels = {
      'pcs': 'Pieces (pcs)',
      'ton': 'Ton (ton)'
    };
    
    const formattedUnits = filteredUnits.map(unit => ({
      value: unit,
      label: unitLabels[unit] || unit.charAt(0).toUpperCase() + unit.slice(1)
    }));
    
    res.json({
      success: true,
      data: formattedUnits
    });
  } catch (error) {
    console.error('Get unique units error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching units'
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getAdminProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview,
  getFeaturedProducts,
  getBannerProducts,
  getFlashSaleProducts,
  getTrendingProducts,
  toggleProductStatus,
  getUniqueUnits
};