import nodemailer from 'nodemailer';
import { env } from '../config';
import { log } from './logger';

// Types
type EmailOptions = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
  logger?: boolean;
  debug?: boolean;
}

// Get SMTP configuration
const getSmtpConfig = (): SmtpConfig => {
  // In production, use real SMTP settings from environment variables
  if (env.NODE_ENV === 'production') {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      throw new Error('Missing required SMTP configuration for production');
    }

    return {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587', 10),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
      logger: process.env.NODE_ENV === 'development',
      debug: process.env.NODE_ENV === 'development',
    };
  }
  
  // In development, use test account
  return {
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: 'test@example.com', // Will be replaced by createTestAccount
      pass: 'test123', // Will be replaced by createTestAccount
    },
    logger: true,
    debug: true,
  };
};

// Create a test account if in development
const createTestAccount = async (): Promise<SmtpConfig> => {
  if (env.NODE_ENV === 'development') {
    try {
      const testAccount = await nodemailer.createTestAccount();
      log.info('Created test email account', { 
        user: testAccount.user,
        pass: testAccount.pass 
      });
      
      return {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
        logger: true,
        debug: true,
      };
    } catch (error) {
      log.error('Failed to create test email account');
      throw new Error('Failed to create test email account');
    }
  }
  
  return getSmtpConfig();
};

// Create transporter
let transporter: nodemailer.Transporter;

const getTransporter = async (): Promise<nodemailer.Transporter> => {
  if (transporter) {
    return transporter;
  }

  const smtpConfig = env.NODE_ENV === 'development' 
    ? await createTestAccount() 
    : getSmtpConfig();

  transporter = nodemailer.createTransport(smtpConfig);
  
  // Verify connection configuration
  try {
    await transporter.verify();
    log.info('SMTP connection verified');
  } catch (error) {
    log.error('SMTP connection error');
    throw new Error('Failed to connect to SMTP server');
  }

  return transporter;
};

// Email templates
const templates = {
  welcome: (name: string, loginUrl: string, password: string) => {
    const subject = 'Welcome to The RAM PLC Partner Portal';
    const text = `
      Hello ${name},

      Welcome to The RAM PLC Partner Portal! Your account has been created successfully.

      Here are your login details:
      Email: ${name}
      Password: ${password}

      You can now log in using the following link:
      ${loginUrl}

      For security reasons, we recommend changing your password after your first login.

      If you have any questions, please don't hesitate to contact our support team.

      Best regards,
      The RAM PLC Team
    `;
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a365d; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">The RAM PLC</h1>
        </div>
        <div style="padding: 20px;">
          <h2>Welcome to The RAM PLC Partner Portal, ${name}!</h2>
          <p>Your account has been created successfully.</p>
          
          <div style="background-color: #f7fafc; border-left: 4px solid #3182ce; padding: 12px 20px; margin: 20px 0;">
            <p style="margin: 5px 0; font-weight: 600;">Your login details:</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Password:</strong> ${password}</p>
          </div>
          
          <p>Please use the button below to log in to your account:</p>
          <div style="margin: 30px 0; text-align: center;">
            <a href="${loginUrl}" style="background-color: #3182ce; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">
              Log In to Your Account
            </a>
          </div>
          
          <p style="color: #e53e3e; font-weight: 500;">
            For security reasons, we recommend changing your password after your first login.
          </p>
          
          <p>If the button above doesn't work, you can copy and paste this link into your browser:</p>
          <p><a href="${loginUrl}" style="color: #3182ce; word-break: break-all;">${loginUrl}</a></p>
          
          <p>If you have any questions, please don't hesitate to contact our support team.</p>
          <p>Best regards,<br>The RAM PLC Team</p>
        </div>
        <div style="background-color: #f7fafc; padding: 15px; text-align: center; font-size: 12px; color: #718096; border-top: 1px solid #e2e8f0;">
          <p>  ${new Date().getFullYear()} The RAM PLC. All rights reserved.</p>
        </div>
      </div>
    `;

    return { subject, text, html };
  },
  // Add more email templates here
};

// Send email
const sendEmail = async (options: EmailOptions) => {
  const transporter = await getTransporter();
  
  const mailOptions: nodemailer.SendMailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'The RAM PLC'}" <${process.env.EMAIL_FROM_ADDRESS || 'noreply@theramplc.com'}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    headers: {
      'X-Laziness-level': '1000', // Custom header
    },
  };

  try {
    log.info('Sending email', { 
      to: options.to, 
      subject: options.subject 
    });
    
    const info = await transporter.sendMail(mailOptions);
    
    if (env.NODE_ENV === 'development') {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      log.info('Email sent', { 
        messageId: info.messageId, 
        previewUrl 
      });
      
      if (previewUrl) {
        log.info(`Preview URL: ${previewUrl}`);
      }
    } else {
      log.info('Email sent', { 
        messageId: info.messageId,
        to: options.to,
        subject: options.subject
      });
    }
    
    return { 
      success: true, 
      messageId: info.messageId,
      previewUrl: env.NODE_ENV === 'development' 
        ? nodemailer.getTestMessageUrl(info) 
        : undefined
    };
  } catch (error) {
    log.error('Error sending email', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      to: options.to,
      subject: options.subject
    });
    
    // Rethrow with a more user-friendly message
    throw new Error(
      env.NODE_ENV === 'production'
        ? 'Failed to send email. Please try again later.'
        : `Failed to send email: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
};

// Public API
export const emailService = {
  sendWelcomeEmail: async (email: string, name: string, loginUrl: string, password: string) => {
    const template = templates.welcome(name, loginUrl, password);
    
    return sendEmail({
      to: email,
      subject: template.subject,
      text: template.text,
      html: template.html,
    });
  },
  // Add more email sending methods here
};

export default emailService;
