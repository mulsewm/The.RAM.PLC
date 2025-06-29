import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { PrismaClient } from "@prisma/client"
import { verifyAuth } from "@/lib/auth"

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    
    // Even if auth fails, we still want to clear the cookie
    // But we'll only log the audit if we have a valid user
    
    // Create response object first
    const response = NextResponse.json({ success: true })
    
    // Clear the auth cookie on the response
    response.cookies.delete("auth_token")
    
    // If we have a valid user, log the logout
    if (authResult.success && authResult.user) {
      // Log audit entry
      // @ts-ignore - The auditLog model exists in the database schema but TypeScript doesn't recognize it
      await prisma.auditLog.create({
        data: {
          action: "auth.logout",
          entityType: "User",
          entityId: authResult.user.id,
          performedBy: { connect: { id: authResult.user.id } },
          details: JSON.stringify({ email: authResult.user.email }),
          ipAddress: request.headers.get("x-forwarded-for") || "unknown",
          userAgent: request.headers.get("user-agent") || "unknown",
        },
      })
    }

    return response
  } catch (error) {
    console.error("Logout error:", error)
    
    // Still clear the cookie even if there's an error
    const errorResponse = NextResponse.json({ error: "Logout failed" }, { status: 500 })
    
    // Clear the auth cookie on the error response
    errorResponse.cookies.delete("auth_token")
    
    return errorResponse
  }
}
