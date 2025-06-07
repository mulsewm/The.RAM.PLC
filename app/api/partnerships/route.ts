import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { Status, Role } from '@prisma/client';
import { withErrorHandler } from '@/middleware/error-handler';
import { ApiResponse } from '@/lib/api-response';
import { getPagination } from '@/lib/api-response';
import prisma from '@/lib/db';
import { rateLimit } from '@/lib/rate-limit';

// Rate limiting configuration
const limiter = rateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500, // Max 500 users per second
});

// Input validation schemas
const searchParamsSchema = z.object({
  status: z.nativeEnum(Status).optional(),
  country: z.string().min(2).optional(),
  businessType: z.string().min(2).optional(),
  search: z.string().optional(),
  page: z.string().regex(/^\d+$/).default('1').transform(Number),
  limit: z.string().regex(/^\d+$/).default('10').transform(Number)
});

// Validation schema for partnership application
const partnershipSchema = z.object({
  fullName: z.string()
    .min(2, { message: "Full name must be at least 2 characters" })
    .max(100, { message: "Full name must be at most 100 characters" })
    .trim(),
  email: z.string()
    .email({ message: "Invalid email address" })
    .max(100, { message: "Email must be at most 100 characters" })
    .toLowerCase()
    .trim(),
  company: z.string()
    .min(2, { message: "Company name must be at least 2 characters" })
    .max(100, { message: "Company name must be at most 100 characters" })
    .trim(),
  phone: z.string()
    .min(5, { message: "Phone number must be at least 5 characters" })
    .max(20, { message: "Phone number must be at most 20 characters" })
    .regex(/^[+\d\s-]+$/, { message: "Invalid phone number format" })
    .trim(),
  country: z.string()
    .min(2, { message: "Country must be at least 2 characters" })
    .max(100, { message: "Country must be at most 100 characters" })
    .trim(),
  expertise: z.array(z.string())
    .min(1, { message: "At least one area of expertise must be selected" })
    .max(10, { message: "Maximum 10 expertise areas allowed" }),
  businessType: z.string()
    .min(2, { message: "Business type must be at least 2 characters" })
    .max(100, { message: "Business type must be at most 100 characters" })
    .trim(),
  message: z.string()
    .max(2000, { message: "Message must be at most 2000 characters" })
    .optional()
    .default(''),
  termsAccepted: z.boolean()
    .refine(val => val === true, { message: "You must accept the terms and conditions" })
});

// Type for filters
interface PartnershipFilters {
  status?: Status;
  country?: string;
  businessType?: string;
  OR?: Array<{
    fullName?: { contains: string };
    email?: { contains: string };
    company?: { contains: string };
  }>;
}

export const GET = withErrorHandler(async (request: NextRequest) => {
  try {
    // Apply rate limiting
    const identifier = request.ip || '127.0.0.1';
    await limiter.check(10, identifier); // 10 requests per minute

    // Validate and parse query parameters
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const params = searchParamsSchema.safeParse(searchParams);
    
    if (!params.success) {
      return ApiResponse.error(
        new Response(JSON.stringify({ errors: params.error.flatten() }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }),
        'Invalid query parameters'
      );
    }
    
    const { status, country, businessType, search, page, limit } = params.data;
    const { skip, take } = getPagination(page, limit);
    
    // Build query filters with type safety
    const filters: PartnershipFilters = {};
      
    if (status) {
      filters.status = status as Status;
    }
      
    if (country) {
      filters.country = country;
    }
      
    if (businessType) {
      filters.businessType = businessType;
    }
      
    // Add search to filters if provided
    if (search) {
      filters.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count for pagination
    const total = await prisma.partnershipApplication.count({
      where: filters,
    });

    // Fetch applications with related data
    const applications = await prisma.partnershipApplication.findMany({
      skip,
      take,
      where: filters,
      orderBy: { createdAt: 'desc' },
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
          orderBy: { changedAt: 'desc' },
          take: 1 // Only get the most recent status change
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
          orderBy: { createdAt: 'desc' }
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
          orderBy: { uploadedAt: 'desc' }
        }
      },
    });

    // Return paginated response
    return ApiResponse.paginated(applications, {
      page,
      limit: take,
      total,
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting using headers since IP might not be directly available
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(/, /)[0] : '127.0.1.1';
    
    // Apply rate limiting
    const rateLimitResult = await limiter.check(request, 5, ip); // 5 requests per minute
    
    // Check if rate limited (should be handled by the error, but just in case)
    if (!rateLimitResult.success) {
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests',
          message: rateLimitResult.error || 'Rate limit exceeded',
          retryAfter: rateLimitResult.retryAfter 
        }),
        { 
          status: 429, 
          headers: { 
            'Content-Type': 'application/json',
            'Retry-After': rateLimitResult.retryAfter?.toString() || '60',
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': (Math.floor(Date.now() / 1000) + (rateLimitResult.retryAfter || 60)).toString()
          } 
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const result = partnershipSchema.safeParse(body);
    
    if (!result.success) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Validation failed',
          details: result.error.flatten() 
        }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'X-Request-ID': crypto.randomUUID()
          } 
        }
      );
    }

    const data = result.data;
    
    try {
      // Create a new application in the database within a transaction
      const newApplication = await prisma.$transaction(async (prisma) => {
        // First, find or create the system user
        const systemUser = await prisma.user.upsert({
          where: { email: 'system@theramplc.com' },
          update: {},
          create: {
            name: 'System',
            email: 'system@theramplc.com',
            role: 'ADMIN', // Using ADMIN role for system actions
            active: false
          }
        });

        // Create the application with status history
        return await prisma.partnershipApplication.create({
          data: {
            fullName: data.fullName,
            email: data.email,
            company: data.company,
            phone: data.phone,
            country: data.country,
            businessType: data.businessType,
            expertise: data.expertise,
            message: data.message,
            status: 'NEW',
            statusHistory: {
              create: {
                previousStatus: null,
                newStatus: 'NEW',
                userId: systemUser.id,
                notes: 'Application submitted'
              }
            }
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
              orderBy: { changedAt: 'desc' },
              take: 1
            }
          }
        });
      });
      
      // TODO: Send email notification to admin and confirmation to applicant
      
      return new Response(
        JSON.stringify({
          success: true,
          data: newApplication,
          message: 'Application submitted successfully'
        }),
        { 
          status: 201, 
          headers: { 
            'Content-Type': 'application/json',
            'X-Request-ID': crypto.randomUUID()
          } 
        }
      );
      
    } catch (error) {
      console.error('Database error creating application:', error);
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Failed to create application',
          requestId: crypto.randomUUID()
        }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'X-Request-ID': crypto.randomUUID()
          } 
        }
      );
    }
  } catch (error) {
    console.error('Unexpected error in POST /api/partnerships:', error);
    
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ 
          success: false,
          error: 'Invalid request data',
          details: error.flatten()
        }),
        { 
          status: 400, 
          headers: { 
            'Content-Type': 'application/json',
            'X-Request-ID': crypto.randomUUID()
          } 
        }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Internal server error',
        requestId: crypto.randomUUID()
      }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'X-Request-ID': crypto.randomUUID()
        } 
      }
    );
  }
}
