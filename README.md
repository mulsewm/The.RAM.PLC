# The.RAM.PLC - Partner Management System

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mulsewms-projects/v0-the-ram-plc)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)

## Overview

The Partner Management System (PMS) is a comprehensive solution for managing partnership applications, onboarding, and relationships for the.RAM.plc. The system includes a public-facing partnership application form and an admin dashboard for reviewing and managing applications.

## Features

### Public-Facing Features
- Partnership application form with validation
- Responsive design for all devices
- Success confirmation and next steps information

### Admin Dashboard Features
- Overview dashboard with key metrics and recent applications
- Partnership applications list with filtering, sorting, and search
- Detailed application view with tabs for notes, attachments, and status history
- Status management workflow (New → Under Review → Approved/Rejected → Onboarding)
- Internal notes system for collaboration
- File attachment uploads and management
- User management with role-based access control

## Technology Stack

- **Frontend**: React, Next.js, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js
- **Email Service**: Nodemailer with SMTP or Ethereal for development
- **File Storage**: (Planned) AWS S3 or similar service

## Email Configuration

The application includes a robust email service with the following features:

- Welcome emails for new users
- Password reset functionality
- Development-friendly with Ethereal test accounts
- Type-safe email templates
- Support for HTML and plain text emails
- File attachments support

### Environment Variables

Create a `.env` file in the root directory with the following email-related variables:

```env
# Email Configuration
SMTP_HOST=smtp.example.com  # Leave empty for Ethereal test account in development
SMTP_PORT=587               # 587 for TLS, 465 for SSL, 25 for unencrypted
SMTP_SECURE=false           # true for 465, false for other ports
SMTP_USER=your_email@example.com
SMTP_PASSWORD=your_email_password
EMAIL_FROM_NAME="The RAM PLC"
EMAIL_FROM_ADDRESS=noreply@theramplc.com
NEXTAUTH_URL=http://localhost:3000  # Used in email templates for links
```

### Development with Ethereal

In development mode, if no SMTP host is configured, the application will automatically create an Ethereal test account and log the SMTP credentials and email preview URLs to the console.

### Sending Emails

Use the email service in your code:

```typescript
import { sendWelcomeEmail, sendPasswordResetEmail } from '@/lib/email';

// Send welcome email
await sendWelcomeEmail({
  to: 'user@example.com',
  name: 'John Doe',
});

// Send password reset email
await sendPasswordResetEmail({
  to: 'user@example.com',
  name: 'John Doe',
  resetToken: 'abc123',
  expiresInHours: 24,
});
```

### Email Templates

- **Welcome Email**: Sent when a new user account is created
- **Password Reset**: Sent when a user requests a password reset

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your configuration:
   - Set up your database connection string
   - Configure email settings (SMTP or use Ethereal in development)
   - Set up authentication secrets

3. For development with Ethereal (no SMTP required), leave `SMTP_HOST` empty and check the console for login credentials and email previews.

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/the.RAM.plc.git
   cd the.RAM.plc
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up the database
   ```bash
   npx prisma migrate dev --name init
   ```

4. Initialize sample data (optional)
   ```bash
   npx ts-node scripts/init-database.ts
   ```

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
/
├── app/                    # Next.js App Router
│   ├── admin/              # Admin dashboard pages
│   ├── api/                # API routes
│   │   └── partnerships/   # Partnership API endpoints
│   └── (site)/             # Public-facing pages
├── components/             # Reusable React components
│   ├── ui/                 # UI components
│   └── admin/              # Admin-specific components
├── lib/                    # Utility functions and shared code
├── prisma/                 # Prisma schema and migrations
├── public/                 # Static assets
└── scripts/                # Database scripts and utilities
```

## API Routes

- `GET /api/partnerships` - List all partnership applications with filtering
- `POST /api/partnerships` - Submit a new partnership application
- `GET /api/partnerships/[id]` - Get a specific partnership application
- `PUT /api/partnerships/[id]` - Update a partnership application
- `PUT /api/partnerships/[id]/status` - Update application status
- `GET /api/partnerships/[id]/notes` - Get application notes
- `POST /api/partnerships/[id]/notes` - Add a note to an application
- `GET /api/partnerships/[id]/attachments` - Get application attachments
- `POST /api/partnerships/[id]/attachments` - Upload an attachment

## Deployment

This project is configured for deployment on Vercel. Connect your GitHub repository to Vercel for automatic deployments.

## License

Proprietary - All rights reserved
