import { Request, Response } from 'express';
import { prisma } from '../../../../prisma';
import { 
  RegistrationInput, 
  RegistrationStatus,
  VisaType,
  ProcessingUrgency,
  Gender,
  MaritalStatus
} from '../validations/registration.schema';
import { sendEmail } from '../../../../utils/email';
import { User, Registration } from '@prisma/client';
import { AuthenticatedRequest } from '../../../middleware/auth.middleware';
import { uploadToS3 } from '../../../services/s3.service';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

// Extend the Express Request type to include user
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// Helper to map frontend form data to our database model
const mapFormDataToRegistration = (
  formData: any,
  userId: string,
  filePaths: Record<string, string>
): Omit<Registration, 'id' | 'createdAt' | 'updatedAt'> => {
  return {
    // Personal Information
    firstName: formData.firstName,
    middleName: formData.middleName || null,
    lastName: formData.lastName,
    dateOfBirth: new Date(formData.dateOfBirth),
    gender: formData.gender,
    maritalStatus: formData.maritalStatus,
    
    // Contact Information
    email: formData.email,
    phoneNumber: formData.phoneNumber,
    currentLocation: formData.currentLocation,
    
    // Professional Information
    profession: formData.profession,
    specialization: formData.specialization || null,
    yearsOfExperience: formData.yearsOfExperience,
    licensingStatus: formData.licensingStatus,
    
    // Location & Visa
    preferredLocation: formData.preferredLocation,
    visaType: formData.visaType,
    processingUrgency: formData.processingUrgency,
    
    // File uploads
    passport: filePaths.passport || null,
    license: filePaths.license || null,
    degree: filePaths.degree || null,
    experience: filePaths.experience || null,
    medicalReport: filePaths.medicalReport || null,
    photo: filePaths.photo || null,
    
    // System fields
    status: 'SUBMITTED',
    notes: formData.notes || null,
    statusUpdatedAt: null,
    statusUpdatedBy: null,
    submittedAt: new Date(),
    userId,
  };
};

export const submitRegistration = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Check if user already has a registration
    const existingRegistration = await prisma.registration.findFirst({
      where: { userId },
    });

    if (existingRegistration) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a registration',
      });
    }

    // Handle file uploads
    const files = req.files as Record<string, Express.Multer.File[]>;
    const filePaths: Record<string, string> = {};

    // Process each file type
    const fileTypes = ['passport', 'license', 'degree', 'experience', 'medicalReport', 'photo'];
    
    for (const fileType of fileTypes) {
      if (files[fileType] && files[fileType][0]) {
        const file = files[fileType][0];
        const fileKey = `uploads/${uuidv4()}${path.extname(file.originalname)}`;
        const result = await uploadToS3(file.buffer, fileKey, file.mimetype);
        filePaths[fileType] = result.url;
      }
    }

    // Map form data to registration model
    const registrationData = mapFormDataToRegistration(req.body, userId, filePaths);

    // Create registration
    const registration = await prisma.registration.create({
      data: registrationData,
    });

    // Send confirmation email
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      await sendRegistrationConfirmationEmail(user, registration);
    }

    return res.status(201).json({
      success: true,
      message: 'Registration submitted successfully',
      data: registration,
      data: responseData
    });

  } catch (error: any) {
    console.error('Error submitting registration:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        error: 'VALIDATION_ERROR',
        details: {
          errors: error.errors.map((e: any) => ({
            path: e.path.join('.'),
            message: e.message
          }))
        }
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'An error occurred while processing your registration',
      error: 'INTERNAL_SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Get all registrations (admin only)
const getAllRegistrations = async (req: Request, res: Response) => {
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
const getRegistration = async (req: Request, res: Response) => {
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
const updateRegistrationStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body as UpdateStatusRequest;
    const userId = req.user?.id;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        error: 'UNAUTHORIZED'
      });
    }

    if (userRole !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update registration status',
        error: 'FORBIDDEN'
      });
    }

    // Validate input
    if (!status || !Object.values(RegistrationStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
        error: 'VALIDATION_ERROR',
        details: {
          status: `Must be one of: ${Object.values(RegistrationStatus).join(', ')}`
        }
      });
    }

    // Validate notes length if provided
    if (notes && notes.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Notes must be less than 2000 characters',
        error: 'VALIDATION_ERROR',
        details: {
          notes: 'Maximum length is 2000 characters'
        }
      });
    }

    // Check if registration exists
    const existingRegistration = await prisma.registration.findUnique({
      where: { id },
      include: { user: true }
    });

    if (!existingRegistration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
        error: 'NOT_FOUND'
      });
    }

    // Skip update if status is the same
    if (existingRegistration.status === status) {
      return res.status(200).json({
        success: true,
        message: 'Status already set to the requested value',
        data: existingRegistration
      });
    }

    // Update registration status
    const updatedRegistration = await prisma.registration.update({
      where: { id },
      data: {
        status,
        notes: notes || undefined, // Use notes if provided, otherwise undefined to not update
        statusUpdatedAt: new Date(),
        statusUpdatedBy: userId,
        updatedAt: new Date()
      },
      include: {
        documents: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true
          }
        }
      }
    });
    
    // Get user details separately since we can't include nested relations in the update
    const user = await prisma.user.findUnique({
      where: { id: updatedRegistration.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true
      }
    });

    // Log the status update
    console.log(`Registration ${id} status updated to ${status} by user ${userId}`);

    // Send status update email if user and email are available
    if (user?.email) {
      try {
        const userName = user.name || 'User';
          
        await sendStatusUpdateEmail(user.email, {
          name: userName,
          status: updatedRegistration.status,
          notes: updatedRegistration.notes || '',
          registrationId: updatedRegistration.id,
          updatedBy: req.user?.email || 'System',
          updateDate: new Date().toISOString()
        });
      } catch (emailError) {
        console.error('Failed to send status update email:', emailError);
        // Continue even if email fails
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Registration status updated successfully',
      data: updatedRegistration
    });

  } catch (error) {
    console.error('Error in updateRegistrationStatus:', error);
    
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({
          success: false,
          message: 'Registration not found',
          error: 'NOT_FOUND'
        });
      }
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to update registration status',
      error: 'INTERNAL_SERVER_ERROR'
    });
  }
};

// Export all controller functions
export {
  submitRegistration,
  getAllRegistrations,
  getRegistration,
  updateRegistrationStatus
};
