"use client";

import { useEffect, useState } from "react";
import { Plus, Download, Wallet } from "lucide-react";

type Expense = { id: string; cat: string; amount: number; note: string };

export default function BudgetTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [cat, setCat] = useState("טיסות");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [rate, setRate] = useState<number | null>(null);

  useEffect(() => {
    const s = localStorage.getItem("thai_budget");
    if (s) setExpenses(JSON.parse(s));
    fetch("/api/fx").then((r) => r.json()).then((d) => setRate(d.rate));
  }, []);
  useEffect(() => {
    localStorage.setItem("thai_budget", JSON.stringify(expenses));
  }, [expenses]);

  function add() {
    const a = parseFloat(amount);
    if (!a) return;
    setExpenses((p) => [...p, { id: crypto.randomUUID(), cat, amount: a, note }]);
    setAmount("");
    setNote("");
  }
  const total = expenses.reduce((s, e) => s + e.amount, 0);

  function exportCsv() {
    const rows = [["קטגוריה", "סכום", "הערה"]].concat(
      expenses.map((e) => [e.cat, e.amount, e.note])
    );
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "thailand-budget.csv";
    a.click();
  }

  return (
    <div className="card p-4">
      <h3 className="font-bold text-thai-deep mb-3 flex items-center gap-2"><Wallet size={18} className="text-thai-teal" /> מעקב תקציב</h3>
      <div className="flex gap-2 mb-2 flex-wrap">
        <select className="border rounded-lg p-2 text-sm" value={cat} onChange={(e) => setCat(e.target.value)}>
          {["טיסות", "מלונות", "אוכל", "תחבורה", "אטרקציות", "קניות", "אחר"].map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <input
          className="border rounded-lg p-2 text-sm w-24"
          type="number"
          placeholder="סכום"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          className="border rounded-lg p-2 text-sm flex-1"
          placeholder="הערה"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button className="btn btn-primary" onClick={add}>
          <Plus size={16} />
        </button>
      </div>
      <div className="text-sm text-gray-700 mb-2">
        סה"כ: <b className="text-thai-orange">{total.toLocaleString("he-IL")} ₪</b>
        {rate && <span className="text-xs text-gray-400 mr-2">≈ {(total * rate).toLocaleString("he-IL")} באט</span>}
      </div>
      <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
        {expenses.map((e) => (
          <div key={e.id} className="text-sm flex justify-between border-b pb-1">
            <span>{e.cat} · {e.note}</span>
            <span className="font-semibold">{e.amount.toLocaleString("he-IL")} ₪</span>
          </div>
        ))}
      </div>
      {expenses.length > 0 && (
        <button className="btn btn-ghost mt-3 w-full text-sm" onClick={exportCsv}>
          <Download size={14} /> ייצא CSV
        </button>
      )}
    </div>
  );
}
