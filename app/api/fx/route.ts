import { NextRequest, NextResponse } from "next/server";

// frankfurter.app — free, no key. ILS -> THB.
export async function GET(req: NextRequest) {
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=ILS&to=THB");
    if (!res.ok) throw new Error("fx");
    const data = await res.json();
    return NextResponse.json(
      { rate: data.rates?.THB ?? null },
      { headers: { "Cache-Control": "public, s-maxage: 3600" } }
    );
  } catch {
    return NextResponse.json({ rate: null });
  }
}
