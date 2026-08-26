"use client";

import { Plane, Bed, Sparkles, MapPin, CalendarDays } from "lucide-react";

export default function TripStats({ flights, hotels, activities }: { flights: any[]; hotels: any[]; activities: any[] }) {
  const cities = new Set([...hotels.map((h) => h.city), ...activities.map((a) => a.location).filter(Boolean)]);
  const dates = [...flights.map((f) => f.date), ...hotels.map((h) => h.checkIn), ...activities.map((a) => a.date)].filter(Boolean).sort();
  const days = dates.length > 1 ? Math.ceil((new Date(dates[dates.length - 1]).getTime() - new Date(dates[0]).getTime()) / 86400000) + 1 : 1;

  const stats = [
    { icon: CalendarDays, label: "ימים", value: days, color: "text-thai-orange" },
    { icon: Plane, label: "טיסות", value: flights.length, color: "text-blue-600" },
    { icon: Bed, label: "מלונות", value: hotels.length, color: "text-thai-teal" },
    { icon: Sparkles, label: "פעילויות", value: activities.length, color: "text-purple-600" },
    { icon: MapPin, label: "ערים", value: cities.size, color: "text-red-600" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 mb-4">
      {stats.map((s, i) => {
        const Icon = s.icon;
        return (
          <div key={i} className="card p-3 text-center flex flex-col items-center">
            <Icon size={20} className={s.color} />
            <div className={`text-2xl font-extrabold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500">{s.label}</div>
          </div>
        );
      })}
    </div>
  );
}
