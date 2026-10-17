import Link from "next/link";

export default function KvkkPage() {
  return (
    <main className="min-h-screen bg-[#faf8f5] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium mb-8">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Ana Sayfaya Dön
        </Link>

        <h1 className="text-4xl font-bold text-slate-900 mb-8">KVKK Aydınlatma Metni</h1>

        <div className="prose prose-slate max-w-none">
          <p className="text-slate-600 leading-relaxed mb-6">
            Balcıoğlu Makina olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verilerinizin işlenmesine ilişkin aşağıda belirtilen hususları açıklıyoruz.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">1. Veri Sorumlusu</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Kişisel verileriniz, Balcıoğlu Makina (İstanbul Bağcılar merkezli) tarafından veri sorumlusu sıfatıyla işlenmektedir.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">2. Kişisel Verilerin İşlenme Amaçları</h2>
          <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
            <li>İletişim formu üzerinden tarafımıza ulaşan taleplerinizin yanıtlanması</li>
            <li>Ürün ve hizmetlerimiz hakkında bilgi verilmesi</li>
            <li>Teknik destek ve satış sonrası hizmetlerin sağlanması</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            <li>Web sitesi kullanım istatistiklerinin analizi (çerez politikası kapsamında)</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">3. Kişisel Verilerin Aktarılması</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Kişisel verileriniz, yukarıda belirtilen amaçlar doğrultusunda, yurtiçinde veya yurtdışında bulunan üçüncü kişilere aktarılmamaktadır. Yasal zorunluluklar saklıdır.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">4. Kişisel Verilerin Toplanması Yöntemi ve Hukuki Sebebi</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Kişisel verileriniz, web sitemiz üzerinden iletişim formu doldurulması, çerezler aracılığıyla otomatik olarak veya sözlü/yazılı başvuru yöntemleriyle toplanmaktadır. KVKK'nın 5. ve 6. maddelerinde belirtilen şartlar çerçevesinde işlenmektedir.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">5. Veri Sahibinin Hakları</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            KVKK'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:
          </p>
          <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-6">
            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
            <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
            <li>Kişisel verilerinizin işlenme amacını ve bunların amacına uygun kullanılıp kullanılmadığını öğrenme</li>
            <li>Yurtiçinde veya yurtdışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme</li>
            <li>Kişisel verilerinizin eksik veya yanlış işlenmiş olması hâlinde bunların düzeltilmesini isteme</li>
            <li>KVKK'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme</li>
            <li>Yukarıdaki bentler uyarınca yapılan işlemlerin, kişisel verilerinizin aktarıldığı üçüncü kişilere bildirilmesini isteme</li>
            <li>İşlenen verilerin münhasıran otomatik sistemler vasıtasıyla analiz edilmesi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme</li>
            <li>Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme</li>
          </ul>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">6. İletişim</h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            KVKK kapsamındaki haklarınızı kullanmak için aşağıdaki iletişim bilgileri üzerinden bize ulaşabilirsiniz:
          </p>
          <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
            <p className="text-slate-700 mb-2"><strong>Adres:</strong> Barbaros, 163. Sk No:5 Kat:3, 34165 Bağcılar/İstanbul</p>
            <p className="text-slate-700 mb-2"><strong>Telefon:</strong> 0535 396 97 68</p>
            <p className="text-slate-700"><strong>E-posta:</strong> balcioglumakina@gmail.com</p>
          </div>

          <p className="text-slate-600 leading-relaxed mt-8 pt-6 border-t border-slate-200">
            Son güncelleme: {new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>
    </main>
  );
}