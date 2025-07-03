import { Registration, User } from '@prisma/client';
import { z } from 'zod';
import { registrationSchema } from '../validations/registration.schema';

export type RegistrationInput = z.infer<typeof registrationSchema>;

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

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
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
