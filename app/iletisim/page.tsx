"use client";

export default function Iletisim() {
  const formatPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 10);
    
    if (value.length <= 3) {
      e.target.value = value;
    } else if (value.length <= 6) {
      e.target.value = `${value.slice(0, 3)} ${value.slice(3)}`;
    } else if (value.length <= 8) {
      e.target.value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6)}`;
    } else {
      e.target.value = `${value.slice(0, 3)} ${value.slice(3, 6)} ${value.slice(6, 8)} ${value.slice(8, 10)}`;
    }
  };

  const updateCharCount = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const count = document.getElementById('charCount');
    if (count) {
      count.textContent = `${e.target.value.length}/1000`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-slate-900 mb-12">İletişim</h1>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* SOL TARAF */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-xl shadow-md">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">İletişim Bilgileri</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Adres</h3>
                    <p className="text-slate-600">Barbaros, 163. Sk No:5 Kat:3<br/>34165 Bağcılar/İstanbul</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">Telefon</h3>
                    <p className="text-slate-600">0535 396 97 68</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">E-posta</h3>
                    <p className="text-slate-600">balcioglumakina@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-1">İletişim Kişisi</h3>
                    <p className="text-slate-600">Ekrem BALCI</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-4">
                <a href="tel:05353969768" className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-4 rounded-lg transition text-center">
                  Hemen Ara
                </a>
                <a href="https://wa.me/905353969768" target="_blank" rel="noopener noreferrer" className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition text-center">
                  WhatsApp
                </a>
              </div>
            </div>

            {/* Harita */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Konum</h3>
              <div className="relative w-full h-80 rounded-lg overflow-hidden bg-slate-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.123456789!2d28.8328552!3d41.0298904!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cabb21502b016d%3A0x3a38b269b73f97ad!2sBarbaros%2C%20163.%20Sk%20No%3A5!5e0!3m2!1str!2str!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Balcıoğlu Makina Konum"
                  className="absolute inset-0"
                ></iframe>
              </div>
              <a
                href="https://www.google.com/maps/place/K%C4%B1l%C3%A7%C4%B1k+Makinesi+ve+Rulo+K%C4%B1l%C3%A7%C4%B1k+ile+sabitleme+sistemleri+imalat+ithalat+ihracat+ve+pazarlama+Balc%C4%B1o%C4%9Flu+Makina+Pls.San.Tic.Hiz./@41.0298904,28.8328552,17z/data=!3m1!4b1!4m6!3m5!1s0x14cabb21502b016d:0x3a38b269b73f97ad!8m2!3d41.0298864!4d28.8354301!16s%2Fg%2F1ptw4mhxz?entry=ttu&g_ep=EgoyMDI2MDkwOS4wIKXMDSoASAFQAw%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-4 text-orange-600 hover:text-orange-700 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                Haritada Aç
              </a>
            </div>
          </div>

          {/* SAĞ TARAF - Form */}
          <div className="bg-white p-8 rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Bize Ulaşın</h2>
            <p className="text-slate-600 mb-6">Proje detaylarınızı paylaşın, size en kısa sürede dönüş yapalım.</p>

            <form 
              action="https://formsubmit.co/balcioglumakina@gmail.com"
              method="POST"
              className="space-y-5"
            >
              <input type="hidden" name="_subject" value="Yeni İletişim Formu - Balcıoğlu Makina" />
              <input type="hidden" name="_next" value="http://localhost:3000/tesekkurler" />
              <input type="hidden" name="_captcha" value="false" />

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">Adınız Soyadınız</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="Adınızı girin"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">E-posta Adresiniz</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  maxLength={100}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="ornek@email.com"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">Telefon Numaranız</label>
                <input
                  type="tel"
                  id="phone"
                  name="telefon"
                  required
                  maxLength={14}
                  onInput={formatPhone}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  placeholder="05XX XXX XX XX"
                />
                <p className="text-xs text-slate-500 mt-1">Sadece rakam girebilirsiniz.</p>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">Konu</label>
                <select
                  id="subject"
                  name="konu"
                  required
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Seçiniz</option>
                  <option value="Teklif">Teklif Al</option>
                  <option value="Teknik Destek">Teknik Destek</option>
                  <option value="Yedek Parça">Yedek Parça</option>
                  <option value="Genel Bilgi">Genel Bilgi</option>
                  <option value="Diger">Diğer</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">Mesajınız</label>
                <textarea
                  id="message"
                  name="mesaj"
                  required
                  rows={5}
                  minLength={10}
                  maxLength={1000}
                  onInput={updateCharCount}
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  placeholder="Mesajınızı buraya yazın..."
                />
                <div className="flex justify-between items-center mt-2">
                  <p className="text-xs text-slate-500">Minimum 10 karakter</p>
                  <p className="text-xs text-orange-600 font-medium" id="charCount">0/1000</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-4 px-6 rounded-lg transition duration-300 shadow-lg flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}