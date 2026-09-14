const products = [
  {
    name: "Rulo Kılçık Makinesi",
    description: "Yüksek kapasiteli, otomatik rulo kılçık çakma sistemi",
    features: ["Saatte binlerce üretim", "Sessiz çalışma", "Ergonomik tasarım"],
  },
  {
    name: "Oyuncak Kılçık Makinesi",
    description: "Pratik ve kullanışlı manuel kılçık uygulama aracı",
    features: ["Saatte binlerce üretim", "Az eleman çok iş", "Hızlı kullanım"],
    whatsapp: true,
  },
  {
    name: "Yedek Parça ve Servis",
    description: "Tüm makinalar için orijinal yedek parça ve teknik servis",
    features: ["Hızlı temin", "Uygun fiyat", "Garanti"],
  },
];

export default function Products() {
  const handleWhatsApp = () => {
    window.open('https://wa.me/905353969768?text=Oyuncak%20K%C4%B1l%C3%A7%C4%B1k%20Makinesi%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum', '_blank');
  };

  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Ürünlerimiz</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              onClick={product.whatsapp ? handleWhatsApp : undefined}
              className={`bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition duration-300 border-t-4 border-orange-500 ${product.whatsapp ? 'cursor-pointer hover:scale-105' : ''}`}
            >
              <h3 className="text-xl font-bold text-slate-900 mb-3">{product.name}</h3>
              <p className="text-slate-600 mb-4">{product.description}</p>
              <ul className="space-y-2">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex items-center text-sm text-slate-700">
                    <span className="text-orange-500 mr-2">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              {product.whatsapp && (
                <div className="mt-6 text-center">
                  <span className="inline-flex items-center text-green-600 font-semibold">
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                    </svg>
                    Detaylı Bilgi İçin Tıklayın
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}