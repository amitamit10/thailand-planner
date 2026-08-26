import { NextRequest, NextResponse } from "next/server";

// Nominatim (OpenStreetMap) geocoding — free, no key.
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  if (!q) return NextResponse.json({ error: "q required" }, { status: 400 });
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(
      q
    )}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "ThailandPlanner/1.0" },
    });
    if (!res.ok) throw new Error("geo");
    const data = await res.json();
    if (!data.length) return NextResponse.json({ error: "not found" }, { status: 404 });
    return NextResponse.json(
      { lat: data[0].lat, lon: data[0].lon, display: data[0].display_name },
      { headers: { "Cache-Control": "public, s-maxage=86400" } }
    );
  } catch {
    return NextResponse.json({ error: "geo failed" }, { status: 502 });
  }
}
