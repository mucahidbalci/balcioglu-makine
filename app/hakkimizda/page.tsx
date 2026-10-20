"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

const statValues = ["2006", "18+", "1.000+", "10.000+"];
const valueIcons = [
  "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  "M13 10V3L4 14h7v7l9-11h-7z",
  "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
];

export default function HakkimizdaPage() {
  const { t, dir } = useLanguage();

  return (
    <div dir={dir}>
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-32 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            {t.about.badge}
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
            {t.about.title}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">{t.about.highlight}</span>
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">{t.about.desc}</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {statValues.map((v, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{v}</p>
              <p className="text-slate-600 font-medium">{t.about.stats[i]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-900 mb-6 tracking-tight">{t.about.storyTitle}</h2>
            <p className="text-slate-600 leading-relaxed mb-6 text-lg">{t.about.story}</p>
            <ul className="space-y-3">
              {t.about.bullets.map((b, i) => (
                <li key={i} className="flex items-center gap-3 text-slate-700">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-slate-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{t.about.visionTitle}</h3>
            <p className="text-slate-600 leading-relaxed mb-6">{t.about.vision}</p>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">{t.about.missionTitle}</h3>
            <p className="text-slate-600 leading-relaxed">{t.about.mission}</p>
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{t.about.valuesTitle}</h2>
            <p className="text-slate-600 text-xl max-w-2xl mx-auto">{t.about.valuesSub}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {t.about.values.map((v, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-200 hover:-translate-y-1">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={valueIcons[i]} /></svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{v.t}</h3>
                <p className="text-slate-600 leading-relaxed">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{t.about.timelineTitle}</h2>
            <p className="text-slate-600 text-xl">{t.about.timelineSub}</p>
          </div>
          <div className="relative border-l-4 border-blue-600 ms-3 space-y-10">
            {t.about.timeline.map((item, i) => (
              <div key={i} className="relative ps-8">
                <span className="absolute -start-[11px] top-1 w-5 h-5 rounded-full bg-blue-600 ring-4 ring-white" />
                <p className="text-blue-600 font-bold text-sm mb-1">{item.y}</p>
                <h3 className="text-xl font-semibold text-slate-900 mb-1">{item.t}</h3>
                <p className="text-slate-600 leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">{t.about.ctaTitle}</h2>
          <p className="text-slate-300 text-xl mb-10 max-w-2xl mx-auto">{t.about.ctaDesc}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/iletisim" className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/25">{t.about.cta1}</Link>
            <Link href="/urunler" className="px-8 py-4 rounded-xl border-2 border-slate-600 hover:border-blue-500 text-white font-semibold transition-all">{t.about.cta2}</Link>
          </div>
        </div>
      </section>
    </div>
  );
}