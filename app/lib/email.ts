import nodemailer, { Transporter, SentMessageInfo } from 'nodemailer';
import { createTestAccount } from 'nodemailer';
import { env } from '@/config';
import { log } from '@/lib/logger';

// Email configuration from environment
const config = {
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_SECURE,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
  from: {
    name: env.EMAIL_FROM_NAME,
    address: env.EMAIL_FROM_ADDRESS,
  },
  appLoginUrl: env.NEXTAUTH_URL,
};

// Type definitions
type EmailRecipient = {
  email: string;
  name?: string;
};

type EmailAttachment = {
  filename: string;
  content?: string | Buffer;
  path?: string;
  contentType?: string;
};

type SendEmailOptions = {
  to: EmailRecipient | EmailRecipient[];
  subject: string;
  text?: string;
  html?: string;
  attachments?: EmailAttachment[];
  replyTo?: string;
  cc?: string | string[];
  bcc?: string | string[];
};

type SendEmailResult = {
  success: boolean;
  messageId?: string;
  previewUrl?: string;
  error?: Error;
};

// Create reusable transporter object
let transporter: Transporter | null = null;
let isUsingTestAccount = false;

/**
 * Format recipient for email
 */
function formatRecipient(recipient: EmailRecipient): string {
  return recipient.name 
    ? `"${recipient.name}" <${recipient.email}>` 
    : recipient.email;
}

/**
 * Initialize the email transporter
 * If in development and SMTP is not configured, creates a test account with Ethereal
 */
async function getTransporter(): Promise<Transporter> {
  // If already initialized, return the existing transporter
  if (transporter) {
    return transporter;
  }

  // In development, use Ethereal test account if SMTP is not configured
  if (env.NODE_ENV === 'development' && !config.host) {
    try {
      log.info('No SMTP host configured. Creating Ethereal test account...');
      const testAccount = await createTestAccount();
      
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      isUsingTestAccount = true;
      log.info(`Ethereal test account created. Preview emails at https://ethereal.email/messages`);
      return transporter;
    } catch (error) {
      const errorMessage = error instanceof Error ? error : new Error('Unknown error creating test account');
      log.error('Failed to create Ethereal test account', { error: errorMessage });
      throw new Error('Failed to initialize email service');
    }
  }

  // In production or if SMTP is configured, use the provided SMTP settings
  if (!config.host || !config.auth.user || !config.auth.pass) {
    throw new Error('SMTP configuration is incomplete');
  }

  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: {
      user: config.auth.user,
      pass: config.auth.pass,
    },
    tls: {
      // Only reject unauthorized in production
      rejectUnauthorized: env.NODE_ENV === 'production',
    },
  });

  // Verify connection configuration
  try {
    await transporter.verify();
    log.info('SMTP connection verified');
  } catch (error) {
    const errorMessage = error instanceof Error ? error : new Error('SMTP connection failed');
    log.error('SMTP connection failed', { error: errorMessage });
    throw new Error('Failed to connect to SMTP server');
  }

  return transporter;
}

/**
 * Send an email
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  try {
    const transporter = await getTransporter();
    
    // Format recipients
    const to = Array.isArray(options.to)
      ? options.to.map(formatRecipient).join(', ')
      : formatRecipient(options.to);
    
    const mailOptions: nodemailer.SendMailOptions = {
      from: config.from,
      to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments,
      replyTo: options.replyTo,
      cc: options.cc,
      bcc: options.bcc,
    };

    const info = await transporter.sendMail(mailOptions);
    
    // For Ethereal test account, log the preview URL
    const previewUrl = isUsingTestAccount && info.messageId
      ? nodemailer.getTestMessageUrl(info) || undefined
      : undefined;
    
    if (previewUrl) {
      log.info(`Preview URL: ${previewUrl}`);
    }
    
    return {
      success: true,
      messageId: info.messageId,
      previewUrl,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error : new Error('Failed to send email');
    log.error('Error sending email', { error: errorMessage });
    
    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Send a welcome email to a new user
 */
export async function sendWelcomeEmail(params: {
  to: string; // Recipient's email address
  name: string; // Recipient's name
}): Promise<SendEmailResult> {
  const { to, name } = params;
  const loginUrl = config.appLoginUrl;
  
  const subject = 'Welcome to The RAM PLC!';
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hello ${name},</p>
      <p>Welcome to The RAM PLC! Your account has been successfully created.</p>
      <p>You can log in using your email address (<strong>${to}</strong>) and the password that was set up for you.</p>
      <p>
        <a href="${loginUrl}" style="background-color: #14b8a6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Login to Your Account
        </a>
      </p>
      <p>If you have any questions or did not expect this email, please contact our support team.</p>
      <p>Best regards,<br/>The RAM PLC Team</p>
    </div>
  `;
  
  const text = `
    Hello ${name},

    Welcome to The RAM PLC! Your account has been successfully created.
    You can log in using your email address (${to}) and the password that was set up for you.

    Login here: ${loginUrl}

    If you have any questions or did not expect this email, please contact our support team.

    Best regards,
    The RAM PLC Team
  `;

  return sendEmail({
    to: { email: to, name },
    subject,
    text: text.trim(),
    html,
  });
}

/**
 * Send a password reset email
 */
export async function sendPasswordResetEmail(params: {
  to: string;
  name: string;
  resetToken: string;
  expiresInHours?: number;
}): Promise<SendEmailResult> {
  const { to, name, resetToken, expiresInHours = 24 } = params;
  const resetUrl = `${config.appLoginUrl}/reset-password?token=${encodeURIComponent(resetToken)}`;
  
  const subject = 'Password Reset Request';
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <p>Hello ${name},</p>
      <p>We received a request to reset your password. Please click the button below to set a new password.</p>
      <p>
        <a href="${resetUrl}" style="background-color: #14b8a6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Reset Password
        </a>
      </p>
      <p>This link will expire in ${expiresInHours} hours.</p>
      <p>If you didn't request a password reset, you can safely ignore this email.</p>
      <p>Best regards,<br/>The RAM PLC Team</p>
    </div>
  `;
  
  const text = `
    Hello ${name},

    We received a request to reset your password. Please use the following link to set a new password:

    ${resetUrl}

    This link will expire in ${expiresInHours} hours.

    If you didn't request a password reset, you can safely ignore this email.

    Best regards,
    The RAM PLC Team
  `;

  return sendEmail({
    to: { email: to, name },
    subject,
    text: text.trim(),
    html,
  });
}

// Initialize transporter when the module loads
getTransporter().catch((error: Error) => {
  log.error('Failed to initialize email transporter', { error });
});