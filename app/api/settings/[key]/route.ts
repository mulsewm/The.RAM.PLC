import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import { verifyAuth } from "@/lib/auth"

const prisma = new PrismaClient()

// Settings update schema
const settingsUpdateSchema = z.object({
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
  category: z.string().optional(),
})

// GET handler - Get a specific setting
export async function GET(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    // Verify authentication and authorization
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Get setting from database
    const setting = await prisma.settings.findUnique({
      where: { key: params.key },
    })

    if (!setting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 })
    }

    // Log audit entry
    await prisma.auditLog.create({
      data: {
        action: "settings.view",
        entityType: "Settings",
        entityId: setting.id,
        performedBy: { connect: { id: authResult.user.id } },
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    })

    return NextResponse.json(setting)
  } catch (error) {
    console.error("Error fetching setting:", error)
    return NextResponse.json({ error: "Failed to fetch setting" }, { status: 500 })
  }
}

// PUT handler - Update a setting
export async function PUT(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    // Verify authentication and authorization
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Only admins can update settings
    if (!["ADMIN", "SUPER_ADMIN"].includes(authResult.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = settingsUpdateSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 })
    }
    
    const updateData = validation.data

    // Check if setting exists
    const existingSetting = await prisma.settings.findUnique({
      where: { key: params.key },
    })

    if (!existingSetting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 })
    }

    // Create a settings change record
    await prisma.settingsChange.create({
      data: {
        setting: { connect: { id: existingSetting.id } },
        previousValue: existingSetting.value,
        newValue: updateData.value,
        changedBy: { connect: { id: authResult.user.id } },
      },
    })

    // Update the setting
    const updatedSetting = await prisma.settings.update({
      where: { key: params.key },
      data: updateData,
    })

    // Log audit entry
    await prisma.auditLog.create({
      data: {
        action: "settings.update",
        entityType: "Settings",
        entityId: updatedSetting.id,
        performedBy: { connect: { id: authResult.user.id } },
        details: JSON.stringify({
          key: params.key,
          previousValue: existingSetting.value,
          newValue: updatedSetting.value,
          category: updatedSetting.category,
        }),
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    })

    return NextResponse.json(updatedSetting)
  } catch (error) {
    console.error("Error updating setting:", error)
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 })
  }
}

// DELETE handler - Delete a setting
export async function DELETE(
  request: NextRequest,
  { params }: { params: { key: string } }
) {
  try {
    // Verify authentication and authorization
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Only super admins can delete settings
    if (authResult.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Check if setting exists
    const existingSetting = await prisma.settings.findUnique({
      where: { key: params.key },
    })

    if (!existingSetting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 })
    }

    // Delete the setting
    await prisma.settings.delete({
      where: { key: params.key },
    })

    // Log audit entry
    await prisma.auditLog.create({
      data: {
        action: "settings.delete",
        entityType: "Settings",
        entityId: existingSetting.id,
        performedBy: { connect: { id: authResult.user.id } },
        details: JSON.stringify({
          key: params.key,
          category: existingSetting.category,
          value: existingSetting.value,
        }),
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    })

    return NextResponse.json({ 
      message: "Setting deleted successfully" 
    })
  } catch (error) {
    console.error("Error deleting setting:", error)
    return NextResponse.json({ error: "Failed to delete setting" }, { status: 500 })
  }
}
