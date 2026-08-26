import { NextRequest, NextResponse } from "next/server";

// Open-Meteo — free, no key. Returns current + 7-day forecast for lat/lon.
export async function GET(req: NextRequest) {
  const lat = req.nextUrl.searchParams.get("lat");
  const lon = req.nextUrl.searchParams.get("lon");
  if (!lat || !lon)
    return NextResponse.json({ error: "lat/lon required" }, { status: 400 });
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=7`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("meteo");
    const data = await res.json();
    return NextResponse.json(data, {
      headers: { "Cache-Control": "public, s-maxage=3600" },
    });
  } catch {
    return NextResponse.json({ error: "weather failed" }, { status: 502 });
  }
}
