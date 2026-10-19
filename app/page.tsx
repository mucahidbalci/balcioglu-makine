"use client";

import Link from "next/link";
import Products from "@/components/Products";
import { useLanguage } from "@/lib/LanguageContext";

export default function Home() {
  const { t, dir } = useLanguage();

  return (
    <div dir={dir}>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }}></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            {t.hero.badge}
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            {t.hero.title}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              {t.hero.highlight}
            </span>
          </h1>
          <p className="text-slate-300 text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
            {t.hero.desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/iletisim"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
            >
              {t.hero.cta1}
            </Link>
            <Link
              href="/urunler"
              className="px-8 py-4 rounded-xl border-2 border-slate-600 hover:border-blue-500 text-white font-semibold transition-all duration-300 hover:bg-slate-800/50"
            >
              {t.hero.cta2}
            </Link>
          </div>
        </div>
      </section>

      {/* MANIFESTO - SİTE SAHİBİNİN ÖZEL CÜMLESİ */}
      <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 py-24 px-4 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-block px-4 py-1.5 rounded-full bg-amber-900/10 border border-amber-600/30 text-amber-800 text-xs font-bold uppercase tracking-widest mb-6">
            {t.manifesto.badge}
          </div>
          <div className="space-y-3">
            <p className="text-2xl md:text-4xl font-bold text-slate-900 leading-tight">
              {t.manifesto.text1}
            </p>
            <p className="text-3xl md:text-5xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-red-600">
                {t.manifesto.text2}
              </span>
            </p>
            <p className="text-3xl md:text-5xl font-bold leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-600">
                {t.manifesto.text3}
              </span>
            </p>
          </div>
          <div className="mt-8 pt-8 border-t border-amber-900/10">
            <p className="text-lg md:text-xl text-slate-700 font-medium">
              {t.manifesto.footer}
            </p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 px-4 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {t.stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">{s.value}</div>
                <div className="text-slate-600 font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              {t.why.title}
            </h2>
            <p className="text-slate-600 text-xl max-w-2xl mx-auto">{t.why.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {t.why.features.map((f, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:-translate-y-1"
              >
                <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-slate-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <Products />

      {/* TESTIMONIALS */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-xs font-bold uppercase tracking-widest mb-6">
              {t.testimonials.badge}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{t.testimonials.title}</h2>
            <p className="text-slate-300 text-xl max-w-2xl mx-auto">{t.testimonials.subtitle}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {t.testimonials.items.map((item, i) => (
              <div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="flex text-yellow-400 mb-4 text-lg">★★★★★</div>
                <p className="text-slate-200 mb-4 leading-relaxed text-sm">"{item.quote}"</p>
                <div className="font-semibold text-white text-sm">{item.name}</div>
                <div className="text-xs text-slate-400">{item.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            {t.cta.title}
          </h2>
          <p className="text-slate-600 text-xl mb-10 leading-relaxed">{t.cta.subtitle}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/iletisim"
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
            >
              {t.cta.button1}
            </Link>
            <a
              href="tel:05353969768"
              className="px-8 py-4 rounded-xl border-2 border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-semibold transition-all duration-300"
            >
              {t.cta.button2}: 0535 396 97 68
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}