import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from "@prisma/client"
import { verifyAuth } from "@/lib/auth"

const prisma = new PrismaClient()

// GET handler - List audit logs with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    // Verify authentication and authorization
    const authResult = await verifyAuth(request)
    if (!authResult.success) {
      return NextResponse.json({ error: authResult.error }, { status: 401 })
    }

    // Only admins can view audit logs
    if (!["ADMIN", "SUPER_ADMIN"].includes(authResult.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    // Parse query parameters
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get("page") || "1")
    const limit = parseInt(url.searchParams.get("limit") || "20")
    const action = url.searchParams.get("action") || undefined
    const entityType = url.searchParams.get("entityType") || undefined
    const entityId = url.searchParams.get("entityId") || undefined
    const userId = url.searchParams.get("userId") || undefined
    const startDate = url.searchParams.get("startDate") || undefined
    const endDate = url.searchParams.get("endDate") || undefined

    // Validate pagination parameters
    if (isNaN(page) || page < 1) {
      return NextResponse.json({ error: "Invalid page parameter" }, { status: 400 })
    }
    if (isNaN(limit) || limit < 1 || limit > 100) {
      return NextResponse.json({ error: "Invalid limit parameter" }, { status: 400 })
    }

    // Build filter conditions
    const where: any = {}
    if (action) where.action = action
    if (entityType) where.entityType = entityType
    if (entityId) where.entityId = entityId
    if (userId) where.performedById = userId

    // Date filtering
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    // Count total matching records
    // @ts-ignore - The auditLog model exists in the database schema but TypeScript doesn't recognize it
    const total = await prisma.auditLog.count({ where })

    // Calculate pagination values
    const skip = (page - 1) * limit
    const pages = Math.ceil(total / limit)

    // Query audit logs with pagination
    // @ts-ignore - The auditLog model exists in the database schema but TypeScript doesn't recognize it
    const auditLogs = await prisma.auditLog.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      include: {
        performedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      auditLogs,
      pagination: {
        total,
        page,
        limit,
        pages,
      },
    })
  } catch (error) {
    console.error("Error fetching audit logs:", error)
    return NextResponse.json({ error: "Failed to fetch audit logs" }, { status: 500 })
  }
}
