import { Router } from 'express';
import { authenticate, authorize } from '../../../src/middleware/auth.js';
import { uploadFileMiddleware, uploadMultipleFilesMiddleware } from './middleware/upload.js';
import { 
  getFile, 
  uploadFile, 
  uploadMultipleFiles 
} from './controllers/upload.controller.js';
import { 
  submitRegistration, 
  getRegistration, 
  getAllRegistrations, 
  updateRegistrationStatus 
} from './controllers/registration.controller.js';
import { ApiResponse } from '../../../src/utils/apiResponse.js';
import { sendWelcomeEmail } from '../../../src/middleware/emailNotification.js';

const router = Router();

// File upload endpoints - POST /api/registrations/upload
router.post('/upload', 
  authenticate, // Require authentication
  uploadFileMiddleware, // Handle file upload
  uploadFile // Process the uploaded file
);

// Multiple file upload - POST /api/registrations/upload/multiple
router.post('/upload/multiple', 
  authenticate, // Require authentication
  uploadMultipleFilesMiddleware, // Handle multiple file uploads
  uploadMultipleFiles // Process the uploaded files
);

// Get file details - GET /api/registrations/files/:id
router.get('/files/:id', 
  authenticate, // Require authentication
  getFile // Get file details
);

// Submit new registration - POST /api/registrations
router.post('/', 
  authenticate, // Require authentication
  sendWelcomeEmail, // Send welcome email
  submitRegistration // Process registration
);

// Get all registrations (admin only) - GET /api/registrations
router.get('/', 
  authenticate, // Require authentication
  authorize(['ADMIN']), // Require admin role
  getAllRegistrations // Get all registrations (paginated)
);

// Get registration by ID - GET /api/registrations/:id
router.get('/:id', 
  authenticate, // Require authentication
  getRegistration // Get a specific registration by ID
);

// Update registration status (admin only) - PATCH /api/registrations/:id/status
router.patch('/:id/status', 
  authenticate, // Require authentication
  authorize(['ADMIN']), // Require admin role
  updateRegistrationStatus // Update registration status
);

export default router;
