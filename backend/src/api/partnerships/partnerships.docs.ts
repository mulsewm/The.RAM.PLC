/**
 * @swagger
 * components:
 *   schemas:
 *     PartnershipApplication:
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
 *         company:
 *           type: string
 *           example: 'Tech Solutions Inc.'
 *         phone:
 *           type: string
 *           example: '+1234567890'
 *         country:
 *           type: string
 *           example: 'United States'
 *         expertise:
 *           type: array
 *           items:
 *             type: string
 *           example: ['IT Services', 'Consulting']
 *         businessType:
 *           type: string
 *           example: 'Technology'
 *         message:
 *           type: string
 *           example: 'Interested in forming a strategic partnership'
 *         status:
 *           type: string
 *           enum: [PENDING, IN_REVIEW, APPROVED, REJECTED]
 *           example: 'PENDING'
 *         userId:
 *           type: string
 *           format: uuid
 *           example: '123e4567-e89b-12d3-a456-426614174000'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2023-01-01T00:00:00Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: '2023-01-01T00:00:00Z'
 * 
 *     Note:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: '123e4567-e89b-12d3-a456-426614174000'
 *         content:
 *           type: string
 *           example: 'Follow up scheduled for next week'
 *         userId:
 *           type: string
 *           format: uuid
 *           example: '123e4567-e89b-12d3-a456-426614174000'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: '2023-01-01T00:00:00Z'
 * 
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
 *           type: object
 *           additionalProperties: true
 * 
 * securitySchemes:
 *   bearerAuth:
 *     type: http
 *     scheme: bearer
 *     bearerFormat: JWT
 */

/**
 * @swagger
 * tags:
 *   - name: Partnerships
 *     description: Partnership application management
 */

/**
 * @swagger
 * /api/partnerships:
 *   post:
 *     summary: Create a new partnership application
 *     tags: [Partnerships]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - email
 *               - company
 *               - phone
 *               - country
 *               - expertise
 *               - businessType
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               company:
 *                 type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *               businessType:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       201:
 *         description: Partnership application created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartnershipApplication'
 *       400:
 *         description: Bad request (missing or invalid fields)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 * 
 *   get:
 *     summary: Get all partnership applications (admin only)
 *     tags: [Partnerships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, IN_REVIEW, APPROVED, REJECTED]
 *         description: Filter by status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of partnership applications
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
 *                     $ref: '#/components/schemas/PartnershipApplication'
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
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       500:
 *         description: Internal server error
 * 
 * /api/partnerships/{id}:
 *   get:
 *     summary: Get a partnership application by ID
 *     tags: [Partnerships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Partnership application ID
 *     responses:
 *       200:
 *         description: Partnership application details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartnershipApplication'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the owner or admin)
 *       404:
 *         description: Partnership application not found
 *       500:
 *         description: Internal server error
 * 
 *   put:
 *     summary: Update a partnership application
 *     tags: [Partnerships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Partnership application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               company:
 *                 type: string
 *               phone:
 *                 type: string
 *               country:
 *                 type: string
 *               expertise:
 *                 type: array
 *                 items:
 *                   type: string
 *               businessType:
 *                 type: string
 *               message:
 *                 type: string
 *     responses:
 *       200:
 *         description: Partnership application updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartnershipApplication'
 *       400:
 *         description: Bad request (invalid fields)
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the owner or admin)
 *       404:
 *         description: Partnership application not found
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete a partnership application
 *     tags: [Partnerships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Partnership application ID
 *     responses:
 *       204:
 *         description: Partnership application deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the owner or admin)
 *       404:
 *         description: Partnership application not found
 *       500:
 *         description: Internal server error
 * 
 * /api/partnerships/{id}/status:
 *   patch:
 *     summary: Update partnership application status (admin only)
 *     tags: [Partnerships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Partnership application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, IN_REVIEW, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PartnershipApplication'
 *       400:
 *         description: Invalid status
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (admin access required)
 *       404:
 *         description: Partnership application not found
 *       500:
 *         description: Internal server error
 * 
 * /api/partnerships/{id}/notes:
 *   post:
 *     summary: Add a note to a partnership application
 *     tags: [Partnerships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Partnership application ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *                 minLength: 1
 *     responses:
 *       201:
 *         description: Note added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the owner or admin)
 *       404:
 *         description: Partnership application not found
 *       500:
 *         description: Internal server error
 * 
 *   get:
 *     summary: Get all notes for a partnership application
 *     tags: [Partnerships]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Partnership application ID
 *     responses:
 *       200:
 *         description: List of notes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (not the owner or admin)
 *       404:
 *         description: Partnership application not found
 *       500:
 *         description: Internal server error
 */

export default {};
