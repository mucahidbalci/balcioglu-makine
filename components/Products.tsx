"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string | null;
  features: string[];
  imageUrl: string | null;
  images: string[];
  isActive: boolean;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/admin/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.filter((p: Product) => p.isActive));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Artık detay sayfasına yönlendiriyor
  const handleViewDetail = (productId: string) => {
    router.push(`/urun/${productId}`);
  };

  if (loading) {
    return (
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-slate-500">Ürünler yükleniyor...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-4">Ürünlerimiz</h2>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Yüksek kalite standartlarında ürettiğimiz kılçık makineleri ve sabitleme sistemleri
        </p>
        
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-500">Henüz ürün eklenmemiş.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => handleViewDetail(product.id)}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 border-t-4 border-orange-500 cursor-pointer hover:scale-105 group flex flex-col h-full"
              >
                {/* Ürün Görseli */}
                {(product.imageUrl || product.images?.[0]) ? (
                  <div className="mb-6 h-48 rounded-lg overflow-hidden bg-slate-100">
                    <img 
                      src={product.imageUrl || product.images?.[0]} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="mb-6 h-48 rounded-lg bg-slate-100 flex items-center justify-center">
                    <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-600 transition">
                  {product.name}
                </h3>
                <p className="text-slate-600 mb-4 flex-grow">{product.description}</p>
                
                {product.price && (
                  <p className="text-orange-600 font-bold text-lg mb-4">{product.price}</p>
                )}

                <ul className="space-y-2 mb-6">
                  {product.features.slice(0, 3).map((feature, i) => (
                    <li key={i} className="flex items-center text-sm text-slate-700">
                      <span className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* DETAYLI İNCELE BUTONU */}
                <div className="mt-auto flex items-center justify-center gap-2 bg-orange-50 border border-orange-200 rounded-lg py-3 px-4 group-hover:bg-orange-100 transition">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span className="text-orange-700 font-semibold text-sm">Detaylı İncele</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}