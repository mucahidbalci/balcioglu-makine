import Link from "next/link";

export default function CerezPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Ana Sayfaya Dön
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">Çerez Politikası</h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 leading-relaxed mb-6">
            Balcıoğlu Makina web sitesi olarak, ziyaretçilerimize daha iyi bir deneyim sunmak amacıyla çerezler kullanmaktayız. Bu politika, çerezlerin nasıl kullanıldığını ve hangi haklara sahip olduğunuzu açıklar.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Çerez Nedir?</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Çerezler, web siteleri tarafından tarayıcınıza yerleştirilen küçük metin dosyalarıdır. Bu dosyalar, siteyi tekrar ziyaret ettiğinizde tanınmanızı ve tercihlerinizin hatırlanmasını sağlar.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Hangi Çerezleri Kullanıyoruz?</h2>
          
          <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Zorunlu Çerezler</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            Bu çerezler, web sitesinin temel işlevlerinin çalışması için gereklidir. Örneğin, çerez tercihlerinizin hatırlanması. Bu çerezler olmadan site düzgün çalışamaz.
          </p>

          <h3 className="text-xl font-semibold text-slate-900 mt-6 mb-3">Analitik Çerezler</h3>
          <p className="text-slate-600 leading-relaxed mb-4">
            Bu çerezler, siteyi nasıl kullandığınızı anlamamıza yardımcı olur. Hangi sayfaların ziyaret edildiği, ziyaret süresi ve cihaz bilgileri gibi veriler toplanır. Bu veriler, site deneyimini iyileştirmek için kullanılır.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Çerez Yönetimi</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Çerez tercihlerinizi istediğiniz zaman değiştirebilirsiniz. Tarayıcı ayarlarından çerezleri silebilir veya engelleyebilirsiniz. Ancak bazı çerezleri engellemek, site deneyiminizi olumsuz etkileyebilir.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Rıza Yönetimi</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Analitik çerezler kullanılmadan önce açık rızanız alınır. Rızanızı istediğiniz zaman geri çekebilirsiniz. Rıza durumu, tarayıcınızda güvenli bir şekilde saklanır.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. İletişim</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Çerez politikamız hakkında sorularınız için bize ulaşabilirsiniz:
          </p>
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
            <p className="text-slate-700 mb-2"><strong>E-posta:</strong> balcioglumakina@gmail.com</p>
            <p className="text-slate-700"><strong>Telefon:</strong> 0535 396 97 68</p>
          </div>

          <p className="text-slate-600 leading-relaxed mt-8 pt-6 border-t border-slate-200">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </main>
  );
}