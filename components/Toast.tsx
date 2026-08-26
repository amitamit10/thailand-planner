"use client";

import { useEffect } from "react";
import { CheckCircle2, AlertTriangle, Info } from "lucide-react";

export default function Toast({ message, type, onClose }: { message: string; type: "success" | "error" | "info"; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  const color = type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-slate-700";
  const Icon = type === "success" ? CheckCircle2 : type === "error" ? AlertTriangle : Info;

  return (
    <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-[60] ${color} text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium animate-toast flex items-center gap-2`}>
      <Icon size={16} /> {message}
    </div>
  );
}
