import type { Request as ExpressRequest, Response } from 'express';
import { prisma } from '../../../../src/lib/prisma.js';
import { Prisma, Registration, Gender, MaritalStatus, RegistrationStatus } from '@prisma/client';
import { registrationSchema, type RegistrationInput, VisaType, ProcessingUrgency } from '../validations/registration.schema.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Extend Express types
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: string;
      name?: string | null;
    } | null;
    files?: {
      [fieldname: string]: Express.Multer.File[];
    } | Express.Multer.File[];
    file?: Express.Multer.File;
  }
}

type AuthenticatedRequest = Express.Request & {
  user?: {
    id: string;
    email: string;
    role: string;
    name?: string | null;
  } | null;
  files?: {
    [fieldname: string]: Express.Multer.File[];
  } | Express.Multer.File[];
  file?: Express.Multer.File;
};

// Type definitions for authenticated requests
type AuthenticatedUser = {
  id: string;
  email: string;
  role: string;
  name?: string | null;
};

// Type for creating a new registration
type RegistrationCreateData = {
  id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  maritalStatus: MaritalStatus;
  email: string;
  phoneNumber: string;
  currentLocation: string;
  country: string;
  city: string;
  address: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  profession: string;
  specialization?: string | null;
  yearsOfExperience: string;
  currentEmployer?: string | null;
  jobTitle: string;
  hasProfessionalLicense: boolean;
  licenseType?: string | null;
  licenseNumber?: string | null;
  issuingOrganization?: string | null;
  licenseExpiryDate?: Date | null;
  licensingStatus?: string | null;
  preferredLocations: string[];
  willingToRelocate: boolean;
  preferredJobTypes: string[];
  expectedSalary?: number | null;
  noticePeriodValue?: number | null;
  noticePeriodUnit?: string | null;
  visaType?: string | null;
  processingUrgency?: string | null;
  references?: any;
  resume?: string | null;
  passportOrId?: string | null;
  professionalCertificates: string[];
  policeClearance?: string | null;
  confirmAccuracy: boolean;
  termsAccepted: boolean;
  backgroundCheckConsent: boolean;
  status: RegistrationStatus;
  notes?: string | null;
  submittedAt?: Date | null;
  userId: string;
};

// Helper function to send registration confirmation email
const sendRegistrationConfirmationEmail = async (
  user: { email: string; name?: string | null },
  registration: Pick<Registration, 'id' | 'email' | 'firstName' | 'lastName' | 'middleName' | 'dateOfBirth' | 'gender' | 'maritalStatus' | 'phoneNumber' | 'profession' | 'yearsOfExperience' | 'status' | 'submittedAt'> & {
    specialization?: string | null;
    notes?: string | null;
  }
): Promise<void> => {
  try {
    // In a real implementation, you would send an email here
    console.log(`Sending registration confirmation to ${user.email}`);
    console.log('Registration details:', registration);
    
    // Example email sending code (commented out as it requires proper email setup)
    /*
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: 'Registration Submitted Successfully',
      html: `
        <h1>Thank you for your registration, ${registration.firstName}!</h1>
        <p>Your registration has been received and is being processed.</p>
        <p>Reference Number: ${registration.id}</p>
        <p>Status: ${registration.status}</p>
      `
    });
    */
  } catch (error) {
    console.error('Failed to send registration confirmation email:', error);
    // Don't throw the error as we don't want to fail the registration process
    // just because the email couldn't be sent
  }
};

// Helper function to send status update email
const sendStatusUpdateEmail = async (
  user: { email: string; name?: string | null },
  registration: Pick<Registration, 'id' | 'email' | 'firstName' | 'lastName' | 'status'> & {
    notes?: string | null;
  }
): Promise<void> => {
  try {
    // In a real implementation, you would send an email here
    console.log(`Sending status update email to ${user.email}`);
    console.log('Registration details:', registration);
  } catch (error) {
    console.error('Failed to send status update email:', error);
  }
};

// Helper to map frontend form data to our database model
interface RegistrationFilePaths {
  resume?: string;
  passportOrId?: string;
  professionalCertificates?: string[];
  policeClearance?: string;
}

interface RegistrationFormData {
  firstName: string;
  middleName?: string | null;
  lastName: string;
  dateOfBirth: string | Date;
  gender: string;
  maritalStatus: string;
  email: string;
  phoneNumber: string;
  profession: string;
  yearsOfExperience: string;
  currentEmployer?: string | null;
  jobTitle: string;
  
  // Licensing & Certification
  hasProfessionalLicense: boolean;
  licenseType?: string | null;
  licenseNumber?: string | null;
  issuingOrganization?: string | null;
  licenseExpiryDate?: string | Date | null;
  licensingStatus?: string | null;
  
  // Work Preferences
  preferredLocations: string[];
  willingToRelocate: boolean;
  preferredJobTypes: string[];
  expectedSalary: number;
  noticePeriodValue: number;
  noticePeriodUnit: string;
  
  // Visa Information
  visaType?: string | null;
  processingUrgency?: string | null;
  
  // Professional References
  references: Array<{
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
  }>;
  
  // Terms & Declaration
  confirmAccuracy: boolean;
  termsAccepted: boolean;
  backgroundCheckConsent: boolean;
  
  // Required fields for database
  country: string;
  city: string;
  address: string;
  postalCode: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  currentLocation?: string | null;
  
  status?: string;
  specialization?: string | null;
  
  [key: string]: unknown;
}

const mapFormDataToRegistration = (
  formData: RegistrationFormData,
  userId: string,
  filePaths: RegistrationFilePaths
): Prisma.RegistrationCreateInput => {
  // Ensure formData is defined and has required properties
  if (!formData) {
    throw new Error('Form data is required');
  }

  // Convert date string to Date object if needed
  const dateOfBirth = typeof formData.dateOfBirth === 'string' 
    ? new Date(formData.dateOfBirth) 
    : formData.dateOfBirth;

  const licenseExpiryDate = formData.licenseExpiryDate
    ? new Date(formData.licenseExpiryDate)
    : null;

  // Build the base registration data object with all required fields
  const baseData: Prisma.RegistrationCreateInput = {
    id: uuidv4(),
    firstName: formData.firstName,
    middleName: formData.middleName || null,
    lastName: formData.lastName,
    dateOfBirth,
    gender: formData.gender as Gender,
    maritalStatus: formData.maritalStatus as MaritalStatus,
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    currentLocation: formData.currentLocation || '',
    profession: formData.profession,
    yearsOfExperience: formData.yearsOfExperience || '0',
    currentEmployer: formData.currentEmployer || null,
    jobTitle: formData.jobTitle,
    
    // Required database fields
    country: formData.country || '',
    city: formData.city || '',
    address: formData.address || '',
    postalCode: formData.postalCode || '',
    emergencyContactName: formData.emergencyContactName || '',
    emergencyContactPhone: formData.emergencyContactPhone || '',
    
    // Licensing & Certification
    hasProfessionalLicense: formData.hasProfessionalLicense,
    licenseType: formData.licenseType || null,
    licenseNumber: formData.licenseNumber || null,
    issuingOrganization: formData.issuingOrganization || null,
    licenseExpiryDate,
    licensingStatus: formData.licensingStatus || null,
    
    // Work Preferences
    preferredLocations: formData.preferredLocations,
    willingToRelocate: formData.willingToRelocate,
    preferredJobTypes: formData.preferredJobTypes,
    expectedSalary: formData.expectedSalary,
    noticePeriodValue: formData.noticePeriodValue,
    noticePeriodUnit: formData.noticePeriodUnit,
    
    // Visa Information
    visaType: formData.visaType ? (formData.visaType as VisaType) : null,
    processingUrgency: formData.processingUrgency ? (formData.processingUrgency as ProcessingUrgency) : null,
    
    // Professional References
    references: formData.references,
    
    // Terms & Declaration
    confirmAccuracy: formData.confirmAccuracy,
    termsAccepted: formData.termsAccepted,
    backgroundCheckConsent: formData.backgroundCheckConsent,
    
    status: Object.values(RegistrationStatus).includes(formData.status as RegistrationStatus)
      ? (formData.status as RegistrationStatus)
      : RegistrationStatus.SUBMITTED,
    
    // File paths from uploads
    ...(filePaths.resume && { resume: filePaths.resume }),
    ...(filePaths.passportOrId && { passportOrId: filePaths.passportOrId }),
    ...(filePaths.professionalCertificates && { professionalCertificates: filePaths.professionalCertificates }),
    ...(filePaths.policeClearance && { policeClearance: filePaths.policeClearance }),
    
    // User relation
    user: {
      connect: {
        id: userId
      }
    },
    
    // Required fields with default values - using string literals to match Prisma enum values
    educationLevel: 'OTHER',
    institution: '',
    fieldOfStudy: '',
    graduationYear: 0,
    educationStatus: 'COMPLETED',
    educationCountry: '',
    educationCity: ''
  };

  return baseData;
};

export const submitRegistration = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Parse and validate the form data
    const formData = req.body;
    const validationResult = registrationSchema.safeParse(formData);

    if (!validationResult.success) {
      return res.status(400).json({
        message: 'Validation error',
        errors: validationResult.error.errors
      });
    }

    // Handle file uploads
    const filePaths: RegistrationFilePaths = {};
    
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      // Handle resume
      if (files.resume?.[0]) {
        filePaths.resume = files.resume[0].path;
      }
      
      // Handle passport/ID
      if (files.passportOrId?.[0]) {
        filePaths.passportOrId = files.passportOrId[0].path;
      }
      
      // Handle professional certificates (multiple files)
      if (files.professionalCertificates) {
        filePaths.professionalCertificates = files.professionalCertificates.map(file => file.path);
      }
      
      // Handle police clearance
      if (files.policeClearance?.[0]) {
        filePaths.policeClearance = files.policeClearance[0].path;
      }
    }

    // Map form data to registration model
    const registrationData = mapFormDataToRegistration(formData, user.id, filePaths);

    // Create the registration
    const registration = await prisma.registration.create({
      data: registrationData
    });

    // Send confirmation email
    await sendRegistrationConfirmationEmail(user, registration);

    return res.status(201).json({
      message: 'Registration submitted successfully',
      data: registration
    });
  } catch (error) {
    console.error('Error submitting registration:', error);
    return res.status(500).json({
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get all registrations (admin only)
export const getAllRegistrations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userRole = req.user?.role;
    
    if (userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view registrations',
        error: 'FORBIDDEN'
      });
    }

    const { page = 1, limit = 10, status } = req.query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const where: Prisma.RegistrationWhereInput = {};
    if (status && Object.values(RegistrationStatus).includes(status as RegistrationStatus)) {
      where.status = status as RegistrationStatus;
    }

    const [registrations, total] = await Promise.all([
      prisma.registration.findMany({
        where,
        skip,
        take: limitNumber,
        include: {
          documents: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.registration.count({ where })
    ]);

    return res.status(200).json({
      success: true,
      data: registrations,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber)
      }
    });

  } catch (error) {
    console.error('Error in getAllRegistrations:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve registrations',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// Get a single registration by ID
export const getRegistration = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        error: 'UNAUTHORIZED'
      });
    }

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: {
        documents: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
        error: 'NOT_FOUND'
      });
    }

    // Check if user has permission to view this registration
    if (userRole !== 'ADMIN' && userId !== registration.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this registration',
        error: 'FORBIDDEN'
      });
    }

    return res.status(200).json({
      success: true,
      data: registration
    });

  } catch (error) {
    console.error('Error in getRegistration:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve registration',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// Update registration status (admin only)
interface UpdateStatusRequest {
  status: RegistrationStatus;
  notes?: string;
}

// Update registration status (admin only)
export const updateRegistrationStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body as UpdateStatusRequest;
    const userRole = req.user?.role;

    if (!userRole || !['ADMIN', 'REVIEWER'].includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update registration status',
        error: 'FORBIDDEN'
      });
    }

    const registration = await prisma.registration.update({
      where: { id },
      data: {
        status,
        notes: notes || undefined,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true
          }
        }
      }
    });

    // Send email notification
    if (registration.user) {
      await sendStatusUpdateEmail(registration.user, registration);
    }

    return res.status(200).json({
      success: true,
      message: 'Registration status updated successfully',
      data: registration
    });

  } catch (error) {
    console.error('Error in updateRegistrationStatus:', error);
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update registration status',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// Export all controller functions
export const registrationController = {
  submitRegistration,
  getAllRegistrations,
  getRegistration,
  updateRegistrationStatus
};

export type { AuthenticatedRequest };
