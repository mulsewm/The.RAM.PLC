import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma.js';
import { ApiResponse } from '../utils/apiResponse.js';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Authenticate middleware triggered for path:', req.path);
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return ApiResponse.unauthorized(res, 'No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret_here') as { id: string | number };
    // Convert ID to string to match Prisma's expected type
    const userId = String(decoded.id);
    
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      return ApiResponse.notFound(res, 'User not found');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return ApiResponse.unauthorized(res, 'Invalid token');
  }
};

export const authorize = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return ApiResponse.unauthorized(res, 'Not authenticated');
    }

    if (!roles.includes(req.user.role)) {
      return ApiResponse.forbidden(res, 'Insufficient permissions');
    }

    next();
  };
};
