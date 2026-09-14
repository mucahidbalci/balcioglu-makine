const features = [
  {
    title: "Yüksek Kalite",
    description: "Ürünlerimiz, en son teknoloji ile üretilmekte ve titiz kalite kontrol süreçlerinden geçmektedir.",
    icon: "✓",
  },
  {
    title: "Hızlı Teknik Servis",
    description: "Sorunlarınıza 'Hızır gibi' yetişen teknik ekibimizle iş akışınız asla aksamaz. Yedek parça desteği garantilidir.",
    icon: "⚡",
  },
  {
    title: "Müşteri Memnuniyeti",
    description: "Güler yüzlü hizmet, samimiyet ve sınırsız çay keyfi ile misafirperverliğimizi her zaman hissettiriyoruz.",
    icon: "★",
  },
];

export default function Features() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Neden Bizi Tercih Etmelisiniz?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-slate-50 p-8 rounded-xl border border-slate-200 hover:border-orange-500 hover:shadow-lg transition duration-300"
            >
              <div className="text-4xl mb-4 text-orange-600">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}