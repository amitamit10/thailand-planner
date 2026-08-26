"use client";

import { useEffect, useRef, useState } from "react";
import JsBarcode from "jsbarcode";
import QRCode from "qrcode";

export default function FlightBarcode({ flight }: { flight: any }) {
  const barcodeRef = useRef<SVGSVGElement>(null);
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [barcodeFailed, setBarcodeFailed] = useState(false);

  useEffect(() => {
    if (barcodeRef.current && flight.flightNo) {
      try {
        JsBarcode(barcodeRef.current, flight.flightNo.replace(/\s/g, ""), {
          format: "CODE128",
          width: 1.5,
          height: 40,
          displayValue: true,
          fontSize: 12,
          margin: 0,
        });
        setBarcodeFailed(false);
      } catch {
        setBarcodeFailed(true);
      }
    }
    if (qrRef.current) {
      const payload = [
        flight.airline,
        flight.flightNo,
        flight.from + "→" + flight.to,
        flight.date + " " + flight.depart,
        flight.pnr ? "PNR:" + flight.pnr : "",
      ].filter(Boolean).join("\n");
      QRCode.toCanvas(qrRef.current, payload, { width: 90, margin: 1 }).catch(() => {});
    }
  }, [flight]);

  return (
    <div className="flex items-center gap-3 mt-2 p-2 bg-gray-50 rounded-lg overflow-hidden">
      <div className="flex-1 overflow-x-auto flex items-center justify-center min-h-[50px]">
        {barcodeFailed ? (
          <span className="font-mono text-sm text-gray-600 tracking-widest">{flight.flightNo}</span>
        ) : (
          <svg ref={barcodeRef} className="max-w-full"></svg>
        )}
      </div>
      <div className="shrink-0">
        <canvas ref={qrRef} width={90} height={90} className="rounded" />
      </div>
    </div>
  );
}
