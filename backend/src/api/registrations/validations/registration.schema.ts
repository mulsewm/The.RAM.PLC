import { z } from 'zod';

// Enums (unchanged - they define the *valid* string values)
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

// Helper for optional string fields that might come as empty strings
const optionalString = z.string().transform(e => (e === '' ? null : e)).nullable().optional();

// Helper for optional boolean fields that might come as "true" / "false" strings
const optionalBoolean = z.union([
  z.boolean(),
  z.literal("true").transform(() => true),
  z.literal("false").transform(() => false),
  z.string().transform(val => (val === '' ? null : val)), // Handles empty string to null before processing
]).transform(val => (val === null || val === undefined || val === '') ? null : val).nullable().optional(); // Final check for null/undefined after transformations

// Helper for optional number fields that might come as strings
const optionalNumber = z.union([
  z.number(),
  z.string().transform(val => {
    const num = Number(val);
    return isNaN(num) ? null : num; // Convert empty string/non-numeric to null
  })
]).nullable().optional();

// Reference schema - make fields optional and handle empty strings
const referenceSchema = z.object({
  name: optionalString,
  position: optionalString,
  company: optionalString,
  email: z.string().email('Invalid email address').or(z.literal('')).transform(e => (e === '' ? null : e)).nullable().optional(), // Specific for email to allow empty string as optional
  phone: z.string().regex(/^[\d\s+()-]+$/, 'Invalid phone number format').or(z.literal('')).transform(e => (e === '' ? null : e)).nullable().optional() // Specific for phone
});

// Base schema for registration
export const registrationSchema = z.object({
  // Personal Information
  firstName: optionalString,
  lastName: optionalString,
  email: z.string().email('Invalid email address'),
  phoneNumber: optionalString,
  currentLocation: optionalString,
  gender: z.preprocess(val => (val === '' || val === undefined) ? undefined : val, Gender.optional().nullable()),
  maritalStatus: z.preprocess(val => (val === '' || val === undefined) ? undefined : val, MaritalStatus.optional().nullable()),
  country: optionalString,
  city: optionalString,
  address: optionalString,
  postalCode: optionalString,
  emergencyContactName: optionalString,
  emergencyContactPhone: optionalString,

  // Professional Information
  profession: optionalString,
  specialization: optionalString,
  yearsOfExperience: optionalString,
  jobTitle: optionalString,
  currentEmployer: optionalString,
  hasProfessionalLicense: optionalBoolean,
  licenseType: optionalString,
  licenseNumber: optionalString,
  issuingOrganization: optionalString,
  licenseExpiryDate: optionalString,
  licensingStatus: optionalString,
  educationLevel: z.preprocess(val => (val === '' || val === undefined) ? undefined : val, EducationLevel.optional().nullable()),
  institution: optionalString,
  fieldOfStudy: optionalString,
  graduationYear: optionalNumber,
  educationStatus: z.preprocess(val => (val === '' || val === undefined) ? undefined : val, EducationStatus.optional().nullable()),
  educationCountry: optionalString,
  educationCity: optionalString,

  // Work Preferences
  preferredLocations: z.preprocess(
    (val) => {
      try {
        return typeof val === 'string' && val !== '' ? JSON.parse(val) : (val === '' ? [] : val);
      } catch {
        return [];
      }
    },
    z.array(optionalString).optional().nullable()
  ),
  willingToRelocate: optionalBoolean,
  preferredJobTypes: z.preprocess(
    (val) => {
      try {
        return typeof val === 'string' && val !== '' ? JSON.parse(val) : (val === '' ? [] : val);
      } catch {
        return [];
      }
    },
    z.array(JobType.or(optionalString)).optional().nullable()
  ),
  expectedSalary: optionalNumber,
  noticePeriodValue: optionalNumber,
  noticePeriodUnit: z.preprocess(val => (val === '' || val === undefined) ? undefined : val, NoticePeriodUnit.optional().nullable()),

  // Visa Information
  visaType: z.preprocess(val => (val === '' || val === undefined) ? undefined : val, VisaType.optional().nullable()),
  processingUrgency: z.preprocess(val => (val === '' || val === undefined) ? undefined : val, ProcessingUrgency.optional().nullable()),

  // Professional References
  references: z.preprocess(
    (val) => {
      try {
        return typeof val === 'string' && val !== '' ? JSON.parse(val) : (val === '' ? [] : val);
      } catch {
        return [];
      }
    },
    z.array(referenceSchema).optional().nullable()
  ),

  // Document Uploads (handled separately in the controller) - These are already optional
  resume: z.any().optional(),
  passportOrId: z.any().optional(),
  professionalCertificates: z.array(z.any()).optional().nullable(),
  policeClearance: z.any().optional(),
  license: z.any().optional(),
  degree: z.any().optional(),
  experience: z.any().optional(),
  medicalReport: z.any().optional(),
  photo: z.any().optional(),

  // Terms & Declaration
  confirmAccuracy: optionalBoolean,
  termsAccepted: optionalBoolean,
  backgroundCheckConsent: optionalBoolean,

  // System fields
  status: RegistrationStatus.default('SUBMITTED'),
  notes: optionalString,
  userId: optionalString
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
