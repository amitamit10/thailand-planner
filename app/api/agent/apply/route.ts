import { NextRequest, NextResponse } from "next/server";
import { loadData, saveData, TripData } from "../../../../lib/db";

/**
 * Smart-merge endpoint for the Mom agent.
 * Accepts structured arrays (flights/hotels/activities) and merges them into
 * the existing data, DEDUPING by natural keys so re-sending an update to an
 * existing item UPDATES it instead of creating a duplicate.
 *
 * Natural keys:
 *   flight:  airline + flightNo  (or pnr)
 *   hotel:   name + city
 *   activity: title + date
 *
 * The agent can POST partial objects; missing fields are preserved from the
 * existing record. A new id is assigned only when the item is genuinely new.
 */

function keyOf(kind: string, item: any): string {
  if (kind === "flights") return `${(item.airline || "").toLowerCase()}|${(item.flightNo || "").toLowerCase()}|${(item.pnr || "").toLowerCase()}`;
  if (kind === "hotels") return `${(item.name || "").toLowerCase()}|${(item.city || "").toLowerCase()}`;
  if (kind === "activities") return `${(item.title || "").toLowerCase()}|${(item.date || "").toLowerCase()}`;
  return Math.random().toString(36);
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "body required" }, { status: 400 });

  const current: TripData = await loadData();
  const changes: { flights: number; hotels: number; activities: number } = { flights: 0, hotels: 0, activities: 0 };

  (["flights", "hotels", "activities"] as const).forEach((kind) => {
    const incoming = (body[kind] as any[]) || [];
    if (!Array.isArray(incoming) || incoming.length === 0) return;
    const existing = (current[kind] as any[]) || [];
    const byKey = new Map(existing.map((e) => [keyOf(kind, e), e]));

    for (const item of incoming) {
      const k = keyOf(kind, item);
      const prev = byKey.get(k);
      if (prev) {
        // UPDATE: merge, keep id + existing fields not overridden
        const merged = { ...prev, ...item, id: prev.id };
        byKey.set(k, merged);
        changes[kind]++;
      } else {
        // NEW
        const fresh = { ...item, id: item.id || crypto.randomUUID() };
        byKey.set(k, fresh);
        changes[kind]++;
      }
    }
    (current as any)[kind] = Array.from(byKey.values());
  });

  const ok = await saveData(current);
  return NextResponse.json({ ok, changes, saved: current });
}
