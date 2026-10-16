"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string | null;
  features: string[];
  imageUrl: string | null;
  images: string[];
}

export default function ProductDetail() {
  const params = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products`);
        const products = await res.json();
        const found = products.find((p: Product) => p.id === params.id);
        setProduct(found);
      } catch (error) {
        console.error("Ürün yüklenemedi", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [params.id]);

  const handleWhatsApp = () => {
    if (!product) return;
    const message = encodeURIComponent(`${product.name} hakkında detaylı bilgi almak istiyorum.`);
    window.open(`https://wa.me/905353969768?text=${message}`, "_blank");
  };

  // Tüm görseller (ana görsel + çoklu görseller)
  const allImages = [
    product?.imageUrl,
    ...(product?.images || []),
  ].filter(Boolean) as string[];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Yükleniyor...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Ürün bulunamadı</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Geri Butonu */}
        <button
          onClick={() => window.history.back()}
          className="mb-6 text-slate-600 hover:text-orange-600 flex items-center gap-2 transition"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Geri Dön
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* SOL: RESİM GALERİSİ */}
          <div className="space-y-4">
            {/* Ana Görsel (Büyük) */}
            <div 
              className={`relative bg-white rounded-2xl overflow-hidden shadow-lg ${zoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'}`}
              onClick={() => setZoomed(!zoomed)}
            >
              {allImages.length > 0 ? (
                <img
                  src={allImages[currentImageIndex]}
                  alt={product.name}
                  className={`w-full transition-transform duration-300 ${zoomed ? 'scale-150' : 'scale-100'}`}
                  style={{ aspectRatio: '1/1', objectFit: 'cover' }}
                />
              ) : (
                <div className="h-96 flex items-center justify-center bg-slate-100">
                  <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}

              {/* Zoom İkonu */}
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-full shadow-md">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0V7m0 3H7m3 0h3" />
                </svg>
              </div>
            </div>

            {/* Küçük Resimler (Thumbnail) */}
            {allImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentImageIndex(index);
                      setZoomed(false);
                    }}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                      currentImageIndex === index ? 'border-orange-500' : 'border-slate-200'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Swipe İndikatörü */}
            {allImages.length > 1 && (
              <div className="flex justify-center gap-2">
                {allImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition ${
                      currentImageIndex === index ? 'bg-orange-500' : 'bg-slate-300'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* SAĞ: ÜRÜN BİLGİLERİ */}
          <div className="bg-white p-8 rounded-2xl shadow-lg">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{product.name}</h1>
            
            {product.price && (
              <div className="text-2xl font-bold text-orange-600 mb-6">{product.price}</div>
            )}

            <div className="prose prose-slate mb-8">
              <h3 className="text-lg font-semibold mb-3">Açıklama</h3>
              <p className="text-slate-600 leading-relaxed">{product.description}</p>
            </div>

            {product.features.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Özellikler</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-slate-700">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* WhatsApp Butonu */}
            <button
              onClick={handleWhatsApp}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 rounded-xl transition flex items-center justify-center gap-3 shadow-lg"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              WhatsApp ile Bilgi Al: 0535 396 97 68
            </button>

            {/* İletişim Bilgileri */}
            <div className="mt-6 pt-6 border-t border-slate-200">
              <p className="text-sm text-slate-500 text-center">
                📞 0535 396 97 68<br/>
                📧 balcioglumakina@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}