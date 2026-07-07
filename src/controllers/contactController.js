const Contact = require('../models/Contact');

// @desc    Get contact data (public)
// @route   GET /api/contact
// @access  Public
const getPublicContact = async (req, res) => {
  try {
    let contact = await Contact.findOne({ isActive: true });
    
    if (!contact) {
      contact = await createDefaultContact();
    }

    // Filter active items
    const activeStats = contact.stats.filter(s => s.isActive !== false);
    const activeQuickContacts = contact.quickContacts.filter(q => q.isActive !== false);
    const activeSocialLinks = contact.socialLinks.filter(s => s.isActive !== false);
    const activeFaqs = contact.faq.items.filter(f => f.isActive !== false);

    res.json({
      success: true,
      data: {
        hero: contact.hero,
        stats: activeStats.sort((a, b) => a.displayOrder - b.displayOrder),
        quickContacts: activeQuickContacts.sort((a, b) => a.displayOrder - b.displayOrder),
        rightSide: contact.rightSide,
        socialLinks: activeSocialLinks.sort((a, b) => a.displayOrder - b.displayOrder),
        faq: {
          title: contact.faq.title,
          description: contact.faq.description,
          badge: contact.faq.badge,
          items: activeFaqs.sort((a, b) => a.displayOrder - b.displayOrder)
        },
        map: contact.map,
        cta: contact.cta,
        form: contact.form
      }
    });
  } catch (error) {
    console.error('Get public contact error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching contact data'
    });
  }
};

// @desc    Get contact data (admin)
// @route   GET /api/admin/contact
// @access  Private (Admin/Moderator)
const getAdminContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    
    if (!contact) {
      contact = await createDefaultContact();
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Get admin contact error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching contact data'
    });
  }
};

// @desc    Update contact data
// @route   PUT /api/admin/contact
// @access  Private (Admin/Moderator)
const updateContact = async (req, res) => {
  try {
    let contact = await Contact.findOne();
    
    if (!contact) {
      contact = await createDefaultContact();
    }

    const {
      hero,
      stats,
      quickContacts,
      rightSide,
      socialLinks,
      faq,
      map,
      cta,
      form,
      isActive
    } = req.body;

    // Update fields
    if (hero) contact.hero = hero;
    if (stats) contact.stats = stats;
    if (quickContacts) contact.quickContacts = quickContacts;
    if (rightSide) contact.rightSide = rightSide;
    if (socialLinks) contact.socialLinks = socialLinks;
    if (faq) contact.faq = faq;
    if (map) contact.map = map;
    if (cta) contact.cta = cta;
    if (form) contact.form = form;
    if (isActive !== undefined) contact.isActive = isActive;

    contact.updatedBy = req.user.id;
    await contact.save();

    const updatedContact = await Contact.findById(contact._id);

    res.json({
      success: true,
      data: updatedContact,
      message: 'Contact page updated successfully'
    });
  } catch (error) {
    console.error('Update contact error:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errorMessages = [];
      
      // Parse validation errors
      for (const [path, err] of Object.entries(error.errors)) {
        // Check if it's a socialLinks url error
        if (path.includes('socialLinks') && path.includes('url')) {
          const index = parseInt(path.split('.')[1]) + 1; // Convert 0-based to 1-based
          errorMessages.push(`Social link #${index} is missing a URL. Please add a URL or remove this link.`);
        } 
        // Check if it's a socialLinks platform error
        else if (path.includes('socialLinks') && path.includes('platform')) {
          const index = parseInt(path.split('.')[1]) + 1;
          errorMessages.push(`Social link #${index} has an invalid platform. Please select a valid platform.`);
        }
        // Check if it's a stats error
        else if (path.includes('stats')) {
          const index = parseInt(path.split('.')[1]) + 1;
          if (path.includes('value')) {
            errorMessages.push(`Stat #${index} is missing a value.`);
          } else if (path.includes('label')) {
            errorMessages.push(`Stat #${index} is missing a label.`);
          } else {
            errorMessages.push(`Stat #${index} has invalid data.`);
          }
        }
        // Check if it's a quickContact error
        else if (path.includes('quickContacts')) {
          const index = parseInt(path.split('.')[1]) + 1;
          if (path.includes('label')) {
            errorMessages.push(`Quick contact #${index} is missing a label.`);
          } else if (path.includes('value')) {
            errorMessages.push(`Quick contact #${index} is missing a value.`);
          } else if (path.includes('link')) {
            errorMessages.push(`Quick contact #${index} is missing a link.`);
          } else {
            errorMessages.push(`Quick contact #${index} has invalid data.`);
          }
        }
        // Check if it's a FAQ error
        else if (path.includes('faq')) {
          if (path.includes('question')) {
            errorMessages.push(`FAQ question is missing.`);
          } else if (path.includes('answer')) {
            errorMessages.push(`FAQ answer is missing.`);
          }
        }
        // Generic error
        else {
          // Get a human-readable field name
          const fieldName = path.split('.').pop().replace(/([A-Z])/g, ' $1').toLowerCase();
          errorMessages.push(`The "${fieldName}" field is required.`);
        }
      }
      
      // Return user-friendly error messages
      return res.status(400).json({
        success: false,
        error: errorMessages.join(' '),
        // Keep detailed errors for debugging if needed
        details: errorMessages
      });
    }
    
    // Handle other errors
    res.status(500).json({
      success: false,
      error: 'Failed to update contact page. Please try again.',
      details: error.message
    });
  }
};

// @desc    Reset contact to default
// @route   POST /api/admin/contact/reset
// @access  Private (Admin)
const resetContact = async (req, res) => {
  try {
    await Contact.deleteOne({});
    const contact = await createDefaultContact();

    res.json({
      success: true,
      data: contact,
      message: 'Contact page reset to default successfully'
    });
  } catch (error) {
    console.error('Reset contact error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while resetting contact page'
    });
  }
};

// @desc    Get raw database data
// @route   GET /api/admin/contact/raw-data
// @access  Private (Admin)
const getRawData = async (req, res) => {
  try {
    const contact = await Contact.findOne().lean();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        error: 'No contact data found'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error getting raw data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Create default contact
const createDefaultContact = async () => {
  const defaultContact = {
    hero: {
      bgImage: '/images/contact.png',
      badge: 'Get in Touch',
      badgeIcon: 'Zap',
      title: "We're Here to",
      highlightText: 'Help You',
      description: 'Have questions about our power products? Our team is ready to assist you with expert support and fast solutions.'
    },
    stats: [
      { icon: 'FaUsers', value: '50K+', label: 'Happy Customers', displayOrder: 0, isActive: true },
      { icon: 'FaStar', value: '4.9/5', label: 'Rating', displayOrder: 1, isActive: true },
      { icon: 'Award', value: '100%', label: 'Satisfaction', displayOrder: 2, isActive: true },
      { icon: 'FaClock', value: '24/7', label: 'Available', displayOrder: 3, isActive: true }
    ],
    quickContacts: [
      {
        icon: 'FaWhatsapp',
        label: 'WhatsApp',
        value: '+880 1234 567890',
        link: 'https://wa.me/8801234567890',
        color: 'bg-green-500',
        displayOrder: 0,
        isActive: true
      },
      {
        icon: 'FaPhone',
        label: 'Phone',
        value: '+880 1234 567890',
        link: 'tel:+8801234567890',
        color: 'bg-[#06B6D4]',
        displayOrder: 1,
        isActive: true
      },
      {
        icon: 'FaEnvelope',
        label: 'Email',
        value: 'support@hypervolt.com',
        link: 'mailto:support@hypervolt.com',
        color: 'bg-[#004767]',
        displayOrder: 2,
        isActive: true
      },
      {
        icon: 'FaMapMarkerAlt',
        label: 'Address',
        value: 'Dhaka, Bangladesh',
        link: 'https://maps.google.com',
        color: 'bg-[#0891B2]',
        displayOrder: 3,
        isActive: true
      }
    ],
    rightSide: {
      image: '/images/contact-image.jpg',
      title: 'HyperVolt',
      subtitle: 'Premium Power Products',
      badge: 'Power Your World',
      quickContactTitle: 'Quick Contact',
      socialTitle: 'Follow Us'
    },
    socialLinks: [
      { platform: 'facebook', url: '#', icon: 'FaFacebookF', color: 'hover:bg-[#1877F2]', displayOrder: 0, isActive: true },
      { platform: 'instagram', url: '#', icon: 'FaInstagram', color: 'hover:bg-[#E4405F]', displayOrder: 1, isActive: true },
      { platform: 'youtube', url: '#', icon: 'FaYoutube', color: 'hover:bg-[#FF0000]', displayOrder: 2, isActive: true },
      { platform: 'twitter', url: '#', icon: 'FaTwitter', color: 'hover:bg-[#1DA1F2]', displayOrder: 3, isActive: true },
      { platform: 'linkedin', url: '#', icon: 'FaLinkedinIn', color: 'hover:bg-[#0A66C2]', displayOrder: 4, isActive: true }
    ],
    faq: {
      title: 'Frequently Asked Questions',
      description: 'Find quick answers to common questions',
      badge: 'FAQ',
      items: [
        {
          question: 'How do I track my order?',
          answer: "You'll receive a tracking number via email once your order ships. You can also track your order in your account dashboard.",
          displayOrder: 0,
          isActive: true
        },
        {
          question: 'What is the warranty period?',
          answer: 'All HyperVolt products come with a 1-year warranty against manufacturing defects. Please keep your purchase receipt for warranty claims.',
          displayOrder: 1,
          isActive: true
        },
        {
          question: 'Do you offer international shipping?',
          answer: "Currently we only ship within Bangladesh. We're working on expanding our delivery network.",
          displayOrder: 2,
          isActive: true
        },
        {
          question: 'How can I return a product?',
          answer: 'Contact our support team within 7 days of delivery to initiate a return. Products must be unused with original packaging.',
          displayOrder: 3,
          isActive: true
        },
        {
          question: 'What payment methods do you accept?',
          answer: 'We accept Cash on Delivery (COD), mobile banking (bKash, Nagad), and online card payments.',
          displayOrder: 4,
          isActive: true
        },
        {
          question: 'How long does delivery take?',
          answer: 'Standard delivery takes 2-5 business days depending on your location. Express delivery is available in Dhaka.',
          displayOrder: 5,
          isActive: true
        }
      ]
    },
    map: {
      embedCode: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3649.5029279808477!2d90.3686038739732!3d23.83626858547701!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c14a38f924d3%3A0x39a8c038652ae720!2sHouse%20470%2C%20R9PC%2BHGM%2C%206%20Avenue%206%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1781765267904!5m2!1sen!2sbd',
      title: 'Our Location'
    },
    cta: {
      title: 'Need Immediate Assistance?',
      description: 'Our support team is ready to help you with any questions.',
      buttonText: 'Call Now',
      buttonLink: 'tel:+8801234567890',
      secondaryButtonText: 'Browse Products',
      secondaryButtonLink: '/products'
    },
    form: {
      title: 'Send Us a Message',
      description: "We'll get back to you within 24 hours",
      successMessage: 'Thank you! We\'ll get back to you within 24 hours.'
    },
    isActive: true
  };

  return await Contact.create(defaultContact);
};

module.exports = {
  getPublicContact,
  getAdminContact,
  updateContact,
  resetContact,
  getRawData
};