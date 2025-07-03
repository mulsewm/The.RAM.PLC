import { 
  registrationSchema, 
  documentSchema, 
  documentReferenceSchema,
  Gender,
  MaritalStatus,
  EducationLevel,
  EmploymentType
} from './registration.schema.js';
import { z } from 'zod';
import { User } from '@prisma/client';

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type DocumentInput = z.infer<typeof documentSchema>;
export type DocumentReferenceInput = z.infer<typeof documentReferenceSchema>;

export type LanguageProficiency = {
  language: string;
  proficiency: 'BASIC' | 'INTERMEDIATE' | 'FLUENT' | 'NATIVE';
};

// Helper type to convert Prisma enums to string literals
type EnumToString<T> = T extends string ? T : never;

export type RegistrationResponse = {
  // Personal Information
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  dateOfBirth: Date;
  gender: EnumToString<keyof typeof Gender>;
  maritalStatus: EnumToString<keyof typeof MaritalStatus>;
  
  // Contact Information
  email: string;
  phoneNumber: string;
  alternatePhoneNumber: string | null;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  
  // Professional Information
  profession: string;
  yearsOfExperience: number;
  educationLevel: EnumToString<keyof typeof EducationLevel>;
  institution: string;
  fieldOfStudy: string;
  graduationYear: number;
  currentEmploymentStatus: EnumToString<keyof typeof EmploymentType>;
  currentJobTitle: string | null;
  currentCompany: string | null;
  
  // Skills and Languages
  skills: string[];
  languageProficiencies: LanguageProficiency[];
  
  // Preferences
  preferredCountries: string[];
  visaType: string;
  relocationTimeline: string;
  
  // Status & Metadata
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'MORE_INFO_NEEDED';
  notes: string | null;
  statusUpdatedAt: Date | null;
  statusUpdatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
  submittedAt: Date | null;
  
  // Relations
  userId: string;
  user?: Pick<User, 'id' | 'name' | 'email'>;
  documents?: Array<{
    id: string;
    fileName: string;
    fileType: string;
    fileSize: number;
    fileUrl: string;
    description: string | null;
    documentType: string | null;
    uploadedAt: Date;
    createdAt: Date;
    updatedAt: Date;
  }>;
};
