// test-email.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Force IPv4 by disabling IPv6
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 465,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
  // Add these options
  tls: {
    rejectUnauthorized: false,
    minVersion: 'TLSv1.2'
  },
  // Force IPv4
  family: 4,
});

async function testEmail() {
  try {
    console.log('📧 Testing email configuration...');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('User:', process.env.SMTP_USER);
    
    await transporter.verify();
    console.log('✅ SMTP connection verified!');
    
    const result = await transporter.sendMail({
      from: `"HyperVolt" <${process.env.SMTP_USER}>`,
      to: process.env.OWNER_EMAIL || process.env.SMTP_USER,
      subject: 'Test Email from HyperVolt',
      html: `
        <h1>✅ Test Email</h1>
        <p>Your email configuration is working correctly!</p>
        <p>Time: ${new Date().toLocaleString()}</p>
      `
    });
    
    console.log('✅ Test email sent:', result.messageId);
  } catch (error) {
    console.error('❌ Email test failed:', error.message);
    console.error('Full error:', error);
  }
}

testEmail();