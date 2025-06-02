import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    const attachments = await prisma.attachment.findMany({
      where: {
        partnershipId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(attachments)
  } catch (error) {
    console.error("Error fetching attachments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Verify partnership exists
    const partnership = await prisma.partnership.findUnique({
      where: { id },
    })

    if (!partnership) {
      return NextResponse.json({ error: "Partnership not found" }, { status: 404 })
    }

    // In a real implementation, you would upload the file to a storage service
    // For now, we'll just store the metadata
    const attachment = await prisma.attachment.create({
      data: {
        filename: file.name,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: `/uploads/${file.name}`, // This would be the actual URL after upload
        partnershipId: id,
      },
    })

    return NextResponse.json(attachment, { status: 201 })
  } catch (error) {
    console.error("Error creating attachment:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
