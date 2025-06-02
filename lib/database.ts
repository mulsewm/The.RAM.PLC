import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export interface Partnership {
  id: string
  company_name: string
  email: string
  phone?: string
  message?: string
  created_at: string
  updated_at: string
}

export async function createPartnership(data: {
  companyName: string
  email: string
  phone?: string
  message?: string
}) {
  const result = await sql`
    INSERT INTO partnerships (company_name, email, phone, message)
    VALUES (${data.companyName}, ${data.email}, ${data.phone || null}, ${data.message || null})
    RETURNING *
  `
  return result[0] as Partnership
}

export async function getPartnerships() {
  const result = await sql`
    SELECT * FROM partnerships
    ORDER BY created_at DESC
  `
  return result as Partnership[]
}

export async function getPartnershipById(id: string) {
  const result = await sql`
    SELECT * FROM partnerships
    WHERE id = ${id}
  `
  return result[0] as Partnership | undefined
}
