/**
 * @swagger
 * components:
 *   schemas:
 *     Document:
 *       type: object
 *       required:
 *         - fileName
 *         - fileUrl
 *         - fileType
 *         - fileSize
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated document ID
 *         fileName:
 *           type: string
 *           description: Original filename
 *         fileUrl:
 *           type: string
 *           format: uri
 *           description: URL to access the uploaded file
 *         fileType:
 *           type: string
 *           description: MIME type of the file
 *         fileSize:
 *           type: integer
 *           description: File size in bytes
 *         description:
 *           type: string
 *           description: Optional description
 *         documentType:
 *           type: string
 *           enum: [PASSPORT, RESUME, DEGREE, CERTIFICATE, OTHER]
 *           description: Type of document
 *         createdAt:
 *           type: string
 *           format: date-time
 * 
 *     Registration:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - email
 *         - phoneNumber
 *         - dateOfBirth
 *         - nationality
 *         - currentCountry
 *         - profession
 *         - yearsOfExperience
 *         - educationLevel
 *         - skills
 *         - languages
 *         - preferredCountries
 *         - visaType
 *         - relocationTimeline
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           description: Auto-generated registration ID
 *         firstName:
 *           type: string
 *           description: First name of the applicant
 *         lastName:
 *           type: string
 *           description: Last name of the applicant
 *         email:
 *           type: string
 *           format: email
 *           description: Email address of the applicant
 *         phoneNumber:
 *           type: string
 *           description: Phone number with country code
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           description: Date of birth in YYYY-MM-DD format
 *         nationality:
 *           type: string
 *           description: Nationality of the applicant
 *         currentCountry:
 *           type: string
 *           description: Current country of residence
 *         profession:
 *           type: string
 *           description: Current profession
 *         yearsOfExperience:
 *           type: integer
 *           minimum: 0
 *           description: Years of professional experience
 *         educationLevel:
 *           type: string
 *           enum: [HIGHSCHOOL, BACHELORS, MASTERS, PHD, OTHER]
 *           description: Highest level of education
 *         skills:
 *           type: array
 *           items:
 *             type: string
 *           description: List of professional skills
 *         languages:
 *           type: array
 *           items:
 *             type: string
 *           description: List of languages spoken
 *         preferredCountries:
 *           type: array
 *           items:
 *             type: string
 *           description: List of preferred countries for relocation
 *         visaType:
 *           type: string
 *           enum: [WORK, STUDENT, BUSINESS, TOURIST, OTHER]
 *           description: Type of visa being applied for
 *         relocationTimeline:
 *           type: string
 *           enum: [IMMEDIATE, 3_MONTHS, 6_MONTHS, 1_YEAR, FLEXIBLE]
 *           description: Expected timeline for relocation
 *         status:
 *           type: string
 *           enum: [DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED]
 *           default: DRAFT
 *           description: Current status of the application
 *         statusNotes:
 *           type: string
 *           nullable: true
 *           description: Notes about the application status
 *         documents:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Document'
 *           description: List of uploaded documents
 *         userId:
 *           type: string
 *           format: uuid
 *           description: ID of the user who created the registration
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 * 
 *     RegistrationStatusUpdate:
 *       type: object
 *       required:
 *         - status
 *       properties:
 *         status:
 *           type: string
 *           enum: [SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED]
 *           description: New status for the registration
 *         notes:
 *           type: string
 *           description: Optional notes about the status change
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           default: false
 *         message:
 *           type: string
 *         error:
 *           type: string
 *           description: Error code/type
 *         details:
 *           type: object
 *           description: Additional error details
 */

/**
 * @swagger
 * /api/registrations:
 *   post:
 *     summary: Create a new registration
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Registration'
 *     responses:
 *       201:
 *         description: Registration created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Registration'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 * 
 *   get:
 *     summary: Get all registrations (Admin only)
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED]
 *         description: Filter by status
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
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of registrations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
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
 *                     pages:
 *                       type: integer
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Admin access required
 * 
 * @swagger
 * /api/registrations/me:
 *   get:
 *     summary: Get current user's registration
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user's registration
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Registration'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       404:
 *         description: No registration found for current user
 * 
/**
 * @swagger
 * /api/registrations/{id}:
 *   get:
 *     summary: Get registration by ID
 *     tags: [Registrations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *     responses:
 *       200:
 *         description: Registration details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Registration'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Not authorized to view this registration
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */

/**
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
 *         required: true
 *         schema:
 *           type: string
 *         description: Registration ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegistrationStatusUpdate'
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Registration'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Admin access required
 *       404:
 *         $ref: '#/components/responses/NotFoundError'
 */
