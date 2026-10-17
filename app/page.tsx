import Link from "next/link";
import Products from "@/components/Products";

export default function Home() {
  return (
    <div>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="inline-block px-4 py-1.5 rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-300 text-xs font-semibold uppercase tracking-widest mb-8">
            2006'dan beri
          </span>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
            Kılçık Makinesi ve Sabitleme Sistemlerinde
            <br />
            <span className="text-orange-500">Güvenilir Çözüm Ortağınız</span>
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto mb-10">
            İmalat, ithalat, ihracat ve pazarlama alanlarında sektörün öncüsü, kaliteden ödün vermeyen hizmet anlayışı.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/iletisim" className="px-8 py-3.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold transition">Bize Ulaşın</Link>
            <Link href="/urunler" className="px-8 py-3.5 rounded-lg border border-slate-500 hover:border-orange-500 hover:text-orange-400 text-white font-semibold transition">Ürünlerimiz</Link>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-[#faf8f5]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Neden Bizi Tercih Etmelisiniz?</h2>
            <p className="text-slate-600 max-w-xl mx-auto">Ciddiyetimiz işimizde, sıcaklığımız soframızda.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition">
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Yüksek Kalite</h3>
              <p className="text-slate-600">Ürünlerimiz en son teknoloji ile üretilmekte ve titiz kalite kontrol süreçlerinden geçmektedir.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition">
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Hızlı Teknik Servis</h3>
              <p className="text-slate-600">Sorunlarınıza "Hızır gibi" yetişen teknik ekibimizle iş akışınız asla aksamaz.</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-xl transition">
              <div className="w-14 h-14 rounded-xl bg-orange-50 flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Müşteri Memnuniyeti</h3>
              <p className="text-slate-600">Güler yüzlü hizmet, samimiyet ve sınırsız çay keyfi ile misafirperverliğimizi hissettiriyoruz.</p>
            </div>
          </div>
        </div>
      </section>

      <Products />

      <section className="py-20 px-4 bg-[#f3efe9]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-orange-600 font-semibold text-sm uppercase tracking-widest mb-3">Müşterilerimiz Ne Diyor?</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Bizim İçin En Güzel Ödül</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-7">
              <span className="text-5xl text-orange-500 leading-none">"</span>
              <p className="text-slate-700 text-sm mt-2 mb-4">Bedava çay ikramı var istediğin kadar içebiliyorsun. Allah razı olsun.</p>
              <p className="font-semibold text-slate-900 text-sm">Nurullah Gültey</p>
              <p className="text-xs text-slate-400">6 yıl önce</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-7">
              <span className="text-5xl text-orange-500 leading-none">"</span>
              <p className="text-slate-700 text-sm mt-2 mb-4">Sıkıntılara Hızır gibi yetişmeleri en çok beğendiğim yanları.</p>
              <p className="font-semibold text-slate-900 text-sm">Rıza Sevilir</p>
              <p className="text-xs text-slate-400">5 yıl önce</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-7">
              <span className="text-5xl text-orange-500 leading-none">"</span>
              <p className="text-slate-700 text-sm mt-2 mb-4">Çok güzel karşılandık. Makine tamiri boyunca sıkılmadan bekledik.</p>
              <p className="font-semibold text-slate-900 text-sm">Ömer Şen</p>
              <p className="text-xs text-slate-400">5 yıl önce</p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-7">
              <span className="text-5xl text-orange-500 leading-none">"</span>
              <p className="text-slate-700 text-sm mt-2 mb-4">Güven ve kalitenin doğru adresi Balcıoğlu Makina.</p>
              <p className="font-semibold text-slate-900 text-sm">Sebahattin Kuşal</p>
              <p className="text-xs text-slate-400">4 yıl önce</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-900 text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">İletişime Geçin</h2>
          <p className="text-slate-300 text-lg mb-9 max-w-xl mx-auto">Sorularınız için bize ulaşın. Çayımız da hazır.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="tel:05353969768" className="px-8 py-3.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-semibold transition">Hemen Ara</a>
            <Link href="/iletisim" className="px-8 py-3.5 rounded-lg border border-slate-500 hover:border-orange-500 hover:text-orange-400 text-white font-semibold transition">İletişim Formu</Link>
          </div>
        </div>
      </section>
    </div>
  );
}