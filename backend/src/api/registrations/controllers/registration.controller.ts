import type { Request as ExpressRequest, Response } from 'express';
import { prisma } from '../../../../src/lib/prisma.js';
import { Prisma, Registration, Gender, MaritalStatus, RegistrationStatus } from '@prisma/client';
import { registrationSchema, type RegistrationInput, VisaType, ProcessingUrgency } from '../validations/registration.schema.js';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { MulterFiles, RegistrationFilePaths } from '../types/registration.types.js';
import { uploadFilesToS3, deleteFileFromS3 } from '../../lib/s3.js';
import { generateSecurePassword, sendAccountCreationEmail } from '../../services/email.service.js';
import crypto from 'crypto';
import { ZodError } from 'zod';

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
  firstName?: string | null;
  lastName?: string | null;
  gender?: Gender | null;
  maritalStatus?: MaritalStatus | null;
  email: string;
  phoneNumber?: string | null;
  currentLocation?: string | null;
  profession?: string | null;
  specialization?: string | null;
  yearsOfExperience?: string | null;
  jobTitle?: string | null;
  hasProfessionalLicense?: boolean | null;
  licensingStatus?: string | null;
  preferredLocations?: string[];
  willingToRelocate?: boolean | null;
  preferredJobTypes?: string[];
  expectedSalary?: number | null;
  noticePeriodValue?: number | null;
  noticePeriodUnit?: string | null;
  visaType?: VisaType | null;
  processingUrgency?: ProcessingUrgency | null;
  references?: Prisma.JsonValue | null;
  resume?: string | null;
  passportOrId?: string | null;
  professionalCertificates?: string[];
  policeClearance?: string | null;
  confirmAccuracy?: boolean | null;
  termsAccepted?: boolean | null;
  backgroundCheckConsent?: boolean | null;
  status?: RegistrationStatus | null; 
  notes?: string | null;
  submittedAt?: Date | null;
  userId?: string | null;
};

// Helper function to send registration confirmation email
const sendRegistrationConfirmationEmail = async (
  user: { email: string; name?: string | null },
  registration: Pick<Registration, 'id' | 'email' | 'firstName' | 'lastName' | 'gender' | 'maritalStatus' | 'phoneNumber' | 'profession' | 'yearsOfExperience' | 'status' | 'submittedAt'> & {
    specialization?: string | null;
    notes?: string | null;
  }
): Promise<void> => {
  try {
    console.log(`Sending registration confirmation to ${user.email}`);
    console.log('Registration details:', registration);
  } catch (error) {
    console.error('Failed to send registration confirmation email:', error);
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
    console.log(`Sending status update email to ${user.email}`);
    console.log('Registration details:', registration);
  } catch (error) {
    console.error('Failed to send status update email:', error);
  }
};

interface RegistrationFormData {
  firstName?: string;
  lastName?: string;
  gender?: string;
  maritalStatus?: string;
  email: string;
  phoneNumber?: string;
  currentLocation?: string | null;
  profession?: string;
  specialization?: string | null;
  yearsOfExperience?: string;
  jobTitle?: string;
  hasProfessionalLicense?: boolean;
  licensingStatus?: string | null;
  preferredLocations?: string[] | string;
  willingToRelocate?: boolean;
  preferredJobTypes?: string[] | string;
  expectedSalary?: number;
  noticePeriodValue?: number;
  noticePeriodUnit?: string;
  visaType?: string | null;
  processingUrgency?: string | null;
  references?: string; // JSON string
  confirmAccuracy?: boolean;
  termsAccepted?: boolean;
  backgroundCheckConsent?: boolean;
  status?: string;
  notes?: string | null;
  // For dynamic access, though Zod schema is preferred
  [key: string]: unknown;
}

export const submitRegistration = async (req: ExpressRequest, res: Response) => {
  console.log("submitRegistration controller triggered for path:", req.path);

  try {
    const files = req.files as MulterFiles;
    const formData = req.body as RegistrationFormData;

    console.log("formData before validation:", formData);
    console.log("files before validation:", files);

    const parsedFormData = {
      ...formData,
      preferredLocations: typeof formData.preferredLocations === 'string' 
        ? JSON.parse(formData.preferredLocations) 
        : (formData.preferredLocations || []),
      preferredJobTypes: typeof formData.preferredJobTypes === 'string' 
        ? JSON.parse(formData.preferredJobTypes) 
        : (formData.preferredJobTypes || []),
      references: typeof formData.references === 'string' && formData.references !== '' 
        ? JSON.parse(formData.references) 
        : (formData.references || null),
    };

    const validatedData = registrationSchema.parse(parsedFormData);

    console.log("validationResult", {
      success: true,
      data: validatedData,
    });

    let uploadedFilePaths: RegistrationFilePaths = {};
    try {
      uploadedFilePaths = await uploadFilesToS3(files);
    } catch (uploadError: any) {
      console.error("Error uploading files to S3:", uploadError);
      return res.status(500).json({ message: "Failed to upload documents.", error: uploadError.message });
    }

    const userEmail = validatedData.email; 
    const userName = validatedData.firstName || '';

    let userId: string | null = null; 
    let generatedPassword = '';

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email: userEmail },
      });

      if (!existingUser) {
        generatedPassword = crypto.randomBytes(16).toString('hex');
        const hashedPassword = await generateSecurePassword(generatedPassword);

        const newUser = await prisma.user.create({
          data: {
            email: userEmail,
            name: userName,
            password: hashedPassword,
            role: "USER",
          },
        });
        userId = newUser.id;
        await sendAccountCreationEmail(userEmail, generatedPassword);
      } else {
        userId = existingUser.id;
      }
    } catch (userError: any) {
      console.error("Error during user creation/connection:", userError);
      return res.status(500).json({ message: "Failed to process user account.", error: userError.message });
    }
    
    const registrationData: Prisma.RegistrationCreateInput = {
      id: uuidv4(),
      firstName: validatedData.firstName ?? null,
      lastName: validatedData.lastName ?? null,
      gender: validatedData.gender ?? null,
      maritalStatus: validatedData.maritalStatus ?? null,
      email: validatedData.email,
      phoneNumber: validatedData.phoneNumber ?? null,
      currentLocation: validatedData.currentLocation ?? null,
      profession: validatedData.profession ?? null,
      specialization: validatedData.specialization ?? null,
      yearsOfExperience: validatedData.yearsOfExperience ?? null,
      jobTitle: validatedData.jobTitle ?? null,
      hasProfessionalLicense: validatedData.hasProfessionalLicense ?? null,
      licensingStatus: validatedData.licensingStatus ?? null,
      preferredLocations: validatedData.preferredLocations || [],
      willingToRelocate: validatedData.willingToRelocate ?? null,
      preferredJobTypes: validatedData.preferredJobTypes || [],
      expectedSalary: validatedData.expectedSalary ?? null,
      noticePeriodValue: validatedData.noticePeriodValue ?? null,
      noticePeriodUnit: validatedData.noticePeriodUnit ?? null,
      visaType: validatedData.visaType ?? null,
      processingUrgency: validatedData.processingUrgency ?? null,
      references: validatedData.references ?? null,
      confirmAccuracy: validatedData.confirmAccuracy ?? null,
      termsAccepted: validatedData.termsAccepted ?? null,
      backgroundCheckConsent: validatedData.backgroundCheckConsent ?? null,
      status: validatedData.status ?? "SUBMITTED",
      notes: validatedData.notes ?? null,
      submittedAt: new Date(),
      userId: userId ?? null,

      // File paths from uploaded files
      resume: uploadedFilePaths.resume ?? null,
      passportOrId: uploadedFilePaths.passport ?? null,
      policeClearance: uploadedFilePaths.policeClearance ?? null,
      professionalCertificates: uploadedFilePaths.professionalCertificates || [],
      license: uploadedFilePaths.license ?? null,
      degree: uploadedFilePaths.degree ?? null,
      experience: uploadedFilePaths.experience ?? null,
      medicalReport: uploadedFilePaths.medicalReport ?? null,
      photo: uploadedFilePaths.photo ?? null,
    };

    const registration = await prisma.registration.create({
      data: registrationData,
    });

    res.status(201).json({ message: 'Registration successful!', registrationId: registration.id });
  } catch (error: any) {
    console.error("Error submitting registration:", error);
    if (error instanceof ZodError) {
      return res.status(400).json({ message: 'Validation error', errors: error.errors });
    } else if (error.message.includes("P2002")) { 
      return res.status(409).json({ message: "A user with this email already exists." });
    } else {
      if (error.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ message: "File too large. Maximum size is 1MB." });
      } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ message: `Unexpected file field: ${error.field}` });
      }
      return res.status(500).json({ message: "Internal server error", error: error.message });
    }
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
