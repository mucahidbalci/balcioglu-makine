"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/LanguageContext";

export default function UrunDetayPage() {
  const params = useParams();
  const { t, dir } = useLanguage();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        setProduct(data.find((p: any) => p.id === params.id));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    if (params.id) fetchProduct();
  }, [params.id]);

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteStatus("sending");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productName: product?.name,
          customerName: quoteForm.name,
          customerEmail: quoteForm.email,
          customerPhone: quoteForm.phone,
          message: quoteForm.message,
          type: "QUOTE_REQUEST",
        }),
      });
      if (res.ok) {
        setQuoteStatus("success");
        setTimeout(() => { setShowQuoteModal(false); setQuoteStatus("idle"); setQuoteForm({ name: "", email: "", phone: "", message: "" }); }, 2000);
      } else {
        setQuoteStatus("error");
      }
    } catch {
      setQuoteStatus("error");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">...</div>;
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
      <h2 className="text-2xl font-bold mb-4">{t.detail.notFound}</h2>
      <Link href="/urunler" className="text-blue-600 hover:underline">{t.detail.back}</Link>
    </div>
  );

  const images = [product.imageUrl, ...(product.images || [])].filter(Boolean);
  const whatsappUrl = `https://wa.me/905353969768?text=${encodeURIComponent(`Merhaba, ${product.name} ürünü hakkında bilgi istiyorum.`)}`;

  return (
    <div dir={dir} className="bg-white">
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <Link href="/urunler" className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 font-medium mb-6 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            {t.detail.back}
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 tracking-tight">{product.name}</h1>
          <p className="text-slate-300 text-lg max-w-2xl">{t.detail.heroSub}</p>
        </div>
      </section>

      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-6 shadow-sm">
              <img src={images[activeImage]} alt={product.name} className="max-h-full max-w-full object-contain rounded-lg" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, i: number) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all ${activeImage === i ? "border-blue-600 ring-2 ring-blue-100" : "border-transparent hover:border-slate-300"}`}>
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col">
            {product.price && <div className="inline-block px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold text-lg mb-6 w-fit">{product.price}</div>}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-3">{t.detail.descTitle}</h3>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{product.description}</p>
            </div>
            {(product.features?.length ?? 0) > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  {t.detail.featuresTitle}
                </h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {product.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700"><span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />{f}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-auto grid sm:grid-cols-2 gap-4">
              <button onClick={() => setShowQuoteModal(true)} className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/25">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                {t.detail.quote}
              </button>
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all shadow-lg shadow-green-600/25">
                {t.detail.whatsapp}
              </a>
            </div>
          </div>
        </div>
      </section>

      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setShowQuoteModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">{t.detail.quoteTitle}</h3>
              <button onClick={() => setShowQuoteModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4"><strong>{product.name}</strong> {t.detail.quoteDesc}</p>

            {quoteStatus === "error" && (
              <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">{t.detail.error}</div>
            )}

            {quoteStatus === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-green-700 font-semibold">{t.detail.success}</p>
                <p className="text-sm text-slate-500 mt-1">{t.detail.successDesc}</p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <input required type="text" placeholder={t.detail.name} value={quoteForm.name} onChange={(e) => setQuoteForm({ ...quoteForm, name: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <input required type="email" placeholder={t.detail.email} value={quoteForm.email} onChange={(e) => setQuoteForm({ ...quoteForm, email: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <input required type="tel" placeholder={t.detail.phone} value={quoteForm.phone} onChange={(e) => setQuoteForm({ ...quoteForm, phone: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <textarea rows={3} placeholder={t.detail.note} value={quoteForm.message} onChange={(e) => setQuoteForm({ ...quoteForm, message: e.target.value })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none" />
                <button type="submit" disabled={quoteStatus === "sending"} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-lg shadow-blue-600/25 disabled:opacity-50">
                  {quoteStatus === "sending" ? t.detail.sending : t.detail.send}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}