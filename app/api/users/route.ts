import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { z } from "zod"
import { log } from "@/lib/logger"

// Import the email service with a direct path to avoid module resolution issues
const { sendWelcomeEmail } = require("@/lib/email")

// Mock auth for now - replace with your actual auth implementation
async function verifyAuth(request: NextRequest) {
  // This is a placeholder - implement your actual auth logic here
  return { 
    success: true, 
    user: { 
      id: 'system', 
      role: 'ADMIN' 
    },
    error: null
  };
}

const prisma = new PrismaClient()

// Simple in-memory rate limiting
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple rate limiting middleware
 * @param ip Client IP address
 * @param windowMs Time window in milliseconds
 * @param maxRequests Maximum number of requests allowed in the window
 * @returns Object with rate limit information
 */
function checkRateLimit(ip: string, windowMs: number, maxRequests: number) {
  const now = Date.now();
  const clientData = rateLimitMap.get(ip) || { count: 0, resetAt: now + windowMs };
  
  // Reset the counter if the window has passed
  if (now > clientData.resetAt) {
    clientData.count = 0;
    clientData.resetAt = now + windowMs;
  }
  
  // Increment the counter
  clientData.count++;
  rateLimitMap.set(ip, clientData);
  
  return {
    isRateLimited: clientData.count > maxRequests,
    remaining: Math.max(0, maxRequests - clientData.count),
    resetAt: clientData.resetAt,
  };
}

// Rate limiting configuration
const RATE_LIMIT = {
  WINDOW_MS: 15 * 60 * 1000, // 15 minutes
  MAX_REQUESTS: 10, // Limit each IP to 10 requests per windowMs
  MESSAGE: "Too many user creation attempts, please try again later"
}

// User creation schema
const userCreateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  // @ts-ignore - REVIEWER is a valid role in the database schema
  role: z.enum(["USER", "REVIEWER", "ADMIN", "SUPER_ADMIN"]),
})

// User update schema
const userUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  // @ts-ignore - REVIEWER is a valid role in the database schema
  role: z.enum(["USER", "REVIEWER", "ADMIN", "SUPER_ADMIN"]).optional(),
  active: z.boolean().optional(),
})

// GET handler - List all users
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and authorization
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Check if user has admin or super_admin role
    if (!["ADMIN", "SUPER_ADMIN"].includes(authResult.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Parse query parameters
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "10")
    const role = url.searchParams.get("role") || undefined
    const active = url.searchParams.get("active") ? url.searchParams.get("active") === "true" : undefined
    const search = url.searchParams.get("search") || undefined

    // Calculate pagination
    const skip = (page - 1) * limit

    // Build filter conditions
    const where: any = {}
    if (role) where.role = role
    if (active !== undefined) where.active = active
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]
    }

    // Query users with pagination
    const [users, totalCount] = await Promise.all([
      // @ts-ignore - The active and lastLogin fields exist in the database schema but TypeScript doesn't recognize them
      prisma.user.findMany({
        where,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          active: true,
          createdAt: true,
          updatedAt: true,
          lastLogin: true,
          // Exclude password and other sensitive fields
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ])

    // Log audit entry
    // @ts-ignore - The auditLog model exists in the database schema but TypeScript doesn't recognize it
    await prisma.auditLog.create({
      data: {
        action: "user.list",
        entityType: "User",
        entityId: "multiple",
        performedBy: { connect: { id: authResult.user.id } },
        details: JSON.stringify({ filters: { role, active, search }, pagination: { page, limit } }),
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    })

    // Return paginated results
    return NextResponse.json({
      users,
      pagination: {
        total: totalCount,
        page,
        limit,
        pages: Math.ceil(totalCount / limit),
      },
    })
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 })
  }
}

// POST handler - Create a new user
export async function POST(request: NextRequest) {
  // Get client IP
  const forwarded = request.headers.get('x-forwarded-for');
  const ip = (forwarded || '127.0.0.1').split(',')[0].trim();
  
  // Check rate limit
  const rateLimit = checkRateLimit(ip, RATE_LIMIT.WINDOW_MS, RATE_LIMIT.MAX_REQUESTS);
  
  // If rate limited, return 429 response
  if (rateLimit.isRateLimited) {
    const retryAfter = Math.ceil((rateLimit.resetAt - Date.now()) / 1000);
    
    return NextResponse.json(
      { 
        error: RATE_LIMIT.MESSAGE,
        retryAfter
      },
      { 
        status: 429,
        headers: {
          'Retry-After': retryAfter.toString(),
          'X-RateLimit-Limit': RATE_LIMIT.MAX_REQUESTS.toString(),
          'X-RateLimit-Remaining': Math.max(0, RATE_LIMIT.MAX_REQUESTS - rateLimit.remaining).toString(),
          'X-RateLimit-Reset': Math.ceil(rateLimit.resetAt / 1000).toString(),
        }
      }
    );
  }

  try {
    // Verify authentication and authorization
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      log.warn('Unauthorized user creation attempt', { 
        ip: request.headers.get('x-forwarded-for'),
        userAgent: request.headers.get('user-agent') 
      });
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Check if user has admin or super_admin role
    if (!['ADMIN', 'SUPER_ADMIN'].includes(authResult.user.role)) {
      log.warn('Insufficient permissions for user creation', { 
        userId: authResult.user.id,
        role: authResult.user.role
      });
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = userCreateSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 })
    }
    
    const { name, email, password, role } = validation.data
    
    // @ts-ignore - REVIEWER is a valid role in the database schema
    // This is needed because TypeScript doesn't recognize the updated enum

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 })
    }

    // Hash the password
    const hashedPassword = await hash(password, 12)

    // Create the new user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
      // @ts-ignore - The active field exists in the database schema but TypeScript doesn't recognize it
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        // Exclude password
      },
    })

    // Log audit entry
    // @ts-ignore - The auditLog model exists in the database schema but TypeScript doesn't recognize it
    await prisma.auditLog.create({
      data: {
        action: "user.create",
        entityType: "User",
        entityId: newUser.id,
        performedBy: { connect: { id: authResult.user.id } },
        details: JSON.stringify({ 
          name: newUser.name, 
          email: newUser.email, 
          role: newUser.role 
        }),
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    })

    // Send welcome email in the background
    sendWelcomeEmail({ to: newUser.email, name: newUser.name })
      .then((result: { success: boolean; messageId?: string; error?: Error }) => {
        if (result.success) {
          log.info('Welcome email sent successfully', { 
            userId: newUser.id, 
            email: newUser.email,
            messageId: result.messageId 
          });
        } else {
          log.error('Failed to send welcome email', { 
            userId: newUser.id, 
            email: newUser.email,
            error: result.error?.message 
          });
        }
      })
      .catch((error: Error) => {
        log.error('Unexpected error in welcome email sending', { 
          userId: newUser.id, 
          email: newUser.email,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      });

    // Log successful user creation
    log.info('User created successfully', { 
      userId: newUser.id,
      email: newUser.email,
      role: newUser.role,
      createdBy: authResult.user.id 
    });

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    log.error('Error creating user', { 
      error: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
      requestBody: await request.clone().json().catch(() => ({}))
    });
    
    // Return appropriate error response
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
