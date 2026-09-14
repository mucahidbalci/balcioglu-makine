export default function Hakkimizda() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center text-slate-900 mb-12">Hakkımızda</h1>
      
      <div className="bg-white p-8 rounded-xl shadow-md space-y-6 text-slate-700 leading-relaxed">
        <p className="text-lg">
          <strong className="text-slate-900">Balcıoğlu Makina</strong> olarak 2006 yılından bu yana 
          plastik kılçık üretimi, rulo kılçık makinesi ve sabitleme sistemleri alanında 
          imalat, ithalat, ihracat ve pazarlama hizmetleri sunmaktayız.
        </p>
        
        <p>
          İstanbul Bağcılar'daki merkezimizden, başta tekstil ve ambalaj sektörü olmak üzere 
          birçok sektöre yenilikçi, ergonomik ve çevre dostu çözümler sunuyoruz.
        </p>

        <div className="bg-slate-50 p-6 rounded-lg border-l-4 border-orange-500">
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Vizyonumuz</h2>
          <p>
            Yerli üretim gücümüzü uluslararası standartlara taşıyarak, kılçık ve sabitleme 
            sistemleri alanında global bir marka olmak.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Neden Balcıoğlu Makina?</h2>
          <ul className="space-y-3">
            {[
              "15 yılı aşkın sektör tecrübesi",
              "Kırılan parçaların özel üretimi",
              "Yüksek kapasiteli, sessiz makine tasarımları",
              "Hızlı teknik destek ve yedek parça",
              "%100 müşteri memnuniyeti"
            ].map((item, index) => (
              <li key={index} className="flex items-start">
                <span className="text-orange-600 mr-3 text-xl">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}