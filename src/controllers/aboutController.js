const About = require('../models/About');

// @desc    Get public about data
// @route   GET /api/about/page
// @access  Public
const getPublicAbout = async (req, res) => {
  try {
    let about = await About.findOne({ isActive: true });
    
    if (!about) {
      about = await createDefaultAbout();
    }

    // Filter active items
    const activeStats = about.stats.filter(s => s.isActive !== false);
    const activeValues = about.values.filter(v => v.isActive !== false);
    const activeFeatures = about.features.filter(f => f.isActive !== false);
    const activeReviews = about.testimonials.items.filter(r => r.isActive !== false);
    const activeMilestones = about.milestones.items.filter(m => m.isActive !== false);

    res.json({
      success: true,
      data: {
        hero: about.hero,
        aboutUs: about.aboutUs,
        stats: activeStats.sort((a, b) => a.displayOrder - b.displayOrder),
        mission: about.mission,
        vision: about.vision,
        values: activeValues.sort((a, b) => a.displayOrder - b.displayOrder),
        features: activeFeatures.sort((a, b) => a.displayOrder - b.displayOrder),
        testimonials: {
          bgImage: about.testimonials.bgImage,
          badge: about.testimonials.badge,
          title: about.testimonials.title,
          highlightText: about.testimonials.highlightText,
          description: about.testimonials.description,
          items: activeReviews.sort((a, b) => a.displayOrder - b.displayOrder)
        },
        milestones: {
          badge: about.milestones.badge,
          title: about.milestones.title,
          description: about.milestones.description,
          items: activeMilestones.sort((a, b) => a.displayOrder - b.displayOrder)
        },
        cta: about.cta
      }
    });
  } catch (error) {
    console.error('Get public about error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching about data'
    });
  }
};

// @desc    Get admin about data
// @route   GET /api/admin/about
// @access  Private (Admin/Moderator)
const getAdminAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      about = await createDefaultAbout();
    }

    res.json({
      success: true,
      data: about
    });
  } catch (error) {
    console.error('Get admin about error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching about data'
    });
  }
};

// @desc    Update about data
// @route   PUT /api/admin/about
// @access  Private (Admin/Moderator)
const updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      about = await createDefaultAbout();
    }

    const {
      hero,
      aboutUs,
      stats,
      mission,
      vision,
      values,
      features,
      testimonials,
      milestones,
      cta,
      isActive
    } = req.body;

    // Update fields
    if (hero) about.hero = hero;
    if (aboutUs) about.aboutUs = aboutUs;
    if (stats) about.stats = stats;
    if (mission) about.mission = mission;
    if (vision) about.vision = vision;
    if (values) about.values = values;
    if (features) about.features = features;
    if (testimonials) about.testimonials = testimonials;
    if (milestones) about.milestones = milestones;
    if (cta) about.cta = cta;
    if (isActive !== undefined) about.isActive = isActive;

    about.updatedBy = req.user.id;
    await about.save();

    const updatedAbout = await About.findById(about._id);

    res.json({
      success: true,
      data: updatedAbout,
      message: 'About page updated successfully'
    });
  } catch (error) {
    console.error('Update about error:', error);
    
    if (error.name === 'ValidationError') {
      const errorMessages = [];
      for (const [path, err] of Object.entries(error.errors)) {
        const fieldName = path.split('.').pop().replace(/([A-Z])/g, ' $1').toLowerCase();
        errorMessages.push(`The "${fieldName}" field is required.`);
      }
      
      return res.status(400).json({
        success: false,
        error: errorMessages.join(' '),
        details: errorMessages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to update about page. Please try again.',
      details: error.message
    });
  }
};

// @desc    Reset about to default
// @route   POST /api/admin/about/reset
// @access  Private (Admin)
const resetAbout = async (req, res) => {
  try {
    await About.deleteOne({});
    const about = await createDefaultAbout();

    res.json({
      success: true,
      data: about,
      message: 'About page reset to default successfully'
    });
  } catch (error) {
    console.error('Reset about error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while resetting about page'
    });
  }
};

// @desc    Create default about
const createDefaultAbout = async () => {
  const defaultAbout = {
    hero: {
      image: '/images/contact.png',
      badge: 'About HyperVolt',
      title: 'Powering Your',
      highlightText: 'World, Every Day',
      description: "We're on a mission to deliver reliable, innovative, and safe power solutions that keep you connected when it matters most.",
      buttonText: 'Explore Products',
      buttonLink: '/products',
      secondaryButtonText: 'Get in Touch',
      secondaryButtonLink: '/contact'
    },
    aboutUs: {
      badge: 'About Us',
      title: 'Empowering Lives Through Power',
      highlightText: 'Power',
      description: 'HyperVolt is dedicated to providing innovative, reliable, and safe power solutions that keep you connected and productive. From premium power banks to fast chargers, we bring you the best in portable power technology.'
    },
    stats: [
      { icon: 'FaUsers', value: '50K+', label: 'Happy Customers', displayOrder: 0, isActive: true },
      { icon: 'FaStar', value: '4.9/5', label: 'Rating', displayOrder: 1, isActive: true },
      { icon: 'Award', value: '100%', label: 'Quality Guaranteed', displayOrder: 2, isActive: true },
      { icon: 'FaClock', value: '24/7', label: 'Customer Support', displayOrder: 3, isActive: true }
    ],
    mission: {
      image: '/images/bg6.png',
      overlayImage: '/images/bg9.PNG',
      badge: 'Our Mission',
      title: 'Powering Possibilities',
      highlightText: 'Possibilities',
      description: 'Our mission is to make reliable portable power accessible to everyone, empowering people to stay connected and productive wherever they go.',
      points: [
        'Provide innovative charging solutions',
        'Ensure uncompromised safety and quality',
        'Deliver exceptional customer experience',
        'Drive sustainable practices'
      ]
    },
    vision: {
      image: '/images/bg8.png',
      overlayImage: '/images/bg6.png',
      badge: 'Our Vision',
      title: 'A World Connected',
      highlightText: 'Connected',
      description: 'We envision a world where everyone has access to reliable, sustainable, and innovative power solutions that enhance their daily lives.',
      points: [
        'Become the most trusted power brand in Bangladesh',
        'Lead innovation in charging technology',
        'Create sustainable power solutions',
        'Build a community of empowered users'
      ]
    },
    values: [
      {
        icon: 'FaBolt',
        title: 'Innovation',
        description: 'Cutting-edge charging technology for modern needs.',
        displayOrder: 0,
        isActive: true
      },
      {
        icon: 'FaShieldAlt',
        title: 'Safety',
        description: 'Rigorous testing for your complete peace of mind.',
        displayOrder: 1,
        isActive: true
      },
      {
        icon: 'FaBatteryFull',
        title: 'Quality',
        description: 'Premium components for long-lasting performance.',
        displayOrder: 2,
        isActive: true
      },
      {
        icon: 'FaUsers',
        title: 'Customer First',
        description: 'Your satisfaction is our top priority.',
        displayOrder: 3,
        isActive: true
      }
    ],
    features: [
      {
        icon: 'FaShieldAlt',
        title: 'Advanced Safety',
        description: 'Multi-layer protection against overcharging and overheating.',
        displayOrder: 0,
        isActive: true
      },
      {
        icon: 'FaBatteryFull',
        title: 'High Capacity',
        description: 'Power banks from 10000mAh to 30000mAh for all-day power.',
        displayOrder: 1,
        isActive: true
      },
      {
        icon: 'FaPlug',
        title: 'Fast Charging',
        description: 'Quick Charge 3.0 and Power Delivery technologies.',
        displayOrder: 2,
        isActive: true
      },
      {
        icon: 'FaTools',
        title: 'Durable Design',
        description: 'Premium materials for long-lasting performance.',
        displayOrder: 3,
        isActive: true
      },
      {
        icon: 'FaLeaf',
        title: 'Eco-Friendly',
        description: 'Sustainable practices and environmentally conscious packaging.',
        displayOrder: 4,
        isActive: true
      },
      {
        icon: 'FaGlobe',
        title: 'Global Standards',
        description: 'Products meet international quality and safety standards.',
        displayOrder: 5,
        isActive: true
      }
    ],
    testimonials: {
      bgImage: '/images/contact.png',
      badge: 'Testimonials',
      title: 'What Our Customers Say',
      highlightText: 'Customers Say',
      description: 'Real stories from real customers who trust HyperVolt.',
      items: [
        {
          name: 'Md. Rahman',
          role: 'Business Owner',
          quote: 'HyperVolt power banks have been a game-changer for my business. Reliable, fast, and durable. I\'ve recommended them to all my colleagues.',
          rating: 5,
          displayOrder: 0,
          isActive: true
        },
        {
          name: 'Sadia Khan',
          role: 'Digital Nomad',
          quote: 'I never run out of battery when I\'m traveling. HyperVolt keeps me connected everywhere I go.',
          rating: 5,
          displayOrder: 1,
          isActive: true
        },
        {
          name: 'Ahmed Hossain',
          role: 'Tech Enthusiast',
          quote: 'The best power bank I\'ve ever used. Fast charging, premium build quality, and the capacity is amazing.',
          rating: 5,
          displayOrder: 2,
          isActive: true
        }
      ]
    },
    milestones: {
      badge: 'Our Journey',
      title: 'Milestones',
      description: 'Every step has been a powerful journey.',
      items: [
        {
          year: '2020',
          title: 'Founded',
          description: 'HyperVolt was born with a vision to revolutionize portable power.',
          icon: 'FaRocket',
          displayOrder: 0,
          isActive: true
        },
        {
          year: '2021',
          title: 'First Product Launch',
          description: 'Launched our first premium power bank with fast charging technology.',
          icon: 'FaBolt',
          displayOrder: 1,
          isActive: true
        },
        {
          year: '2022',
          title: 'Expansion',
          description: 'Expanded our product line to include chargers, cables, and accessories.',
          icon: 'FaPlug',
          displayOrder: 2,
          isActive: true
        },
        {
          year: '2023',
          title: '50K+ Customers',
          description: 'Served over 50,000 customers across Bangladesh with reliable power solutions.',
          icon: 'FaUsers',
          displayOrder: 3,
          isActive: true
        },
        {
          year: '2024',
          title: 'Innovation Leader',
          description: 'Became the go-to brand for innovative charging solutions in Bangladesh.',
          icon: 'FaMicrochip',
          displayOrder: 4,
          isActive: true
        }
      ]
    },
    cta: {
      title: 'Ready to Power Your World?',
      description: 'Explore our collection of premium power solutions.',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      secondaryButtonText: 'Contact Us',
      secondaryButtonLink: '/contact'
    },
    isActive: true
  };

  return await About.create(defaultAbout);
};

module.exports = {
  getPublicAbout,
  getAdminAbout,
  updateAbout,
  resetAbout
};