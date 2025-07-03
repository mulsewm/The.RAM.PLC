import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Get SMTP configuration from environment variables
const smtpConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || '',
  },
  tls: {
    // Do not fail on invalid certs
    rejectUnauthorized: false
  }
};

// Create a test account if no SMTP config is provided
async function testEmailConfig() {
  console.log('Testing SMTP configuration...');
  console.log('SMTP Host:', smtpConfig.host);
  console.log('SMTP Port:', smtpConfig.port);
  console.log('SMTP User:', smtpConfig.auth.user ? '***' : 'Not set');

  // If no SMTP config is provided, use ethereal.email for testing
  if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
    console.log('\nNo SMTP credentials found. Using ethereal.email for testing...');
    const testAccount = await nodemailer.createTestAccount();
    
    smtpConfig.host = 'smtp.ethereal.email';
    smtpConfig.port = 587;
    smtpConfig.auth = {
      user: testAccount.user,
      pass: testAccount.pass
    };
    
    console.log('Using Ethereal test account:', testAccount.user);
  }

  // Create a nodemailer transport
  const transporter = nodemailer.createTransport(smtpConfig);

  // Test the connection
  try {
    console.log('\nTesting SMTP connection...');
    await transporter.verify();
    console.log('✅ SMTP connection successful!');

    // Send a test email
    console.log('\nSending test email...');
    const info = await transporter.sendMail({
      from: `"Test Sender" <${smtpConfig.auth.user}>`,
      to: 'test@example.com',
      subject: 'Test Email from Your App',
      text: 'This is a test email from your application.',
      html: '<b>This is a test email from your application.</b>'
    });

    console.log('✅ Test email sent successfully!');
    
    if (smtpConfig.host.includes('ethereal.email')) {
      console.log('\n📧 Preview URL:', nodemailer.getTestMessageUrl(info));
      console.log('Note: This is a test email sent via ethereal.email');
      console.log('To view the email, open the URL above in your browser');
    }
    
    return true;
  } catch (error) {
    console.error('❌ SMTP Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n🔧 Connection refused. Possible issues:');
      console.error('1. SMTP server is not running');
      console.error('2. Incorrect SMTP host/port');
      console.error('3. Firewall blocking the connection');
      console.error('4. SMTP server requires authentication');
    } else if (error.code === 'EAUTH') {
      console.error('\n🔐 Authentication failed. Please check:');
      console.error('1. SMTP username and password are correct');
      console.error('2. App passwords are enabled (for Gmail)');
      console.error('3. Less secure apps access is enabled (if applicable)');
    }
    
    return false;
  }
}

// Run the test
testEmailConfig().then(success => {
  process.exit(success ? 0 : 1);
});
