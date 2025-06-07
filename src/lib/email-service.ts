import { render } from '@react-email/render';
import nodemailer from 'nodemailer';
import { ApiError } from './error-handler';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;
  private from: string;
  private isEnabled: boolean;

  constructor() {
    this.isEnabled = Boolean(
      process.env.EMAIL_HOST &&
      process.env.EMAIL_PORT &&
      process.env.EMAIL_USER &&
      process.env.EMAIL_PASSWORD
    );

    if (this.isEnabled) {
      this.from = `"${process.env.EMAIL_FROM_NAME || 'RAM Partner Portal'}" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`;
      
      this.transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
    } else {
      // Create a dummy transporter in development
      this.transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
      this.from = 'no-reply@example.com';
      console.warn('Email service is running in development mode. Emails will be logged to console.');
    }
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      const mailOptions = {
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text || this.htmlToText(options.html),
      };

      if (!this.isEnabled) {
        console.log('\n--- EMAIL NOTIFICATION (not sent in dev) ---');
        console.log('To:', mailOptions.to);
        console.log('Subject:', mailOptions.subject);
        console.log('HTML Content:', mailOptions.html);
        console.log('---\n');
        return;
      }

      const info = await this.transporter.sendMail(mailOptions);
      console.log('Email sent:', info.messageId);
    } catch (error) {
      console.error('Failed to send email:', error);
      throw new ApiError(
        'Failed to send email notification',
        500,
        'EMAIL_SEND_ERROR',
        { error: error instanceof Error ? error.message : 'Unknown error' }
      );
    }
  }

  async sendWelcomeEmail(email: string, name: string, loginUrl: string, password: string): Promise<void> {
    const subject = 'Welcome to RAM Partner Portal';
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">Welcome to RAM Partner Portal, ${name}!</h1>
        <p>Your account has been successfully created. Please use the following credentials to log in:</p>
        <div style="background-color: #f9fafb; padding: 16px; border-radius: 8px; margin: 16px 0; border: 1px solid #e5e7eb;">
          <p style="margin: 0 0 8px 0;"><strong>Email:</strong> ${email}</p>
          <p style="margin: 0 0 8px 0;"><strong>Temporary Password:</strong> <span style="font-family: monospace; background-color: #f3f4f6; padding: 2px 6px; border-radius: 4px;">${password}</span></p>
        </div>
        <p style="color: #dc2626; font-weight: 500; margin-bottom: 16px;">
          ⚠️ For security reasons, please change your password immediately after your first login.
        </p>
        <p>To get started, please click the button below to log in:</p>
        <div style="margin: 30px 0;">
          <a href="${loginUrl}" 
             style="background-color: #2563eb; color: white; padding: 12px 24px; 
                    text-decoration: none; border-radius: 4px; font-weight: bold;">
            Log In to Partner Portal
          </a>
        </div>
        <p>If the button doesn't work, you can copy and paste this URL into your browser:</p>
        <p>${loginUrl}</p>
        <p style="color: #dc2626; font-weight: 500;">For security reasons, please change your password immediately after your first login.</p>
        <p>If you didn't request this account, please contact our support team immediately.</p>
        <p>Best regards,<br/>The RAM Partner Team</p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }



  async sendPasswordResetEmail(email: string, name: string, resetUrl: string, expiresInHours: number): Promise<void> {
    const subject = 'Reset Your RAM Partner Portal Password';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #1f2937; font-size: 24px; margin-bottom: 20px;">Password Reset Request</h1>
        
        <p>Hello ${name},</p>
        
        <p>We received a request to reset the password for your RAM Partner Portal account.</p>
        
        <p>To reset your password, please click the button below:</p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a 
            href="${resetUrl}"
            style="
              display: inline-block;
              background-color: #2563eb; 
              color: white; 
              padding: 12px 24px; 
              text-decoration: none; 
              border-radius: 4px; 
              font-weight: bold;
              font-size: 16px;
            "
          >
            Reset Password
          </a>
        </div>
        
        <p style="font-size: 14px; color: #6b7280; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
          <br /><br />
          <strong>This link will expire in ${expiresInHours} hour${expiresInHours !== 1 ? 's' : ''}.</strong>
        </p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #9ca3af;">
          If you're having trouble with the button above, copy and paste the URL below into your web browser:
          <br />
          <a 
            href="${resetUrl}"
            style="color: #3b82f6; word-break: break-all; font-size: 12px;"
          >
            ${resetUrl}
          </a>
        </p>
        
        <p style="margin-top: 30px; font-size: 14px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 20px;">
          Best regards,<br />
          <strong>The RAM Partner Team</strong>
        </p>
      </div>
    `;

    await this.sendEmail({
      to: email,
      subject,
      html,
    });
  }

  private htmlToText(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

// Export a typed instance of the email service
export const emailService: {
  sendWelcomeEmail: (email: string, name: string, loginUrl: string, password: string) => Promise<void>;
  sendPasswordResetEmail: (email: string, name: string, resetUrl: string, expiresInHours: number) => Promise<void>;
} = new EmailService();
