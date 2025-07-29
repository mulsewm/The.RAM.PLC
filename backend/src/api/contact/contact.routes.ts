import { Router } from 'express';
import { EmailService } from '../../services/email.service.js';
import { ApiResponse } from '../../utils/apiResponse.js';
// import { authenticateToken } from '../../middleware/auth.middleware.js';
import {authenticateToken} from '../../middleware/auth.js';
const router = Router();
const emailService = new EmailService();

/**
 * @swagger
 * components:
 *   schemas:
 *     ContactFormData:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - subject
 *         - message
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the person contacting
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the person contacting
 *         phone:
 *           type: string
 *           description: Phone number (optional)
 *         company:
 *           type: string
 *           description: Company or organization name (optional)
 *         serviceInterest:
 *           type: string
 *           description: The service the person is interested in (optional)
 *         subject:
 *           type: string
 *           description: The subject of the message
 *         message:
 *           type: string
 *           description: The actual message content
 */

/**
 * @swagger
 * /api/contact/submit:
 *   post:
 *     summary: Submit a contact form
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ContactFormData'
 *     responses:
 *       200:
 *         description: Message sent successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Internal server error
 */
router.post('/submit', async (req, res) => {
  try {
    const { name, email, phone, company, serviceInterest, subject, message } = req.body as ContactFormData;

    // Basic validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json(
        new ApiResponse(false, 'Missing required fields', null, 400)
      );
    }

    // Email template
    const emailTemplate = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
      ${company ? `<p><strong>Company/Organization:</strong> ${company}</p>` : ''}
      ${serviceInterest ? `<p><strong>Service of Interest:</strong> ${serviceInterest}</p>` : ''}
      <p><strong>Subject:</strong> ${subject}</p>
      <h3>Message:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    `;

    // Send email
    await emailService.sendEmail({
      to: 'info@theramplc.com',
      bcc: 'theramplc@gmail.com',
      subject: `New Contact Form: ${subject}`,
      html: emailTemplate,
    });

    return res.status(200).json(
      new ApiResponse(true, 'Message sent successfully', null, 200)
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return res.status(500).json(
      new ApiResponse(false, 'Failed to send message', null, 500)
    );
  }
});

export default router;
