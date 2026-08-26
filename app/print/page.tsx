"use client";

import { useEffect, useState } from "react";
import { Hotel as HotelType, Flight, Activity } from "../types";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";
import { useRef } from "react";
import { Printer, Plane, Building2, Sparkles } from "lucide-react";

function Barcode({ flight }: { flight: Flight }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (svgRef.current && flight.flightNo) {
      try { JsBarcode(svgRef.current, flight.flightNo.replace(/\s/g, ""), { format: "CODE128", width: 1, height: 30, displayValue: true, fontSize: 9, margin: 0 }); } catch {}
    }
    if (canvasRef.current) {
      const payload = [flight.airline, flight.flightNo, `${flight.from}→${flight.to}`, flight.date + " " + flight.depart, flight.pnr ? "PNR:" + flight.pnr : ""].filter(Boolean).join("\n");
      QRCode.toCanvas(canvasRef.current, payload, { width: 70, margin: 1 }).catch(() => {});
    }
  }, [flight]);
  return (
    <div className="flex items-center gap-2 mt-1">
      <svg ref={svgRef} className="h-8"></svg>
      <canvas ref={canvasRef} width={70} height={70} className="ml-auto"></canvas>
    </div>
  );
}

export default function PrintPage() {
  const [data, setData] = useState<{ hotels: HotelType[]; flights: Flight[]; activities: Activity[] } | null>(null);

  useEffect(() => {
    fetch("/api/load").then((r) => r.json()).then((d) => {
      setData({ hotels: d.hotels || [], flights: d.flights || [], activities: d.activities || [] });
    });
  }, []);

  if (!data) return <div className="p-8 text-center">טוען…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 text-black print:p-0">
      <div className="no-print text-center mb-4 print:hidden">
        <button className="btn btn-primary" onClick={() => window.print()}><Printer size={16} className="inline ml-1" /> הדפס / שמור PDF</button>
        <a href="/" className="btn btn-ghost mr-2">← חזרה</a>
      </div>
      <h1 className="text-2xl font-bold mb-1 text-center">🇹🇭 תאילנד 2026</h1>
      <p className="text-center text-gray-600 mb-4 text-sm">דף הדפסה — כל פרטי הטיול</p>

      <h2 className="text-lg font-bold mt-4 mb-2 border-b pb-1 flex items-center gap-2"><Plane size={18} /> טיסות</h2>
      {data.flights.map((f) => (
        <div key={f.id} className="border-b py-2">
          <b>{f.airline} {f.flightNo}</b> · {f.from} → {f.to} · {f.date} {f.depart}-{f.arrive}
          {f.pnr && <span> · PNR: {f.pnr}</span>}
          {f.bookingRef && <span> · הזמנה: {f.bookingRef}</span>}
          <Barcode flight={f} />
        </div>
      ))}

      <h2 className="text-lg font-bold mt-4 mb-2 border-b pb-1 flex items-center gap-2"><Building2 size={18} /> מלונות</h2>
      {data.hotels.map((h) => (
        <div key={h.id} className="border-b py-2">
          <b>{h.name}</b> · {h.city} · {h.checkIn} → {h.checkOut}
          {h.notes && <div className="text-xs text-gray-600">{h.notes}</div>}
        </div>
      ))}

      <h2 className="text-lg font-bold mt-4 mb-2 border-b pb-1 flex items-center gap-2"><Sparkles size={18} /> פעילויות</h2>
      {data.activities.map((a) => (
        <div key={a.id} className="border-b py-2">
          <b>{a.title}</b> · {a.date} {a.time || ""} · {a.location || ""} {a.cost ? `· ฿${a.cost}` : ""}
          {a.detail && <div className="text-xs text-gray-600">{a.detail}</div>}
        </div>
      ))}

      <p className="text-center text-xs text-gray-400 mt-6">נוצר באפליקציית תכנון הטיול לתאילנד</p>
    </div>
  );
}
