import { z } from 'zod';

// Enums
export const Gender = z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']);
export type Gender = z.infer<typeof Gender>;

export const MaritalStatus = z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER']);
export type MaritalStatus = z.infer<typeof MaritalStatus>;

export const VisaType = z.enum(['EMPLOYMENT', 'PSV', 'FAMILY', 'VISIT']);
export type VisaType = z.infer<typeof VisaType>;

export const ProcessingUrgency = z.enum(['STANDARD', 'URGENT', 'EMERGENCY']);
export type ProcessingUrgency = z.infer<typeof ProcessingUrgency>;

export const RegistrationStatus = z.enum([
  'DRAFT',
  'SUBMITTED',
  'UNDER_REVIEW',
  'APPROVED',
  'REJECTED',
  'MORE_INFO_NEEDED'
]);
export type RegistrationStatus = z.infer<typeof RegistrationStatus>;

// Base schema for registration
export const registrationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  middleName: z.string().optional(),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  dateOfBirth: z.string().or(z.date()).transform(val => new Date(val)),
  gender: Gender,
  maritalStatus: MaritalStatus,
  
  // Contact Information
  email: z.string().email('Invalid email address'),
  phoneNumber: z.string().min(6, 'Phone number must be at least 6 characters'),
  currentLocation: z.string().min(2, 'Current location is required'),
  
  // Professional Information
  profession: z.string().min(1, 'Profession is required'),
  specialization: z.string().optional(),
  yearsOfExperience: z.string().min(1, 'Years of experience is required'),
  licensingStatus: z.string().min(1, 'Licensing status is required'),
  
  // Location & Visa
  preferredLocation: z.string().min(1, 'Preferred location is required'),
  visaType: VisaType,
  processingUrgency: ProcessingUrgency,
  
  // File uploads (handled separately in the controller)
  passport: z.any().optional(),
  license: z.any().optional(),
  degree: z.any().optional(),
  experience: z.any().optional(),
  medicalReport: z.any().optional(),
  photo: z.any().optional(),
  
  // System fields
  status: RegistrationStatus.default('SUBMITTED'),
  notes: z.string().optional(),
  userId: z.string().min(1, 'User ID is required')
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
