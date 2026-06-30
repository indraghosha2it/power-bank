

// // backend/src/controllers/bannerController.js
// const Banner = require('../models/Banner');
// const Product = require('../models/Product');

// // @desc    Create a new banner
// // @route   POST /api/banners
// // @access  Private (Moderator/Admin)
// const createBanner = async (req, res) => {
//   try {
//     console.log('Create banner request received');
//     console.log('Body:', req.body);
//     console.log('User role:', req.user.role);

//     const {
//       title,
//       subtitle,
//       mainText,
//       description,
//       badge,
//       discount,
//       category,
//       bgImage,
//       productImage,
//       features,
//       buttons,
//       linkedProductId,
//       startDate,
//       endDate,
//       order,
//       isActive,
//       isPublished
//     } = req.body;

//     // Validation
//     if (!title) return res.status(400).json({ success: false, error: 'Title is required' });
//     if (!subtitle) return res.status(400).json({ success: false, error: 'Subtitle is required' });
//     if (!mainText) return res.status(400).json({ success: false, error: 'Main text is required' });
//     if (!description) return res.status(400).json({ success: false, error: 'Description is required' });
//     if (!badge) return res.status(400).json({ success: false, error: 'Badge is required' });
//     if (!discount) return res.status(400).json({ success: false, error: 'Discount is required' });
//     if (!category) return res.status(400).json({ success: false, error: 'Category is required' });
    
//     // Handle bgImage - Check if it's a string or object
//     let formattedBgImage;
//     if (typeof bgImage === 'string') {
//       formattedBgImage = {
//         url: bgImage,
//         publicId: '',
//         alt: title || 'Banner background'
//       };
//     } else if (bgImage && typeof bgImage === 'object') {
//       formattedBgImage = {
//         url: bgImage.url || '',
//         publicId: bgImage.publicId || '',
//         alt: bgImage.alt || title || 'Banner background'
//       };
//     } else {
//       formattedBgImage = {
//         url: '',
//         publicId: '',
//         alt: title || 'Banner background'
//       };
//     }

//     // Handle productImage - Make it optional (allow empty string)
//     let formattedProductImage = '';
//     if (productImage) {
//       if (typeof productImage === 'string') {
//         formattedProductImage = productImage;
//       } else if (typeof productImage === 'object') {
//         formattedProductImage = productImage.url || '';
//       }
//     }

//     // Validate features (max 3)
//     if (features && features.length > 3) {
//       return res.status(400).json({ success: false, error: 'Maximum 3 features allowed' });
//     }

//     // Validate buttons (max 2)
//     if (buttons && buttons.length > 2) {
//       return res.status(400).json({ success: false, error: 'Maximum 2 buttons allowed' });
//     }

//     // Validate linked product if provided
//     if (linkedProductId) {
//       const productExists = await Product.findById(linkedProductId);
//       if (!productExists) {
//         return res.status(400).json({ success: false, error: 'Linked product not found' });
//       }
//     }

//     // Both admin and moderator can create banners with the same permissions
//     const bannerData = {
//       title,
//       subtitle,
//       mainText,
//       description,
//       badge,
//       discount,
//       category,
//       bgImage: formattedBgImage,
//       productImage: formattedProductImage,
//       features: features || [],
//       buttons: buttons || [
//         { text: 'Shop Now', link: '/products', isPrimary: true }
//       ],
//       linkedProductId: linkedProductId || null,
//       startDate: startDate || new Date(),
//       endDate: endDate || null,
//       displayOrder: order || 0,
//       createdBy: req.user.id,
//       isActive: isActive !== undefined ? isActive : true,
//       isPublished: isPublished !== undefined ? isPublished : true
//     };

//     const banner = await Banner.create(bannerData);
//     await banner.populate('createdBy', 'name email');

//     res.status(201).json({
//       success: true,
//       data: banner,
//       message: 'Banner created successfully'
//     });
//   } catch (error) {
//     console.error('Create banner error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while creating banner'
//     });
//   }
// };

// // @desc    Get all banners (admin)
// // @route   GET /api/banners/admin/all
// // @access  Private (Moderator/Admin)
// const getBanners = async (req, res) => {
//   try {
//     console.log('📥 GET /api/banners/admin/all called');
//     console.log('📝 Query params:', req.query);
//     console.log('👤 User:', req.user ? req.user.id : 'No user');

//     const {
//       page = 1,
//       limit = 20,
//       search,
//       isActive,
//       isPublished,
//       category,
//       sort = '-createdAt'
//     } = req.query;

//     const query = {};

//     if (search) {
//       query.$or = [
//         { title: { $regex: search, $options: 'i' } },
//         { subtitle: { $regex: search, $options: 'i' } },
//         { category: { $regex: search, $options: 'i' } }
//       ];
//     }

//     if (isActive !== undefined) {
//       query.isActive = isActive === 'true';
//     }
//     if (isPublished !== undefined) {
//       query.isPublished = isPublished === 'true';
//     }
//     if (category) {
//       query.category = { $regex: category, $options: 'i' };
//     }

//     const sortOptions = {};
//     switch (sort) {
//       case 'displayOrder_asc':
//         sortOptions.displayOrder = 1;
//         break;
//       case 'displayOrder_desc':
//         sortOptions.displayOrder = -1;
//         break;
//       case '-createdAt':
//         sortOptions.createdAt = -1;
//         break;
//       case 'createdAt':
//         sortOptions.createdAt = 1;
//         break;
//       default:
//         sortOptions.createdAt = -1;
//     }

//     const skip = (parseInt(page) - 1) * parseInt(limit);

//     const [banners, total] = await Promise.all([
//       Banner.find(query)
//         .populate('createdBy', 'name email')
//         .populate('linkedProductId', 'productName skuCode regularPrice discountPrice images')
//         .sort(sortOptions)
//         .skip(skip)
//         .limit(parseInt(limit))
//         .lean(),
//       Banner.countDocuments(query)
//     ]);

//     console.log(`✅ Found ${banners.length} banners out of ${total} total`);

//     // Format the response
//     const formattedBanners = banners.map(banner => {
//       // Get the bgImage URL properly
//       let bgImageUrl = '';
//       if (typeof banner.bgImage === 'string') {
//         bgImageUrl = banner.bgImage;
//       } else if (banner.bgImage && typeof banner.bgImage === 'object') {
//         bgImageUrl = banner.bgImage.url || '';
//       }

//       return {
//         _id: banner._id,
//         title: banner.title || '',
//         subtitle: banner.subtitle || '',
//         mainText: banner.mainText || '',
//         description: banner.description || '',
//         badge: banner.badge || '',
//         discount: banner.discount || '',
//         category: banner.category || '',
//         bgImage: bgImageUrl,
//         productImage: banner.productImage || '',
//         features: banner.features || [],
//         buttons: banner.buttons || [],
//         linkedProductId: banner.linkedProductId || null,
//         isActive: banner.isActive,
//         isPublished: banner.isPublished,
//         displayOrder: banner.displayOrder || 0,
//         order: banner.displayOrder || 0,
//         views: banner.views || 0,
//         clicks: banner.clicks || 0,
//         createdAt: banner.createdAt,
//         updatedAt: banner.updatedAt,
//         createdBy: banner.createdBy,
//         startDate: banner.startDate,
//         endDate: banner.endDate
//       };
//     });

//     res.json({
//       success: true,
//       data: formattedBanners,
//       pagination: {
//         total,
//         page: parseInt(page),
//         pages: Math.ceil(total / parseInt(limit)),
//         limit: parseInt(limit)
//       }
//     });
//   } catch (error) {
//     console.error('❌ Get banners error:', error);
//     console.error('❌ Error stack:', error.stack);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching banners'
//     });
//   }
// };

// // @desc    Get active banners for homepage
// // @route   GET /api/banners/active
// // @access  Public
// const getActiveBanners = async (req, res) => {
//   try {
//     const { limit = 5 } = req.query;
//     const now = new Date();

//     const banners = await Banner.find({
//       isActive: true,
//       isPublished: true,
//       startDate: { $lte: now },
//       $or: [
//         { endDate: null },
//         { endDate: { $gte: now } }
//       ]
//     })
//       .sort({ displayOrder: 1, createdAt: -1 })
//       .limit(parseInt(limit))
//       .populate('linkedProductId', 'productName skuCode regularPrice discountPrice images')
//       .lean();

//     res.json({
//       success: true,
//       data: banners
//     });
//   } catch (error) {
//     console.error('Get active banners error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching active banners'
//     });
//   }
// };

// // @desc    Get banner for homepage with specific format
// // @route   GET /api/banners/homepage
// // @access  Public
// const getBannerForHomepage = async (req, res) => {
//   try {
//     const now = new Date();

//     const banners = await Banner.find({
//       isActive: true,
//       isPublished: true,
//       startDate: { $lte: now },
//       $or: [
//         { endDate: null },
//         { endDate: { $gte: now } }
//       ]
//     })
//       .sort({ displayOrder: 1, createdAt: -1 })
//       .limit(5)
//       .populate('linkedProductId', 'productName skuCode regularPrice discountPrice images')
//       .lean();

//     const formattedBanners = banners.map(banner => {
//       let bgImageUrl = '';
//       if (typeof banner.bgImage === 'string') {
//         bgImageUrl = banner.bgImage;
//       } else if (banner.bgImage && typeof banner.bgImage === 'object') {
//         bgImageUrl = banner.bgImage.url || '';
//       }

//       return {
//         id: banner._id,
//         title: banner.title,
//         subtitle: banner.subtitle,
//         mainText: banner.mainText,
//         description: banner.description,
//         badge: banner.badge,
//         discount: banner.discount,
//         category: banner.category,
//         bgImage: bgImageUrl,
//         productImage: banner.productImage || '',
//         features: banner.features || [],
//         buttons: banner.buttons || [],
//         linkedProduct: banner.linkedProductId
//       };
//     });

//     res.json({
//       success: true,
//       data: formattedBanners
//     });
//   } catch (error) {
//     console.error('Get homepage banners error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching homepage banners'
//     });
//   }
// };

// // @desc    Get single banner by ID
// // @route   GET /api/banners/:id
// // @access  Public
// const getBannerById = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const banner = await Banner.findById(id)
//       .populate('createdBy', 'name email')
//       .populate('linkedProductId', 'productName skuCode regularPrice discountPrice images')
//       .lean();

//     if (!banner) {
//       return res.status(404).json({
//         success: false,
//         error: 'Banner not found'
//       });
//     }

//     await Banner.findByIdAndUpdate(id, { $inc: { views: 1 } });

//     res.json({
//       success: true,
//       data: banner
//     });
//   } catch (error) {
//     console.error('Get banner error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching banner'
//     });
//   }
// };

// // @desc    Update banner
// // @route   PUT /api/banners/:id
// // @access  Private (Moderator/Admin)
// // const updateBanner = async (req, res) => {
// //   try {
// //     const { id } = req.params;
// //     const {
// //       title,
// //       subtitle,
// //       mainText,
// //       description,
// //       badge,
// //       discount,
// //       category,
// //       bgImage,
// //       productImage,
// //       features,
// //       buttons,
// //       linkedProductId,
// //       startDate,
// //       endDate,
// //       order,
// //       isActive,
// //       isPublished
// //     } = req.body;

// //     const banner = await Banner.findById(id);

// //     if (!banner) {
// //       return res.status(404).json({
// //         success: false,
// //         error: 'Banner not found'
// //       });
// //     }

// //     // Both admin and moderator can update any banner
// //     // No restrictions on who can edit which banner

// //     // Validate linked product if provided
// //     if (linkedProductId) {
// //       const productExists = await Product.findById(linkedProductId);
// //       if (!productExists) {
// //         return res.status(400).json({ success: false, error: 'Linked product not found' });
// //       }
// //     }

// //     // Handle bgImage
// //     let formattedBgImage;
// //     if (bgImage) {
// //       if (typeof bgImage === 'string') {
// //         formattedBgImage = {
// //           url: bgImage,
// //           publicId: '',
// //           alt: title || 'Banner background'
// //         };
// //       } else if (typeof bgImage === 'object') {
// //         formattedBgImage = {
// //           url: bgImage.url || '',
// //           publicId: bgImage.publicId || '',
// //           alt: bgImage.alt || title || 'Banner background'
// //         };
// //       }
// //     }

// //     // Handle productImage
// //     let formattedProductImage;
// //     if (productImage) {
// //       if (typeof productImage === 'string') {
// //         formattedProductImage = productImage;
// //       } else if (typeof productImage === 'object') {
// //         formattedProductImage = productImage.url || '';
// //       }
// //     }

// //     // Update fields
// //     if (title) banner.title = title;
// //     if (subtitle) banner.subtitle = subtitle;
// //     if (mainText) banner.mainText = mainText;
// //     if (description) banner.description = description;
// //     if (badge) banner.badge = badge;
// //     if (discount) banner.discount = discount;
// //     if (category) banner.category = category;
// //     if (formattedBgImage) banner.bgImage = formattedBgImage;
// //     if (formattedProductImage !== undefined) banner.productImage = formattedProductImage;
// //     if (features) banner.features = features;
// //     if (buttons) banner.buttons = buttons;
// //     if (linkedProductId !== undefined) banner.linkedProductId = linkedProductId;
// //     if (startDate) banner.startDate = startDate;
// //     if (endDate !== undefined) banner.endDate = endDate;
// //     if (order !== undefined) banner.displayOrder = order;
// //     if (isActive !== undefined) banner.isActive = isActive;
// //     if (isPublished !== undefined) banner.isPublished = isPublished;

// //     await banner.save();

// //     // Populate for response
// //     await banner.populate('createdBy', 'name email');
// //     await banner.populate('linkedProductId', 'productName skuCode regularPrice discountPrice images');

// //     res.json({
// //       success: true,
// //       data: banner,
// //       message: 'Banner updated successfully'
// //     });
// //   } catch (error) {
// //     console.error('Update banner error:', error);
// //     res.status(500).json({
// //       success: false,
// //       error: error.message || 'Server error while updating banner'
// //     });
// //   }
// // };

// // backend/src/controllers/bannerController.js

// // @desc    Update banner
// // @route   PUT /api/banners/:id
// // @access  Private (Moderator/Admin)
// const updateBanner = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const {
//       title,
//       subtitle,
//       mainText,
//       description,
//       badge,
//       discount,
//       category,
//       bgImage,
//       productImage,
//       features,
//       buttons,
//       linkedProductId,
//       startDate,
//       endDate,
//       order,
//       isActive,
//       isPublished
//     } = req.body;

//     const banner = await Banner.findById(id);

//     if (!banner) {
//       return res.status(404).json({
//         success: false,
//         error: 'Banner not found'
//       });
//     }

//     // Validate linked product if provided
//     if (linkedProductId) {
//       const productExists = await Product.findById(linkedProductId);
//       if (!productExists) {
//         return res.status(400).json({ success: false, error: 'Linked product not found' });
//       }
//     }

//     // Handle bgImage
//     let formattedBgImage;
//     if (bgImage !== undefined) {
//       if (typeof bgImage === 'string') {
//         formattedBgImage = {
//           url: bgImage,
//           publicId: '',
//           alt: title || 'Banner background'
//         };
//       } else if (typeof bgImage === 'object') {
//         formattedBgImage = {
//           url: bgImage.url || '',
//           publicId: bgImage.publicId || '',
//           alt: bgImage.alt || title || 'Banner background'
//         };
//       }
//       banner.bgImage = formattedBgImage;
//     }

//     // Handle productImage - FIX: Allow empty string to remove image
//     if (productImage !== undefined) {
//       // If productImage is empty string or null, set to empty string
//       // This allows removing the image
//       if (typeof productImage === 'string') {
//         banner.productImage = productImage; // This could be empty string
//       } else if (typeof productImage === 'object' && productImage !== null) {
//         banner.productImage = productImage.url || '';
//       } else {
//         banner.productImage = ''; // If null or undefined, set to empty
//       }
//     }

//     // Update other fields
//     if (title !== undefined) banner.title = title;
//     if (subtitle !== undefined) banner.subtitle = subtitle;
//     if (mainText !== undefined) banner.mainText = mainText;
//     if (description !== undefined) banner.description = description;
//     if (badge !== undefined) banner.badge = badge;
//     if (discount !== undefined) banner.discount = discount;
//     if (category !== undefined) banner.category = category;
//     if (features !== undefined) banner.features = features;
//     if (buttons !== undefined) banner.buttons = buttons;
//     if (linkedProductId !== undefined) banner.linkedProductId = linkedProductId;
//     if (startDate !== undefined) banner.startDate = startDate;
//     if (endDate !== undefined) banner.endDate = endDate;
//     if (order !== undefined) banner.displayOrder = order;
//     if (isActive !== undefined) banner.isActive = isActive;
//     if (isPublished !== undefined) banner.isPublished = isPublished;

//     await banner.save();

//     // Populate for response
//     await banner.populate('createdBy', 'name email');
//     await banner.populate('linkedProductId', 'productName skuCode regularPrice discountPrice images');

//     res.json({
//       success: true,
//       data: banner,
//       message: 'Banner updated successfully'
//     });
//   } catch (error) {
//     console.error('Update banner error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while updating banner'
//     });
//   }
// };

// // @desc    Delete banner
// // @route   DELETE /api/banners/:id
// // @access  Private (Admin only)
// const deleteBanner = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const banner = await Banner.findById(id);

//     if (!banner) {
//       return res.status(404).json({
//         success: false,
//         error: 'Banner not found'
//       });
//     }

//     await banner.deleteOne();

//     res.json({
//       success: true,
//       message: 'Banner deleted successfully'
//     });
//   } catch (error) {
//     console.error('Delete banner error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while deleting banner'
//     });
//   }
// };

// // @desc    Toggle banner active status
// // @route   PUT /api/banners/:id/toggle-status
// // @access  Private (Moderator/Admin)
// const toggleBannerStatus = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const banner = await Banner.findById(id);

//     if (!banner) {
//       return res.status(404).json({
//         success: false,
//         error: 'Banner not found'
//       });
//     }

//     // Both admin and moderator can toggle status
//     banner.isActive = !banner.isActive;
//     await banner.save();

//     res.json({
//       success: true,
//       data: banner,
//       message: `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`
//     });
//   } catch (error) {
//     console.error('Toggle banner status error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while toggling banner status'
//     });
//   }
// };

// // @desc    Toggle banner publish status
// // @route   PUT /api/banners/:id/toggle-publish
// // @access  Private (Moderator/Admin)
// const toggleBannerPublish = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const banner = await Banner.findById(id);

//     if (!banner) {
//       return res.status(404).json({
//         success: false,
//         error: 'Banner not found'
//       });
//     }

//     // Both admin and moderator can toggle publish status
//     banner.isPublished = !banner.isPublished;
//     await banner.save();

//     res.json({
//       success: true,
//       data: banner,
//       message: `Banner ${banner.isPublished ? 'published' : 'unpublished'} successfully`
//     });
//   } catch (error) {
//     console.error('Toggle banner publish error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while toggling banner publish status'
//     });
//   }
// };

// // @desc    Reorder banners
// // @route   PUT /api/banners/reorder
// // @access  Private (Moderator/Admin)
// const reorderBanners = async (req, res) => {
//   try {
//     const { banners } = req.body;

//     if (!banners || !Array.isArray(banners)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Banners array is required'
//       });
//     }

//     // Both admin and moderator can reorder
//     const updatePromises = banners.map(({ id, order }) =>
//       Banner.findByIdAndUpdate(id, { displayOrder: order })
//     );

//     await Promise.all(updatePromises);

//     res.json({
//       success: true,
//       message: 'Banners reordered successfully'
//     });
//   } catch (error) {
//     console.error('Reorder banners error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while reordering banners'
//     });
//   }
// };

// // @desc    Get banner statistics
// // @route   GET /api/banners/admin/stats
// // @access  Private (Moderator/Admin)
// const getBannerStats = async (req, res) => {
//   try {
//     console.log('📊 Getting banner stats...');
//     const now = new Date();

//     const [
//       totalBanners,
//       activeBanners,
//       publishedBanners,
//       totalViews,
//       totalClicks
//     ] = await Promise.all([
//       Banner.countDocuments(),
//       Banner.countDocuments({ isActive: true }),
//       Banner.countDocuments({ isPublished: true }),
//       Banner.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
//       Banner.aggregate([{ $group: { _id: null, total: { $sum: '$clicks' } } }])
//     ]);

//     const expiredBanners = await Banner.countDocuments({
//       isActive: true,
//       endDate: { $lt: now }
//     });

//     const upcomingBanners = await Banner.countDocuments({
//       isActive: true,
//       startDate: { $gt: now }
//     });

//     const stats = {
//       total: totalBanners,
//       active: activeBanners,
//       published: publishedBanners,
//       expired: expiredBanners,
//       upcoming: upcomingBanners,
//       views: totalViews[0]?.total || 0,
//       clicks: totalClicks[0]?.total || 0
//     };

//     console.log('📊 Stats:', stats);

//     res.json({
//       success: true,
//       data: stats
//     });
//   } catch (error) {
//     console.error('❌ Get banner stats error:', error);
//     console.error('❌ Error stack:', error.stack);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while fetching banner stats'
//     });
//   }
// };

// // @desc    Increment banner clicks
// // @route   POST /api/banners/:id/click
// // @access  Public
// const incrementBannerClicks = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const banner = await Banner.findById(id);

//     if (!banner) {
//       return res.status(404).json({
//         success: false,
//         error: 'Banner not found'
//       });
//     }

//     await Banner.findByIdAndUpdate(id, { $inc: { clicks: 1 } });

//     res.json({
//       success: true,
//       message: 'Click tracked successfully'
//     });
//   } catch (error) {
//     console.error('Increment banner clicks error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error while tracking click'
//     });
//   }
// };

// module.exports = {
//   createBanner,
//   getBanners,
//   getActiveBanners,
//   getBannerForHomepage,
//   getBannerById,
//   updateBanner,
//   deleteBanner,
//   toggleBannerStatus,
//   toggleBannerPublish,
//   reorderBanners,
//   getBannerStats,
//   incrementBannerClicks
// };



// backend/src/controllers/bannerController.js
const Banner = require('../models/Banner');
const Product = require('../models/Product');

// @desc    Create a new banner
// @route   POST /api/banners
// @access  Private (Moderator/Admin)
const createBanner = async (req, res) => {
  try {
    console.log('Create banner request received');
    console.log('Body:', req.body);

    const {
      title,
      subtitle,
      mainText,
      description,
      badge,
      discount,
      category,
      bgImage,
      productImage,
      features,
      buttons,
      linkedProductId,
      featuredProducts,
      startDate,
      endDate,
      order,
      isActive,
      isPublished
    } = req.body;

    // Validation
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }
    if (!description) {
      return res.status(400).json({ success: false, error: 'Description is required' });
    }
    if (!badge) {
      return res.status(400).json({ success: false, error: 'Badge is required' });
    }
    if (!discount) {
      return res.status(400).json({ success: false, error: 'Discount is required' });
    }

    // Validate featured products (max 3)
    if (featuredProducts && featuredProducts.length > 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'Maximum 3 featured products allowed' 
      });
    }

    // Process featured products
    const processedFeaturedProducts = featuredProducts && Array.isArray(featuredProducts) 
      ? featuredProducts.map((p, index) => ({
          productId: p.productId,
          displayOrder: p.displayOrder || index
        }))
      : [];

    // Handle bgImage
    let formattedBgImage = '';
    if (typeof bgImage === 'string') {
      formattedBgImage = bgImage;
    } else if (bgImage && typeof bgImage === 'object') {
      formattedBgImage = bgImage.url || '';
    }

    // Handle productImage
    let formattedProductImage = '';
    if (typeof productImage === 'string') {
      formattedProductImage = productImage;
    } else if (productImage && typeof productImage === 'object') {
      formattedProductImage = productImage.url || '';
    }

    // Validate linked product if provided
    if (linkedProductId) {
      const productExists = await Product.findById(linkedProductId);
      if (!productExists) {
        return res.status(400).json({ success: false, error: 'Linked product not found' });
      }
    }

    // Validate features (max 3)
    if (features && features.length > 3) {
      return res.status(400).json({ success: false, error: 'Maximum 3 features allowed' });
    }

    // Validate buttons (max 2)
    if (buttons && buttons.length > 2) {
      return res.status(400).json({ success: false, error: 'Maximum 2 buttons allowed' });
    }

    const bannerData = {
      title,
      subtitle: subtitle || title,
      mainText: mainText || description || title,
      description: description || '',
      badge: badge || '',
      discount: discount || '',
      category: category || 'Beauty',
      bgImage: formattedBgImage,
      productImage: formattedProductImage,
      features: features || [],
      buttons: buttons || [{ text: 'Shop Now', link: '/products', isPrimary: true }],
      linkedProductId: linkedProductId || null,
      featuredProducts: processedFeaturedProducts,
      startDate: startDate || new Date(),
      endDate: endDate || null,
      displayOrder: order || 0,
      createdBy: req.user.id,
      isActive: isActive !== undefined ? isActive : true,
      isPublished: isPublished !== undefined ? isPublished : true
    };

    const banner = await Banner.create(bannerData);
    
    // Populate references for response
    await banner.populate('createdBy', 'name email');
    await banner.populate('featuredProducts.productId', 'productName images regularPrice discountPrice slug');
    await banner.populate('linkedProductId', 'productName images regularPrice discountPrice slug');

    res.status(201).json({
      success: true,
      data: banner,
      message: 'Banner created successfully'
    });
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while creating banner'
    });
  }
};

// @desc    Get all banners (admin)
// @route   GET /api/banners/admin/all
// @access  Private (Moderator/Admin)
const getBanners = async (req, res) => {
  try {
    console.log('📥 GET /api/banners/admin/all called');
    console.log('📝 Query params:', req.query);
    console.log('👤 User:', req.user ? req.user.id : 'No user');

    const {
      page = 1,
      limit = 20,
      search,
      isActive,
      isPublished,
      category,
      sort = '-createdAt'
    } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { subtitle: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    if (isPublished !== undefined) {
      query.isPublished = isPublished === 'true';
    }
    if (category) {
      query.category = { $regex: category, $options: 'i' };
    }

    const sortOptions = {};
    switch (sort) {
      case 'displayOrder_asc':
        sortOptions.displayOrder = 1;
        break;
      case 'displayOrder_desc':
        sortOptions.displayOrder = -1;
        break;
      case '-createdAt':
        sortOptions.createdAt = -1;
        break;
      case 'createdAt':
        sortOptions.createdAt = 1;
        break;
      default:
        sortOptions.createdAt = -1;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [banners, total] = await Promise.all([
      Banner.find(query)
        .populate('createdBy', 'name email')
        .populate('linkedProductId', 'productName skuCode regularPrice discountPrice images')
        .populate('featuredProducts.productId', 'productName images regularPrice discountPrice slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Banner.countDocuments(query)
    ]);

    console.log(`✅ Found ${banners.length} banners out of ${total} total`);

    // Format the response
    const formattedBanners = banners.map(banner => {
      // Get the bgImage URL properly
      let bgImageUrl = '';
      if (typeof banner.bgImage === 'string') {
        bgImageUrl = banner.bgImage;
      } else if (banner.bgImage && typeof banner.bgImage === 'object') {
        bgImageUrl = banner.bgImage.url || '';
      }

      return {
        _id: banner._id,
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        mainText: banner.mainText || '',
        description: banner.description || '',
        badge: banner.badge || '',
        discount: banner.discount || '',
        category: banner.category || '',
        bgImage: bgImageUrl,
        productImage: banner.productImage || '',
        features: banner.features || [],
        buttons: banner.buttons || [],
        linkedProductId: banner.linkedProductId || null,
        featuredProducts: banner.featuredProducts || [],
        isActive: banner.isActive,
        isPublished: banner.isPublished,
        displayOrder: banner.displayOrder || 0,
        order: banner.displayOrder || 0,
        views: banner.views || 0,
        clicks: banner.clicks || 0,
        createdAt: banner.createdAt,
        updatedAt: banner.updatedAt,
        createdBy: banner.createdBy,
        startDate: banner.startDate,
        endDate: banner.endDate
      };
    });

    res.json({
      success: true,
      data: formattedBanners,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit)),
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('❌ Get banners error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching banners'
    });
  }
};

// @desc    Get active banners for homepage
// @route   GET /api/banners/active
// @access  Public
const getActiveBanners = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const now = new Date();

    const banners = await Banner.find({
      isActive: true,
      isPublished: true,
      startDate: { $lte: now },
      $or: [
        { endDate: null },
        { endDate: { $gte: now } }
      ]
    })
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .populate('linkedProductId', 'productName skuCode regularPrice discountPrice images')
      .populate('featuredProducts.productId', 'productName images regularPrice discountPrice slug')
      .lean();

    res.json({
      success: true,
      data: banners
    });
  } catch (error) {
    console.error('Get active banners error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching active banners'
    });
  }
};

// @desc    Get banner for homepage with specific format
// @route   GET /api/banners/homepage
// @access  Public
const getBannerForHomepage = async (req, res) => {
  try {
    const now = new Date();

    const banners = await Banner.find({
      isActive: true,
      isPublished: true,
      startDate: { $lte: now },
      $or: [
        { endDate: null },
        { endDate: { $gte: now } }
      ]
    })
      .sort({ displayOrder: 1, createdAt: -1 })
      .limit(5)
      .populate('linkedProductId', 'productName skuCode regularPrice discountPrice images')
      .populate('featuredProducts.productId', 'productName images regularPrice discountPrice slug')
      .lean();

    const formattedBanners = banners.map(banner => {
      let bgImageUrl = '';
      if (typeof banner.bgImage === 'string') {
        bgImageUrl = banner.bgImage;
      } else if (banner.bgImage && typeof banner.bgImage === 'object') {
        bgImageUrl = banner.bgImage.url || '';
      }

      return {
        id: banner._id,
        title: banner.title,
        subtitle: banner.subtitle,
        mainText: banner.mainText,
        description: banner.description,
        badge: banner.badge,
        discount: banner.discount,
        category: banner.category,
        bgImage: bgImageUrl,
        productImage: banner.productImage || '',
        features: banner.features || [],
        buttons: banner.buttons || [],
        linkedProduct: banner.linkedProductId,
        featuredProducts: banner.featuredProducts || []
      };
    });

    res.json({
      success: true,
      data: formattedBanners
    });
  } catch (error) {
    console.error('Get homepage banners error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching homepage banners'
    });
  }
};

// @desc    Get single banner by ID
// @route   GET /api/banners/:id
// @access  Public
const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id)
      .populate('createdBy', 'name email')
      .populate('linkedProductId', 'productName skuCode regularPrice discountPrice images')
      .populate('featuredProducts.productId', 'productName images regularPrice discountPrice slug')
      .lean();

    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }

    await Banner.findByIdAndUpdate(id, { $inc: { views: 1 } });

    res.json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Get banner error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching banner'
    });
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private (Moderator/Admin)
const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      subtitle,
      mainText,
      description,
      badge,
      discount,
      category,
      bgImage,
      productImage,
      features,
      buttons,
      linkedProductId,
      featuredProducts,
      startDate,
      endDate,
      order,
      isActive,
      isPublished
    } = req.body;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }

    // Validate featured products (max 3)
    if (featuredProducts && featuredProducts.length > 3) {
      return res.status(400).json({ 
        success: false, 
        error: 'Maximum 3 featured products allowed' 
      });
    }

    // Process featured products
    const processedFeaturedProducts = featuredProducts && Array.isArray(featuredProducts) 
      ? featuredProducts.map((p, index) => ({
          productId: p.productId,
          displayOrder: p.displayOrder || index
        }))
      : [];

    // Validate linked product if provided
    if (linkedProductId) {
      const productExists = await Product.findById(linkedProductId);
      if (!productExists) {
        return res.status(400).json({ success: false, error: 'Linked product not found' });
      }
    }

    // Handle bgImage
    if (bgImage !== undefined) {
      if (typeof bgImage === 'string') {
        banner.bgImage = bgImage;
      } else if (typeof bgImage === 'object') {
        banner.bgImage = bgImage.url || '';
      } else {
        banner.bgImage = '';
      }
    }

    // Handle productImage
    if (productImage !== undefined) {
      if (typeof productImage === 'string') {
        banner.productImage = productImage;
      } else if (typeof productImage === 'object') {
        banner.productImage = productImage.url || '';
      } else {
        banner.productImage = '';
      }
    }

    // Update fields
    if (title !== undefined) banner.title = title;
    if (subtitle !== undefined) banner.subtitle = subtitle;
    if (mainText !== undefined) banner.mainText = mainText;
    if (description !== undefined) banner.description = description;
    if (badge !== undefined) banner.badge = badge;
    if (discount !== undefined) banner.discount = discount;
    if (category !== undefined) banner.category = category;
    if (features !== undefined) banner.features = features;
    if (buttons !== undefined) banner.buttons = buttons;
    if (linkedProductId !== undefined) banner.linkedProductId = linkedProductId;
    if (featuredProducts !== undefined) banner.featuredProducts = processedFeaturedProducts;
    if (startDate !== undefined) banner.startDate = startDate;
    if (endDate !== undefined) banner.endDate = endDate;
    if (order !== undefined) banner.displayOrder = order;
    if (isActive !== undefined) banner.isActive = isActive;
    if (isPublished !== undefined) banner.isPublished = isPublished;

    await banner.save();

    // Populate for response
    await banner.populate('createdBy', 'name email');
    await banner.populate('linkedProductId', 'productName skuCode regularPrice discountPrice images');
    await banner.populate('featuredProducts.productId', 'productName images regularPrice discountPrice slug');

    res.json({
      success: true,
      data: banner,
      message: 'Banner updated successfully'
    });
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while updating banner'
    });
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private (Admin only)
const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }

    await banner.deleteOne();

    res.json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while deleting banner'
    });
  }
};

// @desc    Toggle banner active status
// @route   PUT /api/banners/:id/toggle-status
// @access  Private (Moderator/Admin)
const toggleBannerStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }

    banner.isActive = !banner.isActive;
    await banner.save();

    res.json({
      success: true,
      data: banner,
      message: `Banner ${banner.isActive ? 'activated' : 'deactivated'} successfully`
    });
  } catch (error) {
    console.error('Toggle banner status error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while toggling banner status'
    });
  }
};

// @desc    Toggle banner publish status
// @route   PUT /api/banners/:id/toggle-publish
// @access  Private (Moderator/Admin)
const toggleBannerPublish = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }

    banner.isPublished = !banner.isPublished;
    await banner.save();

    res.json({
      success: true,
      data: banner,
      message: `Banner ${banner.isPublished ? 'published' : 'unpublished'} successfully`
    });
  } catch (error) {
    console.error('Toggle banner publish error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while toggling banner publish status'
    });
  }
};

// @desc    Reorder banners
// @route   PUT /api/banners/reorder
// @access  Private (Moderator/Admin)
const reorderBanners = async (req, res) => {
  try {
    const { banners } = req.body;

    if (!banners || !Array.isArray(banners)) {
      return res.status(400).json({
        success: false,
        error: 'Banners array is required'
      });
    }

    const updatePromises = banners.map(({ id, order }) =>
      Banner.findByIdAndUpdate(id, { displayOrder: order })
    );

    await Promise.all(updatePromises);

    res.json({
      success: true,
      message: 'Banners reordered successfully'
    });
  } catch (error) {
    console.error('Reorder banners error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while reordering banners'
    });
  }
};

// @desc    Get banner statistics
// @route   GET /api/banners/admin/stats
// @access  Private (Moderator/Admin)
const getBannerStats = async (req, res) => {
  try {
    console.log('📊 Getting banner stats...');
    const now = new Date();

    const [
      totalBanners,
      activeBanners,
      publishedBanners,
      totalViews,
      totalClicks
    ] = await Promise.all([
      Banner.countDocuments(),
      Banner.countDocuments({ isActive: true }),
      Banner.countDocuments({ isPublished: true }),
      Banner.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      Banner.aggregate([{ $group: { _id: null, total: { $sum: '$clicks' } } }])
    ]);

    const expiredBanners = await Banner.countDocuments({
      isActive: true,
      endDate: { $lt: now }
    });

    const upcomingBanners = await Banner.countDocuments({
      isActive: true,
      startDate: { $gt: now }
    });

    const stats = {
      total: totalBanners,
      active: activeBanners,
      published: publishedBanners,
      expired: expiredBanners,
      upcoming: upcomingBanners,
      views: totalViews[0]?.total || 0,
      clicks: totalClicks[0]?.total || 0
    };

    console.log('📊 Stats:', stats);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('❌ Get banner stats error:', error);
    console.error('❌ Error stack:', error.stack);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching banner stats'
    });
  }
};

// @desc    Increment banner clicks
// @route   POST /api/banners/:id/click
// @access  Public
const incrementBannerClicks = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        error: 'Banner not found'
      });
    }

    await Banner.findByIdAndUpdate(id, { $inc: { clicks: 1 } });

    res.json({
      success: true,
      message: 'Click tracked successfully'
    });
  } catch (error) {
    console.error('Increment banner clicks error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while tracking click'
    });
  }
};

module.exports = {
  createBanner,
  getBanners,
  getActiveBanners,
  getBannerForHomepage,
  getBannerById,
  updateBanner,
  deleteBanner,
  toggleBannerStatus,
  toggleBannerPublish,
  reorderBanners,
  getBannerStats,
  incrementBannerClicks
};