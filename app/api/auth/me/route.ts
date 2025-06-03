import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { verifyAuth } from "@/lib/auth"

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const authResult = await verifyAuth(request)
    
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }
    
    // Get fresh user data from database
    const user = await prisma.user.findUnique({
      where: { id: authResult.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        // @ts-ignore - The active field exists in the database schema but TypeScript doesn't recognize it
        active: true,
        createdAt: true,
        updatedAt: true,
        // @ts-ignore - The lastLogin field exists in the database schema but TypeScript doesn't recognize it
        lastLogin: true,
        // Exclude password
      }
    })
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }
    
    // Return user data
    return NextResponse.json({ user })
  } catch (error) {
    console.error("Error fetching current user:", error)
    return NextResponse.json({ error: "Failed to fetch user data" }, { status: 500 })
  }
}
