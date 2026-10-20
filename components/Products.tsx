"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function Products({ showHeader = true }: { showHeader?: boolean }) {
  const { t, dir } = useLanguage();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((d) => { setProducts(Array.isArray(d) ? d : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 px-4 bg-white" dir={dir}>
      <div className="max-w-6xl mx-auto">
        {showHeader && (
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">{t.products.title}</h2>
            <p className="text-slate-600 text-xl max-w-2xl mx-auto">{t.products.subtitle}</p>
          </div>
        )}
        {loading ? (
          <p className="text-center text-slate-500 py-16">{t.products.loading}</p>
        ) : products.length === 0 ? (
          <p className="text-center text-slate-500 py-16">{t.products.empty}</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((p) => (
              <div key={p.id} className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                <Link href={`/urun/${p.id}`} className="block">
                  <div className="aspect-[4/3] bg-white overflow-hidden">
                    {p.imageUrl ? (
                      <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-300">
                        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">{p.name}</h3>
                    <p className="text-sm text-slate-600 mb-4">{(p.description || "").substring(0, 90)}{(p.description || "").length > 90 ? "..." : ""}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 group-hover:gap-3 transition-all">
                      {t.products.detail}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}