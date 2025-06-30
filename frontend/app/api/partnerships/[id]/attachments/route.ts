import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

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
    
    // Get attachments for this application
    const attachments = await prisma.attachment.findMany({
      where: { applicationId: id },
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
    });
    
    return NextResponse.json({ attachments });
  } catch (error) {
    console.error('Error fetching attachments:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const formData = await request.formData();
    
    // Extract file and other data from formData
    const file = formData.get('file') as File;
    const description = formData.get('description') as string || '';
    const userId = formData.get('userId') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Validate file type and size
    const validFileTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!validFileTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 400 });
    }
    
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
      where: { id: userId },
      select: { id: true } // Just check if it exists
    });
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 400 });
    }
    
    // In a real implementation, you would:
    // 1. Upload the file to a storage service (e.g., S3, Azure Blob Storage)
    // 2. Get the file URL or path
    
    // For this implementation, we'll create a fake file path
    const filePath = `/uploads/${Date.now()}-${file.name}`;
    
    // Create new attachment in database
    const newAttachment = await prisma.attachment.create({
      data: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        description,
        filePath,
        userId,
        applicationId: id
      },
      include: {
        uploadedBy: {
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
      attachment: newAttachment
    });
  } catch (error) {
    console.error('Error uploading attachment:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
