import { NextRequest, NextResponse } from "next/server"
import { PrismaClient, User, Role } from "@prisma/client"
import { compare } from "bcrypt"
import { z } from "zod"
import { sign } from "jsonwebtoken"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

// Login schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

// Define a type that includes our custom fields
type UserWithCustomFields = {
  id: string;
  name: string;
  email: string;
  emailVerified: Date | null;
  password: string | null;
  image: string | null;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
  lastLogin?: Date | null;
}

export async function POST(request: NextRequest) {
  try {
    console.log("Login attempt started")
    console.log("Request headers:", Object.fromEntries(request.headers.entries()))
    
    // Parse and validate request body
    const body = await request.json()
    console.log("Request body:", JSON.stringify(body))
    
    const validation = loginSchema.safeParse(body)
    
    if (!validation.success) {
      console.log("Validation failed:", validation.error.errors)
      return NextResponse.json({ error: validation.error.errors }, { status: 400 })
    }
    
    const { email, password } = validation.data
    console.log("Login attempt for email:", email)

    // Find user by email
    console.log("Looking for user with email:", email)
    let user: UserWithCustomFields | null = null;
    try {
      const result = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          active: true,
          lastLogin: true,
          emailVerified: true,
          image: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      // Cast the result to our custom type
      user = result as UserWithCustomFields;
      console.log("Database query result:", user ? JSON.stringify(user, null, 2) : "User not found")
    } catch (error) {
      console.error("Database query error:", error)
      return NextResponse.json({ error: "Database error occurred" }, { status: 500 })
    }
    
    console.log("User found:", user ? "Yes" : "No")
    
    if (!user) {
      console.log("User not found with email:", email)
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Check if user is active
    console.log("User active status:", user.active)
    if (user.active === false) {
      console.log("User account is inactive")
      return NextResponse.json({ error: "Your account is inactive" }, { status: 403 })
    }

    // Verify password
    console.log("Password exists:", !!user.password)
    if (!user.password) {
      console.log("User has no password set")
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    console.log("Comparing passwords")
    const passwordMatch = await compare(password, user.password)
    console.log("Password match:", passwordMatch)
    
    if (!passwordMatch) {
      console.log("Password does not match")
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 })
    }

    // Generate JWT token
    const token = sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    )

    console.log("JWT token created successfully")
    console.log("Token payload:", {
      id: user.id,
      email: user.email,
      role: user.role
    })

    // Create response object first
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
      }
    })
    
    // Set cookie on the response
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax", // Changed from strict to lax for better compatibility
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    })

    console.log("Cookie set on response")

    try {
      // Update last login time
      await prisma.user.update({
        where: { id: user.id },
        data: { 
          lastLogin: new Date() 
        }
      })

      console.log("Last login time updated")

      // Log audit entry
      await prisma.auditLog.create({
        data: {
          action: "auth.login",
          entityType: "User",
          entityId: user.id,
          performedBy: { connect: { id: user.id } },
          details: JSON.stringify({ email: user.email }),
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        },
      })

      console.log("Audit log created")
    } catch (error) {
      console.error("Error updating last login or creating audit log:", error)
      // Continue anyway since the user is authenticated
    }

    // Return the response with the cookie already set
    console.log("Returning successful login response")
    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
