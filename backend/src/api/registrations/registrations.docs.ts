/**
 * @swagger
 * components:
 *   schemas:
 *     FileUploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: 'File uploaded successfully'
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               example: '123e4567-e89b-12d3-a456-426614174000'
 *             fileName:
 *               type: string
 *               example: 'resume.pdf'
 *             fileUrl:
 *               type: string
 *               format: uri
 *               example: 'http://localhost:3000/api/registrations/documents/123e4567-e89b-12d3-a456-426614174000.pdf'
 *             fileType:
 *               type: string
 *               example: 'application/pdf'
 *     Registration:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: '123e4567-e89b-12d3-a456-426614174000'
 *         fullName:
 *           type: string
 *           example: 'John Doe'
 *         email:
 *           type: string
 *           format: email
 *           example: 'john.doe@example.com'
 *         phone:
 *           type: string
 *           example: '+1234567890'
 *         nationality:
 *           type: string
 *           example: 'United States'
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: '1990-01-01'
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER, PREFER_NOT_TO_SAY]
 *           example: 'MALE'
 *         address:
 *           type: string
 *           example: '123 Main St, Anytown, USA'
 *         educationLevel:
 *           type: string
 *           example: 'BACHELORS'
 *         fieldOfStudy:
 *           type: string
 *           example: 'Computer Science'
 *         workExperience:
 *           type: number
 *           example: 5
 *         currentJobTitle:
 *           type: string
 *           example: 'Software Engineer'
 *         currentEmployer:
 *           type: string
 *           example: 'Tech Corp'
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           example: ['JavaScript', 'Node.js', 'React']
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           example: ['English', 'Spanish']
 *         relocationWillingness:
 *           type: boolean
 *           example: true
 *         preferredCountries:
 *           type: array
 *           items:
 *             type: string
 *           example: ['Canada', 'Germany']
 *         visaType:
 *           type: string
 *           example: 'WORK'
 *         visaExpiryDate:
 *           type: string
 *           format: date
 *           example: '2025-12-31'
 *         resumeUrl:
 *           type: string
 *           format: uri
 *           example: 'http://localhost:3000/api/registrations/documents/resume-123.pdf'
 *         passportOrIdUrl:
 *           type: string
 *           format: uri
 *           example: 'http://localhost:3000/api/registrations/documents/passport-123.pdf'
 *         status:
 *           type: string
 *           enum: [PENDING, UNDER_REVIEW, APPROVED, REJECTED]
 *           example: 'PENDING'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2023-01-01T12:00:00Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2023-01-01T12:00:00Z'
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: 'Error message'
 *         error:
 *           type: string
 *           example: 'ERROR_CODE'
 *     RegistrationStatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [PENDING, UNDER_REVIEW, APPROVED, REJECTED]
 *           example: 'APPROVED'
 *   responses:
 *     Unauthorized:
 *       description: Unauthorized - Authentication credentials were missing or incorrect
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     Forbidden:
 *       description: Forbidden - User does not have permission to access this resource
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     NotFound:
 *       description: The specified resource was not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     BadRequest:
 *       description: Bad request - The request was invalid or cannot be served
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *     ServerError:
 *       description: Internal server error - Something went wrong on the server
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * @swagger
 * tags:
 *   - name: Registrations
 *     description: Registration management
 *   - name: Documents
 *     description: Document upload and management
 *
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Create a new registration
 *     tags: [Registrations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     responses:
 *       '201':
 *         description: Registration created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '500':
 *         $ref: '#/components/responses/ServerError'
 *
 *   get:
 *     summary: Get all registrations (Admin only)
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       '200':
 *         description: A list of registrations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Registration'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *
 * @swagger
 * /api/registrations/{id}:
 *   get:
 *     summary: Get a registration by ID
 *     tags: [Registrations]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Registration ID
 *     responses:
 *       '200':
 *         description: Registration details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *
 * @swagger
 * /api/registrations/{id}/documents:
 *   post:
 *     summary: Upload a document for a registration
 *     tags: [Documents]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Registration ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file to upload (max 10MB)
 *               documentType:
 *                 type: string
 *                 enum: [PASSPORT, RESUME, DEGREE, CERTIFICATE, OTHER]
 *                 default: OTHER
 *                 description: Type of document
 *               description:
 *                 type: string
 *                 description: Optional description of the document
 *     responses:
 *       '201':
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadResponse'
 *       '400':
 *         description: Bad request (e.g., no file provided, invalid file type, file too large)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *       '500':
 *         $ref: '#/components/responses/ServerError'
 *
 * @swagger
 * /api/registrations/documents/{filename}:
 *   get:
 *     summary: Get an uploaded document
 *     tags: [Documents]
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: The filename of the document to retrieve
 *     responses:
 *       '200':
 *         description: Document file
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 *
 * @swagger
 * /api/registrations/{id}/status:
 *   patch:
 *     summary: Update registration status (Admin only)
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Registration ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationStatusUpdate'
 *     responses:
 *       '200':
 *         description: Registration status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Registration'
 *       '400':
 *         $ref: '#/components/responses/BadRequest'
 *       '401':
 *         $ref: '#/components/responses/Unauthorized'
 *       '403':
 *         $ref: '#/components/responses/Forbidden'
 *       '404':
 *         $ref: '#/components/responses/NotFound'
 */
