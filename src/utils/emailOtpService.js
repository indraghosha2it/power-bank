// // utils/emailOtpService.js
// const nodemailer = require('nodemailer');

// // Validate environment variables
// const requiredEnvVars = ['INFO_SMTP_USER', 'INFO_SMTP_PASSWORD', 'INFO_SMTP_HOST', 'INFO_SMTP_PORT'];
// for (const envVar of requiredEnvVars) {
//   if (!process.env[envVar]) {
//     console.error(`❌ Missing required environment variable: ${envVar}`);
//     console.error('Please check your .env file');
//   }
// }

// // HyperVolt Brand Colors
// const HYPERVOLT_COLORS = {
//   primary: '#0D506F',        // Main HyperVolt Blue
//   secondary: '#06B6D4',      // Cyan accent
//   accent: '#06B6D4',         // Cyan accent
//   darkBlue: '#0A3D55',       // Darker Blue
//   gold: '#FFD700',           // Gold for accent
//   textDark: '#1A1A2E',       // Dark text
//   textLight: '#64748B',      // Light text
//   white: '#FFFFFF',          // White
//   lightBg: '#F0F7FA',        // Light background
//   border: '#0D506F30',       // Border with opacity
//   success: '#22C55E',        // Green for success
//   warning: '#F59E0B'         // Orange for warnings
// };

// // Create transporter for Hostinger SMTP (port 465 with SSL)
// const transporter = nodemailer.createTransport({
//   host: process.env.INFO_SMTP_HOST,
//   port: parseInt(process.env.INFO_SMTP_PORT) || 465,
//   secure: true,
//   auth: {
//     user: process.env.INFO_SMTP_USER,
//     pass: process.env.INFO_SMTP_PASSWORD
//   },
//   tls: {
//     rejectUnauthorized: false
//   },
//   debug: true,
//   logger: true
// });

// // Verify connection configuration
// transporter.verify(function(error, success) {
//   if (error) {
//     console.error('❌ Email server connection error:', error);
//     console.error('Please check your SMTP credentials in .env file');
//   } else {
//     console.log('✅ Email server is ready to send messages');
//     console.log(`📧 Connected to: ${process.env.INFO_SMTP_HOST}`);
//   }
// });

// // Generate 6-digit OTP
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Send OTP email with HyperVolt branding
// const sendOTPEmail = async (email, otp, contactPerson) => {
//   if (!process.env.INFO_SMTP_USER || !process.env.INFO_SMTP_PASSWORD) {
//     throw new Error('Email credentials not configured. Please check your .env file.');
//   }

//   const mailOptions = {
//     from: `"HyperVolt" <${process.env.INFO_SMTP_USER}>`,
//     to: email,
//     subject: '⚡ Verify Your Email - HyperVolt',
//     html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <style>
//           @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
//         </style>
//       </head>
//       <body style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: ${HYPERVOLT_COLORS.lightBg};">
//         <div style="max-width: 600px; margin: 20px auto; background-color: ${HYPERVOLT_COLORS.white}; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(13, 80, 111, 0.12); border: 1px solid ${HYPERVOLT_COLORS.border};">
          
//           <!-- Header with HyperVolt Branding -->
//           <div style="background: linear-gradient(135deg, ${HYPERVOLT_COLORS.primary}, ${HYPERVOLT_COLORS.secondary}); padding: 35px 20px 30px; text-align: center; position: relative;">
//             <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, ${HYPERVOLT_COLORS.gold}, ${HYPERVOLT_COLORS.secondary}, ${HYPERVOLT_COLORS.gold});"></div>
//             <div style="display: inline-block; background: rgba(255,255,255,0.15); border-radius: 14px; padding: 12px 24px; margin-bottom: 15px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.25);">
//               <span style="font-size: 28px; margin-right: 10px;">⚡</span>
//               <span style="font-family: 'Playfair Display', 'Georgia', serif; color: ${HYPERVOLT_COLORS.white}; font-weight: 700; font-size: 22px; letter-spacing: 1px;">HyperVolt</span>
//             </div>
//             <p style="color: ${HYPERVOLT_COLORS.white}; margin: 10px 0 0; opacity: 0.95; font-size: 14px; font-family: 'Playfair Display', 'Georgia', serif;">Powering Your Digital Life</p>
//           </div>
          
//           <!-- Content -->
//           <div style="padding: 40px 30px;">
//             <h2 style="color: ${HYPERVOLT_COLORS.textDark}; margin-top: 0; font-family: 'Playfair Display', 'Georgia', serif; font-size: 24px; font-weight: 700;">
//               Welcome to HyperVolt, ${contactPerson}! ⚡
//             </h2>
            
//             <p style="color: ${HYPERVOLT_COLORS.textLight}; line-height: 1.8; margin-bottom: 20px; font-size: 15px;">
//               Thank you for choosing HyperVolt — your ultimate destination for premium gadgets and power banks! 
//               To complete your registration and unlock exclusive deals, please verify your email address using the OTP below:
//             </p>
            
//             <!-- OTP Box -->
//             <div style="background: linear-gradient(135deg, ${HYPERVOLT_COLORS.lightBg}, #E8F0F5); border: 2px solid ${HYPERVOLT_COLORS.primary}; border-radius: 16px; padding: 30px; text-align: center; margin: 30px 0; box-shadow: 0 4px 20px rgba(13, 80, 111, 0.1);">
//               <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 12px; margin-bottom: 10px; letter-spacing: 3px; text-transform: uppercase; font-weight: 600;">Verification Code</p>
//               <h1 style="font-size: 52px; letter-spacing: 14px; color: ${HYPERVOLT_COLORS.primary}; margin: 10px 0; font-family: 'Inter', Arial, sans-serif; font-weight: 700; text-shadow: 0 2px 10px rgba(13, 80, 111, 0.2);">${otp}</h1>
//               <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 12px; margin-top: 10px;">Enter this code to verify your email</p>
//             </div>
            
//             <p style="color: ${HYPERVOLT_COLORS.textLight}; line-height: 1.8;">
//               This OTP is valid for <strong style="color: ${HYPERVOLT_COLORS.primary};">10 minutes</strong>.
//             </p>
            
//             <!-- Benefits Section -->
//             <div style="background: linear-gradient(135deg, ${HYPERVOLT_COLORS.lightBg}, #E8F0F5); border-radius: 14px; padding: 25px; margin: 30px 0; border: 1px solid ${HYPERVOLT_COLORS.border};">
//               <p style="color: ${HYPERVOLT_COLORS.textDark}; font-weight: 700; margin-bottom: 15px; text-align: center; font-size: 15px; font-family: 'Playfair Display', 'Georgia', serif;">⚡ What Awaits You at HyperVolt? ⚡</p>
//               <table style="width: 100%; font-size: 13px;">
//                 <tr>
//                   <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.secondary}; font-size: 20px; width: 35px;">⚡</td>
//                   <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.textDark};">Premium gadgets and power banks curated for you</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.secondary}; font-size: 20px;">💎</td>
//                   <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.textDark};">100% authentic products guaranteed</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.secondary}; font-size: 20px;">🚚</td>
//                   <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.textDark};">Fast delivery across Bangladesh</td>
//                 </tr>
//                 <tr>
//                   <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.secondary}; font-size: 20px;">💡</td>
//                   <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.textDark};">Expert support & guidance</td>
//                 </tr>
//               </table>
//             </div>
            
//             <div style="background: linear-gradient(135deg, ${HYPERVOLT_COLORS.lightBg}, #E8F0F5); border-left: 4px solid ${HYPERVOLT_COLORS.secondary}; padding: 18px 20px; margin: 20px 0; border-radius: 10px; border: 1px solid ${HYPERVOLT_COLORS.border};">
//               <p style="color: ${HYPERVOLT_COLORS.textLight}; margin: 0; font-size: 13px;">
//                 <strong style="color: ${HYPERVOLT_COLORS.secondary};">🔒 Important:</strong> If you didn't request this registration, please ignore this email. 
//                 Your account will not be activated without verification.
//               </p>
//             </div>
            
//             <!-- Divider -->
//             <div style="height: 2px; background: linear-gradient(90deg, transparent, ${HYPERVOLT_COLORS.border}, transparent); margin: 25px 0;"></div>
            
//             <!-- Call to Action -->
//             <div style="text-align: center; margin-top: 20px;">
//               <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 13px; margin-bottom: 15px;">
//                 <span style="font-family: 'Playfair Display', 'Georgia', serif; font-size: 14px; color: ${HYPERVOLT_COLORS.secondary};">⚡</span>
//                 Ready to explore the world of gadgets?
//               </p>
//             </div>
//           </div>
          
//           <!-- Footer -->
//           <div style="background: linear-gradient(135deg, ${HYPERVOLT_COLORS.lightBg}, #E8F0F5); padding: 25px 30px; text-align: center; border-top: 1px solid ${HYPERVOLT_COLORS.border};">
//             <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 12px; margin: 0;">
//               &copy; ${new Date().getFullYear()} HyperVolt. All rights reserved.<br>
//               <span style="font-size: 11px; font-family: 'Playfair Display', 'Georgia', serif; color: ${HYPERVOLT_COLORS.secondary};">⚡ Powering Your Digital Life</span>
//             </p>
//             <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 11px; margin-top: 10px;">
//               <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://hypervolt.com'}" style="color: ${HYPERVOLT_COLORS.primary}; text-decoration: none; font-weight: 600;">Visit Our Store</a> | 
//               <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://hypervolt.com'}/support" style="color: ${HYPERVOLT_COLORS.primary}; text-decoration: none; font-weight: 600;">Support Center</a>
//             </p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `,
//     text: `
//       Welcome to HyperVolt, ${contactPerson}! ⚡

//       Thank you for choosing HyperVolt — your ultimate destination for premium gadgets and power banks!

//       Your OTP verification code is: ${otp}

//       This code is valid for 10 minutes.

//       ⚡ What Awaits You at HyperVolt? ⚡
//       ⚡ Premium gadgets and power banks curated for you
//       💎 100% authentic products guaranteed
//       🚚 Fast delivery across Bangladesh
//       💡 Expert support & guidance

//       🔒 Important: If you didn't request this registration, please ignore this email.

//       Visit us at: ${process.env.NEXT_PUBLIC_APP_URL || 'https://hypervolt.com'}
//       Support: ${process.env.NEXT_PUBLIC_APP_URL || 'https://hypervolt.com'}/support
//     `
//   };

//   try {
//     console.log(`📧 Attempting to send OTP email to: ${email}`);
//     console.log(`📧 Using SMTP server: ${process.env.INFO_SMTP_HOST}:${process.env.INFO_SMTP_PORT}`);
    
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ OTP email sent successfully to ${email}`);
//     console.log(`📧 Message ID: ${info.messageId}`);
    
//     return true;
//   } catch (error) {
//     console.error('❌ Email send error details:', {
//       error: error.message,
//       code: error.code,
//       command: error.command,
//       response: error.response,
//       responseCode: error.responseCode
//     });
    
//     if (error.code === 'EAUTH') {
//       throw new Error('Email authentication failed. Please check your SMTP username and password.');
//     } else if (error.code === 'ESOCKET') {
//       throw new Error(`Could not connect to SMTP server ${process.env.INFO_SMTP_HOST}:${process.env.INFO_SMTP_PORT}. Please check your network and firewall settings.`);
//     } else if (error.code === 'ETIMEDOUT') {
//       throw new Error('Connection to SMTP server timed out. Please check your network.');
//     } else {
//       throw new Error(`Failed to send OTP email: ${error.message}`);
//     }
//   }
// };

// module.exports = {
//   generateOTP,
//   sendOTPEmail
// };

// utils/emailOtpService.js
const { sendEmail, getFromAddress } = require('./emailService');

// HyperVolt Brand Colors
const HYPERVOLT_COLORS = {
  primary: '#0D506F',        // Main HyperVolt Blue
  secondary: '#06B6D4',      // Cyan accent
  accent: '#06B6D4',         // Cyan accent
  darkBlue: '#0A3D55',       // Darker Blue
  gold: '#FFD700',           // Gold for accent
  textDark: '#1A1A2E',       // Dark text
  textLight: '#64748B',      // Light text
  white: '#FFFFFF',          // White
  lightBg: '#F0F7FA',        // Light background
  border: '#0D506F30',       // Border with opacity
  success: '#22C55E',        // Green for success
  warning: '#F59E0B'         // Orange for warnings
};

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send OTP email with HyperVolt branding using database-stored system email settings
 * @param {string} email - Recipient email address
 * @param {string} otp - 6-digit OTP code
 * @param {string} contactPerson - User's name
 * @returns {Promise<boolean>}
 */
const sendOTPEmail = async (email, otp, contactPerson) => {
  try {
    // Get from address from database settings (system type)
    const from = await getFromAddress('system');
    
    if (!from.email) {
      throw new Error('System email not configured. Please set up email settings in admin panel.');
    }

    console.log(`📧 Attempting to send OTP email to: ${email}`);
    console.log(`📧 From: ${from.email} (${from.name})`);

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap');
        </style>
      </head>
      <body style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: ${HYPERVOLT_COLORS.lightBg};">
        <div style="max-width: 600px; margin: 20px auto; background-color: ${HYPERVOLT_COLORS.white}; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(13, 80, 111, 0.12); border: 1px solid ${HYPERVOLT_COLORS.border};">
          
          <!-- Header with HyperVolt Branding -->
          <div style="background: linear-gradient(135deg, ${HYPERVOLT_COLORS.primary}, ${HYPERVOLT_COLORS.secondary}); padding: 35px 20px 30px; text-align: center; position: relative;">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, ${HYPERVOLT_COLORS.gold}, ${HYPERVOLT_COLORS.secondary}, ${HYPERVOLT_COLORS.gold});"></div>
            <div style="display: inline-block; background: rgba(255,255,255,0.15); border-radius: 14px; padding: 12px 24px; margin-bottom: 15px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.25);">
              <span style="font-size: 28px; margin-right: 10px;">⚡</span>
              <span style="font-family: 'Playfair Display', 'Georgia', serif; color: ${HYPERVOLT_COLORS.white}; font-weight: 700; font-size: 22px; letter-spacing: 1px;">HyperVolt</span>
            </div>
            <p style="color: ${HYPERVOLT_COLORS.white}; margin: 10px 0 0; opacity: 0.95; font-size: 14px; font-family: 'Playfair Display', 'Georgia', serif;">Powering Your Digital Life</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px;">
            <h2 style="color: ${HYPERVOLT_COLORS.textDark}; margin-top: 0; font-family: 'Playfair Display', 'Georgia', serif; font-size: 24px; font-weight: 700;">
              Welcome to HyperVolt, ${contactPerson}! ⚡
            </h2>
            
            <p style="color: ${HYPERVOLT_COLORS.textLight}; line-height: 1.8; margin-bottom: 20px; font-size: 15px;">
              Thank you for choosing HyperVolt — your ultimate destination for premium gadgets and power banks! 
              To complete your registration and unlock exclusive deals, please verify your email address using the OTP below:
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, ${HYPERVOLT_COLORS.lightBg}, #E8F0F5); border: 2px solid ${HYPERVOLT_COLORS.primary}; border-radius: 16px; padding: 30px; text-align: center; margin: 30px 0; box-shadow: 0 4px 20px rgba(13, 80, 111, 0.1);">
              <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 12px; margin-bottom: 10px; letter-spacing: 3px; text-transform: uppercase; font-weight: 600;">Verification Code</p>
              <h1 style="font-size: 52px; letter-spacing: 14px; color: ${HYPERVOLT_COLORS.primary}; margin: 10px 0; font-family: 'Inter', Arial, sans-serif; font-weight: 700; text-shadow: 0 2px 10px rgba(13, 80, 111, 0.2);">${otp}</h1>
              <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 12px; margin-top: 10px;">Enter this code to verify your email</p>
            </div>
            
            <p style="color: ${HYPERVOLT_COLORS.textLight}; line-height: 1.8;">
              This OTP is valid for <strong style="color: ${HYPERVOLT_COLORS.primary};">10 minutes</strong>.
            </p>
            
            <!-- Benefits Section -->
            <div style="background: linear-gradient(135deg, ${HYPERVOLT_COLORS.lightBg}, #E8F0F5); border-radius: 14px; padding: 25px; margin: 30px 0; border: 1px solid ${HYPERVOLT_COLORS.border};">
              <p style="color: ${HYPERVOLT_COLORS.textDark}; font-weight: 700; margin-bottom: 15px; text-align: center; font-size: 15px; font-family: 'Playfair Display', 'Georgia', serif;">⚡ What Awaits You at HyperVolt? ⚡</p>
              <table style="width: 100%; font-size: 13px;">
                <tr>
                  <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.secondary}; font-size: 20px; width: 35px;">⚡</td>
                  <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.textDark};">Premium gadgets and power banks curated for you</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.secondary}; font-size: 20px;">💎</td>
                  <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.textDark};">100% authentic products guaranteed</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.secondary}; font-size: 20px;">🚚</td>
                  <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.textDark};">Fast delivery across Bangladesh</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.secondary}; font-size: 20px;">💡</td>
                  <td style="padding: 8px 0; color: ${HYPERVOLT_COLORS.textDark};">Expert support & guidance</td>
                </tr>
              </table>
            </div>
            
            <div style="background: linear-gradient(135deg, ${HYPERVOLT_COLORS.lightBg}, #E8F0F5); border-left: 4px solid ${HYPERVOLT_COLORS.secondary}; padding: 18px 20px; margin: 20px 0; border-radius: 10px; border: 1px solid ${HYPERVOLT_COLORS.border};">
              <p style="color: ${HYPERVOLT_COLORS.textLight}; margin: 0; font-size: 13px;">
                <strong style="color: ${HYPERVOLT_COLORS.secondary};">🔒 Important:</strong> If you didn't request this registration, please ignore this email. 
                Your account will not be activated without verification.
              </p>
            </div>
            
            <!-- Divider -->
            <div style="height: 2px; background: linear-gradient(90deg, transparent, ${HYPERVOLT_COLORS.border}, transparent); margin: 25px 0;"></div>
            
            <!-- Call to Action -->
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 13px; margin-bottom: 15px;">
                <span style="font-family: 'Playfair Display', 'Georgia', serif; font-size: 14px; color: ${HYPERVOLT_COLORS.secondary};">⚡</span>
                Ready to explore the world of gadgets?
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: linear-gradient(135deg, ${HYPERVOLT_COLORS.lightBg}, #E8F0F5); padding: 25px 30px; text-align: center; border-top: 1px solid ${HYPERVOLT_COLORS.border};">
            <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} HyperVolt. All rights reserved.<br>
              <span style="font-size: 11px; font-family: 'Playfair Display', 'Georgia', serif; color: ${HYPERVOLT_COLORS.secondary};">⚡ Powering Your Digital Life</span>
            </p>
            <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 11px; margin-top: 10px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://hypervolt.com'}" style="color: ${HYPERVOLT_COLORS.primary}; text-decoration: none; font-weight: 600;">Visit Our Store</a> | 
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://hypervolt.com'}/support" style="color: ${HYPERVOLT_COLORS.primary}; text-decoration: none; font-weight: 600;">Support Center</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Plain text version
    const text = `
      Welcome to HyperVolt, ${contactPerson}! ⚡

      Thank you for choosing HyperVolt — your ultimate destination for premium gadgets and power banks!

      Your OTP verification code is: ${otp}

      This code is valid for 10 minutes.

      ⚡ What Awaits You at HyperVolt? ⚡
      ⚡ Premium gadgets and power banks curated for you
      💎 100% authentic products guaranteed
      🚚 Fast delivery across Bangladesh
      💡 Expert support & guidance

      🔒 Important: If you didn't request this registration, please ignore this email.

      Visit us at: ${process.env.NEXT_PUBLIC_APP_URL || 'https://hypervolt.com'}
      Support: ${process.env.NEXT_PUBLIC_APP_URL || 'https://hypervolt.com'}/support
    `;

    // Send email using the system email configuration
    const result = await sendEmail(
      email,
      '⚡ Verify Your Email - HyperVolt',
      html,
      text,
      'system'  // Use 'system' email type for OTP emails
    );

    if (result.success) {
      console.log(`✅ OTP email sent successfully to ${email}`);
      console.log(`📧 Message ID: ${result.messageId}`);
      return true;
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('❌ Email send error details:', {
      error: error.message,
      stack: error.stack
    });
    
    // More specific error messages
    if (error.message.includes('authentication')) {
      throw new Error('Email authentication failed. Please check your SMTP username and password in the admin panel.');
    } else if (error.message.includes('connect') || error.message.includes('ENETUNREACH')) {
      throw new Error(`Could not connect to SMTP server. Please check your network and firewall settings.`);
    } else if (error.message.includes('timeout')) {
      throw new Error('Connection to SMTP server timed out. Please check your network.');
    } else {
      throw new Error(`Failed to send OTP email: ${error.message}`);
    }
  }
};

module.exports = {
  generateOTP,
  sendOTPEmail
};