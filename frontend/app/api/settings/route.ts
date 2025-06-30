import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { z } from "zod"
import { verifyAuth } from "@/lib/auth"

const prisma = new PrismaClient()

// Settings schema
const settingsSchema = z.object({
  key: z.string().min(1, "Key is required"),
  value: z.string().min(1, "Value is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
})

// GET handler - List all settings
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and authorization
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Parse query parameters
    const url = new URL(request.url)
    const category = url.searchParams.get("category") || undefined

    // Build filter conditions
    const where: any = {}
    if (category) where.category = category

    // Query settings
    const settings = await prisma.settings.findMany({
      where,
      orderBy: [
        { category: "asc" },
        { key: "asc" },
      ],
    })

    // Group settings by category
    const groupedSettings = settings.reduce((acc: any, setting) => {
      if (!acc[setting.category]) {
        acc[setting.category] = []
      }
      acc[setting.category].push(setting)
      return acc
    }, {})

    // Log audit entry
    await prisma.auditLog.create({
      data: {
        action: "settings.list",
        entityType: "Settings",
        entityId: "multiple",
        performedBy: { connect: { id: authResult.user.id } },
        details: JSON.stringify({ category }),
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    })

    return NextResponse.json({
      settings: groupedSettings,
    })
  } catch (error) {
    console.error("Error fetching settings:", error)
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

// POST handler - Create a new setting
export async function POST(request: NextRequest) {
  try {
    // Verify authentication and authorization
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Only admins can create settings
    if (!["ADMIN", "SUPER_ADMIN"].includes(authResult.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Parse and validate request body
    const body = await request.json()
    const validation = settingsSchema.safeParse(body)
    
    if (!validation.success) {
      return NextResponse.json({ error: validation.error.errors }, { status: 400 })
    }
    
    const { key, value, description, category } = validation.data

    // Check if setting with the same key already exists
    const existingSetting = await prisma.settings.findUnique({
      where: { key },
    })

    if (existingSetting) {
      return NextResponse.json({ error: "Setting with this key already exists" }, { status: 409 })
    }

    // Create the new setting
    const newSetting = await prisma.settings.create({
      data: {
        key,
        value,
        description,
        category,
      },
    })

    // Log audit entry
    await prisma.auditLog.create({
      data: {
        action: "settings.create",
        entityType: "Settings",
        entityId: newSetting.id,
        performedBy: { connect: { id: authResult.user.id } },
        details: JSON.stringify({
          key: newSetting.key,
          category: newSetting.category,
          description: newSetting.description,
        }),
        ipAddress: request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      },
    })

    return NextResponse.json(newSetting, { status: 201 })
  } catch (error) {
    console.error("Error creating setting:", error)
    return NextResponse.json({ error: "Failed to create setting" }, { status: 500 })
  }
}
