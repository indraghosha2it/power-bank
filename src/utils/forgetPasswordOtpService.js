// // utils/forgetPasswordOtpService.js
// const nodemailer = require('nodemailer');

// // Validate environment variables
// const requiredEnvVars = ['INFO_SMTP_USER', 'INFO_SMTP_PASSWORD', 'INFO_SMTP_HOST', 'INFO_SMTP_PORT'];
// for (const envVar of requiredEnvVars) {
//   if (!process.env[envVar]) {
//     console.error(`❌ Missing required environment variable: ${envVar}`);
//     console.error('Please check your .env file');
//   }
// }

// // BeautyBucket Brand Colors - Pink/Magenta Beauty Theme
// const BEAUTY_BUCKET_COLORS = {
//   primary: '#EE4275',        // Bold Pink
//   secondary: '#FF6B9D',      // Light Pink
//   accent: '#FF6B9D',         // Pink accent
//   darkPink: '#D63A6A',       // Darker Pink
//   gold: '#FFD700',           // Gold for accent
//   textDark: '#2D1B2E',       // Dark Purple-Black
//   textLight: '#8B7A8C',      // Muted Purple
//   white: '#FFFFFF',          // White
//   lightBg: '#FFF5F6',        // Very Light Pink background
//   border: '#FFD2DB',         // Light Pink border
//   warning: '#FF8C00'         // Orange for warnings
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
//     console.log('✅ Forget Password Email Service is ready');
//     console.log(`📧 Connected to: ${process.env.INFO_SMTP_HOST}`);
//   }
// });

// // Generate 6-digit OTP
// const generateOTP = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// // Send password reset OTP email
// const sendPasswordResetOTP = async (email, otp, userName) => {
//   // Validate email credentials first
//   if (!process.env.INFO_SMTP_USER || !process.env.INFO_SMTP_PASSWORD) {
//     throw new Error('Email credentials not configured. Please check your .env file.');
//   }

//   const mailOptions = {
//     from: `"BeautyBucket Support" <${process.env.INFO_SMTP_USER}>`,
//     to: email,
//     subject: '💖 Password Reset Request - BeautyBucket',
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
//       <body style="font-family: 'Inter', 'Segoe UI', Arial, sans-serif; margin: 0; padding: 0; background-color: ${BEAUTY_BUCKET_COLORS.lightBg};">
//         <div style="max-width: 600px; margin: 20px auto; background-color: ${BEAUTY_BUCKET_COLORS.white}; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(238, 66, 117, 0.12); border: 1px solid ${BEAUTY_BUCKET_COLORS.border};">
          
//           <!-- Header with BeautyBucket Branding -->
//           <div style="background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.primary}, ${BEAUTY_BUCKET_COLORS.secondary}); padding: 35px 20px 30px; text-align: center; position: relative;">
//             <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(90deg, ${BEAUTY_BUCKET_COLORS.gold}, ${BEAUTY_BUCKET_COLORS.secondary}, ${BEAUTY_BUCKET_COLORS.gold});"></div>
//             <div style="display: inline-block; background: rgba(255,255,255,0.15); border-radius: 14px; padding: 12px 24px; margin-bottom: 15px; backdrop-filter: blur(10px); border: 1px solid rgba(255,255,255,0.25);">
//               <span style="font-size: 28px; margin-right: 10px;">💖</span>
//               <span style="font-family: 'Playfair Display', 'Georgia', serif; color: ${BEAUTY_BUCKET_COLORS.white}; font-weight: 700; font-size: 22px; letter-spacing: 1px;">BeautyBucket</span>
//             </div>
//             <p style="color: ${BEAUTY_BUCKET_COLORS.white}; margin: 10px 0 0; opacity: 0.95; font-size: 14px; font-family: 'Playfair Display', 'Georgia', serif;">Your Beauty Journey Starts Here</p>
//           </div>
          
//           <!-- Content -->
//           <div style="padding: 40px 30px;">
//             <h2 style="color: ${BEAUTY_BUCKET_COLORS.textDark}; margin-top: 0; font-family: 'Playfair Display', 'Georgia', serif; font-size: 24px; font-weight: 700;">
//               Hello, ${userName}! 💕
//             </h2>
            
//             <p style="color: ${BEAUTY_BUCKET_COLORS.textLight}; line-height: 1.8; font-size: 16px;">
//               We received a request to reset your password for your BeautyBucket account. Don't worry, we've got you covered!
//             </p>
            
//             <!-- OTP Box -->
//             <div style="background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.lightBg}, #FFF0F5); border: 2px solid ${BEAUTY_BUCKET_COLORS.primary}; border-radius: 16px; padding: 30px; text-align: center; margin: 30px 0; box-shadow: 0 4px 20px rgba(238, 66, 117, 0.1);">
//               <p style="color: ${BEAUTY_BUCKET_COLORS.textLight}; font-size: 12px; margin: 0 0 10px 0; letter-spacing: 3px; text-transform: uppercase; font-weight: 600;">Password Reset Code</p>
//               <h1 style="font-size: 52px; letter-spacing: 14px; color: ${BEAUTY_BUCKET_COLORS.primary}; margin: 10px 0; font-family: 'Inter', Arial, sans-serif; font-weight: 700; text-shadow: 0 2px 10px rgba(238, 66, 117, 0.2);">${otp}</h1>
//               <p style="color: ${BEAUTY_BUCKET_COLORS.textLight}; font-size: 12px; margin-top: 10px;">Enter this code to reset your password</p>
//             </div>
            
//             <p style="color: ${BEAUTY_BUCKET_COLORS.textLight}; line-height: 1.8;">This OTP is valid for <strong style="color: ${BEAUTY_BUCKET_COLORS.primary};">10 minutes</strong>.</p>
            
//             <div style="background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.lightBg}, #FFF0F5); border-left: 4px solid ${BEAUTY_BUCKET_COLORS.primary}; padding: 18px 20px; margin: 30px 0; border-radius: 10px; border: 1px solid ${BEAUTY_BUCKET_COLORS.border};">
//               <p style="color: ${BEAUTY_BUCKET_COLORS.textLight}; margin: 0; font-size: 14px; line-height: 1.6;">
//                 <strong style="color: ${BEAUTY_BUCKET_COLORS.primary};">🔒 Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account security is important to us.
//               </p>
//             </div>
            
//             <!-- Divider -->
//             <div style="height: 2px; background: linear-gradient(90deg, transparent, ${BEAUTY_BUCKET_COLORS.border}, transparent); margin: 25px 0;"></div>
            
//             <div style="text-align: center; margin-top: 30px; padding: 20px 25px; background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.lightBg}, #FFF0F5); border-radius: 14px; border: 1px solid ${BEAUTY_BUCKET_COLORS.border};">
//               <p style="color: ${BEAUTY_BUCKET_COLORS.textLight}; font-size: 13px; margin: 5px 0;">
//                 💕 Need help? Contact our beauty support team at 
//                 <a href="mailto:${process.env.INFO_SMTP_USER}" style="color: ${BEAUTY_BUCKET_COLORS.primary}; text-decoration: none; font-weight: 600;">${process.env.INFO_SMTP_USER}</a>
//               </p>
//               <p style="color: ${BEAUTY_BUCKET_COLORS.textLight}; font-size: 12px; margin-top: 8px; font-family: 'Playfair Display', 'Georgia', serif; color: ${BEAUTY_BUCKET_COLORS.primary};">✨ We're here to help you shine ✨</p>
//             </div>
//           </div>
          
//           <!-- Footer -->
//           <div style="background: linear-gradient(135deg, ${BEAUTY_BUCKET_COLORS.lightBg}, #FFF0F5); padding: 25px 30px; text-align: center; border-top: 1px solid ${BEAUTY_BUCKET_COLORS.border};">
//             <p style="color: ${BEAUTY_BUCKET_COLORS.textLight}; font-size: 12px; margin: 0;">
//               &copy; ${new Date().getFullYear()} BeautyBucket. All rights reserved.<br>
//               <span style="font-size: 11px; font-family: 'Playfair Display', 'Georgia', serif; color: ${BEAUTY_BUCKET_COLORS.primary};">💖 Where Beauty Meets Confidence</span>
//             </p>
//             <p style="color: ${BEAUTY_BUCKET_COLORS.textLight}; font-size: 11px; margin-top: 10px;">
//               <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="color: ${BEAUTY_BUCKET_COLORS.primary}; text-decoration: none; font-weight: 600;">Visit Our Store</a> | 
//               <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support" style="color: ${BEAUTY_BUCKET_COLORS.primary}; text-decoration: none; font-weight: 600;">Support Center</a>
//             </p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `,
//     // Plain text version
//     text: `
//       Hello ${userName},
      
//       We received a request to reset your password for your BeautyBucket account.
      
//       Your password reset OTP is: ${otp}
      
//       This OTP is valid for 10 minutes.
      
//       If you didn't request this password reset, please ignore this email. Your account security is important to us.
      
//       Need help? Contact our beauty support team at: ${process.env.INFO_SMTP_USER}
      
//       Visit us at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
//     `
//   };

//   try {
//     console.log(`📧 Attempting to send password reset OTP to: ${email}`);
//     console.log(`📧 Using SMTP server: ${process.env.INFO_SMTP_HOST}:${process.env.INFO_SMTP_PORT}`);
//     console.log(`📧 From: ${process.env.INFO_SMTP_USER}`);
    
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ Password reset OTP sent successfully to ${email}`);
//     console.log(`📧 Message ID: ${info.messageId}`);
//     console.log(`📧 Response: ${info.response}`);
    
//     return true;
//   } catch (error) {
//     console.error('❌ Password reset email send error details:', {
//       error: error.message,
//       code: error.code,
//       command: error.command,
//       response: error.response,
//       responseCode: error.responseCode
//     });
    
//     // More specific error messages
//     if (error.code === 'EAUTH') {
//       throw new Error('Email authentication failed. Please check your SMTP username and password.');
//     } else if (error.code === 'ESOCKET') {
//       throw new Error(`Could not connect to SMTP server ${process.env.INFO_SMTP_HOST}:${process.env.INFO_SMTP_PORT}. Please check your network and firewall settings.`);
//     } else if (error.code === 'ETIMEDOUT') {
//       throw new Error('Connection to SMTP server timed out. Please check your network.');
//     } else {
//       throw new Error(`Failed to send password reset OTP: ${error.message}`);
//     }
//   }
// };

// module.exports = {
//   generateOTP,
//   sendPasswordResetOTP
// };


// utils/forgetPasswordOtpService.js
const nodemailer = require('nodemailer');

// Validate environment variables
const requiredEnvVars = ['INFO_SMTP_USER', 'INFO_SMTP_PASSWORD', 'INFO_SMTP_HOST', 'INFO_SMTP_PORT'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`❌ Missing required environment variable: ${envVar}`);
    console.error('Please check your .env file');
  }
}

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
  warning: '#FF8C00'         // Orange for warnings
};

// Create transporter for Hostinger SMTP (port 465 with SSL)
const transporter = nodemailer.createTransport({
  host: process.env.INFO_SMTP_HOST,
  port: parseInt(process.env.INFO_SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.INFO_SMTP_USER,
    pass: process.env.INFO_SMTP_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  },
  debug: true,
  logger: true
});

// Verify connection configuration
transporter.verify(function(error, success) {
  if (error) {
    console.error('❌ Email server connection error:', error);
    console.error('Please check your SMTP credentials in .env file');
  } else {
    console.log('✅ Forget Password Email Service is ready');
    console.log(`📧 Connected to: ${process.env.INFO_SMTP_HOST}`);
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send password reset OTP email
const sendPasswordResetOTP = async (email, otp, userName) => {
  // Validate email credentials first
  if (!process.env.INFO_SMTP_USER || !process.env.INFO_SMTP_PASSWORD) {
    throw new Error('Email credentials not configured. Please check your .env file.');
  }

  const mailOptions = {
    from: `"HyperVolt Support" <${process.env.INFO_SMTP_USER}>`,
    to: email,
    subject: '🔐 Password Reset Request - HyperVolt',
    html: `
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
              Hello, ${userName}! ⚡
            </h2>
            
            <p style="color: ${HYPERVOLT_COLORS.textLight}; line-height: 1.8; font-size: 16px;">
              We received a request to reset your password for your HyperVolt account. Don't worry, we've got you covered!
            </p>
            
            <!-- OTP Box -->
            <div style="background: linear-gradient(135deg, ${HYPERVOLT_COLORS.lightBg}, #E8F0F5); border: 2px solid ${HYPERVOLT_COLORS.primary}; border-radius: 16px; padding: 30px; text-align: center; margin: 30px 0; box-shadow: 0 4px 20px rgba(13, 80, 111, 0.1);">
              <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 12px; margin: 0 0 10px 0; letter-spacing: 3px; text-transform: uppercase; font-weight: 600;">Password Reset Code</p>
              <h1 style="font-size: 52px; letter-spacing: 14px; color: ${HYPERVOLT_COLORS.primary}; margin: 10px 0; font-family: 'Inter', Arial, sans-serif; font-weight: 700; text-shadow: 0 2px 10px rgba(13, 80, 111, 0.2);">${otp}</h1>
              <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 12px; margin-top: 10px;">Enter this code to reset your password</p>
            </div>
            
            <p style="color: ${HYPERVOLT_COLORS.textLight}; line-height: 1.8;">This OTP is valid for <strong style="color: ${HYPERVOLT_COLORS.primary};">10 minutes</strong>.</p>
            
            <div style="background: linear-gradient(135deg, ${HYPERVOLT_COLORS.lightBg}, #E8F0F5); border-left: 4px solid ${HYPERVOLT_COLORS.secondary}; padding: 18px 20px; margin: 30px 0; border-radius: 10px; border: 1px solid ${HYPERVOLT_COLORS.border};">
              <p style="color: ${HYPERVOLT_COLORS.textLight}; margin: 0; font-size: 14px; line-height: 1.6;">
                <strong style="color: ${HYPERVOLT_COLORS.secondary};">🔒 Security Notice:</strong> If you didn't request this password reset, please ignore this email. Your account security is important to us.
              </p>
            </div>
            
            <!-- Divider -->
            <div style="height: 2px; background: linear-gradient(90deg, transparent, ${HYPERVOLT_COLORS.border}, transparent); margin: 25px 0;"></div>
            
            <div style="text-align: center; margin-top: 30px; padding: 20px 25px; background: linear-gradient(135deg, ${HYPERVOLT_COLORS.lightBg}, #E8F0F5); border-radius: 14px; border: 1px solid ${HYPERVOLT_COLORS.border};">
              <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 13px; margin: 5px 0;">
                ⚡ Need help? Contact our support team at 
                <a href="mailto:${process.env.INFO_SMTP_USER}" style="color: ${HYPERVOLT_COLORS.secondary}; text-decoration: none; font-weight: 600;">${process.env.INFO_SMTP_USER}</a>
              </p>
              <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 12px; margin-top: 8px; font-family: 'Playfair Display', 'Georgia', serif; color: ${HYPERVOLT_COLORS.secondary};">⚡ We're here to help you</p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: linear-gradient(135deg, ${HYPERVOLT_COLORS.lightBg}, #E8F0F5); padding: 25px 30px; text-align: center; border-top: 1px solid ${HYPERVOLT_COLORS.border};">
            <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 12px; margin: 0;">
              &copy; ${new Date().getFullYear()} HyperVolt. All rights reserved.<br>
              <span style="font-size: 11px; font-family: 'Playfair Display', 'Georgia', serif; color: ${HYPERVOLT_COLORS.secondary};">⚡ Powering Your Digital Life</span>
            </p>
            <p style="color: ${HYPERVOLT_COLORS.textLight}; font-size: 11px; margin-top: 10px;">
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" style="color: ${HYPERVOLT_COLORS.primary}; text-decoration: none; font-weight: 600;">Visit Our Store</a> | 
              <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/support" style="color: ${HYPERVOLT_COLORS.primary}; text-decoration: none; font-weight: 600;">Support Center</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
    // Plain text version
    text: `
      Hello ${userName},
      
      We received a request to reset your password for your HyperVolt account.
      
      Your password reset OTP is: ${otp}
      
      This OTP is valid for 10 minutes.
      
      If you didn't request this password reset, please ignore this email. Your account security is important to us.
      
      Need help? Contact our support team at: ${process.env.INFO_SMTP_USER}
      
      Visit us at: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
    `
  };

  try {
    console.log(`📧 Attempting to send password reset OTP to: ${email}`);
    console.log(`📧 Using SMTP server: ${process.env.INFO_SMTP_HOST}:${process.env.INFO_SMTP_PORT}`);
    console.log(`📧 From: ${process.env.INFO_SMTP_USER}`);
    
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Password reset OTP sent successfully to ${email}`);
    console.log(`📧 Message ID: ${info.messageId}`);
    console.log(`📧 Response: ${info.response}`);
    
    return true;
  } catch (error) {
    console.error('❌ Password reset email send error details:', {
      error: error.message,
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode
    });
    
    // More specific error messages
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check your SMTP username and password.');
    } else if (error.code === 'ESOCKET') {
      throw new Error(`Could not connect to SMTP server ${process.env.INFO_SMTP_HOST}:${process.env.INFO_SMTP_PORT}. Please check your network and firewall settings.`);
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error('Connection to SMTP server timed out. Please check your network.');
    } else {
      throw new Error(`Failed to send password reset OTP: ${error.message}`);
    }
  }
};

module.exports = {
  generateOTP,
  sendPasswordResetOTP
};