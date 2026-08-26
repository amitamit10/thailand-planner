"use client";

import { useRouter } from "next/navigation";
import { Plane, Hotel, Sparkles, Cloud, Map, Wallet, Backpack, Info, CalendarDays, ArrowRight } from "lucide-react";

const STEPS = [
  { icon: Plane, title: "הוספת טיסה", text: "לחצי על 'טיסות' בתחתית. מלאי: חברה, מספר טיסה, מוצא, יעד, תאריך ושעה. לחצי 'הוסף'. אפשר גם לשלוח לבוט צילום מסך של ההזמנה והוא ימלא בעצמו.", color: "text-blue-600" },
  { icon: Hotel, title: "הוספת מלון", text: "לחצי על 'מלונות'. רשמי שם המלון ועיר — התמונה והתיאור יופיעו אוטומטית! הוסיפי תאריכי צ'ק-אין וצ'ק-אאוט.", color: "text-orange-600" },
  { icon: Sparkles, title: "הוספת פעילות", text: "לחצי על 'פעילויות'. רשמי מה עושים, מתי, ואיפה. זה יופיע בטיימליין לפי תאריך.", color: "text-purple-600" },
  { icon: CalendarDays, title: "הטיימליין", text: "לחצי על 'טיימליין' כדי לראות את כל הטיול מסודר לפי ימים — טיסות, מלונות ופעילויות ביחד.", color: "text-green-600" },
  { icon: Cloud, title: "מזג אוויר", text: "לחצי על 'מזג אוויר' לראות תחזית לערים שבהן את לנה. עדכני כל יום.", color: "text-sky-600" },
  { icon: Map, title: "מפה", text: "לחצי על 'מפה' לראות את כל המלונות והערים על המפה.", color: "text-red-600" },
  { icon: Wallet, title: "תקציב", text: "לחצי על 'תקציב' כדי לרשום הוצאות ולעקוב כמה הוצאת בסך הכל (בבאט ובשקלים).", color: "text-emerald-600" },
  { icon: Backpack, title: "רשימת ציוד", text: "לחצי על 'ציוד' וסמני מה כבר ארזת. אפשר להוסיף פריטים חדשים.", color: "text-amber-600" },
];

export default function HelpPage() {
  const router = useRouter();
  return (
    <main className="max-w-2xl mx-auto px-4 py-8 pb-24">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-thai-orange">איך מוסיפים דברים 🇹🇭</h1>
        <p className="text-gray-600 mt-2">מדריך פשוט בשבילך</p>
        <button className="btn btn-primary mt-4" onClick={() => router.push("/")}>
          חזרה לטיול <ArrowRight size={16} className="mr-1" />
        </button>
      </header>

      <div className="space-y-4">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="card p-5 flex gap-4 items-start">
              <div className={`rounded-full bg-gray-100 p-3 ${s.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <h2 className="font-bold text-lg text-thai-deep">{s.title}</h2>
                <p className="text-gray-700 text-sm mt-1 leading-relaxed">{s.text}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="card p-5 mt-6 bg-thai-sand">
        <h2 className="font-bold text-lg text-thai-deep flex items-center gap-2">
          <Info size={18} className="text-thai-orange" /> טיפ
        </h2>
        <p className="text-gray-700 text-sm mt-2 leading-relaxed">
          הכל נשמר אוטומטית — אפשר לסגור ולחזור מתי שרוצים. אם שלחת לבוט צילום מסך,
          הוא יוסיף את הנתונים כאן בעצמו ואת רק צריכה לפתוח.
        </p>
      </div>
    </main>
  );
}
