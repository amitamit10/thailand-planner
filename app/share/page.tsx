"use client";

import { useEffect, useRef, useState } from "react";
import QRCode from "qrcode";
import { useRouter } from "next/navigation";
import { Share2, Check } from "lucide-react";

export default function SharePage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const url = typeof window !== "undefined" ? window.location.origin : "https://thailand-planner-black.vercel.app";

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, { width: 240, margin: 2, color: { dark: "#f97316", light: "#ffffff" } }).catch(() => {});
    }
  }, [url]);

  return (
    <main className="max-w-md mx-auto px-4 py-12 text-center">
      <h1 className="text-2xl font-bold text-thai-teal mb-2 flex items-center justify-center gap-2"><Share2 size={22} /> שתף את הטיול</h1>
      <p className="text-gray-600 text-sm mb-6">סרקי את הקוד כדי לפתוח את מערכת הטיול בטלפון</p>
      <div className="card p-6 flex flex-col items-center gap-4">
        <canvas ref={canvasRef} width={240} height={240} className="rounded-lg" />
        <div className="text-xs text-gray-500 break-all">{url}</div>
        <button
          className="btn btn-primary w-full"
          onClick={() => { navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
        >
          {copied ? <><Check size={16} className="inline ml-1" /> הועתק!</> : "העתק קישור"}
        </button>
        <button className="btn btn-ghost w-full text-sm" onClick={() => router.push("/")}>← חזרה לאתר</button>
      </div>
    </main>
  );
}
