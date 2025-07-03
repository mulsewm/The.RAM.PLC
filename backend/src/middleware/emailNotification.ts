import { Request, Response, NextFunction } from 'express';
import { EmailService } from '../services/email.service.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const sendWelcomeEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const loginLink = `${process.env.APP_URL}/login`;

    const emailService = new EmailService();
    await emailService.sendWelcomeEmail(email, loginLink);

    next();
  } catch (error) {
    console.error('Email notification error:', error);
    // Continue even if email fails to ensure user creation succeeds
    next();
  }
};
