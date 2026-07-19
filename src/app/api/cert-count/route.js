import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { rows } = await sql`SELECT COUNT(*)::int as count FROM certificates`;
    return NextResponse.json({ count: rows[0]?.count || 0 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
