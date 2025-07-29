import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { setupSwagger } from './utils/swagger.js';

// Load environment variables
dotenv.config();

// Initialize Prisma Client
export const prisma = new PrismaClient();

// Initialize Express
const app = express();
const port = process.env.PORT || 3001;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:5001',
  'http://localhost:5002',
  'https://the-ram-plc.vercel.app',
  'https://the-ram-plc-git-main-mulsewm.vercel.app',
  'https://the-ram-plc-mulsewm.vercel.app',
  'https://v0-the-ram-plc.vercel.app',
  'https://v0-the-ram-plc.vercel.app'
];

// Add any environment-specific origins
if (process.env.FRONTEND_URL) {
  if (Array.isArray(process.env.FRONTEND_URL)) {
    allowedOrigins.push(...process.env.FRONTEND_URL);
  } else {
    allowedOrigins.push(process.env.FRONTEND_URL);
  }
}

// CORS middleware with enhanced logging
app.use((req, res, next) => {
  const origin = req.headers.origin || '';
  
  // Allow requests with no origin (like mobile apps or curl requests) or from allowed origins
  if (!origin || allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    return next();
  }
  
  // Log CORS errors for debugging
  console.warn('CORS blocked request from origin:', origin);
  console.warn('Allowed origins:', allowedOrigins);
  
  // For non-allowed origins, still return 200 for preflight but with no CORS headers
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // For actual requests, return 403
  return res.status(403).json({ 
    success: false, 
    message: `Origin ${origin} not allowed by CORS` 
  });
});

// Apply CORS with default settings for all routes
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is allowed
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Log CORS errors for debugging
    console.warn('CORS blocked request from origin:', origin);
    console.warn('Allowed origins:', allowedOrigins);
    
    const msg = `The CORS policy for this site does not allow access from ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS', 'HEAD'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Allow-Headers',
    'X-Requested-With'
  ],
  exposedHeaders: [
    'Content-Range',
    'X-Total-Count',
    'Content-Disposition',
    'Content-Length'
  ],
  maxAge: 86400 // 24 hours
}));

// Handle preflight requests
app.options('*', cors());

// Add security headers
app.use((req, res, next) => {
  // Remove X-Powered-By header
  res.removeHeader('X-Powered-By');
  
  // Security headers
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Set Content Security Policy
  res.header(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data:; " +
    "font-src 'self'; " +
    "connect-src 'self' http://localhost:5002;"
  );
  
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('dev'));

// Setup Swagger documentation
setupSwagger(app);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  });
});

// API Routes
import authRoutes from './api/auth/routes.js';
import userRoutes from './api/users/routes.js';
import partnershipRoutes from './api/partnerships/routes.js';
import settingsRoutes from './api/settings/routes.js';
import registrationRoutes from './api/registrations/routes.js';
import contactRoutes from './api/contact/contact.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/partnerships', partnershipRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/registrations', registrationRoutes);
app.use('/api/contact', contactRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  const publicPath = path.join(__dirname, '../../public');
  
  // Serve static files
  app.use(express.static(publicPath));
  
  // Handle client-side routing, return all requests to React app
  app.get('*', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
  });
}

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.path}`,
    path: req.path
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  // Handle JWT authentication errors
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Access token expired' });
  }

  // Handle Prisma errors
  if (err.code?.startsWith('P') || err.name?.startsWith('Prisma')) {
    console.error('Database error:', err);
    return res.status(500).json({
      success: false,
      message: 'A database error occurred',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  // Handle other errors
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  // Default error handler
  console.error('Unhandled error:', err);
  res.status(statusCode).json({
    success: false,
    message,
    error: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV === 'development' && { 
      stack: err.stack,
      details: err.details 
    })
  });
});

// Setup Swagger documentation
if (process.env.NODE_ENV !== 'production') {
  setupSwagger(app);
}

// Start the server
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Database URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
  if (process.env.NODE_ENV !== 'production') {
    console.log('📚 API Documentation available at http://localhost:' + port + '/api-docs');
  }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: Error) => {
  console.error('Unhandled Rejection:', err);
  // Attempt a graceful shutdown
  server.close(() => {
    console.log('Server closed due to unhandled rejection');
    process.exit(1);
  });
  // Force shutdown if server.close takes too long
  setTimeout(() => process.exit(1), 5000);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  // Attempt a graceful shutdown
  server.close(() => {
    console.log('Server closed due to uncaught exception');
    process.exit(1);
  });
  // Force shutdown if server.close takes too long
  setTimeout(() => process.exit(1), 5000);
});

// Handle SIGTERM (for Docker/Kubernetes)
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully');
  // Close the server first
  server.close(async () => {
    console.log('Server closed');
    // Disconnect Prisma client
    await prisma.$disconnect();
    console.log('Prisma client disconnected');
    process.exit(0);
  });
  // Force shutdown if cleanup takes too long
  setTimeout(() => process.exit(1), 10000);
});

// Handle process exit
process.on('exit', (code) => {
  console.log(`Process exiting with code ${code}`);
});

export default app;
