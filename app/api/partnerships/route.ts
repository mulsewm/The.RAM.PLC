import { type NextRequest, NextResponse } from "next/server"
import { createPartnership, getPartnerships } from "@/lib/database"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fullName, email, company, phone, message } = body

    if (!fullName || !email || !company) {
      return NextResponse.json({ error: "Full name, email, and company are required" }, { status: 400 })
    }

    const partnership = await createPartnership({
      companyName: `${company} (${fullName})`,
      email,
      phone,
      message,
    })

    return NextResponse.json(
      {
        success: true,
        message: "Partnership request submitted successfully!",
        id: partnership.id,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating partnership:", error)
    return NextResponse.json({ error: "Failed to submit partnership request" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const partnerships = await getPartnerships()
    return NextResponse.json(partnerships)
  } catch (error) {
    console.error("Error fetching partnerships:", error)
    return NextResponse.json({ error: "Failed to fetch partnerships" }, { status: 500 })
  }
}
