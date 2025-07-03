import { Request, Response, Express } from 'express';
import { prisma } from '../../../../src/lib/prisma.js';
import { ApiResponse } from '../../../../src/utils/apiResponse.js';
import { documentSchema } from '../validations/registration.schema.js';
import { DocumentInput } from '../validations/registration.types.js';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
        error: 'NO_FILE_UPLOADED'
      });
    }

    const file = req.file as Express.Multer.File;
    const { description, documentType, registrationId } = req.body;

    // Validate input
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        error: 'UNAUTHORIZED'
      });
    }

    // Validate file size (max 10MB)
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return res.status(400).json({
        success: false,
        message: 'File size exceeds the maximum limit of 10MB',
        error: 'FILE_TOO_LARGE'
      });
    }

    // Validate file type
    const allowedMimeTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Allowed types: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX',
        error: 'INVALID_FILE_TYPE'
      });
    }

    // If registrationId is provided, verify the registration exists and belongs to the user
    if (registrationId) {
      const registration = await prisma.registration.findUnique({
        where: { id: registrationId },
        select: { userId: true }
      });

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: 'Registration not found',
          error: 'NOT_FOUND'
        });
      }

      if (registration.userId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to add documents to this registration',
          error: 'FORBIDDEN'
        });
      }
    }

    try {
      // Create document record in database
      const document = await prisma.attachment.create({
        data: {
          fileName: file.originalname,
          fileType: file.mimetype,
          fileSize: file.size,
          fileUrl: file.key,
          description: description || null,
          documentType: documentType || 'OTHER',
          userId: req.user.id,
          ...(registrationId && { 
            registration: { 
              connect: { 
                id: registrationId,
                // Ensure the registration belongs to the user
                userId: req.user.role === 'ADMIN' ? undefined : req.user.id
              } 
            } 
          })
        },
        select: {
          id: true,
          fileName: true,
          fileType: true,
          fileSize: true,
          fileUrl: true,
          description: true,
          documentType: true,
          uploadedAt: true,
          registrationId: true,
          userId: true,
          // These fields are automatically included by Prisma
          // createdAt: true,
          // updatedAt: true
        },
      });

      return res.status(201).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          document: {
            id: document.id,
            fileName: document.fileName,
            fileType: document.fileType,
            fileSize: document.fileSize,
            fileUrl: document.fileUrl,
            description: document.description || null,
            documentType: document.documentType || 'OTHER',
            uploadedAt: document.uploadedAt.toISOString(),
            registrationId: document.registrationId,
            userId: document.userId
          },
          fileUrl: file.key,
        }
      });
    } catch (error) {
      console.error('Error creating document record:', error);
      // Attempt to clean up the uploaded file if record creation fails
      try {
        // TODO: Implement file cleanup logic if using S3 or other storage
        console.warn(`File uploaded but database record creation failed for ${file.key}`);
      } catch (cleanupError) {
        console.error('Error cleaning up file after failed record creation:', cleanupError);
      }
      
      throw error; // Let the error be caught by the outer try-catch
    }
  } catch (error) {
    console.error('File upload error:', error);
    return ApiResponse.error(res, 'Failed to upload file', 500, error);
  }
};

export const uploadMultipleFiles = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No files uploaded',
        error: 'NO_FILES_UPLOADED'
      });
    }

    const { description, documentType, registrationId } = req.body;

    // Validate input
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated',
        error: 'UNAUTHORIZED'
      });
    }

    // If registrationId is provided, verify the registration exists and belongs to the user
    if (registrationId) {
      const registration = await prisma.registration.findUnique({
        where: { id: registrationId },
        select: { userId: true }
      });

      if (!registration) {
        return res.status(404).json({
          success: false,
          message: 'Registration not found',
          error: 'NOT_FOUND'
        });
      }

      if (registration.userId !== req.user.id && req.user.role !== 'ADMIN') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to add documents to this registration',
          error: 'FORBIDDEN'
        });
      }
    }
    
    const documents = await Promise.all(
      files.map(async (file) => {
        // Validate file size (max 10MB)
        const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
        if (file.size > MAX_FILE_SIZE) {
          throw new Error(`File ${file.originalname} exceeds the maximum limit of 10MB`);
        }

        // Validate file type
        const allowedMimeTypes = [
          'application/pdf',
          'image/jpeg',
          'image/png',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!allowedMimeTypes.includes(file.mimetype)) {
          throw new Error(`Invalid file type for ${file.originalname}. Allowed types: PDF, JPG, PNG, DOC, DOCX, XLS, XLSX`);
        }

        return await prisma.attachment.create({
          data: {
            fileName: file.originalname,
            fileType: file.mimetype,
            fileSize: file.size,
            fileUrl: file.key,
            description: description || null,
            documentType: documentType || 'OTHER',
            userId: req.user.id,
            ...(registrationId && { 
              registration: { 
                connect: { 
                  id: registrationId,
                  userId: req.user.role === 'ADMIN' ? undefined : req.user.id
                } 
              } 
            })
          },
          select: {
            id: true,
            fileName: true,
            fileType: true,
            fileSize: true,
            fileUrl: true,
            description: true,
            documentType: true,
            uploadedAt: true,
            registrationId: true,
            userId: true,
          },
        });
      })
    );

    return res.status(201).json({
      success: true,
      message: 'Files uploaded successfully',
      data: {
        documents: documents.map(doc => ({
          id: doc.id,
          fileName: doc.fileName,
          fileType: doc.fileType,
          fileSize: doc.fileSize,
          fileUrl: doc.fileUrl,
          description: doc.description || null,
          documentType: doc.documentType || 'OTHER',
          uploadedAt: doc.uploadedAt.toISOString(),
          registrationId: doc.registrationId,
          userId: doc.userId
        })),
        fileUrls: files.map(file => file.key),
      }
    });
  } catch (error) {
    console.error('Multiple file upload error:', error);
    
    // Attempt to clean up any uploaded files if there was an error
    if (req.files?.length) {
      try {
        // TODO: Implement file cleanup logic if using S3 or other storage
        console.warn('Files were uploaded but an error occurred during processing');
      } catch (cleanupError) {
        console.error('Error cleaning up files after failed upload:', cleanupError);
      }
    }
    
    return res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Failed to upload files',
      error: 'UPLOAD_ERROR'
    });
  }
};

export const getFile = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const document = await prisma.attachment.findUnique({
      where: { id },
      select: {
        id: true,
        fileName: true,
        fileType: true,
        fileSize: true,
        fileUrl: true,
        description: true,
        documentType: true,
        uploadedAt: true,
        registrationId: true,
        userId: true
      },
    });
    
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'File not found',
        error: 'NOT_FOUND'
      });
    }
    
    // Check if the user has permission to access this file
    if (req.user?.role !== 'ADMIN' && req.user?.id !== document.userId) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this file',
        error: 'FORBIDDEN'
      });
    }
    
    // In a real app, you would generate a pre-signed URL here
    // For now, we'll just return the document info
    
    return res.status(200).json({
      success: true,
      data: {
        document: {
          ...document,
          description: document.description || null,
          documentType: document.documentType || 'OTHER',
          uploadedAt: document.uploadedAt.toISOString()
        }
      }
    });
  } catch (error) {
    console.error('Get file error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve file',
      error: 'INTERNAL_SERVER_ERROR',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
};
