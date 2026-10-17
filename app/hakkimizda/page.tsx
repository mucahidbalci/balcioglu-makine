import Link from "next/link";

const stats = [
  { value: "2006", label: "Kuruluş Yılı" },
  { value: "15+", label: "Yıl Sektör Tecrübesi" },
  { value: "500+", label: "Teslim Edilen Makine" },
  { value: "10+", label: "İhracat Ülkesi" },
];

const values = [
  {
    title: "Kalite",
    desc: "Her makine titiz kalite kontrol süreçlerinden geçer; toleranslar milimetrik tutulur.",
    path: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  {
    title: "Güven",
    desc: "Söz verdiğimiz tarihte teslim, şeffaf fiyat ve uzun ömürlü yedek parça desteği.",
    path: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
  },
  {
    title: "Hizmet",
    desc: "Teknik ekibimiz sorunlarınıza hızır gibi yetişir; iş akışınız asla aksamaz.",
    path: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  {
    title: "İnovasyon",
    desc: "Üretim hattımızı sürekli güncelleyerek en son teknolojiyi müşterilerimize sunarız.",
    path: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
  },
];

const timeline = [
  { year: "2006", title: "Kuruluş", desc: "Bağcılar'da ilk atölye ile plastik kılçık üretimine başladık." },
  { year: "2010", title: "Üretim Büyümesi", desc: "Kendi kılçık makinesi imalatımıza geçerek dışa bağımlılığı azalttık." },
  { year: "2015", title: "İhracat Ağı", desc: "Avrupa ve Ortadoğu pazarlarına açılarak ilk ihracat sözleşmelerimizi imzaladık." },
  { year: "2020", title: "Teknoloji Yatırımı", desc: "CNC tezgâh ve otomasyon yatırımlarıyla üretim kapasitemizi ikiye katladık." },
  { year: "2026", title: "Bugün", desc: "Rulo kılçık, çorap kılçık ve sabitleme sistemlerinde sektörün öncüsü konumundayız." },
];

export default function HakkimizdaPage() {
  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-orange-500 font-semibold text-sm uppercase tracking-widest mb-3">Hakkımızda</p>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
            Çeyrek Asırlık Tecrübe,<br />Milimetrik Hassasiyet
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed max-w-2xl mx-auto">
            Balcıoğlu Makina olarak 2006'dan bu yana plastik kılçık üretimi, kılçık makinesi imalatı ve sabitleme sistemleri alanında imalat, ithalat, ihracat ve pazarlama hizmeti sunuyoruz.
          </p>
        </div>
      </section>

      {/* İSTATİSTİKLER */}
      <section className="border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-4xl font-bold text-orange-600 mb-1">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HİKÂYE */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-5">İstanbul Bağcılar'dan Dünyaya</h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              Merkezimiz İstanbul Bağcılar'da; başta tekstil ve ambalaj sektörü olmak üzere birçok sektöre yenilikçi, ekonomik ve güven dolu çözümler sunuyoruz.
            </p>
            <p className="text-slate-600 leading-relaxed mb-6">
              Küçük bir atölyede başlayan yolculuğumuz, bugün kendi makinesini üreten, ihracat yapan ve yüzlerce firmaya hizmet veren bir üretim markasına dönüştü. Bu dönüşümün arkasında tek bir ilke var: kaliteden ödün vermemek.
            </p>
            <ul className="space-y-3">
              {["15 yılı aşkın sektör tecrübesi", "Kırılan parçaların özel üretimi", "Yüksek kapasiteli, sessiz makine tasarımı", "Hızlı teknik destek ve yedek parça", "%100 müşteri memnuniyeti"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-700">
                  <span className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
            <h3 className="text-xl font-bold text-slate-900 mb-4">Vizyonumuz</h3>
            <p className="text-slate-600 leading-relaxed mb-6">
              Yerli üretim gücümüzü uluslararası standartlara taşıyarak, kılçık ve sabitleme sistemleri alanında global bir marka olmak.
            </p>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Misyonumuz</h3>
            <p className="text-slate-600 leading-relaxed">
              Müşterilerimize dayanıklı, verimli ve ekonomik makineler üretmek; satış sonrası desteğimizle yanlarında olmaya devam etmek.
            </p>
          </div>
        </div>
      </section>

      {/* DEĞERLER */}
      <section className="bg-slate-50 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Neye Değer Veriyoruz?</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Her kararımızın arkasında dört temel ilke durur.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition">
                <span className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={v.path} /></svg>
                </span>
                <h3 className="text-lg font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ZAMAN ÇİZELGESİ */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Yolculuğumuz</h2>
            <p className="text-slate-600">2006'dan bugüne adım adım büyüme.</p>
          </div>
          <div className="relative border-l-2 border-slate-200 ml-3 space-y-10">
            {timeline.map((t) => (
              <div key={t.year} className="relative pl-8">
                <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-orange-600 ring-4 ring-white" />
                <p className="text-orange-600 font-bold text-sm mb-1">{t.year}</p>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">{t.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Birlikte Çalışalım</h2>
          <p className="text-slate-300 mb-8 max-w-xl mx-auto">İhtiyacınıza uygun kılçık makinesi ve sabitleme çözümü için bize ulaşın, en kısa sürede dönüş yapalım.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/iletisim" className="px-7 py-3.5 rounded-lg bg-orange-600 hover:bg-orange-700 text-white font-semibold transition">İletişime Geçin</Link>
            <Link href="/urunler" className="px-7 py-3.5 rounded-lg border border-slate-600 hover:bg-slate-800 text-white font-semibold transition">Ürünlerimizi İnceleyin</Link>
          </div>
        </div>
      </section>
    </div>
  );
}