import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { Status } from '@prisma/client';

// Validation schema for partnership application
const partnershipSchema = z.object({
  fullName: z.string().min(2, { message: "Full name must be at least 2 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  company: z.string().min(2, { message: "Company name must be at least 2 characters" }),
  phone: z.string().min(5, { message: "Phone number must be at least 5 characters" }),
  country: z.string().min(2, { message: "Country must be at least 2 characters" }),
  expertise: z.array(z.string()).min(1, { message: "At least one area of expertise must be selected" }),
  businessType: z.string().min(2, { message: "Business type must be at least 2 characters" }),
  message: z.string().optional(),
  termsAccepted: z.boolean().refine(val => val === true, { message: "You must accept the terms and conditions" })
});

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const country = searchParams.get('country');
    const businessType = searchParams.get('businessType');
    const search = searchParams.get('search');
    
    // Build query filters
    const filters: any = {};
    
    if (status) {
      filters.status = status as Status;
    }
    
    if (country) {
      filters.country = country;
    }
    
    if (businessType) {
      filters.businessType = businessType;
    }
    
    // Query database with filters
    let applications;
    if (search) {
      const searchLower = search.toLowerCase();
      applications = await prisma.partnershipApplication.findMany({
        where: {
          OR: [
            { fullName: { contains: searchLower } },
            { email: { contains: searchLower } },
            { company: { contains: searchLower } },
          ],
          ...filters,
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
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      applications = await prisma.partnershipApplication.findMany({
        where: filters,
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
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }
    
    return NextResponse.json({ applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate request body
    const validatedData = partnershipSchema.parse(body);
    
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
    
    // Create new application with initial status history
    const newApplication = await prisma.partnershipApplication.create({
      data: {
        fullName: validatedData.fullName,
        email: validatedData.email,
        company: validatedData.company,
        phone: validatedData.phone,
        country: validatedData.country,
        expertise: validatedData.expertise,
        businessType: validatedData.businessType,
        message: validatedData.message,
        status: 'NEW',
        statusHistory: {
          create: {
            newStatus: 'NEW',
            notes: 'Application submitted',
            userId: systemUser.id
          }
        }
      },
      include: {
        statusHistory: true
      }
    });
    
    // In a real implementation, you would:
    // 1. Send confirmation email
    // 2. Notify administrators
    
    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
