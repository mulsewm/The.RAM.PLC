import { Router } from 'express';
import * as registrationController from './controllers/registration.controller.js';
import { authenticate } from '../../middleware/auth.js';
import { upload, uploadFileMiddleware, serveUploadedFile } from './middleware/upload.js';
import * as uploadController from './controllers/upload.controller.js';

const router = Router();

// File upload configuration for registration documents
const registrationUpload = upload.fields([
  { name: 'resume', maxCount: 1 },
  { name: 'passport', maxCount: 1 },
  { name: 'license', maxCount: 1 },
  { name: 'degree', maxCount: 1 },
  { name: 'experience', maxCount: 1 },
  { name: 'medicalReport', maxCount: 1 },
  { name: 'photo', maxCount: 1 },
  { name: 'policeClearance', maxCount: 1 }
]);

// Submit registration with file uploads
router.post('/', registrationUpload, registrationController.submitRegistration);

// Get all registrations (admin only)
router.get('/', authenticate, registrationController.getAllRegistrations);

// Get single registration
router.get('/:id', authenticate, registrationController.getRegistration);

// Update registration status
router.patch('/:id/status', authenticate, registrationController.updateRegistrationStatus);

// Upload document to registration
router.post(
  '/:id/documents',
  authenticate,
  uploadFileMiddleware,
  uploadController.uploadFile
);

// Serve uploaded files
router.get('/documents/:filename', serveUploadedFile);

export default router;
