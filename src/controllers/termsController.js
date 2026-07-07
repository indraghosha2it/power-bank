const Terms = require('../models/Terms');

// Helper: Generate section ID
const generateSectionId = () => {
  return Math.floor(Math.random() * 1000);
};

// @desc    Get terms (public)
// @route   GET /api/terms
// @access  Public
const getPublicTerms = async (req, res) => {
  try {
    let terms = await Terms.findOne({ isActive: true });
    
    if (!terms) {
      terms = await createDefaultTerms();
    }

    // ONLY show active sections to the public
    const activeSections = terms.sections.filter(section => section.isActive !== false);
    
    res.json({
      success: true,
      data: {
        heroTitle: terms.heroTitle,
        heroDescription: terms.heroDescription,
        introText: terms.introText,
        sections: activeSections.sort((a, b) => a.displayOrder - b.displayOrder),
        lastUpdated: terms.lastUpdated
      }
    });
  } catch (error) {
    console.error('Get public terms error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching terms'
    });
  }
};

// @desc    Get terms (admin) - SHOW ALL SECTIONS
// @route   GET /api/admin/terms
// @access  Private (Admin/Moderator)
const getAdminTerms = async (req, res) => {
  try {
    let terms = await Terms.findOne();
    
    if (!terms) {
      terms = await createDefaultTerms();
    }

    // IMPORTANT: DO NOT FILTER - Show ALL sections including inactive
    // Just sort by displayOrder
    const sortedSections = terms.sections.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
    terms.sections = sortedSections;

    console.log('📊 ADMIN API - ALL sections (including inactive):');
    console.log(`Total: ${terms.sections.length} sections`);
    terms.sections.forEach(s => {
      console.log(`  ${s.title}: isActive = ${s.isActive} (${typeof s.isActive})`);
    });

    // Send the response with ALL sections
    res.json({
      success: true,
      data: terms
    });
  } catch (error) {
    console.error('Get admin terms error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching terms'
    });
  }
};

// @desc    Update terms
// @route   PUT /api/admin/terms
// @access  Private (Admin/Moderator)
const updateTerms = async (req, res) => {
  try {
    console.log('📥 Received update request');
    
    let terms = await Terms.findOne();
    
    if (!terms) {
      terms = await createDefaultTerms();
    }

    const { 
      heroTitle, 
      heroDescription, 
      introText, 
      sections, 
      lastUpdated,
      isActive 
    } = req.body;

    if (heroTitle) terms.heroTitle = heroTitle;
    if (heroDescription) terms.heroDescription = heroDescription;
    if (introText) terms.introText = introText;
    if (lastUpdated) terms.lastUpdated = lastUpdated;
    if (isActive !== undefined) terms.isActive = isActive;

    if (sections && Array.isArray(sections)) {
      console.log('📊 Sections received from frontend:');
      sections.forEach(s => {
        console.log(`  ${s.title}: isActive = ${s.isActive} (${typeof s.isActive})`);
      });
      
      // Process all sections - preserve isActive values
      const processedSections = sections.map((section, index) => {
        // Keep the exact isActive value from the request
        const isActiveValue = section.isActive !== undefined ? Boolean(section.isActive) : true;
        
        return {
          id: section.id || generateSectionId(),
          title: section.title || 'Untitled Section',
          icon: section.icon || 'FaFileContract',
          description: section.description || '',
          details: section.details || [],
          isActive: isActiveValue, // Preserve the value
          displayOrder: section.displayOrder !== undefined ? section.displayOrder : index
        };
      });
      
      // Replace all sections
      terms.sections = processedSections;
    }

    terms.updatedBy = req.user.id;
    await terms.save();

    // Fetch the updated document
    const updatedTerms = await Terms.findById(terms._id);
    
    console.log('✅ Saved sections:');
    updatedTerms.sections.forEach(s => {
      console.log(`  ${s.title}: isActive = ${s.isActive}`);
    });

    res.json({
      success: true,
      data: updatedTerms,
      message: 'Terms updated successfully'
    });
  } catch (error) {
    console.error('❌ Update terms error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while updating terms'
    });
  }
};

// @desc    Reset terms to default
// @route   POST /api/admin/terms/reset
// @access  Private (Admin)
const resetTerms = async (req, res) => {
  try {
    console.log('⚠️ RESETTING TERMS TO DEFAULT');
    await Terms.deleteOne({});
    const terms = await createDefaultTerms();

    res.json({
      success: true,
      data: terms,
      message: 'Terms reset to default successfully'
    });
  } catch (error) {
    console.error('Reset terms error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while resetting terms'
    });
  }
};

// @desc    Get raw database data (bypass all processing)
// @route   GET /api/admin/terms/raw-data
// @access  Private (Admin)
const getRawData = async (req, res) => {
  try {
    const terms = await Terms.findOne().lean();
    
    if (!terms) {
      return res.status(404).json({
        success: false,
        error: 'No terms data found'
      });
    }

    console.log('🔍 RAW DATABASE DATA:');
    console.log('Total sections in DB:', terms.sections.length);
    terms.sections.forEach((s, i) => {
      console.log(`  ${i}. ${s.title}: isActive = ${s.isActive} (${typeof s.isActive})`);
    });

    res.json({
      success: true,
      data: terms
    });
  } catch (error) {
    console.error('Error getting raw data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Get terms (admin) - FORCED ALL SECTIONS
// @route   GET /api/admin/terms/all
// @access  Private (Admin/Moderator)
const getAdminTermsAll = async (req, res) => {
  try {
    let terms = await Terms.findOne();
    
    if (!terms) {
      terms = await createDefaultTerms();
    }

    // Force all sections to be included
    const allSections = terms.sections.map(s => ({
      ...s.toObject ? s.toObject() : s,
      // Ensure isActive is preserved
      isActive: s.isActive
    }));

    // Sort by displayOrder
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
        heroTitle: terms.heroTitle,
        heroDescription: terms.heroDescription,
        introText: terms.introText,
        lastUpdated: terms.lastUpdated,
        isActive: terms.isActive,
        _id: terms._id,
        updatedBy: terms.updatedBy,
        createdAt: terms.createdAt,
        updatedAt: terms.updatedAt
      }
    });
  } catch (error) {
    console.error('Get admin terms all error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error while fetching terms'
    });
  }
};

// @desc    Create default terms
const createDefaultTerms = async () => {
  const defaultTerms = {
    heroTitle: 'Terms & Conditions',
    heroDescription: 'Please read these terms carefully before using our services. They govern your use of HyperVolt\'s platform and services.',
    introText: 'Welcome to HyperVolt. These Terms & Conditions ("Terms") govern your use of the HyperVolt website, mobile application, and all related services (collectively, the "Platform"). By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree to these Terms, please do not use our Platform.',
    lastUpdated: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    sections: [
      {
        id: 1,
        title: 'Acceptance of Terms',
        icon: 'FaFileContract',
        description: 'By using HyperVolt\'s website and services, you agree to comply with and be bound by these Terms & Conditions. If you do not agree, please do not use our services.',
        details: [
          'These terms apply to all users of the HyperVolt platform',
          'By placing an order, you accept these terms in full',
          'We reserve the right to update these terms at any time',
          'Continued use constitutes acceptance of updated terms'
        ],
        isActive: true,
        displayOrder: 0
      },
      {
        id: 2,
        title: 'Products & Services',
        icon: 'FaShoppingBag',
        description: 'HyperVolt offers premium power banks and charging solutions sourced from trusted brands and verified for quality and performance.',
        details: [
          'All products are 100% authentic and sourced from authorized distributors',
          'Product descriptions and images are for illustrative purposes',
          'We reserve the right to modify or discontinue products at any time',
          'Prices are subject to change without prior notice'
        ],
        isActive: true,
        displayOrder: 1
      },
      {
        id: 3,
        title: 'Orders & Payments',
        icon: 'FaCreditCard',
        description: 'Orders are processed securely with multiple payment options including Cash on Delivery (COD) and online payments.',
        details: [
          'All orders are subject to acceptance and availability',
          'Payment must be completed before order processing',
          'Cash on Delivery is available for eligible areas',
          'Online payments are processed through secure gateways'
        ],
        isActive: true,
        displayOrder: 2
      },
      {
        id: 4,
        title: 'Delivery & Shipping',
        icon: 'FaTruck',
        description: 'We deliver across Bangladesh with fast and reliable shipping services for all power bank orders.',
        details: [
          'Delivery times vary by location and product availability',
          'Shipping fees are calculated at checkout',
          'Free shipping is available for orders over ৳3000',
          'Tracking information is provided for all shipped orders'
        ],
        isActive: true,
        displayOrder: 3
      },
      {
        id: 5,
        title: 'Returns & Refunds',
        icon: 'FaHands',
        description: 'Customer satisfaction is our priority. We recommend inspecting your power bank upon delivery to ensure it meets your expectations.',
        details: [
          '⚠️ Please inspect the product in front of the delivery person upon arrival',
          'If you find any issues (damage, wrong item, missing parts), you can refuse delivery or request an immediate return',
          'For issues noticed after delivery, contact us within 24 hours of receiving the product',
          'All return/refund requests must be submitted within 7 days of delivery date',
          'Products must be unused, unopened, and in original packaging with all tags attached',
          'Refunds are processed within 7-10 business days after the returned product is verified',
          'Original shipping costs are non-refundable unless the product is defective',
          'For defective products, return shipping costs are covered by HyperVolt',
          'Online payment refunds are credited back to the original payment method'
        ],
        isActive: true,
        displayOrder: 4
      },
      {
        id: 6,
        title: 'User Accounts',
        icon: 'FaUserShield',
        description: 'Creating an account with HyperVolt provides you with a personalized shopping experience.',
        details: [
          'You are responsible for maintaining account security',
          'Provide accurate and complete registration information',
          'Notify us immediately of any unauthorized use',
          'We reserve the right to suspend accounts for violations'
        ],
        isActive: true,
        displayOrder: 5
      },
      {
        id: 7,
        title: 'Privacy & Data Protection',
        icon: 'FaLock',
        description: 'Your privacy is important to us. We protect your personal information in accordance with our Privacy Policy.',
        details: [
          'We collect minimal personal data necessary for order processing',
          'Your data is never shared with third parties without consent',
          'SSL encryption protects all transactions',
          'You may request data deletion at any time'
        ],
        isActive: true,
        displayOrder: 6
      },
      {
        id: 9,
        title: 'Intellectual Property',
        icon: 'FaBalanceScale',
        description: 'All content on HyperVolt including logos, images, and text is protected by copyright.',
        details: [
          'Content is owned by HyperVolt and its licensors',
          'You may not reproduce, modify, or distribute our content',
          'Trademarks and logos are protected by law',
          'Unauthorized use may result in legal action'
        ],
        isActive: true,
        displayOrder: 7
      },
      {
        id: 10,
        title: 'Limitation of Liability',
        icon: 'FaExclamationTriangle',
        description: 'HyperVolt is not liable for any indirect, incidental, or consequential damages.',
        details: [
          'We are not responsible for third-party service interruptions',
          'Product descriptions are provided \'as is\' without warranties',
          'We are not liable for any damages exceeding the order value',
          'Users agree to indemnify HyperVolt for any violations'
        ],
        isActive: true,
        displayOrder: 8
      }
    ],
    isActive: true
  };

  return await Terms.create(defaultTerms);
};

module.exports = {
  getPublicTerms,
  getAdminTerms,
  updateTerms,
  resetTerms,
  getRawData,
  getAdminTermsAll
};