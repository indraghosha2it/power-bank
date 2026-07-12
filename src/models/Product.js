
// // backend/src/models/Product.js
// const mongoose = require('mongoose');

// // Counter Schema for sequential SKU generation
// const counterSchema = new mongoose.Schema({
//   _id: { type: String, required: true },
//   sequence_value: { type: Number, default: 0 }
// });

// const Counter = mongoose.model('Counter', counterSchema);

// // Review Schema
// const reviewSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User'
//   },
//   userName: {
//     type: String,
//     required: true
//   },
//   rating: {
//     type: Number,
//     required: true,
//     min: 1,
//     max: 5
//   },
//   title: {
//     type: String,
//     trim: true
//   },
//   comment: {
//     type: String,
//     required: true
//   },
//   images: [{
//     url: String,
//     publicId: String
//   }],
//   isVerifiedPurchase: {
//     type: Boolean,
//     default: false
//   },
//   isApproved: {
//     type: Boolean,
//     default: false
//   },
//   helpful: {
//     type: Number,
//     default: 0
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Additional Info Schema
// const additionalInfoSchema = new mongoose.Schema({
//   fieldName: {
//     type: String,
//     required: true,
//     trim: true
//   },
//   fieldValue: {
//     type: String,
//     required: true,
//     trim: true
//   }
// });

// // Meta Settings Schema
// const metaSettingsSchema = new mongoose.Schema({
//   metaTitle: {
//     type: String,
//     trim: true,
//     maxlength: [70, 'Meta title should not exceed 70 characters']
//   },
//   metaDescription: {
//     type: String,
//     trim: true,
//     maxlength: [160, 'Meta description should not exceed 160 characters']
//   },
//   metaKeywords: [{
//     type: String,
//     trim: true
//   }]
// });

// // Main Product Schema (Smart Gadget Product)
// const productSchema = new mongoose.Schema({
//   // Basic Information
//   productName: {
//     type: String,
//     required: [true, 'Product name is required'],
//     trim: true,
//     maxlength: [200, 'Product name cannot exceed 200 characters']
//   },
//   slug: {
//     type: String,
//     lowercase: true,
//     unique: true,
//     sparse: true
//   },
//   shortDescription: {
//     type: String,
//     trim: true,
//     default: ''
//   },
//   fullDescription: {
//     type: String,
//     required: [true, 'Full description is required'],
//     trim: true
//   },

//   // Categories
//   category: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Category',
//     required: [true, 'Category is required']
//   },
//   categoryName: {
//     type: String,
//     trim: true
//   },
//   subcategory: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Category.subcategories'
//   },
//   subcategoryName: {
//     type: String,
//     trim: true
//   },
//   childSubcategory: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Category.subcategories.children'
//   },
//   childSubcategoryName: {
//     type: String,
//     trim: true
//   },

//   // Brand
//   brand: {
//     type: String,
//     required: [true, 'Brand is required'],
//     trim: true
//   },

//   // Pricing
//   regularPrice: {
//     type: Number,
//     required: [true, 'Regular price is required'],
//     min: [0, 'Price cannot be negative']
//   },
//   discountPrice: {
//     type: Number,
//     default: 0,
//     min: [0, 'Discount price cannot be negative']
//   },
//   costPerItem: {
//     type: Number,
//     default: 0,
//     min: [0, 'Cost per item cannot be negative']
//   },
  
//   // Inventory
//   stockQuantity: {
//     type: Number,
//     required: [true, 'Stock quantity is required'],
//     default: 0,
//     min: [0, 'Stock quantity cannot be negative']
//   },
//   stockAlertQuantity: {
//     type: Number,
//     default: 0,
//     min: [0, 'Stock alert quantity cannot be negative']
//   },
//   skuCode: {
//     type: String,
//     unique: true,
//     sparse: true
//   },
//   barcode: {
//     type: String,
//     unique: true,
//     sparse: true,
//     trim: true,
//     index: true,
//     match: [/^[0-9]{8,13}$/, 'Barcode must be 8-13 digits only']
//   },

//   // Unit
//   unit: {
//     type: String,
//     required: [true, 'Unit is required'],
//     default: 'pcs'
//   },

//   // Colors
//   colors: [{
//     type: String,
//     trim: true
//   }],

//   // Delivery
//   deliveryInfo: {
//     type: String,
//     default: ''
//   },

//   // Media
//   images: [{
//     url: {
//       type: String,
//       required: true
//     },
//     publicId: {
//       type: String,
//       required: true
//     },
//     isPrimary: {
//       type: Boolean,
//       default: false
//     }
//   }],

//   // Tags & Promotions
//   // tags: [{
//   //   type: String,
//   //   enum: ['Best Seller', 'Trending', 'New Release', 'Limited Offer', 'Flash Sale', 'Clearance']
//   // }],

//   tags: [{
//   type: mongoose.Schema.Types.ObjectId,
//   ref: 'Tag'
// }],
//   isFeatured: {
//     type: Boolean,
//     default: false
//   },
//   showOnBanner: {
//     type: Boolean,
//     default: false
//   },

//   // Rating
//   rating: {
//     type: Number,
//     default: 0,
//     min: 0,
//     max: 5
//   },

//   // Additional Information
//   additionalInfo: [additionalInfoSchema],

//   // Meta Settings
//   metaSettings: metaSettingsSchema,

//   // Reviews & Stats
//   reviews: [reviewSchema],
//   reviewStats: {
//     averageRating: {
//       type: Number,
//       default: 0
//     },
//     totalReviews: {
//       type: Number,
//       default: 0
//     },
//     ratingDistribution: {
//       1: { type: Number, default: 0 },
//       2: { type: Number, default: 0 },
//       3: { type: Number, default: 0 },
//       4: { type: Number, default: 0 },
//       5: { type: Number, default: 0 }
//     }
//   },

//   // Status flags
//   isActive: {
//     type: Boolean,
//     default: true
//   },

//   // Tracking
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },

//   // Meta
//   views: {
//     type: Number,
//     default: 0
//   },
//   purchaseCount: {
//     type: Number,
//     default: 0
//   }

// }, {
//   timestamps: true
// });

// // Generate slug before saving
// productSchema.pre('save', async function() {
//   if (this.isModified('productName')) {
//     this.slug = this.productName
//       .toLowerCase()
//       .replace(/[^a-z0-9]+/g, '-')
//       .replace(/(^-|-$)+/g, '');
//   }
  
//   // Initialize metaSettings
//   if (!this.metaSettings) {
//     this.metaSettings = {};
//   }
  
//   // Generate sequential SKU - ONLY if no SKU provided and product is new
//   if (!this.skuCode && this.isNew) {
//     try {
//       // Find the most recent product with a SG- SKU
//       const lastProduct = await this.constructor.findOne({ 
//         skuCode: { $regex: /^BB-/ } 
//       }).sort({ createdAt: -1 });
      
//       let nextSequence = 1001;
      
//       if (lastProduct && lastProduct.skuCode) {
//         const parts = lastProduct.skuCode.split('-');
//         if (parts.length === 3) {
//           const lastSeq = parseInt(parts[2]);
//           if (!isNaN(lastSeq)) {
//             nextSequence = lastSeq + 1;
//           }
//         }
//       }
      
//       const timestamp = Date.now().toString().slice(0, 5);
//       this.skuCode = `BB-${timestamp}-${nextSequence}`;
      
//       const existing = await this.constructor.findOne({ skuCode: this.skuCode });
//       if (existing) {
//         this.skuCode = `BB-${timestamp}-${nextSequence}-${Math.floor(Math.random() * 100)}`;
//       }
      
//       console.log(`Generated SKU: ${this.skuCode} for product: ${this.productName}`);
//     } catch (error) {
//       console.error('Error generating SKU:', error);
//       this.skuCode = `BB-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
//     }
//   }
// });

// // Virtuals
// productSchema.virtual('discountPercentage').get(function() {
//   if (this.regularPrice > 0 && this.discountPrice > 0 && this.discountPrice < this.regularPrice) {
//     return Math.round(((this.regularPrice - this.discountPrice) / this.regularPrice) * 100);
//   }
//   return 0;
// });

// productSchema.virtual('stockStatus').get(function() {
//   if (this.stockQuantity <= 0) return 'Out of Stock';
//   if (this.stockAlertQuantity > 0 && this.stockQuantity <= this.stockAlertQuantity) return 'Low Stock';
//   return 'In Stock';
// });

// // Indexes for search
// productSchema.index({ productName: 'text', brand: 'text', fullDescription: 'text' });
// productSchema.index({ category: 1, isActive: 1 });
// productSchema.index({ createdAt: -1 });
// productSchema.index({ isFeatured: 1 });
// productSchema.index({ showOnBanner: 1 });
// productSchema.index({ tags: 1 });
// productSchema.index({ regularPrice: 1 });
// productSchema.index({ discountPrice: 1 });
// productSchema.index({ skuCode: 1 });
// productSchema.index({ barcode: 1 });
// productSchema.index({ unit: 1 });

// // Check if model already exists
// const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
// const CounterModel = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// module.exports = Product;
// module.exports.Counter = CounterModel;

// backend/src/models/Product.js
const mongoose = require('mongoose');

// Counter Schema for sequential SKU generation
const counterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  sequence_value: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', counterSchema);

// Review Schema
const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  userName: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    trim: true
  },
  comment: {
    type: String,
    required: true
  },
  images: [{
    url: String,
    publicId: String
  }],
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  },
  helpful: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Additional Info Schema
const additionalInfoSchema = new mongoose.Schema({
  fieldName: {
    type: String,
    required: true,
    trim: true
  },
  fieldValue: {
    type: String,
    required: true,
    trim: true
  }
});

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true,
    trim: true
  }
});


// Meta Settings Schema
const metaSettingsSchema = new mongoose.Schema({
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [70, 'Meta title should not exceed 70 characters']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description should not exceed 160 characters']
  },
  metaKeywords: [{
    type: String,
    trim: true
  }]
});

// Main Product Schema
const productSchema = new mongoose.Schema({
  // Basic Information
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters']
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    sparse: true,
    trim: true
  },
  shortDescription: {
    type: String,
    trim: true,
    default: ''
  },
  fullDescription: {
    type: String,
    required: [true, 'Full description is required'],
    trim: true
  },

  // Categories
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  categoryName: {
    type: String,
    trim: true
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category.subcategories'
  },
  subcategoryName: {
    type: String,
    trim: true
  },
  childSubcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category.subcategories.children'
  },
  childSubcategoryName: {
    type: String,
    trim: true
  },

  // Brand
  brand: {
    type: String,
    trim: true,
     default: '', 
  },

  // Pricing
  regularPrice: {
    type: Number,
    required: [true, 'Regular price is required'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    default: 0,
    min: [0, 'Discount price cannot be negative']
  },
  costPerItem: {
    type: Number,
    default: 0,
    min: [0, 'Cost per item cannot be negative']
  },
   buyingPrice: {
    type: Number,
    default: 0,
    min: [0, 'Buying price cannot be negative']
  },

  
  // Inventory
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    default: 0,
    min: [0, 'Stock quantity cannot be negative']
  },
  stockAlertQuantity: {
    type: Number,
    default: 0,
    min: [0, 'Stock alert quantity cannot be negative']
  },
  skuCode: {
    type: String,
    unique: true,
    sparse: true
  },
  barcode: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    index: true,
    match: [/^[0-9]{8,13}$/, 'Barcode must be 8-13 digits only']
  },

  // Unit
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    default: 'pcs'
  },

  // Colors
  colors: [{
    type: String,
    trim: true
  }],

  // Delivery
  deliveryInfo: {
    type: String,
    default: ''
  },

  // Media
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    },
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],

  // Video
  videoUrl: {
    type: String,
    default: ''
  },
  videoPublicId: {
    type: String,
    default: ''
  },
  videoType: {
    type: String,
    enum: ['upload', 'youtube'],
    default: 'upload'
  },

  // Tags (ObjectId reference)
  tags: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tag'
  }],
  
  isFeatured: {
    type: Boolean,
    default: false
  },
  showOnBanner: {
    type: Boolean,
    default: false
  },

  // Rating
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },

  // Additional Information
  additionalInfo: [additionalInfoSchema],
  faqs: [faqSchema],

  // Meta Settings
  metaSettings: metaSettingsSchema,

  // Reviews & Stats
  reviews: [reviewSchema],
  reviewStats: {
    averageRating: {
      type: Number,
      default: 0
    },
    totalReviews: {
      type: Number,
      default: 0
    },
    ratingDistribution: {
      1: { type: Number, default: 0 },
      2: { type: Number, default: 0 },
      3: { type: Number, default: 0 },
      4: { type: Number, default: 0 },
      5: { type: Number, default: 0 }
    }
  },

  // Status flags
  isActive: {
    type: Boolean,
    default: true
  },

  // Tracking
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
   updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastUpdatedAt: {
    type: Date,
    default: null
  },

  // Meta
  views: {
    type: Number,
    default: 0
  },
  purchaseCount: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

// Generate slug before saving
productSchema.pre('save', async function() {
  // Only modify slug if it's not manually set
  if (this.isModified('productName') || this.isNew) {
    // If slug is not manually set (empty or null), auto-generate from productName
    if (!this.slug || this.slug === '') {
      this.slug = this.productName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }
  }
  
  // If slug is explicitly set to empty, generate from productName
  if (this.isModified('slug') && !this.slug) {
    this.slug = this.productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  
  // Ensure slug uniqueness (if slug exists, check for duplicates)
  if (this.slug) {
    // Check if slug already exists (excluding current document)
    const existingProduct = await this.constructor.findOne({
      slug: this.slug,
      _id: { $ne: this._id }
    });
    
    if (existingProduct) {
      // If slug exists, append a random suffix to make it unique
      this.slug = `${this.slug}-${Date.now().toString().slice(-4)}`;
    }
  }
  
  if (!this.metaSettings) {
    this.metaSettings = {};
  }
  
  // Generate SKU with HV prefix
  if (!this.skuCode && this.isNew) {
    try {
      const lastProduct = await this.constructor.findOne({ 
        skuCode: { $regex: /^HV-/ } 
      }).sort({ createdAt: -1 });
      
      let nextSequence = 1001;
      
      if (lastProduct && lastProduct.skuCode) {
        const parts = lastProduct.skuCode.split('-');
        if (parts.length === 3) {
          const lastSeq = parseInt(parts[2]);
          if (!isNaN(lastSeq)) {
            nextSequence = lastSeq + 1;
          }
        }
      }
      
      const timestamp = Date.now().toString().slice(0, 5);
      this.skuCode = `HV-${timestamp}-${nextSequence}`;
      
      const existing = await this.constructor.findOne({ skuCode: this.skuCode });
      if (existing) {
        this.skuCode = `HV-${timestamp}-${nextSequence}-${Math.floor(Math.random() * 100)}`;
      }
      
      console.log(`Generated SKU: ${this.skuCode} for product: ${this.productName}`);
    } catch (error) {
      console.error('Error generating SKU:', error);
      this.skuCode = `HV-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    }
  }
});

// Virtuals
productSchema.virtual('discountPercentage').get(function() {
  if (this.regularPrice > 0 && this.discountPrice > 0 && this.discountPrice < this.regularPrice) {
    return Math.round(((this.regularPrice - this.discountPrice) / this.regularPrice) * 100);
  }
  return 0;
});

productSchema.virtual('stockStatus').get(function() {
  if (this.stockQuantity <= 0) return 'Out of Stock';
  if (this.stockAlertQuantity > 0 && this.stockQuantity <= this.stockAlertQuantity) return 'Low Stock';
  return 'In Stock';
});

// Indexes
productSchema.index({ productName: 'text', brand: 'text', fullDescription: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ showOnBanner: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ regularPrice: 1 });
productSchema.index({ discountPrice: 1 });
productSchema.index({ skuCode: 1 });
productSchema.index({ barcode: 1 });
productSchema.index({ unit: 1 });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);
const CounterModel = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

module.exports = Product;
module.exports.Counter = CounterModel;