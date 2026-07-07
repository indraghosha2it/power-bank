const Privacy = require('../models/Privacy');

// Helper: Generate section ID
const generateSectionId = () => {
  return Math.floor(Math.random() * 1000);
};

// @desc    Get privacy policy (public)
// @route   GET /api/privacy
// @access  Public
const getPublicPrivacy = async (req, res) => {
  try {
    let privacy = await Privacy.findOne({ isActive: true });
    
    if (!privacy) {
      privacy = await createDefaultPrivacy();
    }

    // ONLY show active sections to the public
    const activeSections = privacy.sections.filter(section => section.isActive !== false);
    
    res.json({
      success: true,
      data: {
        heroTitle: privacy.heroTitle,
        heroDescription: privacy.heroDescription,
        introText: privacy.introText,
        sections: activeSections.sort((a, b) => a.displayOrder - b.displayOrder),
        lastUpdated: privacy.lastUpdated
      }
    });
  } catch (error) {
    console.error('Get public privacy error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching privacy policy'
    });
  }
};

// @desc    Get privacy policy (admin) - SHOW ALL SECTIONS
// @route   GET /api/admin/privacy
// @access  Private (Admin/Moderator)
const getAdminPrivacy = async (req, res) => {
  try {
    let privacy = await Privacy.findOne();
    
    if (!privacy) {
      privacy = await createDefaultPrivacy();
    }

    // IMPORTANT: DO NOT FILTER - Show ALL sections including inactive
    const sortedSections = privacy.sections.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    privacy.sections = sortedSections;

    console.log('📊 ADMIN API - ALL sections (including inactive):');
    console.log(`Total: ${privacy.sections.length} sections`);
    privacy.sections.forEach(s => {
      console.log(`  ${s.title}: isActive = ${s.isActive} (${typeof s.isActive})`);
    });

    res.json({
      success: true,
      data: privacy
    });
  } catch (error) {
    console.error('Get admin privacy error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching privacy policy'
    });
  }
};

// @desc    Update privacy policy
// @route   PUT /api/admin/privacy
// @access  Private (Admin/Moderator)
const updatePrivacy = async (req, res) => {
  try {
    console.log('📥 Received update request');
    
    let privacy = await Privacy.findOne();
    
    if (!privacy) {
      privacy = await createDefaultPrivacy();
    }

    const { 
      heroTitle, 
      heroDescription, 
      introText, 
      sections, 
      lastUpdated,
      isActive 
    } = req.body;

    if (heroTitle) privacy.heroTitle = heroTitle;
    if (heroDescription) privacy.heroDescription = heroDescription;
    if (introText) privacy.introText = introText;
    if (lastUpdated) privacy.lastUpdated = lastUpdated;
    if (isActive !== undefined) privacy.isActive = isActive;

    if (sections && Array.isArray(sections)) {
      console.log('📊 Sections received from frontend:');
      sections.forEach(s => {
        console.log(`  ${s.title}: isActive = ${s.isActive} (${typeof s.isActive})`);
      });
      
      const processedSections = sections.map((section, index) => {
        const isActiveValue = section.isActive !== undefined ? Boolean(section.isActive) : true;
        
        return {
          id: section.id || generateSectionId(),
          title: section.title || 'Untitled Section',
          icon: section.icon || 'FaShieldAlt',
          description: section.description || '',
          details: section.details || [],
          isActive: isActiveValue,
          displayOrder: section.displayOrder !== undefined ? section.displayOrder : index
        };
      });
      
      privacy.sections = processedSections;
    }

    privacy.updatedBy = req.user.id;
    await privacy.save();

    const updatedPrivacy = await Privacy.findById(privacy._id);
    
    console.log('✅ Saved sections:');
    updatedPrivacy.sections.forEach(s => {
      console.log(`  ${s.title}: isActive = ${s.isActive}`);
    });

    res.json({
      success: true,
      data: updatedPrivacy,
      message: 'Privacy policy updated successfully'
    });
  } catch (error) {
    console.error('❌ Update privacy error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while updating privacy policy'
    });
  }
};

// @desc    Reset privacy to default
// @route   POST /api/admin/privacy/reset
// @access  Private (Admin)
const resetPrivacy = async (req, res) => {
  try {
    console.log('⚠️ RESETTING PRIVACY TO DEFAULT');
    await Privacy.deleteOne({});
    const privacy = await createDefaultPrivacy();

    res.json({
      success: true,
      data: privacy,
      message: 'Privacy policy reset to default successfully'
    });
  } catch (error) {
    console.error('Reset privacy error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while resetting privacy policy'
    });
  }
};

// @desc    Get raw database data
// @route   GET /api/admin/privacy/raw-data
// @access  Private (Admin)
const getRawData = async (req, res) => {
  try {
    const privacy = await Privacy.findOne().lean();
    
    if (!privacy) {
      return res.status(404).json({
        success: false,
        error: 'No privacy data found'
      });
    }

    console.log('🔍 RAW DATABASE DATA:');
    console.log('Total sections in DB:', privacy.sections.length);
    privacy.sections.forEach((s, i) => {
      console.log(`  ${i}. ${s.title}: isActive = ${s.isActive} (${typeof s.isActive})`);
    });

    res.json({
      success: true,
      data: privacy
    });
  } catch (error) {
    console.error('Error getting raw data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get privacy (admin) - FORCED ALL SECTIONS
// @route   GET /api/admin/privacy/all
// @access  Private (Admin/Moderator)
const getAdminPrivacyAll = async (req, res) => {
  try {
    let privacy = await Privacy.findOne();
    
    if (!privacy) {
      privacy = await createDefaultPrivacy();
    }

    const allSections = privacy.sections.map(s => ({
      ...s.toObject ? s.toObject() : s,
      isActive: s.isActive
    }));

    const sortedSections = allSections.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

    console.log('📊 ADMIN ALL API - FORCED ALL SECTIONS:');
    console.log(`Total: ${sortedSections.length} sections`);
    sortedSections.forEach(s => {
      console.log(`  ${s.title}: isActive = ${s.isActive} (${typeof s.isActive})`);
    });

    res.json({
      success: true,
      data: {
        sections: sortedSections,
        heroTitle: privacy.heroTitle,
        heroDescription: privacy.heroDescription,
        introText: privacy.introText,
        lastUpdated: privacy.lastUpdated,
        isActive: privacy.isActive,
        _id: privacy._id,
        updatedBy: privacy.updatedBy,
        createdAt: privacy.createdAt,
        updatedAt: privacy.updatedAt
      }
    });
  } catch (error) {
    console.error('Get admin privacy all error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching privacy policy'
    });
  }
};

// @desc    Create default privacy
const createDefaultPrivacy = async () => {
  const defaultPrivacy = {
    heroTitle: 'Privacy Policy',
    heroDescription: 'Your privacy is important to us. Learn how we collect, use, and protect your personal information.',
    introText: 'Welcome to HyperVolt. Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.',
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    sections: [
      {
        id: 1,
        title: 'Information We Collect',
        icon: 'FaDatabase',
        description: 'We collect information you provide directly, such as when you create an account, make a purchase, or contact us.',
        details: [
          'Name, email address, phone number, and shipping address',
          'Payment information (processed securely through third-party providers)',
          'Account credentials and profile information',
          'Order history and preferences',
          'Communications with our support team'
        ],
        isActive: true,
        displayOrder: 0
      },
      {
        id: 2,
        title: 'How We Use Your Information',
        icon: 'FaClipboardList',
        description: 'We use your information to provide, maintain, and improve our services, and to communicate with you.',
        details: [
          'Process and fulfill your orders and requests',
          'Send you order confirmations and updates',
          'Respond to your comments, questions, and support inquiries',
          'Send you marketing communications (with your consent)',
          'Improve our website, products, and services'
        ],
        isActive: true,
        displayOrder: 1
      },
      {
        id: 3,
        title: 'Information Sharing',
        icon: 'FaUsers',
        description: 'We do not sell your personal information. We only share it with trusted partners to provide our services.',
        details: [
          'Shipping partners to deliver your orders',
          'Payment processors to handle transactions',
          'Service providers who assist with our operations',
          'Law enforcement when required by law',
          'With your explicit consent'
        ],
        isActive: true,
        displayOrder: 2
      },
      {
        id: 4,
        title: 'Data Security',
        icon: 'FaLock',
        description: 'We implement appropriate technical and organizational measures to protect your personal data.',
        details: [
          'SSL encryption for all data transmission',
          'Regular security assessments and updates',
          'Access controls and authentication measures',
          'Data encryption for stored information',
          'Secure data storage practices'
        ],
        isActive: true,
        displayOrder: 3
      },
      {
        id: 5,
        title: 'Cookies & Tracking',
        icon: 'FaGlobe',
        description: 'We use cookies and similar technologies to enhance your browsing experience and analyze site usage.',
        details: [
          'Essential cookies for basic website functionality',
          'Analytics cookies to understand user behavior',
          'Preference cookies to remember your settings',
          'Marketing cookies for targeted advertising',
          'You can manage cookie preferences in your browser settings'
        ],
        isActive: true,
        displayOrder: 4
      },
      {
        id: 6,
        title: 'Your Rights',
        icon: 'FaUserShield',
        description: 'You have control over your personal information and can exercise various rights regarding its use.',
        details: [
          'Access your personal data at any time',
          'Request correction of inaccurate data',
          'Request deletion of your data (subject to legal obligations)',
          'Withdraw consent for marketing communications',
          'Data portability - receive your data in a structured format'
        ],
        isActive: true,
        displayOrder: 5
      },
      {
        id: 7,
        title: 'Third-Party Services',
        icon: 'FaStore',
        description: 'Our website may contain links to third-party services with their own privacy policies.',
        details: [
          'We are not responsible for third-party privacy practices',
          'Review third-party privacy policies before providing information',
          'Our payment gateway partners are PCI compliant',
          'Social media features may collect information'
        ],
        isActive: true,
        displayOrder: 6
      },
      {
        id: 8,
        title: 'Children\'s Privacy',
        icon: 'FaShieldAlt',
        description: 'Our services are not directed to children under 13, and we do not knowingly collect their information.',
        details: [
          'We do not knowingly collect data from children under 13',
          'If we discover we have collected such data, we will delete it',
          'Parents should monitor their children\'s online activities',
          'Contact us if you believe we have collected child data'
        ],
        isActive: true,
        displayOrder: 7
      },
      {
        id: 9,
        title: 'Changes to This Policy',
        icon: 'FaScroll',
        description: 'We may update this Privacy Policy from time to time. We will notify you of any changes.',
        details: [
          'We will post updates on this page with a revised date',
          'Significant changes will be communicated via email',
          'Your continued use constitutes acceptance of changes',
          'Review this policy periodically for updates'
        ],
        isActive: true,
        displayOrder: 8
      },
      {
        id: 10,
        title: 'Contact Us',
        icon: 'FaEnvelope',
        description: 'If you have questions about this Privacy Policy, please contact us.',
        details: [
          'Email: support@hypervolt.com',
          'Phone: +880 1XXXXXXXXX',
          'Address: Dhaka, Bangladesh',
          'We respond to inquiries within 48 hours'
        ],
        isActive: true,
        displayOrder: 9
      }
    ],
    isActive: true
  };

  return await Privacy.create(defaultPrivacy);
};

module.exports = {
  getPublicPrivacy,
  getAdminPrivacy,
  updatePrivacy,
  resetPrivacy,
  getRawData,
  getAdminPrivacyAll
};