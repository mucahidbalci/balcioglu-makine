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

  if (loading) return <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-slate-500">Yükleniyor...</div>;
  if (!product) return <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-slate-500">Ürün bulunamadı.</div>;

  const images = [product.imageUrl, ...(product.images || [])].filter(Boolean);
  const whatsappMessage = `Merhaba, ${product.name} ürünü hakkında bilgi almak istiyorum.`;
  const whatsappUrl = `https://wa.me/905353969768?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <main className="min-h-screen bg-[#faf8f5] py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <Link href="/urunler" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-8 transition">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          Ürünlere Dön
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Görsel Galerisi */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl border border-[#ece5db] overflow-hidden flex items-center justify-center p-6 shadow-sm">
              <img src={images[activeImage]} alt={product.name} className="max-h-full max-w-full object-contain rounded-lg" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 overflow-hidden transition ${
                      activeImage === i ? "border-orange-600 ring-2 ring-orange-100" : "border-transparent hover:border-slate-300"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Ürün Bilgileri */}
          <div className="flex flex-col">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{product.name}</h1>
            {product.price && (
              <p className="text-2xl font-semibold text-orange-600 mb-6">{product.price}</p>
            )}
            
            <div className="mb-8">
              <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line">{product.description}</p>
            </div>
            
            {product.features && product.features.length > 0 && (
              <div className="bg-white rounded-xl border border-[#ece5db] p-6 mb-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Teknik Özellikler
                </h3>
                <ul className="grid sm:grid-cols-2 gap-3">
                  {product.features.map((f: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-auto flex flex-col sm:flex-row gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold transition shadow-lg shadow-green-900/10"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                WhatsApp ile Bilgi Al
              </a>
              <a
                href="tel:05353969768"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl border-2 border-slate-200 hover:border-orange-600 hover:text-orange-600 text-slate-700 font-semibold transition bg-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                Hemen Ara
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}