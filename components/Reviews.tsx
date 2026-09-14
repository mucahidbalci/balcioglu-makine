const reviews = [
  { name: "Nurullah Günay", rating: 5, date: "6 yıl önce", text: "Bedava çay ikramı var😀 istediğin kadar içebiliyorsun. Doldur iç sistemi yapmışlar. Allah razı olsun. Müşterinin memnuniyeti üst düzeyde." },
  { name: "Rıza Sevimli", rating: 5, date: "8 yıl önce", text: "Hizmetlerinden çok memnuniyet duyuyorum. En çok beğendiğim yanlarından bir tanesi de sıkıntılara Hızır gibi yetişmeleri." },
  { name: "Ömer Sarı", rating: 5, date: "6 yıl önce", text: "Çok güzel karşılandık. İşçilik ve ikramları ile makine tamiri boyunca sıkılmadan bekledik, teşekkürler :)" },
  { name: "Sabahattin Kudal", rating: 5, date: "4 yıl önce", text: "Güven ve kalitenin doğru adresi Balcıoğlu Makina." },
];

export default function Reviews() {
  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-12">Müşterilerimiz Ne Diyor?</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="bg-slate-50 p-6 rounded-xl border border-slate-200">
              <div className="flex mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-slate-700 text-sm mb-4 italic">"{review.text}"</p>
              <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-200 pt-3">
                <span className="font-semibold text-slate-900">{review.name}</span>
                <span>{review.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}