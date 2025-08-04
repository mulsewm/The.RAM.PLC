import nodemailer from 'nodemailer';

// Environment variables for email configuration
const smtpHost = process.env.EMAIL_SMTP_HOST;
const smtpPort = parseInt(process.env.EMAIL_SMTP_PORT || '587', 10); // Default to 587 if not set
const smtpSecure = process.env.EMAIL_SMTP_SECURE === 'true'; // true for port 465, false for other ports (like 587 with STARTTLS)
const smtpUser = process.env.EMAIL_SMTP_USER; // Username for SMTP authentication
const smtpPass = process.env.EMAIL_SMTP_PASS; // Password for SMTP authentication
const emailFromAddress = process.env.EMAIL_FROM_ADDRESS || 'info@theramplc.com'; // Default "From" address
const appLoginUrl = process.env.APP_LOGIN_URL || 'https://v0-the-ram-plc.vercel.app/login'; // Your application's login page URL

// Basic check for essential SMTP configuration
const isSmtpConfigured = smtpHost && smtpUser && smtpPass && emailFromAddress;

if (!isSmtpConfigured) {
  console.warn(
    'SMTP email configuration is incomplete. Welcome emails will not be sent. ' +
    'Please ensure EMAIL_SMTP_HOST, EMAIL_SMTP_PORT, EMAIL_SMTP_SECURE, ' +
    'EMAIL_SMTP_USER, EMAIL_SMTP_PASS, EMAIL_FROM_ADDRESS, and APP_LOGIN_URL are set in your environment variables.'
  );
}

// Create a Nodemailer transporter instance only if configured
const transporter = isSmtpConfigured
  ? nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpSecure,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
      tls: {
        // Do not fail on invalid certs if using self-signed certificates (for development/testing)
        // For production, ensure you have valid certificates.
        rejectUnauthorized: process.env.NODE_ENV === 'production',
      }
    })
  : null;

interface WelcomeEmailParams {
  to: string; // Recipient's email address
  name: string; // Recipient's name
}

export async function sendWelcomeEmail({ to, name }: WelcomeEmailParams): Promise<void> {
  if (!transporter) {
    console.log(`Skipping welcome email to ${to} because SMTP is not configured.`);
    return; // Do not attempt to send if transporter isn't set up
  }

  const mailOptions = {
    from: `"The RAM PLC" <${emailFromAddress}>`,
    to: to,
    subject: 'Welcome to The RAM PLC!',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Hello ${name},</p>
        <p>Welcome to The RAM PLC! Your account has been successfully created.</p>
        <p>You can log in using your email address (<strong>${to}</strong>) and the password that was set up for you.</p>
        <p>
          <a href="${appLoginUrl}" style="background-color: #14b8a6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Login to Your Account
          </a>
        </p>
        <p>If you have any questions or did not expect this email, please contact our support team.</p>
        <p>Best regards,<br/>The RAM PLC Team</p>
      </div>
    `,
    text: `
      Hello ${name},

      Welcome to The RAM PLC! Your account has been successfully created.
      You can log in using your email address (${to}) and the password that was set up for you.

      Login here: ${appLoginUrl}

      If you have any questions or did not expect this email, please contact our support team.

      Best regards,
      The RAM PLC Team
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}. Message ID: ${info.messageId}`);
  } catch (error) {
    console.error(`Error sending welcome email to ${to}:`, error);
    // We log the error but don't re-throw, so user creation isn't blocked by email issues.
  }
}
