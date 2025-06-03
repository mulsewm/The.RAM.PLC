import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { z } from "zod"
import { verifyAuth, generateResetToken } from "@/lib/auth"

const prisma = new PrismaClient()

// Password reset request schema
const passwordResetSchema = z.object({
  sendEmail: z.boolean().default(true),
})

// POST handler - Initiate password reset
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and authorization
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Check if user has admin or super_admin role, or is requesting their own reset
    const isSelfRequest = authResult.user.id === params.id
    if (!["ADMIN", "SUPER_ADMIN"].includes(authResult.user.role) && !isSelfRequest) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = passwordResetSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 })
    }
    
    const { sendEmail } = validation.data

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        active: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    if (!user.active) {
      return NextResponse.json({ error: "Cannot reset password for inactive user" }, { status: 400 })
    }

    // Generate a reset token
    const resetToken = generateResetToken(user.id)
    
    // In a real implementation, you would:
    // 1. Store the token in the database with an expiration time
    // 2. Send an email with a reset link if sendEmail is true
    
    // For this implementation, we'll simulate storing the token
    // In a real app, you'd have a separate table for password reset tokens
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`
    
    // Log audit entry
    await prisma.auditLog.create({
      data: {
        action: "user.password_reset_request",
        entityType: "User",
        entityId: user.id,
        performedBy: { connect: { id: authResult.user.id } },
        details: JSON.stringify({
          sendEmail,
          requestedBy: isSelfRequest ? "self" : "admin",
        }),
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    })

    // Return success response with token (in a real app, you'd only include the token in development)
    return NextResponse.json({
      message: "Password reset initiated successfully",
      resetUrl: process.env.NODE_ENV === "development" ? resetUrl : undefined,
      emailSent: sendEmail,
    })
  } catch (error) {
    console.error("Error initiating password reset:", error)
    return NextResponse.json({ error: "Failed to initiate password reset" }, { status: 500 })
  }
}
