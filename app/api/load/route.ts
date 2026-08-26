import { NextRequest, NextResponse } from "next/server";
import { loadData } from "../../../lib/db";

export async function GET() {
  const data = await loadData();
  return NextResponse.json(data, {
    headers: { "Cache-Control": "no-store" },
  });
}
