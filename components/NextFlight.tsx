"use client";

import { Flight } from "../types";
import { Plane, Clock } from "lucide-react";

function daysUntil(dateStr: string): number {
  const today = new Date(); today.setHours(0,0,0,0);
  const d = new Date(dateStr + "T00:00:00");
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

function fmtDate(d: string): string {
  const [y, m, day] = d.split("-");
  const months = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצ"];
  return `${+day} ${months[+m - 1]}`;
}

export default function NextFlight({ flights }: { flights: Flight[] }) {
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = flights
    .filter((f) => f.date >= today)
    .sort((a, b) => (a.date + a.depart).localeCompare(b.date + b.depart));
  if (upcoming.length === 0) return null;
  const f = upcoming[0];
  const days = daysUntil(f.date);
  const dayLabel = days === 0 ? "היום!" : days === 1 ? "מחר" : `בעוד ${days} ימים`;
  return (
    <div className="card p-4 flex items-center gap-3 bg-gradient-to-r from-thai-orange/10 to-thai-teal/10 border-thai-orange/30 animate-fade-up">
      <div className="w-10 h-10 rounded-full bg-thai-orange flex items-center justify-center text-white shrink-0">
        <Plane size={20} />
      </div>
      <div className="flex-1">
        <div className="font-bold text-thai-deep">
          הטיסה הבאה: {f.airline} {f.flightNo}
        </div>
        <div className="text-sm text-gray-600">
          {f.from} → {f.to} · {fmtDate(f.date)} {f.depart}
        </div>
      </div>
      <div className="text-center">
        <div className="text-xl font-extrabold text-thai-orange">{dayLabel}</div>
        <div className="text-xs text-gray-500 flex items-center gap-1 justify-center"><Clock size={10} /> לטיסה</div>
      </div>
    </div>
  );
}
