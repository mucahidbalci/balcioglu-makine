import Link from "next/link";

export default function Tesekkurler() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-orange-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white p-12 rounded-2xl shadow-2xl max-w-2xl w-full text-center">
        <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
          <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-slate-900 mb-6">Mesajınız Başarıyla Gönderildi!</h1>
        
        <p className="text-lg text-slate-600 mb-8">
          En kısa sürede size dönüş yapacağız.
        </p>
        
        <div className="bg-slate-50 rounded-xl p-6 mb-8">
          <p className="text-slate-700 mb-2 font-semibold">Acil durumlarda:</p>
          <a href="tel:05353969768" className="text-2xl font-bold text-orange-600">
            📞 0535 396 97 68
          </a>
        </div>
        
        <div className="grid md:grid-cols-2 gap-4">
          <Link href="/" className="block w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-8 rounded-xl transition">
            Ana Sayfaya Dön
          </Link>
          <Link href="/iletisim" className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-4 px-8 rounded-xl transition">
            Yeni Mesaj Gönder
          </Link>
        </div>
      </div>
    </div>
  );
}