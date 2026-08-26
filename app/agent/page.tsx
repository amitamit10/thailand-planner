"use client";

import { useState } from "react";
import { Bot, Loader2 } from "lucide-react";

export default function AgentPage() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState("all");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, mode }),
      });
      const d = await res.json();
      setResult(d);
    } catch {
      setResult({ error: "failed" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-thai-deep flex items-center gap-2"><Bot size={24} className="text-thai-teal" /> כלי סוכן — הזנת נתונים לאמא</h1>
        <p className="text-sm text-gray-600 mt-1">
          הדבק טקסט מצילום מסך / הודעה / דף הזמנה. המערכת תחלץ טיסות, מלונות ופעילויות אוטומטית.
        </p>
      </header>

      <div className="card p-4 space-y-3">
        <select
          className="border rounded-lg p-2 text-sm w-full"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="all">הכל</option>
          <option value="flights">טיסות בלבד</option>
          <option value="hotels">מלונות בלבד</option>
          <option value="activities">פעילויות בלבד</option>
        </select>
        <textarea
          className="border rounded-lg p-2 text-sm w-full h-48"
          placeholder="הדבק כאן את הטקסט מהצילום מסך / ההודעה…"
          value={text}
          onChange={(e) => setText(e.target.value)}
          dir="auto"
        />
        <button className="btn btn-primary w-full" onClick={run} disabled={loading}>
          {loading ? "מעבד…" : "חלץ נתונים"}
        </button>
      </div>

      {result && (
        <div className="card p-4 mt-4">
          <h2 className="font-bold text-thai-deep mb-2">
            תוצאה — נמצאו {result.counts?.flights ?? 0} טיסות, {result.counts?.hotels ?? 0} מלונות, {result.counts?.activities ?? 0} פעילויות
          </h2>
          <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto whitespace-pre-wrap">
            {JSON.stringify(result.extracted ?? result, null, 2)}
          </pre>
          <p className="text-xs text-gray-500 mt-2">
            העתק את ה-JSON לעדכון localStorage של האתר הראשי (מפתחות: thai_flights, thai_hotels, thai_activities).
          </p>
        </div>
      )}

      <section className="mt-6 text-sm text-gray-700 space-y-2">
        <h3 className="font-bold text-thai-deep">איך הסוכן משתמש בזה:</h3>
        <ol className="list-decimal list-inside space-y-1">
          <li>אמא שולחת צילום מסך של הטיסה/מלון ב-Telegram לסוכן.</li>
          <li>הסוכן מחלץ טקסט (OCR / קריאת ההודעה) ומדביק כאן.</li>
          <li>בוחרים מצב (טיסות/מלונות/הכל) ולוחצים "חלץ נתונים".</li>
          <li>מעתיקים את ה-JSON שחולץ ומכניסים לאחסון המקומי של האתר (localStorage).</li>
          <li>האתר מתעדכן אוטומטית — אמא רואה בטלפון.</li>
        </ol>
      </section>
    </main>
  );
}
