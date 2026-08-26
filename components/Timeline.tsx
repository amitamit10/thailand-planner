"use client";

import { TimelineItem } from "../types";
import { Plane, Bed, Sparkles, Calendar, Clock } from "lucide-react";

const ICONS: Record<string, any> = { flight: Plane, hotel: Bed, activity: Sparkles };
const COLORS: Record<string, string> = {
  flight: "bg-thai-orange",
  hotel: "bg-thai-teal",
  activity: "bg-thai-gold",
};

function fmtDate(d: string): string {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  if (!y || !m || !day) return d;
  const months = ["ינו", "פבר", "מרץ", "אפר", "מאי", "יונ", "יול", "אוג", "ספט", "אוק", "נוב", "דצ"];
  return `${+day} ${months[+m - 1]} ${y}`;
}

export default function Timeline({ items }: { items: TimelineItem[] }) {
  const sorted = [...items].sort((a, b) =>
    (a.date + (a.time || "")).localeCompare(b.date + (b.time || ""))
  );

  let lastDate = "";
  return (
    <div className="flex flex-col gap-0">
      {sorted.map((it) => {
        const showDay = it.date !== lastDate;
        lastDate = it.date;
        const Icon = ICONS[it.type] || Sparkles;
        return (
          <div key={it.id}>
            {showDay && (
              <div className="font-bold text-thai-deep text-sm mt-3 mb-2 bg-thai-sand inline-flex items-center gap-1.5 px-3 py-1 rounded-full">
                <Calendar size={14} className="text-thai-teal" /> {fmtDate(it.date)}
              </div>
            )}
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white ${COLORS[it.type] || "bg-thai-gold"}`}>
                  <Icon size={16} />
                </div>
                <div className="w-0.5 flex-1 bg-gray-200"></div>
              </div>
              <div className="pb-5 flex-1">
                <div className="text-xs text-gray-500 flex items-center gap-1">
                  {it.time ? <><Clock size={12} /> {it.time}</> : ""}
                </div>
                <div className="font-semibold text-thai-deep">{it.title}</div>
                {it.detail && <div className="text-sm text-gray-600">{it.detail}</div>}
              </div>
            </div>
          </div>
        );
      })}
      {sorted.length === 0 && (
        <p className="text-gray-500">אין עדיין אירועים. הוסיפי טיסות, מלונות או פעילויות.</p>
      )}
    </div>
  );
}
