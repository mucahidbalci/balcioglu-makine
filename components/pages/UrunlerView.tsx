"use client";

import Products from "@/components/Products";
import { useLanguage } from "@/lib/LanguageContext";

export default function UrunlerView() {
  const { t, dir } = useLanguage();

  return (
    <div dir={dir}>
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-32 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            {t.urunler.badge}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
            {t.urunler.title}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{t.urunler.highlight}</span>
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">{t.urunler.desc}</p>
        </div>
      </section>
      <Products showHeader={false} />
    </div>
  );
}