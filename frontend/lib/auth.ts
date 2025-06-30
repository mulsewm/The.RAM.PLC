import { NextRequest } from "next/server"
import { PrismaClient } from "@prisma/client"
import { verify } from "jsonwebtoken"
import { cookies } from "next/headers"

const prisma = new PrismaClient()
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

interface JwtPayload {
  id: string
  email: string
  role: string
  iat: number
  exp: number
}

interface AuthResult {
  success: boolean
  user?: any
  error?: string
}

/**
 * Verify authentication from the request
 * Checks for JWT token in cookies or Authorization header
 */
export async function verifyAuth(request: NextRequest): Promise<AuthResult> {
  try {
    // Try to get token from cookies first
    let token = null;
    
    // Get token from request cookies (for API routes)
    const authCookie = request.cookies.get("auth_token");
    if (authCookie) {
      token = authCookie.value;
    }
    
    // If not in request cookies, try Authorization header
    if (!token) {
      const authHeader = request.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
      return { success: false, error: "Authentication required" }
    }
    
    // Verify the token
    const decoded = verify(token, JWT_SECRET) as JwtPayload
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        // Include any related data needed
      }
    })
    
    if (!user) {
      return { success: false, error: "User not found" }
    }
    
    // Check if user is active (assuming the active field exists in the database)
    // @ts-ignore - The active field exists in the database schema but TypeScript doesn't recognize it
    if (user && user.active === false) {
      return { success: false, error: "User account is inactive" }
    }
    
    // Update last login time
    // @ts-ignore - The lastLogin field exists in the database schema but TypeScript doesn't recognize it
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() }
    })
    
    return { success: true, user }
  } catch (error) {
    console.error("Authentication error:", error)
    return { success: false, error: "Invalid or expired token" }
  }
}

/**
 * Check if user has required role
 */
export function hasRole(user: any, requiredRoles: string[]): boolean {
  return requiredRoles.includes(user.role)
}

/**
 * Generate a hash for password reset
 */
export function generateResetToken(userId: string): string {
  // In a real implementation, use a secure random token generator
  return Buffer.from(`${userId}-${Date.now()}-${Math.random()}`).toString('base64')
}
