


// // utils/welcomeEmailService.js
// const nodemailer = require('nodemailer');

// // Smart Gadget Brand Colors - White Background with Black, White & Blue
// const SMART_GADGET_COLORS = {
//   primary: '#0066FF',        // Bold Blue
//   secondary: '#0044CC',      // Dark Blue
//   accent: '#0066FF',         // Blue accent
//   textDark: '#1A1A1A',       // Near Black for text
//   textLight: '#4A4A4A',      // Dark Gray
//   white: '#FFFFFF',          // White background
//   lightBg: '#F5F7FA',        // Very Light Gray background
//   border: '#E5E5E5',         // Light Gray border
//   success: '#0066FF',        // Blue for success
//   warning: '#FF8C00'         // Orange for warnings
// };

// // Create transporter using environment variables
// const transporter = nodemailer.createTransport({
//   host: process.env.INFO_SMTP_HOST,
//   port: parseInt(process.env.INFO_SMTP_PORT) || 465,
//   secure: true,
//   auth: {
//     user: process.env.INFO_SMTP_USER,
//     pass: process.env.INFO_SMTP_PASSWORD,
//   },
//   tls: {
//     rejectUnauthorized: false
//   }
// });

// // Verify connection
// transporter.verify((error, success) => {
//   if (error) {
//     console.error('❌ Welcome Email Service - Configuration error:', error.message);
//   } else {
//     console.log('✅ Welcome Email Service is ready');
//   }
// });

// /**
//  * Send welcome email to newly registered customer (Regular Signup)
//  * @param {string} email - Customer email
//  * @param {string} name - Customer name (contactPerson)
//  */
// const sendWelcomeEmail = async (email, name) => {
//   console.log('📧 Sending welcome email to:', email);
  
//   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//   const currentYear = new Date().getFullYear();

//   const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <style>
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
//         body { 
//           font-family: 'Inter', 'Segoe UI', Arial, sans-serif; 
//           line-height: 1.6; 
//           color: #1A1A1A; 
//           margin: 0;
//           padding: 0;
//           background-color: #F5F7FA;
//         }
//         .container {
//           max-width: 600px;
//           margin: 20px auto;
//           background-color: #FFFFFF;
//           border-radius: 16px;
//           overflow: hidden;
//           box-shadow: 0 4px 20px rgba(0,0,0,0.08);
//           border: 1px solid #E5E5E5;
//         }
//         .header {
//           background: #000000;
//           padding: 35px 20px;
//           text-align: center;
//         }
//         .header h1 {
//           color: #FFFFFF;
//           margin: 0;
//           font-size: 28px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 12px;
//           font-weight: 700;
//           letter-spacing: 1px;
//         }
//         .header h1 span:first-child {
//           font-size: 32px;
//         }
//         .header .subtitle {
//           color: #FFFFFF;
//           margin: 10px 0 0;
//           opacity: 0.9;
//           font-size: 14px;
//           letter-spacing: 1px;
//         }
//         .content {
//           padding: 35px 30px;
//           text-align: left;
//         }
//         .welcome-message {
//           font-size: 16px;
//           margin-bottom: 25px;
//           color: #4A4A4A;
//         }
//         .welcome-message strong {
//           color: #1A1A1A;
//         }
//         .benefits-box {
//           background: #F5F7FA;
//           border-left: 4px solid #0066FF;
//           padding: 20px;
//           margin: 25px 0;
//           border-radius: 12px;
//           border: 1px solid #E5E5E5;
//         }
//         .benefits-box h3 {
//           margin: 0 0 15px 0;
//           color: #0066FF;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 16px;
//           font-weight: 700;
//           letter-spacing: 0.5px;
//         }
//         .benefits-list {
//           list-style: none;
//           padding: 0;
//           margin: 0;
//         }
//         .benefits-list li {
//           padding: 10px 0;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           border-bottom: 1px solid #E5E5E5;
//           color: #4A4A4A;
//         }
//         .benefits-list li:last-child {
//           border-bottom: none;
//         }
//         .benefits-list li span:first-child {
//           font-size: 22px;
//         }
//         .benefits-list li strong {
//           color: #1A1A1A;
//         }
//         .button {
//           display: inline-block;
//           background: #000000;
//           color: #FFFFFF;
//           padding: 14px 35px;
//           text-decoration: none;
//           border-radius: 8px;
//           font-weight: 600;
//           margin: 20px 0;
//           text-align: center;
//           font-size: 14px;
//           letter-spacing: 0.5px;
//           transition: background 0.3s ease;
//         }
//         .button:hover {
//           background: #1A1A1A;
//         }
//         .footer {
//           background: #F5F7FA;
//           padding: 25px;
//           text-align: center;
//           font-size: 12px;
//           color: #4A4A4A;
//           border-top: 1px solid #E5E5E5;
//         }
//         .social-links {
//           margin: 15px 0;
//         }
//         .social-links a {
//           color: #0066FF;
//           text-decoration: none;
//           margin: 0 10px;
//           font-weight: 600;
//           transition: color 0.3s ease;
//         }
//         .social-links a:hover {
//           color: #0044CC;
//         }
//         .highlight {
//           color: #0066FF;
//           font-weight: bold;
//         }
//         .support-box {
//           margin-top: 25px;
//           padding: 20px;
//           background: #F5F7FA;
//           border-radius: 12px;
//           border: 1px solid #E5E5E5;
//         }
//         .support-box p {
//           color: #4A4A4A;
//           margin: 0 0 10px 0;
//           font-size: 14px;
//         }
//         .support-box a {
//           color: #0066FF;
//           text-decoration: none;
//           transition: color 0.3s ease;
//         }
//         .support-box a:hover {
//           color: #0044CC;
//         }
//         .support-box strong {
//           color: #1A1A1A;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>
//             <span>⚡</span>
//             <span>Welcome to Smart Gadget!</span>
//             <span>🚀</span>
//           </h1>
//           <p class="subtitle">Premium Tech Store • Bangladesh</p>
//         </div>
        
//         <div class="content">
//           <div class="welcome-message">
//             <p>Dear <strong>${name}</strong>,</p>
//             <p>🎉 <span class="highlight">Welcome to the Smart Gadget family!</span> We're absolutely thrilled to have you on board!</p>
//             <p>Your account has been successfully created and verified. Get ready for a cutting-edge tech experience with amazing gadgets, exclusive deals, and premium service!</p>
//           </div>
          
//           <div class="benefits-box">
//             <h3>
//               <span>✨</span>
//               <span>What Awaits You at Smart Gadget</span>
//             </h3>
//             <ul class="benefits-list">
//               <li><span>💻</span> <span><strong>Latest Tech</strong> - Cutting-edge gadgets at unbeatable prices</span></li>
//               <li><span>🔌</span> <span><strong>Official Warranty</strong> - All products come with manufacturer warranty</span></li>
//               <li><span>🚚</span> <span><strong>Express Delivery</strong> - Fast shipping across Bangladesh</span></li>
//               <li><span>🛡️</span> <span><strong>24/7 Support</strong> - Our tech experts are always here to help</span></li>
//               <li><span>🎯</span> <span><strong>Exclusive Deals</strong> - Special discounts for our members</span></li>
//             </ul>
//           </div>
          
//           <div style="text-align: center;">
//             <a href="${frontendUrl}/customer/dashboard" class="button">
//               🚀 Go to Your Dashboard →
//             </a>
//           </div>
          
//           <div class="support-box">
//             <p><strong>📞 Need Help?</strong></p>
//             <p>Our friendly tech support team is here for you!</p>
//             <p style="margin: 10px 0 0 0;">
//               📧 <a href="mailto:${process.env.INFO_SMTP_USER}">${process.env.INFO_SMTP_USER}</a><br>
//               📞 +880 1234 567890
//             </p>
//           </div>
//         </div>
        
//         <div class="footer">
//           <div class="social-links">
//             <a href="#">Facebook</a> | 
//             <a href="#">Instagram</a> | 
//             <a href="#">YouTube</a>
//           </div>
//           <p>&copy; ${currentYear} Smart Gadget. All rights reserved.</p>
//           <p>Premium Tech Store • Bangladesh</p>
//           <p>
//             <a href="${frontendUrl}/privacy" style="color: #4A4A4A; text-decoration: none;">Privacy Policy</a> | 
//             <a href="${frontendUrl}/terms" style="color: #4A4A4A; text-decoration: none;">Terms of Service</a>
//           </p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;

//   try {
//     const result = await transporter.sendMail({
//       from: `"Smart Gadget" <${process.env.INFO_SMTP_USER}>`,
//       to: email,
//       subject: `⚡ Welcome to Smart Gadget, ${name}! 🚀`,
//       html: htmlContent
//     });
    
//     console.log('✅ Welcome email sent to:', email, 'Message ID:', result.messageId);
//     return { success: true, messageId: result.messageId };
//   } catch (error) {
//     console.error('❌ Welcome email error:', error.message);
//     return { success: false, error: error.message };
//   }
// };

// /**
//  * Send welcome email for Google signup users
//  * @param {string} email - Customer email
//  * @param {string} name - Customer name
//  * @param {boolean} requiresProfileCompletion - Whether profile needs completion
//  */
// const sendGoogleWelcomeEmail = async (email, name, requiresProfileCompletion = true) => {
//   console.log('📧 Sending Google welcome email to:', email);
  
//   const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
//   const currentYear = new Date().getFullYear();

//   const profileNote = requiresProfileCompletion ? `
//     <div style="margin: 25px 0; padding: 20px; background: #F5F7FA; border-left: 4px solid #0066FF; border-radius: 12px; border: 1px solid #E5E5E5;">
//       <h3 style="margin: 0 0 10px 0; color: #0066FF; display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 700; letter-spacing: 0.5px;">
//         <span>📝</span>
//         <span>Complete Your Profile</span>
//       </h3>
//       <p style="margin: 0; font-size: 14px; color: #4A4A4A;">Please visit your dashboard to complete your profile information so we can personalize your tech recommendations and provide the best shopping experience for you!</p>
//     </div>
//   ` : '';

//   const htmlContent = `
//     <!DOCTYPE html>
//     <html>
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <style>
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
//         body { 
//           font-family: 'Inter', 'Segoe UI', Arial, sans-serif; 
//           line-height: 1.6; 
//           color: #1A1A1A; 
//           margin: 0;
//           padding: 0;
//           background-color: #F5F7FA;
//         }
//         .container {
//           max-width: 600px;
//           margin: 20px auto;
//           background-color: #FFFFFF;
//           border-radius: 16px;
//           overflow: hidden;
//           box-shadow: 0 4px 20px rgba(0,0,0,0.08);
//           border: 1px solid #E5E5E5;
//         }
//         .header {
//           background: #000000;
//           padding: 35px 20px;
//           text-align: center;
//         }
//         .header h1 {
//           color: #FFFFFF;
//           margin: 0;
//           font-size: 28px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 12px;
//           font-weight: 700;
//           letter-spacing: 1px;
//         }
//         .header h1 span:first-child {
//           font-size: 32px;
//         }
//         .header .subtitle {
//           color: #FFFFFF;
//           margin: 10px 0 0;
//           opacity: 0.9;
//           font-size: 14px;
//           letter-spacing: 1px;
//         }
//         .content {
//           padding: 35px 30px;
//           text-align: left;
//         }
//         .welcome-message {
//           font-size: 16px;
//           margin-bottom: 25px;
//           color: #4A4A4A;
//         }
//         .welcome-message strong {
//           color: #1A1A1A;
//         }
//         .google-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 8px;
//           background: #F5F7FA;
//           padding: 8px 16px;
//           border-radius: 50px;
//           font-size: 13px;
//           margin: 10px 0;
//           border: 1px solid #E5E5E5;
//           color: #4A4A4A;
//         }
//         .google-badge strong {
//           color: #1A1A1A;
//         }
//         .benefits-box {
//           background: #F5F7FA;
//           border-left: 4px solid #0066FF;
//           padding: 20px;
//           margin: 25px 0;
//           border-radius: 12px;
//           border: 1px solid #E5E5E5;
//         }
//         .benefits-box h3 {
//           margin: 0 0 15px 0;
//           color: #0066FF;
//           display: flex;
//           align-items: center;
//           gap: 8px;
//           font-size: 16px;
//           font-weight: 700;
//           letter-spacing: 0.5px;
//         }
//         .benefits-list {
//           list-style: none;
//           padding: 0;
//           margin: 0;
//         }
//         .benefits-list li {
//           padding: 10px 0;
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           border-bottom: 1px solid #E5E5E5;
//           color: #4A4A4A;
//         }
//         .benefits-list li:last-child {
//           border-bottom: none;
//         }
//         .benefits-list li span:first-child {
//           font-size: 22px;
//         }
//         .benefits-list li strong {
//           color: #1A1A1A;
//         }
//         .button {
//           display: inline-block;
//           background: #000000;
//           color: #FFFFFF;
//           padding: 14px 35px;
//           text-decoration: none;
//           border-radius: 8px;
//           font-weight: 600;
//           margin: 20px 0;
//           text-align: center;
//           font-size: 14px;
//           letter-spacing: 0.5px;
//           transition: background 0.3s ease;
//         }
//         .button:hover {
//           background: #1A1A1A;
//         }
//         .footer {
//           background: #F5F7FA;
//           padding: 25px;
//           text-align: center;
//           font-size: 12px;
//           color: #4A4A4A;
//           border-top: 1px solid #E5E5E5;
//         }
//         .social-links {
//           margin: 15px 0;
//         }
//         .social-links a {
//           color: #0066FF;
//           text-decoration: none;
//           margin: 0 10px;
//           font-weight: 600;
//           transition: color 0.3s ease;
//         }
//         .social-links a:hover {
//           color: #0044CC;
//         }
//         .highlight {
//           color: #0066FF;
//           font-weight: bold;
//         }
//         .support-box {
//           margin-top: 25px;
//           padding: 20px;
//           background: #F5F7FA;
//           border-radius: 12px;
//           border: 1px solid #E5E5E5;
//         }
//         .support-box p {
//           color: #4A4A4A;
//           margin: 0 0 10px 0;
//           font-size: 14px;
//         }
//         .support-box a {
//           color: #0066FF;
//           text-decoration: none;
//           transition: color 0.3s ease;
//         }
//         .support-box a:hover {
//           color: #0044CC;
//         }
//         .support-box strong {
//           color: #1A1A1A;
//         }
//       </style>
//     </head>
//     <body>
//       <div class="container">
//         <div class="header">
//           <h1>
//             <span>🔐</span>
//             <span>Welcome to Smart Gadget!</span>
//             <span>🚀</span>
//           </h1>
//           <p class="subtitle">Premium Tech Store • Bangladesh</p>
//         </div>
        
//         <div class="content">
//           <div class="welcome-message">
//             <p>Dear <strong>${name}</strong>,</p>
//             <div class="google-badge">
//               <span>🔐</span>
//               <span>You've signed up with <strong>Google</strong></span>
//             </div>
//             <p>🎉 <span class="highlight">Welcome to the Smart Gadget family!</span> We're so excited to have you join our community of tech enthusiasts!</p>
//             <p>Your account has been successfully created with Google Sign-In. Get ready to explore our cutting-edge collection of gadgets and tech accessories!</p>
//           </div>
          
//           ${profileNote}
          
//           <div class="benefits-box">
//             <h3>
//               <span>✨</span>
//               <span>Your Smart Gadget Benefits</span>
//             </h3>
//             <ul class="benefits-list">
//               <li><span>💻</span> <span><strong>Latest Tech</strong> - Cutting-edge gadgets at unbeatable prices</span></li>
//               <li><span>🔌</span> <span><strong>Official Warranty</strong> - All products come with manufacturer warranty</span></li>
//               <li><span>🚚</span> <span><strong>Express Delivery</strong> - Fast shipping across Bangladesh</span></li>
//               <li><span>🛡️</span> <span><strong>24/7 Support</strong> - Our tech experts are always here to help</span></li>
//               <li><span>🎯</span> <span><strong>Exclusive Deals</strong> - Special discounts for our members</span></li>
//             </ul>
//           </div>
          
//           <div style="text-align: center;">
//             <a href="${frontendUrl}/customer/dashboard" class="button">
//               🚀 Go to Your Dashboard →
//             </a>
//           </div>
          
//           <div class="support-box">
//             <p><strong>📞 Need Help?</strong></p>
//             <p>Our friendly tech support team is here for you!</p>
//             <p style="margin: 10px 0 0 0;">
//               📧 <a href="mailto:${process.env.INFO_SMTP_USER}">${process.env.INFO_SMTP_USER}</a><br>
//               📞 +880 1234 567890
//             </p>
//           </div>
//         </div>
        
//         <div class="footer">
//           <div class="social-links">
//             <a href="#">Facebook</a> | 
//             <a href="#">Instagram</a> | 
//             <a href="#">YouTube</a>
//           </div>
//           <p>&copy; ${currentYear} Smart Gadget. All rights reserved.</p>
//           <p>Premium Tech Store • Bangladesh</p>
//           <p>
//             <a href="${frontendUrl}/privacy" style="color: #4A4A4A; text-decoration: none;">Privacy Policy</a> | 
//             <a href="${frontendUrl}/terms" style="color: #4A4A4A; text-decoration: none;">Terms of Service</a>
//           </p>
//         </div>
//       </div>
//     </body>
//     </html>
//   `;

//   try {
//     const result = await transporter.sendMail({
//       from: `"Smart Gadget" <${process.env.INFO_SMTP_USER}>`,
//       to: email,
//       subject: `⚡ Welcome to Smart Gadget, ${name}! 🚀`,
//       html: htmlContent
//     });
    
//     console.log('✅ Google welcome email sent to:', email, 'Message ID:', result.messageId);
//     return { success: true, messageId: result.messageId };
//   } catch (error) {
//     console.error('❌ Google welcome email error:', error.message);
//     return { success: false, error: error.message };
//   }
// };

// module.exports = {
//   sendWelcomeEmail,
//   sendGoogleWelcomeEmail
// };


// utils/welcomeEmailService.js
const nodemailer = require('nodemailer');

// BeautyBucket Brand Colors - Pink/Magenta Beauty Theme
const BEAUTY_BUCKET_COLORS = {
  primary: '#EE4275',        // Bold Pink
  secondary: '#FF6B9D',      // Light Pink
  accent: '#FF6B9D',         // Pink accent
  darkPink: '#D63A6A',       // Darker Pink
  gold: '#FFD700',           // Gold for accent
  textDark: '#2D1B2E',       // Dark Purple-Black
  textLight: '#8B7A8C',      // Muted Purple
  white: '#FFFFFF',          // White
  lightBg: '#FFF5F6',        // Very Light Pink background
  border: '#FFD2DB',         // Light Pink border
  success: '#4CAF50',        // Green for success
  warning: '#FF8C00'         // Orange for warnings
};

// Create transporter using environment variables
const transporter = nodemailer.createTransport({
  host: process.env.INFO_SMTP_HOST,
  port: parseInt(process.env.INFO_SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.INFO_SMTP_USER,
    pass: process.env.INFO_SMTP_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Welcome Email Service - Configuration error:', error.message);
  } else {
    console.log('✅ Welcome Email Service is ready');
  }
});

/**
 * Send welcome email to newly registered customer (Regular Signup)
 * @param {string} email - Customer email
 * @param {string} name - Customer name (contactPerson)
 */
const sendWelcomeEmail = async (email, name) => {
  console.log('📧 Sending welcome email to:', email);
  
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const currentYear = new Date().getFullYear();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
        body { 
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: ${BEAUTY_BUCKET_COLORS.textDark}; 
          margin: 0;
          padding: 0;
          background-color: ${BEAUTY_BUCKET_COLORS.lightBg};
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: ${BEAUTY_BUCKET_COLORS.white};
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(238, 66, 117, 0.12);
          border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
        }
        .header {
          background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.primary}, ${BEAUTY_BUCKET_COLORS.secondary});
          padding: 40px 20px 35px;
          text-align: center;
          position: relative;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, ${BEAUTY_BUCKET_COLORS.gold}, ${BEAUTY_BUCKET_COLORS.secondary}, ${BEAUTY_BUCKET_COLORS.gold});
        }
        .header h1 {
          color: ${BEAUTY_BUCKET_COLORS.white};
          margin: 0;
          font-size: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-weight: 700;
          font-family: 'Playfair Display', 'Georgia', serif;
          letter-spacing: 1px;
        }
        .header h1 span:first-child {
          font-size: 36px;
        }
        .header .subtitle {
          color: ${BEAUTY_BUCKET_COLORS.white};
          margin: 10px 0 0;
          opacity: 0.95;
          font-size: 15px;
          font-family: 'Playfair Display', 'Georgia', serif;
          letter-spacing: 1px;
        }
        .content {
          padding: 35px 30px;
          text-align: left;
        }
        .welcome-message {
          font-size: 16px;
          margin-bottom: 25px;
          color: ${BEAUTY_BUCKET_COLORS.textLight};
        }
        .welcome-message strong {
          color: ${BEAUTY_BUCKET_COLORS.textDark};
        }
        .welcome-message .highlight {
          color: ${BEAUTY_BUCKET_COLORS.primary};
          font-weight: 700;
        }
        .benefits-box {
          background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.lightBg}, #FFF0F5);
          border-left: 4px solid ${BEAUTY_BUCKET_COLORS.primary};
          padding: 20px 25px;
          margin: 25px 0;
          border-radius: 14px;
          border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
        }
        .benefits-box h3 {
          margin: 0 0 15px 0;
          color: ${BEAUTY_BUCKET_COLORS.primary};
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 17px;
          font-weight: 700;
          font-family: 'Playfair Display', 'Georgia', serif;
        }
        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .benefits-list li {
          padding: 10px 0;
          display: flex;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid ${BEAUTY_BUCKET_COLORS.border};
          color: ${BEAUTY_BUCKET_COLORS.textLight};
          font-size: 14px;
        }
        .benefits-list li:last-child {
          border-bottom: none;
        }
        .benefits-list li span:first-child {
          font-size: 24px;
        }
        .benefits-list li strong {
          color: ${BEAUTY_BUCKET_COLORS.textDark};
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.primary}, ${BEAUTY_BUCKET_COLORS.secondary});
          color: ${BEAUTY_BUCKET_COLORS.white};
          padding: 14px 40px;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
          font-size: 14px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 20px rgba(238, 66, 117, 0.3);
          transition: all 0.3s ease;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(238, 66, 117, 0.4);
        }
        .footer {
          background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.lightBg}, #FFF0F5);
          padding: 25px;
          text-align: center;
          font-size: 12px;
          color: ${BEAUTY_BUCKET_COLORS.textLight};
          border-top: 1px solid ${BEAUTY_BUCKET_COLORS.border};
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          color: ${BEAUTY_BUCKET_COLORS.primary};
          text-decoration: none;
          margin: 0 12px;
          font-weight: 600;
          font-size: 13px;
          transition: color 0.3s ease;
        }
        .social-links a:hover {
          color: ${BEAUTY_BUCKET_COLORS.darkPink};
        }
        .support-box {
          margin-top: 25px;
          padding: 20px 25px;
          background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.lightBg}, #FFF0F5);
          border-radius: 14px;
          border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
        }
        .support-box p {
          color: ${BEAUTY_BUCKET_COLORS.textLight};
          margin: 0 0 10px 0;
          font-size: 14px;
        }
        .support-box a {
          color: ${BEAUTY_BUCKET_COLORS.primary};
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .support-box a:hover {
          color: ${BEAUTY_BUCKET_COLORS.darkPink};
        }
        .support-box strong {
          color: ${BEAUTY_BUCKET_COLORS.textDark};
        }
        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, ${BEAUTY_BUCKET_COLORS.border}, transparent);
          margin: 20px 0;
        }
        .footer-links a {
          color: ${BEAUTY_BUCKET_COLORS.textLight};
          text-decoration: none;
          margin: 0 8px;
          transition: color 0.3s ease;
        }
        .footer-links a:hover {
          color: ${BEAUTY_BUCKET_COLORS.primary};
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>
            <span>💖</span>
            <span>Welcome to BeautyBucket!</span>
            <span>✨</span>
          </h1>
          <p class="subtitle">Your Beauty Journey Starts Here</p>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            <p>Dear <strong>${name}</strong>,</p>
            <p>🎉 <span class="highlight">Welcome to the BeautyBucket family!</span> We're absolutely thrilled to have you on board!</p>
            <p>Your account has been successfully created and verified. Get ready for a beautiful journey with premium beauty products, exclusive deals, and personalized service!</p>
          </div>
          
          <div class="benefits-box">
            <h3>
              <span>✨</span>
              <span>What Awaits You at BeautyBucket</span>
            </h3>
            <ul class="benefits-list">
              <li><span>🌸</span> <span><strong>Premium Beauty Products</strong> - Curated selection of top-quality brands</span></li>
              <li><span>💎</span> <span><strong>Genuine Authenticity</strong> - 100% authentic products guaranteed</span></li>
              <li><span>🚚</span> <span><strong>Fast Delivery</strong> - Quick shipping across Bangladesh</span></li>
              <li><span>💕</span> <span><strong>Expert Support</strong> - Our beauty experts are here for you</span></li>
              <li><span>🎯</span> <span><strong>Exclusive Offers</strong> - Special discounts for our members</span></li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${frontendUrl}/customer/dashboard" class="button">
              💖 Go to Your Dashboard →
            </a>
          </div>
          
          <div class="divider"></div>
          
          <div class="support-box">
            <p><strong>💕 Need Help?</strong></p>
            <p>Our friendly beauty experts are here for you!</p>
            <p style="margin: 10px 0 0 0;">
              📧 <a href="mailto:${process.env.INFO_SMTP_USER}">${process.env.INFO_SMTP_USER}</a><br>
              📞 +880 1234 567890
            </p>
          </div>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="#">Facebook</a> | 
            <a href="#">Instagram</a> | 
            <a href="#">YouTube</a>
          </div>
          <p style="margin: 5px 0;">&copy; ${currentYear} BeautyBucket. All rights reserved.</p>
          <p style="margin: 5px 0; font-family: 'Playfair Display', 'Georgia', serif; color: ${BEAUTY_BUCKET_COLORS.primary};">
            💖 Where Beauty Meets Confidence
          </p>
          <div class="footer-links">
            <a href="${frontendUrl}/privacy">Privacy Policy</a> | 
            <a href="${frontendUrl}/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await transporter.sendMail({
      from: `"BeautyBucket" <${process.env.INFO_SMTP_USER}>`,
      to: email,
      subject: `💖 Welcome to BeautyBucket, ${name}! ✨`,
      html: htmlContent
    });
    
    console.log('✅ Welcome email sent to:', email, 'Message ID:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Welcome email error:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Send welcome email for Google signup users
 * @param {string} email - Customer email
 * @param {string} name - Customer name
 * @param {boolean} requiresProfileCompletion - Whether profile needs completion
 */
const sendGoogleWelcomeEmail = async (email, name, requiresProfileCompletion = true) => {
  console.log('📧 Sending Google welcome email to:', email);
  
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const currentYear = new Date().getFullYear();

  const profileNote = requiresProfileCompletion ? `
    <div style="margin: 25px 0; padding: 20px 25px; background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.lightBg}, #FFF0F5); border-left: 4px solid ${BEAUTY_BUCKET_COLORS.primary}; border-radius: 14px; border: 1px solid ${BEAUTY_BUCKET_COLORS.border};">
      <h3 style="margin: 0 0 10px 0; color: ${BEAUTY_BUCKET_COLORS.primary}; display: flex; align-items: center; gap: 8px; font-size: 17px; font-weight: 700; font-family: 'Playfair Display', 'Georgia', serif;">
        <span>📝</span>
        <span>Complete Your Beauty Profile</span>
      </h3>
      <p style="margin: 0; font-size: 14px; color: ${BEAUTY_BUCKET_COLORS.textLight};">Please visit your dashboard to complete your profile information so we can personalize your beauty recommendations and provide the best shopping experience for you!</p>
    </div>
  ` : '';

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
        body { 
          font-family: 'Inter', 'Segoe UI', Arial, sans-serif; 
          line-height: 1.6; 
          color: ${BEAUTY_BUCKET_COLORS.textDark}; 
          margin: 0;
          padding: 0;
          background-color: ${BEAUTY_BUCKET_COLORS.lightBg};
        }
        .container {
          max-width: 600px;
          margin: 20px auto;
          background-color: ${BEAUTY_BUCKET_COLORS.white};
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 8px 40px rgba(238, 66, 117, 0.12);
          border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
        }
        .header {
          background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.primary}, ${BEAUTY_BUCKET_COLORS.secondary});
          padding: 40px 20px 35px;
          text-align: center;
          position: relative;
        }
        .header::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, ${BEAUTY_BUCKET_COLORS.gold}, ${BEAUTY_BUCKET_COLORS.secondary}, ${BEAUTY_BUCKET_COLORS.gold});
        }
        .header h1 {
          color: ${BEAUTY_BUCKET_COLORS.white};
          margin: 0;
          font-size: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          font-weight: 700;
          font-family: 'Playfair Display', 'Georgia', serif;
          letter-spacing: 1px;
        }
        .header h1 span:first-child {
          font-size: 36px;
        }
        .header .subtitle {
          color: ${BEAUTY_BUCKET_COLORS.white};
          margin: 10px 0 0;
          opacity: 0.95;
          font-size: 15px;
          font-family: 'Playfair Display', 'Georgia', serif;
          letter-spacing: 1px;
        }
        .content {
          padding: 35px 30px;
          text-align: left;
        }
        .welcome-message {
          font-size: 16px;
          margin-bottom: 25px;
          color: ${BEAUTY_BUCKET_COLORS.textLight};
        }
        .welcome-message strong {
          color: ${BEAUTY_BUCKET_COLORS.textDark};
        }
        .welcome-message .highlight {
          color: ${BEAUTY_BUCKET_COLORS.primary};
          font-weight: 700;
        }
        .google-badge {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.lightBg}, #FFF0F5);
          padding: 10px 20px;
          border-radius: 50px;
          font-size: 13px;
          margin: 10px 0 15px;
          border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
          color: ${BEAUTY_BUCKET_COLORS.textLight};
        }
        .google-badge strong {
          color: ${BEAUTY_BUCKET_COLORS.textDark};
        }
        .benefits-box {
          background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.lightBg}, #FFF0F5);
          border-left: 4px solid ${BEAUTY_BUCKET_COLORS.primary};
          padding: 20px 25px;
          margin: 25px 0;
          border-radius: 14px;
          border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
        }
        .benefits-box h3 {
          margin: 0 0 15px 0;
          color: ${BEAUTY_BUCKET_COLORS.primary};
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 17px;
          font-weight: 700;
          font-family: 'Playfair Display', 'Georgia', serif;
        }
        .benefits-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .benefits-list li {
          padding: 10px 0;
          display: flex;
          align-items: center;
          gap: 14px;
          border-bottom: 1px solid ${BEAUTY_BUCKET_COLORS.border};
          color: ${BEAUTY_BUCKET_COLORS.textLight};
          font-size: 14px;
        }
        .benefits-list li:last-child {
          border-bottom: none;
        }
        .benefits-list li span:first-child {
          font-size: 24px;
        }
        .benefits-list li strong {
          color: ${BEAUTY_BUCKET_COLORS.textDark};
        }
        .button {
          display: inline-block;
          background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.primary}, ${BEAUTY_BUCKET_COLORS.secondary});
          color: ${BEAUTY_BUCKET_COLORS.white};
          padding: 14px 40px;
          text-decoration: none;
          border-radius: 50px;
          font-weight: 600;
          margin: 20px 0;
          text-align: center;
          font-size: 14px;
          letter-spacing: 0.5px;
          box-shadow: 0 4px 20px rgba(238, 66, 117, 0.3);
          transition: all 0.3s ease;
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 30px rgba(238, 66, 117, 0.4);
        }
        .footer {
          background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.lightBg}, #FFF0F5);
          padding: 25px;
          text-align: center;
          font-size: 12px;
          color: ${BEAUTY_BUCKET_COLORS.textLight};
          border-top: 1px solid ${BEAUTY_BUCKET_COLORS.border};
        }
        .social-links {
          margin: 15px 0;
        }
        .social-links a {
          color: ${BEAUTY_BUCKET_COLORS.primary};
          text-decoration: none;
          margin: 0 12px;
          font-weight: 600;
          font-size: 13px;
          transition: color 0.3s ease;
        }
        .social-links a:hover {
          color: ${BEAUTY_BUCKET_COLORS.darkPink};
        }
        .support-box {
          margin-top: 25px;
          padding: 20px 25px;
          background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.lightBg}, #FFF0F5);
          border-radius: 14px;
          border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
        }
        .support-box p {
          color: ${BEAUTY_BUCKET_COLORS.textLight};
          margin: 0 0 10px 0;
          font-size: 14px;
        }
        .support-box a {
          color: ${BEAUTY_BUCKET_COLORS.primary};
          text-decoration: none;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .support-box a:hover {
          color: ${BEAUTY_BUCKET_COLORS.darkPink};
        }
        .support-box strong {
          color: ${BEAUTY_BUCKET_COLORS.textDark};
        }
        .divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, ${BEAUTY_BUCKET_COLORS.border}, transparent);
          margin: 20px 0;
        }
        .footer-links a {
          color: ${BEAUTY_BUCKET_COLORS.textLight};
          text-decoration: none;
          margin: 0 8px;
          transition: color 0.3s ease;
        }
        .footer-links a:hover {
          color: ${BEAUTY_BUCKET_COLORS.primary};
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>
            <span>🔐</span>
            <span>Welcome to BeautyBucket!</span>
            <span>✨</span>
          </h1>
          <p class="subtitle">Your Beauty Journey Starts Here</p>
        </div>
        
        <div class="content">
          <div class="welcome-message">
            <p>Dear <strong>${name}</strong>,</p>
            <div class="google-badge">
              <span>🔐</span>
              <span>You've signed up with <strong>Google</strong></span>
            </div>
            <p>🎉 <span class="highlight">Welcome to the BeautyBucket family!</span> We're so excited to have you join our community of beauty enthusiasts!</p>
            <p>Your account has been successfully created with Google Sign-In. Get ready to explore our curated collection of premium beauty products!</p>
          </div>
          
          ${profileNote}
          
          <div class="benefits-box">
            <h3>
              <span>✨</span>
              <span>Your BeautyBucket Benefits</span>
            </h3>
            <ul class="benefits-list">
              <li><span>🌸</span> <span><strong>Premium Beauty Products</strong> - Curated selection of top-quality brands</span></li>
              <li><span>💎</span> <span><strong>Genuine Authenticity</strong> - 100% authentic products guaranteed</span></li>
              <li><span>🚚</span> <span><strong>Fast Delivery</strong> - Quick shipping across Bangladesh</span></li>
              <li><span>💕</span> <span><strong>Expert Support</strong> - Our beauty experts are here for you</span></li>
              <li><span>🎯</span> <span><strong>Exclusive Offers</strong> - Special discounts for our members</span></li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="${frontendUrl}/customer/dashboard" class="button">
              💖 Go to Your Dashboard →
            </a>
          </div>
          
          <div class="divider"></div>
          
          <div class="support-box">
            <p><strong>💕 Need Help?</strong></p>
            <p>Our friendly beauty experts are here for you!</p>
            <p style="margin: 10px 0 0 0;">
              📧 <a href="mailto:${process.env.INFO_SMTP_USER}">${process.env.INFO_SMTP_USER}</a><br>
              📞 +880 1234 567890
            </p>
          </div>
        </div>
        
        <div class="footer">
          <div class="social-links">
            <a href="#">Facebook</a> | 
            <a href="#">Instagram</a> | 
            <a href="#">YouTube</a>
          </div>
          <p style="margin: 5px 0;">&copy; ${currentYear} BeautyBucket. All rights reserved.</p>
          <p style="margin: 5px 0; font-family: 'Playfair Display', 'Georgia', serif; color: ${BEAUTY_BUCKET_COLORS.primary};">
            💖 Where Beauty Meets Confidence
          </p>
          <div class="footer-links">
            <a href="${frontendUrl}/privacy">Privacy Policy</a> | 
            <a href="${frontendUrl}/terms">Terms of Service</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const result = await transporter.sendMail({
      from: `"BeautyBucket" <${process.env.INFO_SMTP_USER}>`,
      to: email,
      subject: `💖 Welcome to BeautyBucket, ${name}! ✨`,
      html: htmlContent
    });
    
    console.log('✅ Google welcome email sent to:', email, 'Message ID:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('❌ Google welcome email error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendWelcomeEmail,
  sendGoogleWelcomeEmail
};