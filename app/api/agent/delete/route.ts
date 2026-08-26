import { NextRequest, NextResponse } from "next/server";
import { loadData, saveData, TripData } from "../../../../lib/db";

/**
 * Delete endpoint for the Mom agent.
 * Body: { "kind": "flights"|"hotels"|"activities", "match": { "flightNo":"TG 112" } }
 * or  { "kind":..., "id": "uuid" }
 * Removes matching items, saves, returns remaining count.
 */

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !body.kind) return NextResponse.json({ error: "kind required" }, { status: 400 });
  const kind = body.kind as "flights" | "hotels" | "activities";
  if (!["flights", "hotels", "activities"].includes(kind))
    return NextResponse.json({ error: "invalid kind" }, { status: 400 });

  const current: TripData = await loadData();
  const list = (current[kind] as any[]) || [];

  let remaining: any[];
  if (body.id) {
    remaining = list.filter((x) => x.id !== body.id);
  } else if (body.match) {
    remaining = list.filter((x) => {
      return !Object.entries(body.match).every(([k, v]) => {
        const xv = (x[k] || "").toString().toLowerCase();
        const mv = (v || "").toString().toLowerCase();
        return xv.includes(mv);
      });
    });
  } else {
    return NextResponse.json({ error: "id or match required" }, { status: 400 });
  }

  (current as any)[kind] = remaining;
  const ok = await saveData(current);
  return NextResponse.json({ ok, removed: list.length - remaining.length, remaining: remaining.length });
}
