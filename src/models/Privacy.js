const mongoose = require('mongoose');

// Privacy Section Schema
const privacySectionSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    enum: ['FaShieldAlt', 'FaLock', 'FaUserShield', 'FaDatabase', 'FaGlobe', 'FaUsers', 'FaStore', 'FaEnvelope', 'FaPhone', 'FaMapMarkerAlt', 'FaClipboardList', 'FaScroll'],
    default: 'FaShieldAlt'
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  details: [{
    type: String,
    trim: true
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  displayOrder: {
    type: Number,
    default: 0
  }
});

// Main Privacy Schema
const privacySchema = new mongoose.Schema({
  heroTitle: {
    type: String,
    default: 'Privacy Policy'
  },
  heroDescription: {
    type: String,
    default: 'Your privacy is important to us. Learn how we collect, use, and protect your personal information.'
  },
  introText: {
    type: String,
    default: 'Welcome to HyperVolt. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.'
  },
  sections: [privacySectionSchema],
  lastUpdated: {
    type: String,
    default: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
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
privacySchema.index({ isActive: 1 });
privacySchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Privacy', privacySchema);