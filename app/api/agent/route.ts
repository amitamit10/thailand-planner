import { NextRequest, NextResponse } from "next/server";
import { Flight, Hotel, Activity } from "../../../types";

/**
 * Agent ingestion endpoint.
 * Accepts plain text (e.g. pasted from a screenshot OCR, or a forwarded message)
 * and extracts structured flights / hotels / activities using heuristics.
 * No LLM key required — regex + common patterns. The Mom agent can POST here.
 */

function parseFlights(text: string): Flight[] {
  const out: Flight[] = [];
  // Pattern: airline + flight no, e.g. "Thai Airways TG 112" or "TG 112"
  const re = /(Thai Airways|Thai AirAsia|El Al|Emirates|Qatar Airways|Singapore Airlines|אל-על|תאי אייר|תאי אייר אסיה|קטר|אמירטס|סינגפור)?\s*(TG|EK|FY|QR|BA|LH|SQ|OS|W5|PC|IX|AI|UK|6E|FD|SL)\s*[-]?\s*(\d{1,4})/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const airlineKeyword = m[1]?.trim();
    const flightNo = `${m[2]} ${m[3]}`;
    const ctx = text.slice(Math.max(0, m.index - 200), m.index + 400);
    const dateM = ctx.match(/(\d{1,2}[./-]\d{1,2}[./-]\d{2,4})|(\d{4}-\d{2}-\d{2})/);
    const timeM = ctx.match(/(\d{1,2}:\d{2})/);
    // Hebrew: "מסידני לבנקוק" or English "from Sydney to Bangkok"
    const routeM = ctx.match(/(?:מ|מ:|ממוצא|from)[: ]*([A-Za-z\u05d0-\u05ea ()-]{2,20})?\s*(?:ל|אל|יעד|to)[: ]*([A-Za-z\u05d0-\u05ea ()-]{2,20})/i);
    let from = "";
    let to = "";
    if (routeM) {
      from = (routeM[1] || "").trim();
      to = (routeM[2] || "").trim();
    }
    out.push({
      id: crypto.randomUUID(),
      airline: airlineKeyword || (m[1] ? m[1].trim() : "טיסה"),
      flightNo,
      from,
      to,
      date: dateM ? dateM[0].replace(/[./-]/g, "-") : "",
      depart: timeM ? timeM[1] : "",
      arrive: "",
      status: "planned",
      passengers: [],
    });
  }
  return out;
}

function parseHotels(text: string): Hotel[] {
  const out: Hotel[] = [];
  // "Hotel Name, City" or lines with מלון
  const lines = text.split(/\n+/);
  for (const line of lines) {
    const m = line.match(/([A-Za-z\u05d0-\u05ea0-9 .'-]{3,40})[,،]\s*([A-Za-z\u05d0-\u05ea ]{2,25})/);
    if (m && /מלון|hotel|resort|בית|villa/i.test(line)) {
      out.push({ id: crypto.randomUUID(), name: m[1].trim(), city: m[2].trim(), checkIn: "", checkOut: "" });
    }
  }
  return out;
}

function parseActivities(text: string): Activity[] {
  const out: Activity[] = [];
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  for (const line of lines) {
    if (line.length < 3) continue;
    const dateM = line.match(/(\d{4}-\d{2}-\d{2}|\d{1,2}[./-]\d{1,2})/);
    out.push({ id: crypto.randomUUID(), date: dateM ? dateM[0].replace(/[./-]/g, "-") : "", title: line.slice(0, 80) });
  }
  return out.slice(0, 30);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.text) return NextResponse.json({ error: "text required" }, { status: 400 });
  const text: string = body.text;
  const mode: string = body.mode || "all";

  const result: { flights?: Flight[]; hotels?: Hotel[]; activities?: Activity[] } = {};
  if (mode === "all" || mode === "flights") result.flights = parseFlights(text);
  if (mode === "all" || mode === "hotels") result.hotels = parseHotels(text);
  if (mode === "all" || mode === "activities") result.activities = parseActivities(text);

  return NextResponse.json({
    extracted: result,
    counts: {
      flights: result.flights?.length ?? 0,
      hotels: result.hotels?.length ?? 0,
      activities: result.activities?.length ?? 0,
    },
  });
}
