const mongoose = require('mongoose');

const tagSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Tag name is required'],
    unique: true,
    trim: true,
    maxlength: [50, 'Tag name cannot exceed 50 characters']
  },
  slug: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true
  },
  image: {
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String,
      required: true
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// ✅ FIXED: Following your pattern - no parameters, no next()
tagSchema.pre('save', function() {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
  // No return, no next() needed
});

// Indexes
tagSchema.index({ name: 1 });
tagSchema.index({ isActive: 1 });
tagSchema.index({ slug: 1 });

// Check if model already exists (following your pattern)
const Tag = mongoose.models.Tag || mongoose.model('Tag', tagSchema);

module.exports = Tag;