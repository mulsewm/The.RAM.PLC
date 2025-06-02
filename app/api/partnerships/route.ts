import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { companyName, email, phone, message } = body

    // Validate required fields
    if (!companyName || !email) {
      return NextResponse.json({ error: "Company name and email are required" }, { status: 400 })
    }

    // Insert into database
    const result = await sql`
      INSERT INTO partnerships (company_name, email, phone, message)
      VALUES (${companyName}, ${email}, ${phone || null}, ${message || null})
      RETURNING id, company_name, email, phone, message, created_at
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating partnership:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const partnerships = await sql`
      SELECT id, company_name, email, phone, message, created_at, updated_at
      FROM partnerships
      ORDER BY created_at DESC
    `

    return NextResponse.json(partnerships)
  } catch (error) {
    console.error("Error fetching partnerships:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
