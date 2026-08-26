"use client";

import { Coins, Plug, Phone, MessageCircle, UtensilsCrossed, Landmark } from "lucide-react";

const INFO: { icon: any; title: string; text: string }[] = [
  { icon: Coins, title: "מטבע", text: "באט תאילנדי (THB). 1 ₪ ≈ 10 באט. מזומן בשדה, המרה בעיר זולה יותר." },
  { icon: Plug, title: "חשמל", text: "שקע סוג A/B/C, 220V. מתאם ישראלי סטנדרטי עובד." },
  { icon: Phone, title: "חירום", text: "משטרה 191 · אמבולנס 1669 · תיירים 1155." },
  { icon: MessageCircle, title: "פראזות", text: "שלום = סוואסדי · תודה = קופ קון · לא = מאי · כמה? = תאו ראי" },
  { icon: UtensilsCrossed, title: "אוכל", text: "רחוב זול וטעים. בקש 'מתוק לא חריף' = וואן פט מאי פט." },
  { icon: Landmark, title: "קוד לבוש", text: "מקדשים: כתפיים וברכיים מכוסים. נעלי התחברה להוריד." },
];

export default function InfoCard() {
  return (
    <div className="card p-4">
      <h3 className="font-bold text-thai-deep mb-3">מידע שימושי לתאילנד</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        {INFO.map((i) => (
          <div key={i.title} className="flex gap-2.5 text-sm">
            <span className="shrink-0 w-8 h-8 rounded-lg bg-thai-teal/10 flex items-center justify-center">
              <i.icon size={16} className="text-thai-teal" />
            </span>
            <div>
              <div className="font-semibold text-thai-deep">{i.title}</div>
              <div className="text-gray-600 leading-relaxed">{i.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
