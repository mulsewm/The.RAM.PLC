import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Status } from '@prisma/client';

// Validation schema for status update
const statusUpdateSchema = z.object({
  status: z.enum(['NEW', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'ONBOARDING']),
  notes: z.string().optional(),
  userId: z.string()
});

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Validate request body
    const validatedData = statusUpdateSchema.parse(body);
    
    // Find the application by ID
    const application = await prisma.partnershipApplication.findUnique({
      where: { id }
    });
    
    if (!application) {
      return NextResponse.json({ error: 'Partnership application not found' }, { status: 404 });
    }
    
    // Get user by ID
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId }
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }
    
    // Create status history entry and update application status in a transaction
    const result = await prisma.$transaction(async (tx: typeof prisma) => {
      // Create status history entry
      const statusHistory = await tx.statusHistory.create({
        data: {
          previousStatus: application.status,
          newStatus: validatedData.status as Status,
          notes: validatedData.notes,
          userId: user.id,
          applicationId: id
        },
        include: {
          changedBy: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      });
      
      // Update application status
      const updatedApplication = await tx.partnershipApplication.update({
        where: { id },
        data: {
          status: validatedData.status as Status,
          updatedAt: new Date()
        },
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
            },
            take: 5 // Limit to most recent 5 status changes
          }
        }
      });
      
      return { statusHistory, updatedApplication };
    });
    
    return NextResponse.json({
      success: true,
      application: result.updatedApplication,
      statusHistory: result.statusHistory
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
