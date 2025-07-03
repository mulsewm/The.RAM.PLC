import nodemailer from 'nodemailer';
import { ApiResponse } from '../utils/apiResponse.js';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<void> {
    try {
      await this.transporter.sendMail(options);
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, loginLink: string): Promise<void> {
    const template = `
      <h2>Welcome to Partner Management System</h2>
      <p>Thank you for registering with our system.</p>
      <p>Your account has been created successfully. You can now log in using the following link:</p>
      <a href="${loginLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 4px;">
        Login to your account
      </a>
      <p>If you did not create this account, please contact support immediately.</p>
    `;

    await this.sendEmail({
      to: email,
      subject: 'Welcome to Partner Management System',
      html: template,
    });
  }
}
