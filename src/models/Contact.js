const mongoose = require('mongoose');

// Stats Card Schema (max 4 items)
const statItemSchema = new mongoose.Schema({
  icon: {
    type: String,
    enum: ['FaUsers', 'FaStar', 'Award', 'FaClock', 'FaBolt', 'FaShield', 'FaTruck', 'FaHeadset'],
    default: 'FaUsers'
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Quick Contact Schema (max 4 items)
const quickContactItemSchema = new mongoose.Schema({
  icon: {
    type: String,
    enum: ['FaWhatsapp', 'FaPhone', 'FaEnvelope', 'FaMapMarkerAlt'],
    required: true
  },
  label: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: String,
    required: true,
    trim: true
  },
  link: {
    type: String,
    required: true,
    trim: true
  },
  color: {
    type: String,
    default: 'bg-[#06B6D4]'
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// FAQ Schema
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
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Social Link Schema
const socialLinkSchema = new mongoose.Schema({
   platform: {
    type: String,
    required: true,
    trim: true
    // Remove enum validation
  },
  url: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    default: 'FaFacebookF'
  },
  color: {
    type: String,
    default: 'hover:bg-[#1877F2]'
  },
  displayOrder: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

// Main Contact Schema
const contactSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    bgImage: {
      type: String,
      default: '/images/contact.png'
    },
    badge: {
      type: String,
      default: 'Get in Touch'
    },
    badgeIcon: {
      type: String,
      default: 'Zap'
    },
    title: {
      type: String,
      default: "We're Here to"
    },
    highlightText: {
      type: String,
      default: 'Help You'
    },
    description: {
      type: String,
      default: 'Have questions about our power products? Our team is ready to assist you with expert support and fast solutions.'
    }
  },

  // Stats Section (max 4)
  stats: [statItemSchema],

  // Quick Contact (exactly 4)
  quickContacts: [quickContactItemSchema],

  // Right Side Content
  rightSide: {
    image: {
      type: String,
      default: '/images/contact-image.jpg'
    },
    title: {
      type: String,
      default: 'HyperVolt'
    },
    subtitle: {
      type: String,
      default: 'Premium Power Products'
    },
    badge: {
      type: String,
      default: 'Power Your World'
    },
    quickContactTitle: {
      type: String,
      default: 'Quick Contact'
    },
    socialTitle: {
      type: String,
      default: 'Follow Us'
    }
  },

  // Social Links
  socialLinks: [socialLinkSchema],

  // FAQ Section
  faq: {
    title: {
      type: String,
      default: 'Frequently Asked Questions'
    },
    description: {
      type: String,
      default: 'Find quick answers to common questions'
    },
    badge: {
      type: String,
      default: 'FAQ'
    },
    items: [faqSchema]
  },

  // Map
  map: {
    embedCode: {
      type: String,
      default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.5029279808477!2d90.3686038739732!3d23.83626858547701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c14a38f924d3%3A0x39a8c038652ae720!2sHouse%20470%2C%20R9PC%2BHGM%2C%206%20Avenue%206%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1781765267904!5m2!1sen!2sbd'
    },
    title: {
      type: String,
      default: 'Our Location'
    }
  },

  // CTA Section
  cta: {
    title: {
      type: String,
      default: 'Need Immediate Assistance?'
    },
    description: {
      type: String,
      default: 'Our support team is ready to help you with any questions.'
    },
    buttonText: {
      type: String,
      default: 'Call Now'
    },
    buttonLink: {
      type: String,
      default: 'tel:+8801234567890'
    },
    secondaryButtonText: {
      type: String,
      default: 'Browse Products'
    },
    secondaryButtonLink: {
      type: String,
      default: '/products'
    }
  },

  // Form Settings
  form: {
    title: {
      type: String,
      default: 'Send Us a Message'
    },
    description: {
      type: String,
      default: "We'll get back to you within 24 hours"
    },
    successMessage: {
      type: String,
      default: 'Thank you! We\'ll get back to you within 24 hours.'
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
contactSchema.index({ isActive: 1 });
contactSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('Contact', contactSchema);