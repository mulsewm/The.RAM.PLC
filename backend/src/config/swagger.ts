import swaggerJsdoc from 'swagger-jsdoc';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read package.json to get version
const packageJson = JSON.parse(readFileSync(join(__dirname, '../../package.json'), 'utf-8'));
const { version } = packageJson;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'the.RAM.plc System API',
      version,
      description: 'API documentation for the the.RAM.plc System',
      contact: {
        name: 'API Support',
        email: 'support@theramplc.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:5002',
        description: 'Development server',
      },
      {
        url: 'https://api.theramplc.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The auto-generated id of the user',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address',
            },
            name: {
              type: 'string',
              description: 'User full name',
            },
            role: {
              type: 'string',
              enum: ['USER', 'ADMIN'],
              default: 'USER',
              description: 'User role',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp',
            },
          },
        },
        Registration: {
          type: 'object',
          required: [
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'dateOfBirth',
            'nationality',
            'currentCountry',
            'profession',
            'yearsOfExperience',
            'educationLevel',
            'skills',
            'languages',
            'preferredCountries',
            'visaType',
            'relocationTimeline',
          ],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The auto-generated id of the registration',
            },
            firstName: {
              type: 'string',
              description: 'First name of the applicant',
            },
            lastName: {
              type: 'string',
              description: 'Last name of the applicant',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email address of the applicant',
            },
            phoneNumber: {
              type: 'string',
              description: 'Phone number with country code',
            },
            dateOfBirth: {
              type: 'string',
              format: 'date',
              description: 'Date of birth in YYYY-MM-DD format',
            },
            nationality: {
              type: 'string',
              description: 'Nationality of the applicant',
            },
            currentCountry: {
              type: 'string',
              description: 'Current country of residence',
            },
            profession: {
              type: 'string',
              description: 'Current profession',
            },
            yearsOfExperience: {
              type: 'integer',
              minimum: 0,
              description: 'Years of professional experience',
            },
            educationLevel: {
              type: 'string',
              enum: ['HIGHSCHOOL', 'BACHELORS', 'MASTERS', 'PHD', 'OTHER'],
              description: 'Highest level of education',
            },
            skills: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of professional skills',
            },
            languages: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of languages spoken',
            },
            preferredCountries: {
              type: 'array',
              items: {
                type: 'string',
              },
              description: 'List of preferred countries for relocation',
            },
            visaType: {
              type: 'string',
              enum: ['WORK', 'STUDENT', 'BUSINESS', 'TOURIST', 'OTHER'],
              description: 'Type of visa being applied for',
            },
            relocationTimeline: {
              type: 'string',
              enum: ['IMMEDIATE', '3_MONTHS', '6_MONTHS', '1_YEAR', 'FLEXIBLE'],
              description: 'Expected timeline for relocation',
            },
            status: {
              type: 'string',
              enum: ['DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'],
              default: 'DRAFT',
              description: 'Current status of the application',
            },
            statusNotes: {
              type: 'string',
              nullable: true,
              description: 'Notes about the application status',
            },
            documents: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Document',
              },
              description: 'List of uploaded documents',
            },
            userId: {
              type: 'string',
              format: 'uuid',
              description: 'ID of the user who created the registration',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Registration creation timestamp',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Registration last update timestamp',
            },
          },
        },
        Document: {
          type: 'object',
          required: ['fileName', 'fileUrl', 'fileType', 'fileSize'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The auto-generated id of the document',
            },
            fileName: {
              type: 'string',
              description: 'Original name of the uploaded file',
            },
            fileUrl: {
              type: 'string',
              format: 'uri',
              description: 'URL to access the uploaded file',
            },
            fileType: {
              type: 'string',
              description: 'MIME type of the file',
            },
            fileSize: {
              type: 'integer',
              description: 'Size of the file in bytes',
            },
            description: {
              type: 'string',
              description: 'Optional description of the document',
            },
            documentType: {
              type: 'string',
              enum: ['PASSPORT', 'RESUME', 'DEGREE', 'CERTIFICATE', 'OTHER'],
              description: 'Type of document',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Document upload timestamp',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              default: false,
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            error: {
              type: 'string',
              description: 'Error type/code',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
            },
          },
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication information is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'No token provided',
                error: 'UNAUTHORIZED',
              },
            },
          },
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Validation failed',
                error: 'VALIDATION_ERROR',
                details: {
                  errors: [
                    {
                      field: 'email',
                      message: 'Invalid email format',
                    },
                  ],
                },
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                success: false,
                message: 'Registration not found',
                error: 'NOT_FOUND',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: [
    join(__dirname, '../api/**/*.ts'),
    join(__dirname, '../api/**/*.routes.ts'),
    join(__dirname, '../api/**/*.controller.ts'),
    join(__dirname, '../api/**/*.docs.ts'),
  ],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
