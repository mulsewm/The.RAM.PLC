import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { ApiResponse } from '../../../utils/apiResponse.js';
import { DocumentInput } from '../validations/registration.types.js';

// Configure AWS S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

// Configure multer for single file upload
export const uploadFileMiddleware = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME || 'the-ram-registrations',
    acl: 'private',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const uniqueSuffix = uuidv4();
      const fileExtension = file.originalname.split('.').pop();
      cb(null, `uploads/${uniqueSuffix}.${fileExtension}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx)$/)) {
      return cb(new Error('Only .jpg, .jpeg, .png, .pdf, .doc, and .docx files are allowed!'));
    }
    cb(null, true);
  },
}).single('file');

// Configure multer for multiple file upload
export const uploadMultipleFilesMiddleware = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: process.env.AWS_S3_BUCKET_NAME || 'the-ram-registrations',
    acl: 'private',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      const uniqueSuffix = uuidv4();
      const fileExtension = file.originalname.split('.').pop();
      cb(null, `uploads/${uniqueSuffix}.${fileExtension}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
    files: 5, // Maximum 5 files
  },
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf|doc|docx)$/)) {
      return cb(new Error('Only .jpg, .jpeg, .png, .pdf, .doc, and .docx files are allowed!'));
    }
    cb(null, true);
  },
}).array('files', 5);

// Middleware to handle file uploads
export const uploadFile = (req: Request, res: Response, next: NextFunction) => {
  // Parse JSON fields from the form data
  if (req.body.metadata) {
    try {
      const metadata = JSON.parse(req.body.metadata);
      req.body = { ...req.body, ...metadata };
    } catch (error) {
      console.error('Error parsing metadata:', error);
      return res.status(400).json({
        success: false,
        message: 'Invalid metadata format',
        error: 'INVALID_METADATA'
      });
    }
  }

  uploadFileMiddleware(req, res, (err: any) => {
    if (err) {
      console.error('File upload error:', err);
      return res.status(400).json({
        success: false,
        message: err.message || 'File upload failed',
        error: 'UPLOAD_ERROR'
      });
    }
    next();
  });
};

export const uploadMultipleFiles = (req: Request, res: Response, next: NextFunction) => {
  const uploadMultiple = uploadMultipleFilesMiddleware;
  
  uploadMultiple(req, res, (err: any) => {
    if (err instanceof multer.MulterError) {
      return ApiResponse.error(res, err.message, 400);
    } else if (err) {
      return ApiResponse.error(res, 'Failed to upload files', 500, err);
    }
    next();
  });
};
