import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { hash } from "bcrypt"
import { z } from "zod"
import { verifyAuth } from "@/lib/auth"

const prisma = new PrismaClient()

// User update schema
const userUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(8, "Password must be at least 8 characters").optional(),
  role: z.enum(["USER", "REVIEWER", "ADMIN", "SUPER_ADMIN"]).optional(),
  active: z.boolean().optional(),
})

// GET handler - Get a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and authorization
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Check if user has admin or super_admin role, or is requesting their own record
    const isSelfRequest = authResult.user.id === params.id
    if (!["ADMIN", "SUPER_ADMIN"].includes(authResult.user.role) && !isSelfRequest) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        updatedAt: true,
        lastLogin: true,
        // Exclude password
      },
    })

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Log audit entry
    await prisma.auditLog.create({
      data: {
        action: "user.view",
        entityType: "User",
        entityId: user.id,
        performedBy: { connect: { id: authResult.user.id } },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
  }
}

// PUT handler - Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and authorization
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Check if user has admin or super_admin role, or is updating their own record
    // Note: Users can update their own basic info but not their role
    const isSelfUpdate = authResult.user.id === params.id
    if (!["ADMIN", "SUPER_ADMIN"].includes(authResult.user.role) && !isSelfUpdate) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = userUpdateSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 })
    }
    
    const updateData = { ...validation.data }

    // If it's a self-update and not an admin, restrict fields that can be updated
    if (isSelfUpdate && !["ADMIN", "SUPER_ADMIN"].includes(authResult.user.role)) {
      // Only allow name and password updates for non-admin self-updates
      delete updateData.role
      delete updateData.active
      delete updateData.email // Require email change to go through verification
    }

    // Special handling for SUPER_ADMIN role
    if (updateData.role === "SUPER_ADMIN" && authResult.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ 
        error: "Only SUPER_ADMIN users can assign the SUPER_ADMIN role" 
      }, { status: 403 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // If email is being updated, check if it's already in use
    if (updateData.email && updateData.email !== existingUser.email) {
      const emailExists = await prisma.user.findUnique({
        where: { email: updateData.email },
      })

      if (emailExists) {
        return NextResponse.json({ error: "Email already in use" }, { status: 409 })
      }
    }

    // If password is being updated, hash it
    if (updateData.password) {
      updateData.password = await hash(updateData.password, 12)
    }

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        updatedAt: true,
        // Exclude password
      },
    })

    // Log audit entry
    await prisma.auditLog.create({
      data: {
        action: "user.update",
        entityType: "User",
        entityId: updatedUser.id,
        performedBy: { connect: { id: authResult.user.id } },
        details: JSON.stringify({
          updated: Object.keys(updateData).filter(k => k !== 'password'),
          previousRole: existingUser.role,
          newRole: updatedUser.role,
          previousActive: existingUser.active,
          newActive: updatedUser.active,
        }),
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json({ error: "Failed to update user" }, { status: 500 })
  }
}

// DELETE handler - Deactivate a user (soft delete)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication and authorization
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Only admins can deactivate users
    if (!["ADMIN", "SUPER_ADMIN"].includes(authResult.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Prevent deactivating your own account
    if (authResult.user.id === params.id) {
      return NextResponse.json({ 
        error: "You cannot deactivate your own account" 
      }, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: params.id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Prevent deactivating the last SUPER_ADMIN
    if (existingUser.role === "SUPER_ADMIN") {
      const superAdminCount = await prisma.user.count({
        where: { 
          role: "SUPER_ADMIN",
          active: true
        }
      })
      
      if (superAdminCount <= 1) {
        return NextResponse.json({ 
          error: "Cannot deactivate the last super admin account" 
        }, { status: 400 })
      }
    }

    // Soft delete by setting active to false
    const deactivatedUser = await prisma.user.update({
      where: { id: params.id },
      data: { active: false },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
      },
    })

    // Log audit entry
    await prisma.auditLog.create({
      data: {
        action: "user.deactivate",
        entityType: "User",
        entityId: deactivatedUser.id,
        performedBy: { connect: { id: authResult.user.id } },
        details: JSON.stringify({
          deactivatedUser: {
            name: deactivatedUser.name,
            email: deactivatedUser.email,
            role: deactivatedUser.role
          }
        }),
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    })

    return NextResponse.json({ 
      message: "User deactivated successfully",
      user: deactivatedUser
    })
  } catch (error) {
    console.error("Error deactivating user:", error)
    return NextResponse.json({ error: "Failed to deactivate user" }, { status: 500 })
  }
}
