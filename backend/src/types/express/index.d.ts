import { User } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
      files?: {
        [fieldname: string]: Express.Multer.File[];
      } & Express.Multer.File[];
    }
  }
}

export {};
