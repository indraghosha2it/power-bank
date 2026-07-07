const mongoose = require('mongoose');

// Stats Schema (max 4 items)
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

// Value Schema (max 4 items)
const valueItemSchema = new mongoose.Schema({
  icon: {
    type: String,
    enum: ['FaBolt', 'FaShieldAlt', 'FaBatteryFull', 'FaUsers', 'FaStar', 'FaClock', 'FaAward', 'FaHands'],
    default: 'FaBolt'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
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

// Feature Schema (max 6 items)
const featureItemSchema = new mongoose.Schema({
  icon: {
    type: String,
    enum: ['FaShieldAlt', 'FaBatteryFull', 'FaPlug', 'FaTools', 'FaLeaf', 'FaGlobe', 'FaMicrochip', 'FaRocket'],
    default: 'FaShieldAlt'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
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

// Review Schema
const reviewSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  quote: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  rating: {
    type: Number,
    default: 5,
    min: 1,
    max: 5
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

// Milestone Schema
const milestoneSchema = new mongoose.Schema({
  year: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  icon: {
    type: String,
    enum: ['FaRocket', 'FaBolt', 'FaPlug', 'FaUsers', 'FaMicrochip', 'FaAward', 'FaTrophy'],
    default: 'FaRocket'
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

// Main About Schema
const aboutSchema = new mongoose.Schema({
  // Hero Section
  hero: {
    image: {
      type: String,
      default: '/images/contact.png'
    },
    badge: {
      type: String,
      default: 'About HyperVolt'
    },
    title: {
      type: String,
      default: 'Powering Your'
    },
    highlightText: {
      type: String,
      default: 'World, Every Day'
    },
    description: {
      type: String,
      default: "We're on a mission to deliver reliable, innovative, and safe power solutions that keep you connected when it matters most."
    },
    buttonText: {
      type: String,
      default: 'Explore Products'
    },
    buttonLink: {
      type: String,
      default: '/products'
    },
    secondaryButtonText: {
      type: String,
      default: 'Get in Touch'
    },
    secondaryButtonLink: {
      type: String,
      default: '/contact'
    }
  },

  // About Us Section
  aboutUs: {
    badge: {
      type: String,
      default: 'About Us'
    },
    title: {
      type: String,
      default: 'Empowering Lives Through Power'
    },
    highlightText: {
      type: String,
      default: 'Power'
    },
    description: {
      type: String,
      default: 'HyperVolt is dedicated to providing innovative, reliable, and safe power solutions that keep you connected and productive. From premium power banks to fast chargers, we bring you the best in portable power technology.'
    }
  },

  // Stats Section (max 4)
  stats: [statItemSchema],

  // Mission Section
  mission: {
    image: {
      type: String,
      default: '/images/bg6.png'
    },
    overlayImage: {
      type: String,
      default: '/images/bg9.PNG'
    },
    badge: {
      type: String,
      default: 'Our Mission'
    },
    title: {
      type: String,
      default: 'Powering Possibilities'
    },
    highlightText: {
      type: String,
      default: 'Possibilities'
    },
    description: {
      type: String,
      default: 'Our mission is to make reliable portable power accessible to everyone, empowering people to stay connected and productive wherever they go.'
    },
    points: {
      type: [String],
      default: [
        'Provide innovative charging solutions',
        'Ensure uncompromised safety and quality',
        'Deliver exceptional customer experience',
        'Drive sustainable practices'
      ]
    }
  },

  // Vision Section
  vision: {
    image: {
      type: String,
      default: '/images/bg8.png'
    },
    overlayImage: {
      type: String,
      default: '/images/bg6.png'
    },
    badge: {
      type: String,
      default: 'Our Vision'
    },
    title: {
      type: String,
      default: 'A World Connected'
    },
    highlightText: {
      type: String,
      default: 'Connected'
    },
    description: {
      type: String,
      default: 'We envision a world where everyone has access to reliable, sustainable, and innovative power solutions that enhance their daily lives.'
    },
    points: {
      type: [String],
      default: [
        'Become the most trusted power brand in Bangladesh',
        'Lead innovation in charging technology',
        'Create sustainable power solutions',
        'Build a community of empowered users'
      ]
    }
  },

  // Values Section (max 4)
  values: [valueItemSchema],

  // Features Section (max 6)
  features: [featureItemSchema],

  // Testimonials Section
  testimonials: {
    bgImage: {
      type: String,
      default: '/images/contact.png'
    },
    badge: {
      type: String,
      default: 'Testimonials'
    },
    title: {
      type: String,
      default: 'What Our Customers Say'
    },
    highlightText: {
      type: String,
      default: 'Customers Say'
    },
    description: {
      type: String,
      default: 'Real stories from real customers who trust HyperVolt.'
    },
    items: [reviewSchema]
  },

  // Milestones Section
  milestones: {
    badge: {
      type: String,
      default: 'Our Journey'
    },
    title: {
      type: String,
      default: 'Milestones'
    },
    description: {
      type: String,
      default: 'Every step has been a powerful journey.'
    },
    items: [milestoneSchema]
  },

  // CTA Section
  cta: {
    title: {
      type: String,
      default: 'Ready to Power Your World?'
    },
    description: {
      type: String,
      default: 'Explore our collection of premium power solutions.'
    },
    buttonText: {
      type: String,
      default: 'Shop Now'
    },
    buttonLink: {
      type: String,
      default: '/products'
    },
    secondaryButtonText: {
      type: String,
      default: 'Contact Us'
    },
    secondaryButtonLink: {
      type: String,
      default: '/contact'
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
aboutSchema.index({ isActive: 1 });
aboutSchema.index({ updatedAt: -1 });

module.exports = mongoose.model('About', aboutSchema);