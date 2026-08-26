"use client";

import { useEffect, useState } from "react";
import MapView from "./MapView";
import { Hotel } from "../types";

export default function MapViewTab({ hotels }: { hotels: Hotel[] }) {
  const [pois, setPois] = useState<{ name: string; lat: number; lon: number }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hotels.length === 0) {
      setPois([]);
      return;
    }
    setLoading(true);
    (async () => {
      const out: { name: string; lat: number; lon: number }[] = [];
      for (const h of hotels) {
        try {
          const g = await fetch(`/api/geo?q=${encodeURIComponent(h.city + " Thailand")}`).then((r) => r.json());
          if (g.lat) out.push({ name: `${h.name} (${h.city})`, lat: parseFloat(g.lat), lon: parseFloat(g.lon) });
        } catch {}
      }
      setPois(out);
      setLoading(false);
    })();
  }, [hotels]);

  if (hotels.length === 0) return <p className="text-sm text-gray-500">הוסף מלונות כדי לראות מפה</p>;
  if (loading) return <p className="text-sm text-gray-500">ממייק מיקומים…</p>;
  if (pois.length === 0) return <p className="text-sm text-gray-500">לא נמצאו מיקומים</p>;
  return <MapView pois={pois} />;
}
