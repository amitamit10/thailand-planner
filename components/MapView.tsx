"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin } from "lucide-react";

type Poi = { name: string; lat: number; lon: number };

export default function MapView({ pois }: { pois: Poi[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!ref.current || pois.length === 0) return;
    let map: any;
    let cancelled = false;
    (async () => {
      try {
        const L = (await import("leaflet")).default;
        await import("leaflet/dist/leaflet.css");
        if (cancelled || !ref.current) return;
        map = L.map(ref.current).setView([pois[0].lat, pois[0].lon], 6);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap",
        }).addTo(map);
        pois.forEach((p) => {
          L.marker([p.lat, p.lon]).addTo(map).bindPopup(p.name);
        });
        setReady(true);
      } catch {
        setError(true);
      }
    })();
    return () => {
      cancelled = true;
      if (map) map.remove();
    };
  }, [pois]);

  if (pois.length === 0)
    return <p className="text-sm text-gray-500">הוסף מלונות או אתרים כדי לראות מפה</p>;
  if (error) return <p>שגיאה בטעינת המפה</p>;
  return (
    <div>
      <div ref={ref} className="w-full h-80 rounded-xl" style={{ minHeight: 320 }} />
      {!ready && <p className="text-sm text-gray-500 mt-2">טוען מפה…</p>}
    </div>
  );
}
