
// const nodemailer = require('nodemailer');

// // BeautyBucket Brand Colors - Pink/Magenta Beauty Theme
// const BEAUTY_BUCKET_COLORS = {
//   primary: '#EE4275',        // Bold Pink
//   secondary: '#FF6B9D',      // Light Pink
//   accent: '#FF6B9D',         // Pink accent
//   darkPink: '#D63A6A',       // Darker Pink
//   textDark: '#2D1B2E',       // Dark Purple-Black
//   textLight: '#8B7A8C',      // Muted Purple
//   white: '#FFFFFF',          // White
//   lightBg: '#FFF5F6',        // Very Light Pink background
//   border: '#FFD2DB',         // Light Pink border
//   success: '#4CAF50',        // Green for success
//   warning: '#FF8C00',        // Orange for warnings
//   gold: '#FFD700'            // Gold for accent
// };

// const TIMEZONE = 'Asia/Dhaka';

// // Create transporter
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
//     console.error('❌ Contact Email Service - Configuration error:', error.message);
//   } else {
//     console.log('✅ Contact Email Service is ready');
//     console.log(`📧 Using account: ${process.env.INFO_SMTP_USER}`);
//   }
// });

// /**
//  * Format date
//  */
// const formatDate = (dateString) => {
//   const date = new Date(dateString);
//   return date.toLocaleDateString('en-US', {
//     year: 'numeric',
//     month: 'long',
//     day: 'numeric',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//     timeZone: TIMEZONE
//   });
// };

// /**
//  * Send contact form submission emails (customer + admin)
//  */
// const sendContactFormEmails = async (formData) => {
//   console.log('📧 Sending contact form emails...');
//   console.log('📧 Customer email:', formData.email);
//   console.log('📧 Admin email:', process.env.INFO_EMAIL_FROM);

//   try {
//     const {
//       name,
//       email,
//       phone,
//       subject,
//       message
//     } = formData;

//     if (!email) {
//       throw new Error('Customer email is required');
//     }

//     const currentDate = formatDate(new Date());
//     const productInterest = subject || 'General Inquiry';

//     // 1. Send confirmation email to CUSTOMER
//     const customerEmailResult = await transporter.sendMail({
//       from: `"BeautyBucket" <${process.env.INFO_EMAIL_FROM}>`,
//       to: email,
//       subject: `💖 Thank You for Contacting BeautyBucket - ${productInterest}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <style>
//             body { 
//               font-family: 'Playfair Display', 'Georgia', 'Segoe UI', Arial, sans-serif; 
//               line-height: 1.6; 
//               color: ${BEAUTY_BUCKET_COLORS.textDark}; 
//               margin: 0;
//               padding: 0;
//               background-color: ${BEAUTY_BUCKET_COLORS.lightBg};
//             }
//             .container {
//               max-width: 600px;
//               margin: 20px auto;
//               background-color: ${BEAUTY_BUCKET_COLORS.white};
//               border-radius: 20px;
//               overflow: hidden;
//               box-shadow: 0 8px 40px rgba(238, 66, 117, 0.12);
//               border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
//             }
//             .header {
//               background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.primary}, ${BEAUTY_BUCKET_COLORS.secondary});
//               padding: 35px 20px;
//               text-align: center;
//               position: relative;
//             }
//             .header::after {
//               content: '';
//               position: absolute;
//               bottom: 0;
//               left: 0;
//               right: 0;
//               height: 4px;
//               background: linear-gradient(90deg, ${BEAUTY_BUCKET_COLORS.gold}, ${BEAUTY_BUCKET_COLORS.secondary}, ${BEAUTY_BUCKET_COLORS.gold});
//             }
//             .header h1 {
//               color: ${BEAUTY_BUCKET_COLORS.white};
//               margin: 0;
//               font-size: 28px;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               gap: 12px;
//               font-weight: 700;
//               font-family: 'Playfair Display', 'Georgia', serif;
//             }
//             .header p {
//               color: ${BEAUTY_BUCKET_COLORS.white};
//               margin: 10px 0 0 0;
//               opacity: 0.95;
//               font-size: 14px;
//               font-family: 'Playfair Display', 'Georgia', serif;
//             }
//             .content {
//               padding: 30px;
//               text-align: left;
//             }
//             .section-title {
//               font-size: 18px;
//               font-weight: 700;
//               margin: 25px 0 15px 0;
//               display: flex;
//               align-items: center;
//               gap: 8px;
//               color: ${BEAUTY_BUCKET_COLORS.textDark};
//               border-bottom: 2px solid ${BEAUTY_BUCKET_COLORS.border};
//               padding-bottom: 10px;
//               font-family: 'Playfair Display', 'Georgia', serif;
//             }
//             .section-title span:first-child {
//               color: ${BEAUTY_BUCKET_COLORS.primary};
//             }
//             .info-box {
//               background: ${BEAUTY_BUCKET_COLORS.lightBg};
//               padding: 20px;
//               border-radius: 14px;
//               margin: 15px 0;
//               border-left: 4px solid ${BEAUTY_BUCKET_COLORS.primary};
//               border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
//             }
//             .info-row {
//               display: flex;
//               margin-bottom: 12px;
//               border-bottom: 1px solid ${BEAUTY_BUCKET_COLORS.border};
//               padding-bottom: 8px;
//             }
//             .info-row:last-child {
//               border-bottom: none;
//               margin-bottom: 0;
//               padding-bottom: 0;
//             }
//             .info-label {
//               width: 100px;
//               font-weight: 600;
//               color: ${BEAUTY_BUCKET_COLORS.textLight};
//             }
//             .info-value {
//               flex: 1;
//               color: ${BEAUTY_BUCKET_COLORS.textDark};
//             }
//             .message-box {
//               background: ${BEAUTY_BUCKET_COLORS.lightBg};
//               padding: 20px;
//               border-radius: 14px;
//               margin: 15px 0;
//               border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
//             }
//             .footer {
//               margin-top: 30px;
//               padding-top: 20px;
//               border-top: 1px solid ${BEAUTY_BUCKET_COLORS.border};
//               text-align: left;
//             }
//             .signature {
//               background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.lightBg}, #FFF0F5);
//               padding: 15px 20px;
//               border-radius: 14px;
//               margin-top: 20px;
//               border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
//             }
//             .button {
//               display: inline-block;
//               background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.primary}, ${BEAUTY_BUCKET_COLORS.secondary});
//               color: ${BEAUTY_BUCKET_COLORS.white};
//               padding: 12px 30px;
//               text-decoration: none;
//               border-radius: 50px;
//               font-weight: 600;
//               font-size: 14px;
//               margin-top: 10px;
//               box-shadow: 0 4px 15px rgba(238, 66, 117, 0.3);
//               transition: all 0.3s ease;
//             }
//             .button:hover {
//               transform: translateY(-2px);
//               box-shadow: 0 6px 25px rgba(238, 66, 117, 0.4);
//             }
//             .flower-icon {
//               display: inline-block;
//               font-size: 20px;
//             }
//             .divider {
//               height: 2px;
//               background: linear-gradient(90deg, transparent, ${BEAUTY_BUCKET_COLORS.border}, transparent);
//               margin: 20px 0;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>
//                 <span>💖</span>
//                 <span>Thank You for Contacting BeautyBucket</span>
//               </h1>
//               <p>✨ Your Beauty Journey Starts Here ✨</p>
//             </div>
            
//             <div class="content">
//               <p style="margin-bottom: 20px; font-size: 16px;">Dear <strong>${name}</strong>,</p>
              
//               <p style="margin-bottom: 20px; font-size: 16px;">
//                 Thank you for reaching out to <strong>BeautyBucket</strong>! We have received your inquiry and our beauty experts will get back to you within <strong>24 hours</strong>.
//               </p>

//               <div class="section-title">
//                 <span>🌸</span>
//                 <span>Contact Summary</span>
//               </div>
              
//               <div class="info-box">
//                 <div class="info-row">
//                   <div class="info-label">Date:</div>
//                   <div class="info-value">${currentDate}</div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Product:</div>
//                   <div class="info-value"><strong>${productInterest}</strong></div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Name:</div>
//                   <div class="info-value">${name}</div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Email:</div>
//                   <div class="info-value">${email}</div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Phone:</div>
//                   <div class="info-value">${phone}</div>
//                 </div>
//               </div>

//               <div class="section-title">
//                 <span>💬</span>
//                 <span>Your Message</span>
//               </div>
              
//               <div class="message-box">
//                 <p style="margin: 0; white-space: pre-wrap; line-height: 1.8;">${message}</p>
//               </div>

//               <div class="signature">
//                 <p style="margin-bottom: 5px; font-size: 16px; font-weight: 600; color: ${BEAUTY_BUCKET_COLORS.primary};">
//                   ✨ What happens next?
//                 </p>
//                 <p style="margin: 0; font-size: 14px;">
//                   1️⃣ Our beauty team will review your inquiry<br>
//                   2️⃣ We'll respond within 24 hours<br>
//                   3️⃣ Get ready for a beauty transformation! 💖
//                 </p>
//               </div>

//               <div style="text-align: center; margin: 25px 0 10px;">
//                 <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" class="button">
//                   🛍️ Explore Our Beauty Collection
//                 </a>
//               </div>

//               <div class="divider"></div>

//               <div class="footer">
//                 <p style="margin-bottom: 5px; font-family: 'Playfair Display', 'Georgia', serif; font-size: 16px;">With love,</p>
//                 <p style="margin: 0; font-weight: bold; font-size: 18px; color: ${BEAUTY_BUCKET_COLORS.primary};">
//                   BeautyBucket Team 💕
//                 </p>
//                 <p style="font-size: 12px; color: ${BEAUTY_BUCKET_COLORS.textLight}; margin-top: 15px;">
//                   📧 ${process.env.INFO_EMAIL_FROM}<br>
//                   📞 +880 1234 567890<br>
//                   🌐 www.beautybucket.com
//                 </p>
//               </div>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     });
    
//     console.log('✅ Customer confirmation email sent to:', email, 'Message ID:', customerEmailResult.messageId);

//     // 2. Send notification email to ADMIN
//     const adminEmailResult = await transporter.sendMail({
//       from: `"BeautyBucket Contact" <${process.env.INFO_EMAIL_FROM}>`,
//       to: process.env.INFO_EMAIL_FROM,
//       subject: `💖 New Contact Form Submission - ${name}`,
//       html: `
//         <!DOCTYPE html>
//         <html>
//         <head>
//           <meta charset="UTF-8">
//           <meta name="viewport" content="width=device-width, initial-scale=1.0">
//           <style>
//             body { 
//               font-family: 'Playfair Display', 'Georgia', 'Segoe UI', Arial, sans-serif; 
//               line-height: 1.6; 
//               color: ${BEAUTY_BUCKET_COLORS.textDark}; 
//               margin: 0;
//               padding: 20px;
//               background-color: ${BEAUTY_BUCKET_COLORS.lightBg};
//             }
//             .container {
//               max-width: 700px;
//               margin: 0 auto;
//               background-color: ${BEAUTY_BUCKET_COLORS.white};
//               border-radius: 20px;
//               overflow: hidden;
//               box-shadow: 0 8px 40px rgba(238, 66, 117, 0.12);
//               border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
//             }
//             .header {
//               background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.primary}, ${BEAUTY_BUCKET_COLORS.secondary});
//               padding: 30px 30px;
//               text-align: center;
//               position: relative;
//             }
//             .header::after {
//               content: '';
//               position: absolute;
//               bottom: 0;
//               left: 0;
//               right: 0;
//               height: 4px;
//               background: linear-gradient(90deg, ${BEAUTY_BUCKET_COLORS.gold}, ${BEAUTY_BUCKET_COLORS.secondary}, ${BEAUTY_BUCKET_COLORS.gold});
//             }
//             .header h1 {
//               color: ${BEAUTY_BUCKET_COLORS.white};
//               margin: 0;
//               font-size: 28px;
//               display: flex;
//               align-items: center;
//               justify-content: center;
//               gap: 10px;
//               font-weight: 700;
//               font-family: 'Playfair Display', 'Georgia', serif;
//             }
//             .badge {
//               display: inline-block;
//               background: ${BEAUTY_BUCKET_COLORS.white};
//               color: ${BEAUTY_BUCKET_COLORS.primary};
//               padding: 4px 20px;
//               border-radius: 50px;
//               font-size: 12px;
//               font-weight: bold;
//               margin-top: 10px;
//               box-shadow: 0 2px 10px rgba(0,0,0,0.1);
//             }
//             .content {
//               padding: 30px;
//               text-align: left;
//             }
//             .section-title {
//               font-size: 18px;
//               font-weight: 700;
//               margin: 25px 0 15px 0;
//               display: flex;
//               align-items: center;
//               gap: 8px;
//               color: ${BEAUTY_BUCKET_COLORS.textDark};
//               border-bottom: 2px solid ${BEAUTY_BUCKET_COLORS.border};
//               padding-bottom: 10px;
//               font-family: 'Playfair Display', 'Georgia', serif;
//             }
//             .section-title span:first-child {
//               color: ${BEAUTY_BUCKET_COLORS.primary};
//             }
//             .info-grid {
//               background: ${BEAUTY_BUCKET_COLORS.lightBg};
//               padding: 20px;
//               border-radius: 14px;
//               margin: 15px 0;
//               border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
//             }
//             .info-row {
//               display: flex;
//               margin-bottom: 12px;
//               border-bottom: 1px solid ${BEAUTY_BUCKET_COLORS.border};
//               padding-bottom: 8px;
//             }
//             .info-row:last-child {
//               border-bottom: none;
//               margin-bottom: 0;
//               padding-bottom: 0;
//             }
//             .info-label {
//               width: 100px;
//               font-weight: 600;
//               color: ${BEAUTY_BUCKET_COLORS.textLight};
//             }
//             .info-value {
//               flex: 1;
//               color: ${BEAUTY_BUCKET_COLORS.textDark};
//             }
//             .message-box {
//               background: ${BEAUTY_BUCKET_COLORS.lightBg};
//               padding: 20px;
//               border-radius: 14px;
//               margin: 20px 0;
//               border: 1px solid ${BEAUTY_BUCKET_COLORS.border};
//             }
//             .action-buttons {
//               margin: 30px 0;
//               text-align: center;
//             }
//             .button {
//               background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.primary}, ${BEAUTY_BUCKET_COLORS.secondary});
//               color: white;
//               padding: 12px 25px;
//               text-decoration: none;
//               border-radius: 50px;
//               display: inline-block;
//               font-weight: 600;
//               font-size: 14px;
//               margin: 0 10px 10px 10px;
//               box-shadow: 0 4px 15px rgba(238, 66, 117, 0.3);
//               transition: all 0.3s ease;
//             }
//             .button:hover {
//               transform: translateY(-2px);
//               box-shadow: 0 6px 25px rgba(238, 66, 117, 0.4);
//             }
//             .button-outline {
//               background: white;
//               color: ${BEAUTY_BUCKET_COLORS.primary};
//               border: 2px solid ${BEAUTY_BUCKET_COLORS.primary};
//               padding: 10px 23px;
//               text-decoration: none;
//               border-radius: 50px;
//               display: inline-block;
//               font-weight: 600;
//               font-size: 14px;
//               margin: 0 10px 10px 10px;
//               transition: all 0.3s ease;
//             }
//             .button-outline:hover {
//               background: ${BEAUTY_BUCKET_COLORS.lightBg};
//               transform: translateY(-2px);
//             }
//             .footer {
//               margin-top: 30px;
//               padding-top: 20px;
//               border-top: 1px solid ${BEAUTY_BUCKET_COLORS.border};
//               text-align: left;
//               font-size: 13px;
//               color: ${BEAUTY_BUCKET_COLORS.textLight};
//             }
//             .divider {
//               height: 2px;
//               background: linear-gradient(90deg, transparent, ${BEAUTY_BUCKET_COLORS.border}, transparent);
//               margin: 20px 0;
//             }
//             .urgent-badge {
//               display: inline-block;
//               background: ${BEAUTY_BUCKET_COLORS.primary};
//               color: white;
//               padding: 2px 12px;
//               border-radius: 50px;
//               font-size: 10px;
//               font-weight: bold;
//               margin-left: 8px;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="container">
//             <div class="header">
//               <h1>
//                 <span>💖</span>
//                 <span>New Contact Form Submission</span>
//               </h1>
//               <div class="badge">✨ ACTION REQUIRED ✨</div>
//             </div>
            
//             <div class="content">
//               <p style="margin-bottom: 20px; font-size: 16px;">
//                 A new beauty inquiry has been submitted on BeautyBucket website.
//               </p>

//               <div class="section-title">
//                 <span>👤</span>
//                 <span>Customer Information</span>
//               </div>
              
//               <div class="info-grid">
//                 <div class="info-row">
//                   <div class="info-label">Name:</div>
//                   <div class="info-value"><strong>${name}</strong></div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Email:</div>
//                   <div class="info-value">
//                     <a href="mailto:${email}" style="color: ${BEAUTY_BUCKET_COLORS.primary}; text-decoration: none;">${email}</a>
//                   </div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Phone:</div>
//                   <div class="info-value"><a href="tel:${phone}" style="color: ${BEAUTY_BUCKET_COLORS.primary}; text-decoration: none;">${phone}</a></div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Product:</div>
//                   <div class="info-value"><strong>${productInterest}</strong></div>
//                 </div>
//                 <div class="info-row">
//                   <div class="info-label">Submitted:</div>
//                   <div class="info-value">${currentDate}</div>
//                 </div>
//               </div>

//               <div class="section-title">
//                 <span>💬</span>
//                 <span>Customer Message</span>
//               </div>
              
//               <div class="message-box">
//                 <p style="margin: 0; white-space: pre-wrap; line-height: 1.8;">${message}</p>
//               </div>

//               <div class="divider"></div>

//               <div class="action-buttons">
//                 <a href="mailto:${email}" class="button">💌 Reply to Customer</a>
//                 <a href="tel:${phone}" class="button-outline">📞 Call Customer</a>
//               </div>
              
//               <div class="footer">
//                 <p style="margin: 0;">
//                   ⚡ This is an automated notification from BeautyBucket contact form. 
//                   <span style="color: ${BEAUTY_BUCKET_COLORS.primary}; font-weight: 600;">
//                     Please respond within 24 hours.
//                   </span>
//                 </p>
//                 <p style="margin-top: 10px; font-size: 12px; color: ${BEAUTY_BUCKET_COLORS.textLight};">
//                   💖 Beauty is our passion. Thank you for being part of our beauty community!
//                 </p>
//               </div>
//             </div>
//           </div>
//         </body>
//         </html>
//       `
//     });
    
//     console.log('✅ Admin notification email sent to:', process.env.INFO_EMAIL_FROM, 'Message ID:', adminEmailResult.messageId);

//     return { success: true };
//   } catch (error) {
//     console.error('❌ Contact form email error:', error.message);
//     return { success: false, error: error.message };
//   }
// };

// module.exports = {
//   sendContactFormEmails
// };


const nodemailer = require('nodemailer');

// HyperVolt Brand Colors
const HYPERVOLT_COLORS = {
  primary: '#0D506F',        // Main HyperVolt Blue
  secondary: '#06B6D4',      // Cyan accent
  accent: '#06B6D4',         // Cyan accent
  darkBlue: '#0A3D55',       // Darker Blue
  textDark: '#1A1A2E',       // Dark text
  textLight: '#64748B',      // Light text
  white: '#FFFFFF',          // White
  lightBg: '#F0F7FA',        // Light background
  border: '#0D506F30',       // Border with opacity
  success: '#22C55E',        // Green for success
  warning: '#F59E0B',        // Orange for warnings
  gold: '#FFD700'            // Gold for accent
};

const TIMEZONE = 'Asia/Dhaka';

// Create transporter
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
    console.error('❌ Contact Email Service - Configuration error:', error.message);
  } else {
    console.log('✅ Contact Email Service is ready');
    console.log(`📧 Using account: ${process.env.INFO_SMTP_USER}`);
  }
});

/**
 * Format date
 */
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: TIMEZONE
  });
};

/**
 * Send contact form submission emails (customer + admin)
 */
const sendContactFormEmails = async (formData) => {
  console.log('📧 Sending contact form emails...');
  console.log('📧 Customer email:', formData.email);
  console.log('📧 Admin email:', process.env.INFO_EMAIL_FROM);

  try {
    const {
      name,
      email,
      phone,
      subject,
      message
    } = formData;

    if (!email) {
      throw new Error('Customer email is required');
    }

    const currentDate = formatDate(new Date());
    const productInterest = subject || 'General Inquiry';

    // 1. Send confirmation email to CUSTOMER
    const customerEmailResult = await transporter.sendMail({
      from: `"HyperVolt" <${process.env.INFO_EMAIL_FROM}>`,
      to: email,
      subject: `⚡ Thank You for Contacting HyperVolt - ${productInterest}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Playfair Display', 'Georgia', 'Segoe UI', Arial, sans-serif; 
              line-height: 1.6; 
              color: ${HYPERVOLT_COLORS.textDark}; 
              margin: 0;
              padding: 0;
              background-color: ${HYPERVOLT_COLORS.lightBg};
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: ${HYPERVOLT_COLORS.white};
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 8px 40px rgba(13, 80, 111, 0.12);
              border: 1px solid ${HYPERVOLT_COLORS.border};
            }
            .header {
              background: linear-gradient(135deg, ${HYPERVOLT_COLORS.primary}, ${HYPERVOLT_COLORS.secondary});
              padding: 35px 20px;
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
              background: linear-gradient(90deg, ${HYPERVOLT_COLORS.gold}, ${HYPERVOLT_COLORS.secondary}, ${HYPERVOLT_COLORS.gold});
            }
            .header h1 {
              color: ${HYPERVOLT_COLORS.white};
              margin: 0;
              font-size: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 12px;
              font-weight: 700;
              font-family: 'Playfair Display', 'Georgia', serif;
            }
            .header p {
              color: ${HYPERVOLT_COLORS.white};
              margin: 10px 0 0 0;
              opacity: 0.95;
              font-size: 14px;
              font-family: 'Playfair Display', 'Georgia', serif;
            }
            .content {
              padding: 30px;
              text-align: left;
            }
            .section-title {
              font-size: 18px;
              font-weight: 700;
              margin: 25px 0 15px 0;
              display: flex;
              align-items: center;
              gap: 8px;
              color: ${HYPERVOLT_COLORS.textDark};
              border-bottom: 2px solid ${HYPERVOLT_COLORS.border};
              padding-bottom: 10px;
              font-family: 'Playfair Display', 'Georgia', serif;
            }
            .section-title span:first-child {
              color: ${HYPERVOLT_COLORS.secondary};
            }
            .info-box {
              background: ${HYPERVOLT_COLORS.lightBg};
              padding: 20px;
              border-radius: 14px;
              margin: 15px 0;
              border-left: 4px solid ${HYPERVOLT_COLORS.secondary};
              border: 1px solid ${HYPERVOLT_COLORS.border};
            }
            .info-row {
              display: flex;
              margin-bottom: 12px;
              border-bottom: 1px solid ${HYPERVOLT_COLORS.border};
              padding-bottom: 8px;
            }
            .info-row:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .info-label {
              width: 100px;
              font-weight: 600;
              color: ${HYPERVOLT_COLORS.textLight};
            }
            .info-value {
              flex: 1;
              color: ${HYPERVOLT_COLORS.textDark};
            }
            .message-box {
              background: ${HYPERVOLT_COLORS.lightBg};
              padding: 20px;
              border-radius: 14px;
              margin: 15px 0;
              border: 1px solid ${HYPERVOLT_COLORS.border};
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid ${HYPERVOLT_COLORS.border};
              text-align: left;
            }
            .signature {
              background: linear-gradient(135deg, ${HYPERVOLT_COLORS.lightBg}, #E8F0F5);
              padding: 15px 20px;
              border-radius: 14px;
              margin-top: 20px;
              border: 1px solid ${HYPERVOLT_COLORS.border};
            }
            .button {
              display: inline-block;
              background: linear-gradient(135deg, ${HYPERVOLT_COLORS.primary}, ${HYPERVOLT_COLORS.secondary});
              color: ${HYPERVOLT_COLORS.white};
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 50px;
              font-weight: 600;
              font-size: 14px;
              margin-top: 10px;
              box-shadow: 0 4px 15px rgba(13, 80, 111, 0.3);
              transition: all 0.3s ease;
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 25px rgba(13, 80, 111, 0.4);
            }
            .bolt-icon {
              display: inline-block;
              font-size: 20px;
            }
            .divider {
              height: 2px;
              background: linear-gradient(90deg, transparent, ${HYPERVOLT_COLORS.border}, transparent);
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>⚡</span>
                <span>Thank You for Contacting HyperVolt</span>
              </h1>
              <p>✨ Powering Your Digital Life ✨</p>
            </div>
            
            <div class="content">
              <p style="margin-bottom: 20px; font-size: 16px;">Dear <strong>${name}</strong>,</p>
              
              <p style="margin-bottom: 20px; font-size: 16px;">
                Thank you for reaching out to <strong>HyperVolt</strong>! We have received your inquiry and our team will get back to you within <strong>24 hours</strong>.
              </p>

              <div class="section-title">
                <span>⚡</span>
                <span>Contact Summary</span>
              </div>
              
              <div class="info-box">
                <div class="info-row">
                  <div class="info-label">Date:</div>
                  <div class="info-value">${currentDate}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Product:</div>
                  <div class="info-value"><strong>${productInterest}</strong></div>
                </div>
                <div class="info-row">
                  <div class="info-label">Name:</div>
                  <div class="info-value">${name}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Email:</div>
                  <div class="info-value">${email}</div>
                </div>
                <div class="info-row">
                  <div class="info-label">Phone:</div>
                  <div class="info-value">${phone}</div>
                </div>
              </div>

              <div class="section-title">
                <span>💬</span>
                <span>Your Message</span>
              </div>
              
              <div class="message-box">
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.8;">${message}</p>
              </div>

              <div class="signature">
                <p style="margin-bottom: 5px; font-size: 16px; font-weight: 600; color: ${HYPERVOLT_COLORS.secondary};">
                  ⚡ What happens next?
                </p>
                <p style="margin: 0; font-size: 14px;">
                  1️⃣ Our team will review your inquiry<br>
                  2️⃣ We'll respond within 24 hours<br>
                  3️⃣ Get ready for an amazing experience! ⚡
                </p>
              </div>

             <div style="text-align: center; margin: 25px 0 10px;">
  <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/products" 
     class="button" 
     style="color: #FFFFFF; text-decoration: none; display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, ${HYPERVOLT_COLORS.primary}, ${HYPERVOLT_COLORS.secondary}); border-radius: 50px; font-weight: 600; font-size: 14px; box-shadow: 0 4px 15px rgba(13, 80, 111, 0.3);">
    🛍️ Explore Our Products
  </a>
</div>

              <div class="divider"></div>

              <div class="footer">
                <p style="margin-bottom: 5px; font-family: 'Playfair Display', 'Georgia', serif; font-size: 16px;">Best regards,</p>
                <p style="margin: 0; font-weight: bold; font-size: 18px; color: ${HYPERVOLT_COLORS.primary};">
                  HyperVolt Team ⚡
                </p>
                <p style="font-size: 12px; color: ${HYPERVOLT_COLORS.textLight}; margin-top: 15px;">
                  📧 ${process.env.INFO_EMAIL_FROM}<br>
                  📞 +880 1234 567890<br>
                  🌐 www.hypervolt.com
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('✅ Customer confirmation email sent to:', email, 'Message ID:', customerEmailResult.messageId);

    // 2. Send notification email to ADMIN
    const adminEmailResult = await transporter.sendMail({
      from: `"HyperVolt Contact" <${process.env.INFO_EMAIL_FROM}>`,
      to: process.env.INFO_EMAIL_FROM,
      subject: `⚡ New Contact Form Submission - ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Playfair Display', 'Georgia', 'Segoe UI', Arial, sans-serif; 
              line-height: 1.6; 
              color: ${HYPERVOLT_COLORS.textDark}; 
              margin: 0;
              padding: 20px;
              background-color: ${HYPERVOLT_COLORS.lightBg};
            }
            .container {
              max-width: 700px;
              margin: 0 auto;
              background-color: ${HYPERVOLT_COLORS.white};
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 8px 40px rgba(13, 80, 111, 0.12);
              border: 1px solid ${HYPERVOLT_COLORS.border};
            }
            .header {
              background: linear-gradient(135deg, ${HYPERVOLT_COLORS.primary}, ${HYPERVOLT_COLORS.secondary});
              padding: 30px 30px;
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
              background: linear-gradient(90deg, ${HYPERVOLT_COLORS.gold}, ${HYPERVOLT_COLORS.secondary}, ${HYPERVOLT_COLORS.gold});
            }
            .header h1 {
              color: ${HYPERVOLT_COLORS.white};
              margin: 0;
              font-size: 28px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 10px;
              font-weight: 700;
              font-family: 'Playfair Display', 'Georgia', serif;
            }
            .badge {
              display: inline-block;
              background: ${HYPERVOLT_COLORS.white};
              color: ${HYPERVOLT_COLORS.primary};
              padding: 4px 20px;
              border-radius: 50px;
              font-size: 12px;
              font-weight: bold;
              margin-top: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .content {
              padding: 30px;
              text-align: left;
            }
            .section-title {
              font-size: 18px;
              font-weight: 700;
              margin: 25px 0 15px 0;
              display: flex;
              align-items: center;
              gap: 8px;
              color: ${HYPERVOLT_COLORS.textDark};
              border-bottom: 2px solid ${HYPERVOLT_COLORS.border};
              padding-bottom: 10px;
              font-family: 'Playfair Display', 'Georgia', serif;
            }
            .section-title span:first-child {
              color: ${HYPERVOLT_COLORS.secondary};
            }
            .info-grid {
              background: ${HYPERVOLT_COLORS.lightBg};
              padding: 20px;
              border-radius: 14px;
              margin: 15px 0;
              border: 1px solid ${HYPERVOLT_COLORS.border};
            }
            .info-row {
              display: flex;
              margin-bottom: 12px;
              border-bottom: 1px solid ${HYPERVOLT_COLORS.border};
              padding-bottom: 8px;
            }
            .info-row:last-child {
              border-bottom: none;
              margin-bottom: 0;
              padding-bottom: 0;
            }
            .info-label {
              width: 100px;
              font-weight: 600;
              color: ${HYPERVOLT_COLORS.textLight};
            }
            .info-value {
              flex: 1;
              color: ${HYPERVOLT_COLORS.textDark};
            }
            .message-box {
              background: ${HYPERVOLT_COLORS.lightBg};
              padding: 20px;
              border-radius: 14px;
              margin: 20px 0;
              border: 1px solid ${HYPERVOLT_COLORS.border};
            }
            .action-buttons {
              margin: 30px 0;
              text-align: center;
            }
            .button {
              background: linear-gradient(135deg, ${HYPERVOLT_COLORS.primary}, ${HYPERVOLT_COLORS.secondary});
              color: white;
              padding: 12px 25px;
              text-decoration: none;
              border-radius: 50px;
              display: inline-block;
              font-weight: 600;
              font-size: 14px;
              margin: 0 10px 10px 10px;
              box-shadow: 0 4px 15px rgba(13, 80, 111, 0.3);
              transition: all 0.3s ease;
            }
            .button:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 25px rgba(13, 80, 111, 0.4);
            }
            .button-outline {
              background: white;
              color: ${HYPERVOLT_COLORS.primary};
              border: 2px solid ${HYPERVOLT_COLORS.primary};
              padding: 10px 23px;
              text-decoration: none;
              border-radius: 50px;
              display: inline-block;
              font-weight: 600;
              font-size: 14px;
              margin: 0 10px 10px 10px;
              transition: all 0.3s ease;
            }
            .button-outline:hover {
              background: ${HYPERVOLT_COLORS.lightBg};
              transform: translateY(-2px);
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid ${HYPERVOLT_COLORS.border};
              text-align: left;
              font-size: 13px;
              color: ${HYPERVOLT_COLORS.textLight};
            }
            .divider {
              height: 2px;
              background: linear-gradient(90deg, transparent, ${HYPERVOLT_COLORS.border}, transparent);
              margin: 20px 0;
            }
            .urgent-badge {
              display: inline-block;
              background: ${HYPERVOLT_COLORS.secondary};
              color: white;
              padding: 2px 12px;
              border-radius: 50px;
              font-size: 10px;
              font-weight: bold;
              margin-left: 8px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>
                <span>⚡</span>
                <span>New Contact Form Submission</span>
              </h1>
              <div class="badge">⚡ ACTION REQUIRED ⚡</div>
            </div>
            
            <div class="content">
              <p style="margin-bottom: 20px; font-size: 16px;">
                A new inquiry has been submitted on HyperVolt website.
              </p>

              <div class="section-title">
                <span>👤</span>
                <span>Customer Information</span>
              </div>
              
              <div class="info-grid">
                <div class="info-row">
                  <div class="info-label">Name:</div>
                  <div class="info-value"><strong>${name}</strong></div>
                </div>
                <div class="info-row">
                  <div class="info-label">Email:</div>
                  <div class="info-value">
                    <a href="mailto:${email}" style="color: ${HYPERVOLT_COLORS.secondary}; text-decoration: none;">${email}</a>
                  </div>
                </div>
                <div class="info-row">
                  <div class="info-label">Phone:</div>
                  <div class="info-value"><a href="tel:${phone}" style="color: ${HYPERVOLT_COLORS.secondary}; text-decoration: none;">${phone}</a></div>
                </div>
                <div class="info-row">
                  <div class="info-label">Product:</div>
                  <div class="info-value"><strong>${productInterest}</strong></div>
                </div>
                <div class="info-row">
                  <div class="info-label">Submitted:</div>
                  <div class="info-value">${currentDate}</div>
                </div>
              </div>

              <div class="section-title">
                <span>💬</span>
                <span>Customer Message</span>
              </div>
              
              <div class="message-box">
                <p style="margin: 0; white-space: pre-wrap; line-height: 1.8;">${message}</p>
              </div>

              <div class="divider"></div>

              <div class="action-buttons">
                <a href="mailto:${email}" class="button">💌 Reply to Customer</a>
                <a href="tel:${phone}" class="button-outline">📞 Call Customer</a>
              </div>
              
              <div class="footer">
                <p style="margin: 0;">
                  ⚡ This is an automated notification from HyperVolt contact form. 
                  <span style="color: ${HYPERVOLT_COLORS.secondary}; font-weight: 600;">
                    Please respond within 24 hours.
                  </span>
                </p>
                <p style="margin-top: 10px; font-size: 12px; color: ${HYPERVOLT_COLORS.textLight};">
                  ⚡ Powering Your Digital Life
                </p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    });
    
    console.log('✅ Admin notification email sent to:', process.env.INFO_EMAIL_FROM, 'Message ID:', adminEmailResult.messageId);

    return { success: true };
  } catch (error) {
    console.error('❌ Contact form email error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendContactFormEmails
};