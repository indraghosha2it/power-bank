const mongoose = require('mongoose');

// Navbar Item Schema
const navbarItemSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  href: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    enum: ['Home', 'Zap', 'MapPin', 'Info', 'Phone', 'Package', 'User', 'Heart'],
    default: 'Home'
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  requiredRole: {
    type: String,
    enum: ['all', 'authenticated', 'admin', 'moderator', 'call_center_agent', 'super_admin'],
    default: 'all'
  }
});

// Main Navbar Schema
const navbarSchema = new mongoose.Schema({
  items: [navbarItemSchema],
  logo: {
    text: {
      type: String,
      default: 'HyperVolt'
    },
    highlightText: {
      type: String,
      default: 'Volt'
    },
    icon: {
      type: String,
      default: 'Zap'
    },
    logoUrl: {
      type: String,
      default: ''
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Indexes
navbarSchema.index({ isActive: 1 });
navbarSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Navbar', navbarSchema);