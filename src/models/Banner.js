

// // backend/src/models/Banner.js
// const mongoose = require('mongoose');

// const bannerSchema = new mongoose.Schema({
//   // Basic Information
//   title: {
//     type: String,
//     required: [true, 'Banner title is required'],
//     trim: true,
//     maxlength: [100, 'Title cannot exceed 100 characters']
//   },
//   subtitle: {
//     type: String,
//     trim: true,
//     maxlength: [100, 'Subtitle cannot exceed 100 characters']
//   },
//   mainText: {
//     type: String,
//     trim: true,
//     maxlength: [200, 'Main text cannot exceed 200 characters']
//   },
//   description: {
//     type: String,
//     trim: true,
//     maxlength: [500, 'Description cannot exceed 500 characters']
//   },

//   // Media
//   bgImage: {
//     url: {
//       type: String,
//       default: ''
//     },
//     publicId: {
//       type: String,
//       default: ''
//     },
//     alt: {
//       type: String,
//       trim: true
//     }
//   },

//   // Product Image - ADD THIS
//   productImage: {
//     type: String,
//     default: ''
//   },

//   // Mobile Image (optional)
//   mobileBgImage: {
//     url: {
//       type: String,
//       default: ''
//     },
//     publicId: {
//       type: String,
//       default: ''
//     },
//     alt: String
//   },

//   // Buttons - ADD THIS (replacing the old button fields)
//   buttons: [{
//     text: {
//       type: String,
//       required: true,
//       default: 'Shop Now'
//     },
//     link: {
//       type: String,
//       required: true,
//       default: '/products'
//     },
//     isPrimary: {
//       type: Boolean,
//       default: true
//     }
//   }],

//   // Legacy button fields (keep for backward compatibility)
//   buttonText: {
//     type: String,
//     default: 'Shop Now',
//     trim: true
//   },
//   buttonLink: {
//     type: String,
//     default: '/products',
//     trim: true
//   },
//   buttonColor: {
//     type: String,
//     enum: ['primary', 'secondary', 'dark', 'light'],
//     default: 'dark'
//   },

//   // Badge
//   badge: {
//     type: String,
//     trim: true,
//     default: 'Limited Edition'
//   },

//   // Features
//   features: [{
//     icon: {
//       type: String,
//       enum: ['Truck', 'Shield', 'Clock', 'TrendingUp', 'Star', 'Headphones'],
//       default: 'Truck'
//     },
//     text: {
//       type: String,
//       required: true,
//       trim: true
//     }
//   }],

//   // Discount
//   discount: {
//     type: String,
//     trim: true,
//     default: '40% OFF'
//   },

//   // Category
//   category: {
//     type: String,
//     trim: true,
//     default: 'Electronics'
//   },

//   // Linked Product
//   linkedProductId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Product',
//     default: null
//   },

//   // Order & Display
//   displayOrder: {
//     type: Number,
//     default: 0,
//     index: true
//   },

//   // Status
//   isActive: {
//     type: Boolean,
//     default: true
//   },
//   isPublished: {
//     type: Boolean,
//     default: false
//   },
//   isPermanent: {
//     type: Boolean,
//     default: false
//   },

//   // Visibility
//   showOnHomepage: {
//     type: Boolean,
//     default: true
//   },
//   showOnMobile: {
//     type: Boolean,
//     default: true
//   },

//   // Date range
//   startDate: {
//     type: Date,
//     default: null
//   },
//   endDate: {
//     type: Date,
//     default: null
//   },

//   // Target audience
//   targetAudience: {
//     type: String,
//     enum: ['all', 'guest', 'authenticated'],
//     default: 'all'
//   },

//   // Tracking
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   views: {
//     type: Number,
//     default: 0
//   },
//   clicks: {
//     type: Number,
//     default: 0
//   },

//   // Meta
//   metaTitle: {
//     type: String,
//     trim: true
//   },
//   metaDescription: {
//     type: String,
//     trim: true
//   }

// }, {
//   timestamps: true
// });

// // Indexes
// bannerSchema.index({ isActive: 1, showOnHomepage: 1, displayOrder: 1 });
// bannerSchema.index({ isActive: 1, showOnMobile: 1 });
// bannerSchema.index({ startDate: 1, endDate: 1 });
// bannerSchema.index({ createdAt: -1 });

// // Static methods
// bannerSchema.statics.getHomepageBanners = async function() {
//   const now = new Date();
//   return this.find({
//     isActive: true,
//     showOnHomepage: true,
//     $or: [
//       { startDate: { $exists: false } },
//       { startDate: null },
//       { startDate: { $lte: now } }
//     ],
//     $or: [
//       { endDate: { $exists: false } },
//       { endDate: null },
//       { endDate: { $gte: now } }
//     ]
//   })
//   .sort({ displayOrder: 1, createdAt: -1 })
//   .limit(10)
//   .lean();
// };

// bannerSchema.statics.getMobileBanners = async function() {
//   const now = new Date();
//   return this.find({
//     isActive: true,
//     showOnHomepage: true,
//     showOnMobile: true,
//     $or: [
//       { startDate: { $exists: false } },
//       { startDate: null },
//       { startDate: { $lte: now } }
//     ],
//     $or: [
//       { endDate: { $exists: false } },
//       { endDate: null },
//       { endDate: { $gte: now } }
//     ]
//   })
//   .sort({ displayOrder: 1, createdAt: -1 })
//   .limit(10)
//   .lean();
// };

// const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

// module.exports = Banner;



const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Banner title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },

  // Media
  bgImage: {
    type: String,
    default: ''
  },

  // Product Image
  productImage: {
    type: String,
    default: ''
  },

  // Buttons
  buttons: [{
    text: {
      type: String,
      required: true,
      default: 'Shop Now'
    },
    link: {
      type: String,
      required: true,
      default: '/products'
    },
    isPrimary: {
      type: Boolean,
      default: true
    }
  }],

  // Badge
  badge: {
    type: String,
    trim: true,
    default: 'Limited Edition'
  },

  // Features
  features: [{
    icon: {
      type: String,
      enum: ['Truck', 'Shield', 'Clock', 'TrendingUp', 'Star', 'Headphones'],
      default: 'Truck'
    },
    text: {
      type: String,
      required: true,
      trim: true
    }
  }],

  // Discount
  discount: {
    type: String,
    trim: true,
    default: '40% OFF'
  },

  // Category (optional for beauty)
  category: {
    type: String,
    trim: true,
    default: 'Beauty'
  },

  // Linked Product (single)
  linkedProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default: null
  },

  // NEW: 3 Featured Products
  featuredProducts: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    displayOrder: {
      type: Number,
      default: 0
    }
  }],

  // Order & Display
  displayOrder: {
    type: Number,
    default: 0,
    index: true
  },

  // Status
  isActive: {
    type: Boolean,
    default: true
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  isPermanent: {
    type: Boolean,
    default: false
  },

  // Visibility
  showOnHomepage: {
    type: Boolean,
    default: true
  },
  showOnMobile: {
    type: Boolean,
    default: true
  },

  // Date range
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },

  // Target audience
  targetAudience: {
    type: String,
    enum: ['all', 'guest', 'authenticated'],
    default: 'all'
  },

  // Tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  views: {
    type: Number,
    default: 0
  },
  clicks: {
    type: Number,
    default: 0
  },

  // Meta
  metaTitle: {
    type: String,
    trim: true
  },
  metaDescription: {
    type: String,
    trim: true
  }

}, {
  timestamps: true
});

// Indexes
bannerSchema.index({ isActive: 1, showOnHomepage: 1, displayOrder: 1 });
bannerSchema.index({ isActive: 1, showOnMobile: 1 });
bannerSchema.index({ startDate: 1, endDate: 1 });
bannerSchema.index({ createdAt: -1 });

// Static methods
bannerSchema.statics.getHomepageBanners = async function() {
  const now = new Date();
  return this.find({
    isActive: true,
    showOnHomepage: true,
    $or: [
      { startDate: { $exists: false } },
      { startDate: null },
      { startDate: { $lte: now } }
    ],
    $or: [
      { endDate: { $exists: false } },
      { endDate: null },
      { endDate: { $gte: now } }
    ]
  })
  .populate('featuredProducts.productId', 'productName images regularPrice discountPrice slug')
  .populate('linkedProductId', 'productName images regularPrice discountPrice slug')
  .sort({ displayOrder: 1, createdAt: -1 })
  .limit(10)
  .lean();
};

bannerSchema.statics.getMobileBanners = async function() {
  const now = new Date();
  return this.find({
    isActive: true,
    showOnHomepage: true,
    showOnMobile: true,
    $or: [
      { startDate: { $exists: false } },
      { startDate: null },
      { startDate: { $lte: now } }
    ],
    $or: [
      { endDate: { $exists: false } },
      { endDate: null },
      { endDate: { $gte: now } }
    ]
  })
  .populate('featuredProducts.productId', 'productName images regularPrice discountPrice slug')
  .populate('linkedProductId', 'productName images regularPrice discountPrice slug')
  .sort({ displayOrder: 1, createdAt: -1 })
  .limit(10)
  .lean();
};

const Banner = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);

module.exports = Banner;