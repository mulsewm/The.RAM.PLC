import { z } from 'zod';

// Enums
export const Gender = z.enum(['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY']);
export type Gender = z.infer<typeof Gender>;

export const EducationLevel = z.enum(['HIGH_SCHOOL', 'ASSOCIATE', 'BACHELORS', 'MASTERS', 'PHD', 'OTHER']);
export type EducationLevel = z.infer<typeof EducationLevel>;

export const EducationStatus = z.enum(['IN_PROGRESS', 'COMPLETED', 'DROPPED_OUT', 'ON_HOLD']);
export type EducationStatus = z.infer<typeof EducationStatus>;
export const MaritalStatus = z.enum(['SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'OTHER']);
export type MaritalStatus = z.infer<typeof MaritalStatus>;

export const JobType = z.enum(['full_time', 'part_time', 'contract', 'temporary']);
export type JobType = z.infer<typeof JobType>;

export const NoticePeriodUnit = z.enum(['days', 'weeks', 'months']);
export type NoticePeriodUnit = z.infer<typeof NoticePeriodUnit>;

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

// Reference schema
const referenceSchema = z.object({
  name: z.string().min(2, 'Reference name is required'),
  position: z.string().min(2, 'Position is required'),
  company: z.string().min(2, 'Company is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[\d\s+()-]+$/, 'Invalid phone number format')
});

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
  currentEmployer: z.string().optional(),
  jobTitle: z.string().min(1, 'Job title is required'),
  
  // Licensing & Certification
  hasProfessionalLicense: z.boolean(),
  licenseType: z.string().optional().nullable(),
  licenseNumber: z.string().optional().nullable(),
  issuingOrganization: z.string().optional().nullable(),
  licenseExpiryDate: z.string().or(z.date()).optional().nullable().transform(val => val ? new Date(val) : null),
  licensingStatus: z.string().optional().nullable(),
  
  // Work Preferences
  preferredLocations: z.array(z.string()).min(1, 'At least one preferred location is required'),
  willingToRelocate: z.boolean(),
  preferredJobTypes: z.array(JobType).min(1, 'At least one job type must be selected'),
  expectedSalary: z.number().min(0).max(200000),
  noticePeriodValue: z.number().min(0),
  noticePeriodUnit: NoticePeriodUnit,
  
  // Visa Information
  visaType: VisaType.optional().nullable(),
  processingUrgency: ProcessingUrgency.optional().nullable(),
  
  // Professional References
  references: z.array(referenceSchema).min(1, 'At least one reference is required'),
  
  // Document Uploads (handled separately in the controller)
  resume: z.any().optional(),
  passportOrId: z.any().optional(),
  professionalCertificates: z.array(z.any()).optional(),
  policeClearance: z.any().optional(),
  
  // Education Information
  educationLevel: EducationLevel.default('OTHER'),
  institution: z.string().min(2, 'Institution name is required').default(''),
  fieldOfStudy: z.string().min(2, 'Field of study is required').default(''),
  graduationYear: z.number().min(1900).max(new Date().getFullYear() + 5).optional(),
  educationStatus: EducationStatus.default('COMPLETED'),
  educationCountry: z.string().min(2, 'Country is required').default(''),
  educationCity: z.string().min(2, 'City is required').default(''),
  
  // Terms & Declaration
  confirmAccuracy: z.boolean().refine(val => val === true, 'You must confirm the accuracy of the information'),
  termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms and conditions'),
  backgroundCheckConsent: z.boolean().refine(val => val === true, 'You must consent to background checks'),
  
  // System fields
  status: RegistrationStatus.default('SUBMITTED'),
  notes: z.string().optional(),
  userId: z.string().min(1, 'User ID is required')
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
