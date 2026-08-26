"use client";

import { useEffect } from "react";

export default function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => { if (e.key === "Escape") onCancel(); };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [open, onCancel]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={onCancel}>
      <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl animate-fade-up" onClick={(e) => e.stopPropagation()}>
        <h3 className="font-bold text-lg text-thai-deep mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-5">{message}</p>
        <div className="flex gap-2 justify-end">
          <button className="btn btn-ghost text-sm" onClick={onCancel}>ביטול</button>
          <button className="btn bg-red-500 text-white hover:bg-red-600 text-sm" onClick={onConfirm}>מחק</button>
        </div>
      </div>
    </div>
  );
}
