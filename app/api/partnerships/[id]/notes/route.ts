import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// Validation schema for note creation
const noteCreateSchema = z.object({
  content: z.string().min(1, { message: "Note content cannot be empty" }),
  userId: z.string()
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
      select: { id: true } // Just check if it exists
    });
    
    if (!application) {
      return NextResponse.json({ error: 'Partnership application not found' }, { status: 404 });
    }
    
    // Get notes for this application
    const notes = await prisma.note.findMany({
      where: { applicationId: id },
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
    });
    
    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Error fetching notes:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Validate request body
    const validatedData = noteCreateSchema.parse(body);
    
    // Find the application by ID
    const application = await prisma.partnershipApplication.findUnique({
      where: { id },
      select: { id: true } // Just check if it exists
    });
    
    if (!application) {
      return NextResponse.json({ error: 'Partnership application not found' }, { status: 404 });
    }
    
    // Get user by ID
    const user = await prisma.user.findUnique({
      where: { id: validatedData.userId },
      select: { id: true } // Just check if it exists
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }
    
    // Create new note
    const newNote = await prisma.note.create({
      data: {
        content: validatedData.content,
        applicationId: id,
        userId: validatedData.userId
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    // Update application's updatedAt timestamp
    await prisma.partnershipApplication.update({
      where: { id },
      data: { updatedAt: new Date() }
    });
    
    return NextResponse.json({
      success: true,
      note: newNote
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    
    console.error('Error creating note:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
