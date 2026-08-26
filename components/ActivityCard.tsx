"use client";

import { MapPin, Sparkles, Pencil, Trash2, Utensils, Camera, ShoppingBag, Trees, ExternalLink, Navigation } from "lucide-react";
import { Activity } from "../types";

const CATS: Record<string, { icon: any; label: string; color: string }> = {
  food: { icon: Utensils, label: "אוכל", color: "bg-orange-500" },
  sight: { icon: Camera, label: "אתר", color: "bg-blue-500" },
  shop: { icon: ShoppingBag, label: "קניות", color: "bg-pink-500" },
  nature: { icon: Trees, label: "טבע", color: "bg-green-500" },
  other: { icon: Sparkles, label: "כללי", color: "bg-thai-gold" },
};

export default function ActivityCard({
  activity,
  onEdit,
  onDelete,
  fxRate,
}: {
  activity: Activity;
  onEdit: (a: Activity) => void;
  onDelete: (id: string) => void;
  fxRate?: number | null;
}) {
  const cat = CATS[activity.category || "other"];
  const Icon = cat.icon;
  const ils = activity.cost && fxRate ? (parseFloat(activity.cost) * fxRate).toFixed(0) : null;
  const mapUrl = activity.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location + " Thailand")}`
    : null;

  return (
    <div className="card p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-2">
          <div className={`w-8 h-8 rounded-full ${cat.color} flex items-center justify-center text-white shrink-0`}>
            <Icon size={16} />
          </div>
          <div>
            <div className="font-semibold text-thai-deep">{activity.title}</div>
            <div className="text-xs text-gray-500">
              {activity.date} {activity.time ? `· ${activity.time}` : ""}
            </div>
            {activity.location && (
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <MapPin size={13} className="text-thai-orange" /> {activity.location}
                {mapUrl && (
                  <a href={mapUrl} target="_blank" rel="noreferrer" className="text-thai-orange hover:underline ml-1">
                    <Navigation size={11} />
                  </a>
                )}
              </div>
            )}
            {activity.detail && (
              <p className="text-sm text-gray-700 mt-1">{activity.detail}</p>
            )}
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {cat.label}
              </span>
              {activity.cost ? (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-thai-gold/20 text-thai-deep">
                  ฿{activity.cost}{ils ? ` ≈ ₪${ils}` : ""}
                </span>
              ) : null}
            </div>
            {activity.link && (
              <a href={activity.link} target="_blank" rel="noreferrer" className="text-xs text-thai-orange flex items-center gap-1 hover:underline mt-1">
                <ExternalLink size={11} /> קישור
              </a>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button className="p-1.5 hover:bg-gray-100 rounded-full" onClick={() => onEdit(activity)}>
            <Pencil size={14} className="text-thai-deep" />
          </button>
          <button className="p-1.5 hover:bg-gray-100 rounded-full" onClick={() => onDelete(activity.id)}>
            <Trash2 size={14} className="text-red-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
