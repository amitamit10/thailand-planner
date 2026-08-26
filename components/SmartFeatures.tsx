"use client";

import { Flight, Activity } from "../types";
import { CheckSquare, Cloud, AlertTriangle, Sun, Umbrella, CloudRain } from "lucide-react";
import { useState } from "react";

export function PreFlightChecklist({ flights }: { flights: Flight[] }) {
  const next = flights.filter((f) => f.date >= new Date().toISOString().slice(0, 10)).sort((a, b) => (a.date + a.depart).localeCompare(b.date + b.depart))[0];
  const [done, setDone] = useState<Record<string, boolean>>({});
  if (!next) return null;
  const items = [
    { id: "passport", label: "בדקי דרכון בתוקף" },
    { id: "barcode", label: "הדפסת ברקוד/QR של הטיסה" },
    { id: "time", label: `בדקת שעת יציאה (${next.depart})` },
    { id: "pnr", label: next.pnr ? `שמרת PNR: ${next.pnr}` : "השגת מס׳ הזמנה (PNR)" },
    { id: "luggage", label: "אריזת מזוודה" },
  ];
  return (
    <div className="card p-4">
      <h3 className="font-bold text-thai-deep mb-2 flex items-center gap-2">
        <CheckSquare size={16} className="text-thai-orange" /> לפני הטיסה {next.flightNo}
      </h3>
      <div className="space-y-1">
        {items.map((it) => (
          <label key={it.id} className="flex items-center gap-2 text-sm cursor-pointer">
            <input type="checkbox" checked={!!done[it.id]} onChange={(e) => setDone({ ...done, [it.id]: e.target.checked })} className="accent-thai-orange" />
            <span className={done[it.id] ? "line-through text-gray-400" : ""}>{it.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export function WeatherTips({ cities }: { cities: string[] }) {
  if (cities.length === 0) return null;
  return (
    <div className="card p-4 bg-blue-50 border-blue-100 md:col-span-3">
      <h3 className="font-bold text-thai-deep mb-2 flex items-center gap-2">
        <Cloud size={16} className="text-blue-500" /> טיפים לפי מזג אוויר
      </h3>
      <ul className="space-y-1 text-sm">
        {cities.map((c, i) => (
          <li key={i} className="flex items-center gap-2"><Umbrella size={13} className="text-blue-400" /> בתאילנד בדרך כלל חם ולח — קחי בגדים דקים, קרם הגנה ומטריה לגשם אחר הצהריים</li>
        ))}
      </ul>
    </div>
  );
}

export function ConflictDetector({ flights, activities }: { flights: Flight[]; activities: Activity[] }) {
  const conflicts: string[] = [];
  // same date+time activities
  const byDay: Record<string, Activity[]> = {};
  activities.forEach((a) => { if (!byDay[a.date]) byDay[a.date] = []; byDay[a.date].push(a); });
  Object.entries(byDay).forEach(([d, list]) => {
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        if (list[i].time && list[j].time && list[i].time === list[j].time) {
          conflicts.push(`${d}: "${list[i].title}" ו-"${list[j].title}" באותה שעה (${list[i].time})`);
        }
      }
    }
  });
  if (conflicts.length === 0) return null;
  return (
    <div className="card p-4 bg-red-50 border-red-100">
      <h3 className="font-bold text-red-700 mb-2 flex items-center gap-2">
        <AlertTriangle size={16} /> התנגשויות בתוכנית
      </h3>
      <ul className="space-y-1 text-sm text-red-700">
        {conflicts.map((c, i) => <li key={i} className="flex items-center gap-1.5"><AlertTriangle size={13} className="text-amber-500 shrink-0" /> {c}</li>)}
      </ul>
    </div>
  );
}
