import Link from "next/link";

export default function ContactSection() {
  return (
    <section className="py-16 px-4 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">İletişime Geçin</h2>
        <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
          Sorularınız için bize ulaşın. En kısa sürede size dönüş yapalım.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="tel:05353969768"
            className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
          >
            📞 Hemen Ara
          </Link>
          <Link
            href="/iletisim"
            className="bg-white text-slate-900 hover:bg-slate-100 font-semibold py-3 px-8 rounded-lg transition duration-300"
          >
            İletişim Formu
          </Link>
        </div>
      </div>
    </section>
  );
}