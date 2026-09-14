import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-orange-900 text-white py-24 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
          Kılçık Makinesi ve Sabitleme Sistemlerinde{" "}
          <span className="text-orange-500">Güvenilir Çözüm Ortağınız</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-300 mb-10 max-w-3xl mx-auto leading-relaxed">
          2006 yılından bu yana imalat, ithalat, ihracat ve pazarlama alanlarında sektörün öncüsü, 
          kaliteden ödün vermeyen hizmet anlayışı.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/iletisim"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-4 px-8 rounded-lg transition duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Bize Ulaşın
          </Link>
          <Link
            href="/urunler"
            className="bg-transparent border-2 border-white hover:bg-white hover:text-slate-900 text-white font-semibold py-4 px-8 rounded-lg transition duration-300"
          >
            Ürünlerimiz
          </Link>
        </div>
      </div>
    </section>
  );
}