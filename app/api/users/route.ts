import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { z } from "zod"
import { verifyAuth } from "@/lib/auth";
import { sendWelcomeEmail } from "@/lib/email";

const prisma = new PrismaClient()

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

    // Send welcome email (fire and forget)
    sendWelcomeEmail({ to: newUser.email, name: newUser.name })
      .catch(err => console.error(`Failed to send welcome email to ${newUser.email} in background:`, err));

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json({ error: "Failed to create user" }, { status: 500 })
  }
}
