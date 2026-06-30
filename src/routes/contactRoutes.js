// // routes/contactRoutes.js
// const express = require('express');
// const router = express.Router();
// const { sendContactFormEmails } = require('../utils/contactEmailService');

// // @desc    Submit contact form
// // @route   POST /api/contact
// // @access  Public
// router.post('/', async (req, res) => {
//   try {
//     const {
//       name,
//       email,
//       phone,
//       subject,
//       message
//     } = req.body;

//     // Validate required fields
//     if (!name || !email || !phone || !subject || !message) {
//       return res.status(400).json({
//         success: false,
//         error: 'Please provide name, email, phone, subject and message'
//       });
//     }

//     // Validate email format
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Please provide a valid email address'
//       });
//     }

//     // Validate phone (basic validation)
//     const phoneRegex = /^[0-9+\-\s()]{8,20}$/;
//     if (!phoneRegex.test(phone)) {
//       return res.status(400).json({
//         success: false,
//         error: 'Please provide a valid phone number'
//       });
//     }

//     // Send emails
//     const result = await sendContactFormEmails({
//       name,
//       email,
//       phone,
//       subject,
//       message
//     });

//     if (!result.success) {
//       return res.status(500).json({
//         success: false,
//         error: result.error || 'Failed to send message'
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Thank you for your message! We will get back to you within 24 hours.'
//     });

//   } catch (error) {
//     console.error('❌ Contact form error:', error);
//     res.status(500).json({
//       success: false,
//       error: error.message || 'Server error'
//     });
//   }
// });

// module.exports = router;


// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { sendContactFormEmails } = require('../utils/contactEmailService');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      productInterest,  // <-- ADD THIS
      message
    } = req.body;

    // Use subject if provided, otherwise use productInterest
    const finalSubject = subject || productInterest || 'General Inquiry';

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        error: 'Please provide name, email, phone and message'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address'
      });
    }

    // Validate phone (basic validation)
    const phoneRegex = /^[0-9+\-\s()]{8,20}$/;
    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid phone number'
      });
    }

    // Send emails
    const result = await sendContactFormEmails({
      name,
      email,
      phone,
      subject: finalSubject,  // <-- USE THE FINAL SUBJECT
      message
    });

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to send message'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Thank you for your message! We will get back to you within 24 hours.'
    });

  } catch (error) {
    console.error('❌ Contact form error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Server error'
    });
  }
});

module.exports = router;