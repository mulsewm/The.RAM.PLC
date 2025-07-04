import { Request, Response, NextFunction, RequestHandler } from 'express';
import multer, { Multer } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { ApiResponse } from '../../../utils/apiResponse.js';

// Get the current directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, '../../../../uploads/registrations');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure local storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueId = uuidv4();
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `${uniqueId}${extension}`);
  }
});

// File filter
const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Check file type
  const allowedTypes = [
    'application/pdf', 
    'image/jpeg', 
    'image/png', 
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPG, PNG, DOC, and DOCX files are allowed.'));
  }
};

// Create multer instance for local storage
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Try to use S3 if credentials are available, otherwise fall back to local storage
let uploadFileMiddleware: RequestHandler;
let uploadMultipleFilesMiddleware: RequestHandler;

try {
  // Only import AWS SDK if we have credentials
  if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    const { S3Client } = await import('@aws-sdk/client-s3');
    const multerS3 = (await import('multer-s3')).default;
    
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    // Configure S3 storage
    const s3Storage = multerS3({
      s3: s3Client,
      bucket: process.env.AWS_S3_BUCKET_NAME || 'the-ram-registrations',
      acl: 'private',
      contentType: multerS3.AUTO_CONTENT_TYPE,
      key: (req, file, cb) => {
        const uniqueSuffix = uuidv4();
        const fileExtension = path.extname(file.originalname).toLowerCase();
        cb(null, `uploads/${uniqueSuffix}${fileExtension}`);
      },
    });

    uploadFileMiddleware = multer({
      storage: s3Storage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
      },
    }).single('file');

    uploadMultipleFilesMiddleware = multer({
      storage: s3Storage,
      fileFilter,
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max file size
        files: 5, // Maximum 5 files
      },
    }).array('files', 5);
    
    console.log('✅ Using AWS S3 for file storage');
  } else {
    throw new Error('AWS credentials not found');
  }
} catch (error) {
  console.warn('⚠️  AWS S3 not configured, falling back to local file storage');
  console.warn('   Reason:', error instanceof Error ? error.message : String(error));
  
  // Use local storage as fallback
  uploadFileMiddleware = upload.single('file');
  uploadMultipleFilesMiddleware = upload.array('files', 5);
}

// Export the middleware functions
export { uploadFileMiddleware, uploadMultipleFilesMiddleware };

// Middleware to serve uploaded files when using local storage
export const serveUploadedFile = (req: Request, res: Response, next: NextFunction) => {
  if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
    const filename = req.params.filename;
    if (!filename) {
      return res.status(400).json({ success: false, message: 'Filename is required' });
    }
    
    const filePath = path.join(UPLOAD_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }
    
    // Set appropriate headers
    const ext = path.extname(filename).toLowerCase();
    let contentType = 'application/octet-stream';
    
    switch (ext) {
      case '.pdf':
        contentType = 'application/pdf';
        break;
      case '.jpg':
      case '.jpeg':
        contentType = 'image/jpeg';
        break;
      case '.png':
        contentType = 'image/png';
        break;
      case '.doc':
        contentType = 'application/msword';
        break;
      case '.docx':
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        break;
    }
    
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
    
    fileStream.on('error', (error) => {
      console.error('Error streaming file:', error);
      res.status(500).json({ success: false, message: 'Error streaming file' });
    });
  } else {
    next();
  }
};

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
