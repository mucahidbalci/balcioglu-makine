"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function UrunDetayPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [quoteForm, setQuoteForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "sending" | "success">("idle");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch("/api/admin/products");
        const data = await res.json();
        const found = data.find((p: any) => p.id === params.id);
        setProduct(found);
      } catch (error) {
        console.error("Ürün yüklenemedi", error);
      } finally {
        setLoading(false);
      }
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
          ...quoteForm,
          productName: product?.name,
          type: "QUOTE_REQUEST"
        }),
      });
      if (res.ok) {
        setQuoteStatus("success");
        setTimeout(() => {
          setShowQuoteModal(false);
          setQuoteStatus("idle");
          setQuoteForm({ name: "", email: "", phone: "", message: "" });
        }, 2000);
      }
    } catch (error) {
      console.error("Teklif gönderilemedi", error);
      setQuoteStatus("idle");
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Yükleniyor...</div>;
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
      <h2 className="text-2xl font-bold mb-4">Ürün Bulunamadı</h2>
      <Link href="/urunler" className="text-blue-600 hover:underline">Ürünlere Dön</Link>
    </div>
  );

  const images = [product.imageUrl, ...(product.images || [])].filter(Boolean);
  const whatsappMessage = `Merhaba, ${product.name} ürünü hakkında detaylı bilgi ve teklif almak istiyorum.`;
  const whatsappUrl = `https://wa.me/905353969768?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 px-4 overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <Link href="/urunler" className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 font-medium mb-6 transition">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            Ürünlere Dön
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4 tracking-tight">
            {product.name}
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Yüksek kalite standartlarında üretilmiş, dayanıklı ve verimli çözüm.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
          
          {/* GÖRSEL GALERİSİ */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center p-6 shadow-sm">
              <img src={images[activeImage]} alt={product.name} className="max-h-full max-w-full object-contain rounded-lg" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                      activeImage === i ? "border-blue-600 ring-2 ring-blue-100" : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ÜRÜN BİLGİLERİ */}
          <div className="flex flex-col">
            {product.price && (
              <div className="inline-block px-4 py-2 rounded-lg bg-blue-50 text-blue-700 font-semibold text-lg mb-6 w-fit">
                {product.price}
              </div>
            )}
            
            <div className="mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-3">Ürün Açıklaması</h3>
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{product.description}</p>
            </div>
            
            {product.features && product.features.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Teknik Özellikler
                </h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {product.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto grid sm:grid-cols-2 gap-4">
              <button
                onClick={() => setShowQuoteModal(true)}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                Teklif İste
              </button>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-green-600/25 hover:shadow-green-600/40 hover:-translate-y-0.5"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp ile Sor
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TEKLİF MODALI */}
      {showQuoteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={() => setShowQuoteModal(false)}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">Teklif İste</h3>
              <button onClick={() => setShowQuoteModal(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <p className="text-sm text-slate-600 mb-4"><strong>{product.name}</strong> için teklif talebiniz alınacaktır.</p>
            
            {quoteStatus === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                </div>
                <p className="text-green-700 font-semibold">Talebiniz başarıyla iletildi!</p>
                <p className="text-sm text-slate-500 mt-1">En kısa sürede size dönüş yapacağız.</p>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                <input required type="text" placeholder="Adınız Soyadınız" value={quoteForm.name} onChange={(e) => setQuoteForm({...quoteForm, name: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <input required type="email" placeholder="E-posta Adresiniz" value={quoteForm.email} onChange={(e) => setQuoteForm({...quoteForm, email: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <input required type="tel" placeholder="Telefon Numaranız" value={quoteForm.phone} onChange={(e) => setQuoteForm({...quoteForm, phone: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                <textarea required rows={3} placeholder="Eklemek istediğiniz bir not var mı?" value={quoteForm.message} onChange={(e) => setQuoteForm({...quoteForm, message: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none" />
                <button type="submit" disabled={quoteStatus === "sending"} className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25 disabled:opacity-50 flex items-center justify-center gap-2">
                  {quoteStatus === "sending" ? "Gönderiliyor..." : "Teklif Talebini Gönder"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}