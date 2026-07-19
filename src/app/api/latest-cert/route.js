import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { rows } = await sql`SELECT * FROM certificates ORDER BY created_at DESC LIMIT 1`;
    return NextResponse.json(rows[0] || { message: "No certificates found" });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
