"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem("cookie-consent", "rejected");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-2xl p-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-slate-900 mb-2">Çerez Kullanımı</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Web sitemizi daha iyi hale getirmek için çerezler kullanıyoruz. Analitik çerezler, siteyi nasıl kullandığınızı anlamamıza yardımcı olur. 
            Detaylı bilgi için <a href="/cerez" className="text-orange-600 hover:text-orange-700 underline">çerez politikamızı</a> inceleyebilirsiniz.
          </p>
        </div>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleReject}
            className="px-6 py-2.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 font-medium transition"
          >
            Reddet
          </button>
          <button
            onClick={handleAccept}
            className="px-6 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium transition"
          >
            Kabul Et
          </button>
        </div>
      </div>
    </div>
  );
}