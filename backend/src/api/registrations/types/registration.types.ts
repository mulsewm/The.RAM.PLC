import { Registration, User } from '@prisma/client';
import { z } from 'zod';
import { registrationSchema } from '../validations/registration.schema.js'; // Added .js extension

export type RegistrationInput = z.infer<typeof registrationSchema>;

// Type definitions for Multer files
export interface MulterFiles {
  passport?: Express.Multer.File[];
  license?: Express.Multer.File[];
  degree?: Express.Multer.File[];
  experience?: Express.Multer.File[];
  medicalReport?: Express.Multer.File[];
  photo?: Express.Multer.File[];
  policeClearance?: Express.Multer.File[];
  resume?: Express.Multer.File[];
  professionalCertificates?: Express.Multer.File[];
}

// Type definitions for file paths after S3 upload
export type RegistrationFilePaths = {
  resume?: string;
  passport?: string;
  professionalCertificates?: string[];
  policeClearance?: string;
  license?: string;
  degree?: string;
  experience?: string;
  medicalReport?: string;
  photo?: string;
};

export interface RegistrationWithRelations extends Registration {
  user: Pick<User, 'id' | 'email' | 'role'>;
  documents?: Array<{
    id: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
  }>;
}

export interface RegistrationResponse {
  success: boolean;
  data: RegistrationWithRelations;
  message?: string;
}

export interface RegistrationListResponse {
  success: boolean;
  data: {
    registrations: RegistrationWithRelations[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ErrorResponse {
  success: boolean;
  message: string;
  error?: string;
  details?: any;
}

// Extend Express Request type (already in place)
declare global {
  namespace Express {
    interface Request {
      user?: any; // Changed to any to resolve type conflict
    }
  }
}

export type AuthenticatedRequest = Express.Request & {
  user: {
    id: string;
    email: string;
    role: string;
  };
};
