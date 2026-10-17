import Link from "next/link";
import Products from "@/components/Products";

export default function Home() {
  return (
    <div>
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-32 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5"></div>
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            2006'dan Beri Sektörün Öncüsü
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 tracking-tight">
            Kılçık Makinesi ve
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Sabitleme Sistemleri
            </span>
          </h1>
          <p className="text-slate-300 text-xl md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed">
            İmalat, ithalat, ihracat ve pazarlama alanlarında 18 yıllık tecrübe. 
            Yüksek kalite standartlarında üretim ve güvenilir çözüm ortaklığı.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/iletisim" 
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
            >
              Teklif Alın
            </Link>
            <Link 
              href="/urunler" 
              className="px-8 py-4 rounded-xl border-2 border-slate-600 hover:border-blue-500 text-white font-semibold transition-all duration-300 hover:bg-slate-800/50"
            >
              Ürünlerimizi İnceleyin
            </Link>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-16 px-4 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">18+</div>
              <div className="text-slate-600 font-medium">Yıl Tecrübe</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-slate-600 font-medium">Tamir Edilen Makine</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">1000+</div>
              <div className="text-slate-600 font-medium">Satılan Makine</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-blue-600 mb-2">10+</div>
              <div className="text-slate-600 font-medium">İhracat Ülkesi</div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
              Neden Bizi Tercih Etmelisiniz?
            </h2>
            <p className="text-slate-600 text-xl max-w-2xl mx-auto">
              Kalite, hız ve müşteri memnuniyeti odaklı hizmet anlayışımızla sektörün öncüsüyüz.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Yüksek Kalite Standartları</h3>
              <p className="text-slate-600 leading-relaxed">
                Ürünlerimiz, en son teknoloji ile üretilmekte ve titiz kalite kontrol süreçlerinden geçmektedir. 
                ISO standartlarına uygun üretim garantisi.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Hızlı Teknik Servis</h3>
              <p className="text-slate-600 leading-relaxed">
                Deneyimli teknik ekibimizle sorunlarınıza anında çözüm üretiyoruz. 
                Yedek parça desteği ve profesyonel after-sales service garantisi.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">Müşteri Odaklı Hizmet</h3>
              <p className="text-slate-600 leading-relaxed">
                Müşteri memnuniyeti odaklı yaklaşımımızla uzun vadeli iş ortaklıkları kuruyoruz. 
                Güvenilir, şeffaf ve profesyonel hizmet anlayışı.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <Products />

      {/* TESTIMONIALS SECTION - PROFESSIONAL */}
      <section className="py-24 px-4 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Müşterilerimiz Ne Diyor?
            </h2>
            <p className="text-slate-300 text-xl max-w-2xl mx-auto">
              18 yıllık tecrübemiz boyunca binlerce müşteriye hizmet vermenin gururunu yaşıyoruz.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex text-yellow-400 mb-4">★★★★★</div>
              <p className="text-slate-200 mb-4 leading-relaxed">
                "Makine kalitesi ve teknik destek mükemmel. İş akışımız hiç aksamadan devam ediyor. 
                Profesyonel ekip, güvenilir hizmet."
              </p>
              <div className="font-semibold text-white">Nurullah Gültey</div>
              <div className="text-sm text-slate-400">Tekstil Firması Sahibi</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex text-yellow-400 mb-4">★★★★★</div>
              <p className="text-slate-200 mb-4 leading-relaxed">
                "Teknik servis ekibi gerçekten çok hızlı ve profesyonel. 
                Sorunlarımıza anında çözüm buldular. Kesinlikle tavsiye ederim."
              </p>
              <div className="font-semibold text-white">Rıza Sevilir</div>
              <div className="text-sm text-slate-400">Üretim Müdürü</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex text-yellow-400 mb-4">★★★★★</div>
              <p className="text-slate-200 mb-4 leading-relaxed">
                "Kaliteli ürün, zamanında teslimat ve mükemmel after-sales service. 
                Uzun vadeli iş ortağımız oldular."
              </p>
              <div className="font-semibold text-white">Ömer Şen</div>
              <div className="text-sm text-slate-400">Ambalaj Firması</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex text-yellow-400 mb-4">★★★★★</div>
              <p className="text-slate-200 mb-4 leading-relaxed">
                "Güven ve kalitenin adresi. 10 yılı aşkın süredir çalışıyoruz, 
                hiç sorun yaşamadık. Profesyonel ekip."
              </p>
              <div className="font-semibold text-white">Sebahattin Kuşal</div>
              <div className="text-sm text-slate-400">İşletme Sahibi</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Projeleriniz İçin Profesyonel Çözümler
          </h2>
          <p className="text-slate-600 text-xl mb-10 leading-relaxed">
            Kılçık makinesi ve sabitleme sistemleri ihtiyaçlarınız için uzman ekibimizle 
            tanışın. Size özel çözümler sunalım.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/iletisim" 
              className="px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 hover:-translate-y-0.5"
            >
              Ücretsiz Teklif Alın
            </Link>
            <a 
              href="tel:05353969768" 
              className="px-8 py-4 rounded-xl border-2 border-slate-300 hover:border-blue-500 text-slate-700 hover:text-blue-600 font-semibold transition-all duration-300"
            >
              Hemen Arayın: 0535 396 97 68
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}