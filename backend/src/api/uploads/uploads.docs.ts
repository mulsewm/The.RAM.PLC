/**
 * @swagger
 * tags:
 *   name: File Uploads
 *   description: File upload and management
 */

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
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: string
 *               format: uuid
 *               description: Auto-generated file ID
 *             fileName:
 *               type: string
 *               description: Original filename
 *             fileUrl:
 *               type: string
 *               format: uri
 *               description: URL to access the uploaded file
 *             fileType:
 *               type: string
 *               description: MIME type of the file
 *             fileSize:
 *               type: integer
 *               description: File size in bytes
 *             description:
 *               type: string
 *               description: Optional description
 *             documentType:
 *               type: string
 *               enum: [PASSPORT, RESUME, DEGREE, CERTIFICATE, OTHER]
 *               description: Type of document
 *             createdAt:
 *               type: string
 *               format: date-time
 * 
 *     FileUploadRequest:
 *       type: object
 *       required:
 *         - file
 *       properties:
 *         file:
 *           type: string
 *           format: binary
 *           description: File to upload
 *         description:
 *           type: string
 *           description: Optional description
 *         documentType:
 *           type: string
 *           enum: [PASSPORT, RESUME, DEGREE, CERTIFICATE, OTHER]
 *           description: Type of document
 */

/**
 * @swagger
 * /api/uploads:
 *   post:
 *     summary: Upload a single file
 *     tags: [File Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/FileUploadRequest'
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FileUploadResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       413:
 *         description: File too large
 * 
 * @swagger
 * /api/uploads/multiple:
 *   post:
 *     summary: Upload multiple files
 *     tags: [File Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Files to upload
 *               descriptions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Descriptions for each file (same order as files)
 *               documentTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *                   enum: [PASSPORT, RESUME, DEGREE, CERTIFICATE, OTHER]
 *                 description: Document types for each file (same order as files)
 *     responses:
 *       201:
 *         description: Files uploaded successfully
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
 *                     $ref: '#/components/schemas/FileUploadResponse'
 *       400:
 *         $ref: '#/components/responses/ValidationError'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       413:
 *         description: One or more files are too large
 */

/**
 * @swagger
 * /api/uploads/{id}:
 *   get:
 *     summary: Get file by ID
 *     tags: [File Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID
 *     responses:
 *       200:
 *         description: File content
 *         content:
 *           application/octet-stream:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Not authorized to access this file
 *       404:
 *         description: File not found
 *   delete:
 *     summary: Delete a file
 *     tags: [File Uploads]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: File ID to delete
 *     responses:
 *       200:
 *         description: File deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: 'File deleted successfully'
 *       401:
 *         $ref: '#/components/responses/UnauthorizedError'
 *       403:
 *         description: Forbidden - Not authorized to delete this file
 *       404:
 *         description: File not found
 */
