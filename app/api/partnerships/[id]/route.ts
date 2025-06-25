import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Status } from '@prisma/client';

// Validation schema for partnership application updates
const partnershipUpdateSchema = z.object({
  status: z.enum(['NEW', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ONBOARDING']).optional(),
  notes: z.array(z.object({
    content: z.string(),
    createdBy: z.string().optional()
  })).optional(),
  attachments: z.array(z.object({
    fileName: z.string(),
    fileType: z.string(),
    fileSize: z.number(),
    description: z.string().optional(),
    filePath: z.string()
  })).optional()
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Find the application by ID
    const application = await prisma.partnershipApplication.findUnique({
      where: { id },
      include: {
        statusHistory: {
          include: {
            changedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            changedAt: 'desc'
          }
        },
        notes: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        },
        attachments: {
          include: {
            uploadedBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          },
          orderBy: {
            uploadedAt: 'desc'
          }
        }
      }
    });
    
    if (!application) {
      return NextResponse.json({ error: 'Partnership application not found' }, { status: 404 });
    }
    
    return NextResponse.json(application);
  } catch (error) {
    console.error('Error fetching application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Validate request body
    const validatedData = partnershipUpdateSchema.parse(body);
    
    // Find the application by ID
    const application = await prisma.partnershipApplication.findUnique({
      where: { id }
    });
    
    if (!application) {
      return NextResponse.json({ error: 'Partnership application not found' }, { status: 404 });
    }
    
    // Get system user (or create one if it doesn't exist)
    let systemUser = await prisma.user.findFirst({
      where: { email: 'system@theram.plc' }
    });
    
    if (!systemUser) {
      systemUser = await prisma.user.create({
        data: {
          name: 'System',
          email: 'system@theram.plc',
          role: 'ADMIN'
        }
      });
    }
    
    // Update the application
    const updatedApplication = await prisma.partnershipApplication.update({
      where: { id },
      data: {
        ...(validatedData.status && { 
          status: validatedData.status as Status,
          statusHistory: {
            create: {
              previousStatus: application.status,
              newStatus: validatedData.status as Status,
              notes: 'Status updated via API',
              userId: systemUser.id
            }
          }
        }),
        updatedAt: new Date()
      },
      include: {
        statusHistory: {
          include: {
            changedBy: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            changedAt: 'desc'
          }
        }
      }
    });
    
    return NextResponse.json(updatedApplication);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    
    console.error('Error updating application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
