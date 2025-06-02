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
- **Authentication**: (Planned) NextAuth.js
- **File Storage**: (Planned) AWS S3 or similar service

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL="postgresql://username:password@localhost:5432/theram_pms"
NEXTAUTH_SECRET="your-secret-here"
# Add additional environment variables as needed
```

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
