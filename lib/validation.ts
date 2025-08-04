import { z } from 'zod';
import { ERROR_TYPES } from './error';

// Common validation schemas
export const emailSchema = z
  .string()
  .min(1, { message: 'Email is required' })
  .email({ message: 'Please enter a valid email address' })
  .transform((val) => val.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(8, { message: 'Password must be at least 8 characters long' })
  .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
  .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
  .regex(/[0-9]/, { message: 'Password must contain at least one number' })
  .regex(/[^a-zA-Z0-9]/, { message: 'Password must contain at least one special character' });

export const nameSchema = z
  .string()
  .min(2, { message: 'Name must be at least 2 characters long' })
  .max(100, { message: 'Name must be less than 100 characters' });

// Auth schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, { message: 'Password is required' }),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, { message: 'Please confirm your password' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// Partnership schemas
export const partnershipSchema = z.object({
  companyName: z.string().min(1, { message: 'Company name is required' }),
  contactName: z.string().min(1, { message: 'Contact name is required' }),
  contactEmail: emailSchema,
  contactPhone: z.string().optional(),
  website: z.string().url({ message: 'Please enter a valid URL' }).or(z.literal('')),
  description: z.string().min(10, { message: 'Description must be at least 10 characters long' }),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED', 'IN_REVIEW']).default('PENDING'),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

// User schemas
export const userSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  role: z.enum(['ADMIN', 'USER', 'MANAGER']).default('USER'),
  avatar: z.string().url().optional().or(z.literal('')),
  bio: z.string().max(500).optional(),
});

// Profile update schema
export const profileSchema = userSchema.pick({
  name: true,
  email: true,
  avatar: true,
  bio: true,
});

// Password update schema
export const passwordUpdateSchema = z
  .object({
    currentPassword: z.string().min(1, { message: 'Current password is required' }),
    newPassword: passwordSchema,
    confirmPassword: z.string().min(1, { message: 'Please confirm your new password' }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

// File upload schema
export const fileSchema = z.object({
  name: z.string(),
  size: z.number().max(5 * 1024 * 1024, { message: 'File size must be less than 5MB' }),
  type: z.string().refine(
    (type) => ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'].includes(type),
    { message: 'File must be an image (JPEG, PNG, GIF) or PDF' }
  ),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().min(1, { message: 'Search query is required' }),
  filters: z.record(z.any()).optional(),
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(10),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Helper function to format validation errors for the frontend
export function formatValidationError(error: z.ZodError) {
  const formattedErrors: Record<string, string> = {};
  
  error.errors.forEach((err) => {
    const path = err.path.join('.');
    if (!formattedErrors[path]) {
      formattedErrors[path] = err.message;
    }
  });
  
  return {
    success: false,
    error: ERROR_TYPES.VALIDATION_ERROR,
    message: 'Validation failed',
    details: formattedErrors,
  };
}

// Type inference for schemas
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type PartnershipInput = z.infer<typeof partnershipSchema>;
export type UserInput = z.infer<typeof userSchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;
export type FileInput = z.infer<typeof fileSchema>;
export type SearchInput = z.infer<typeof searchSchema>;
