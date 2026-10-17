import Products from "@/components/Products";

export const metadata = {
  title: "Ürünlerimiz",
  description: "Kılçık makineleri ve sabitleme sistemleri ürünlerimiz",
};

export default function UrunlerPage() {
  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-32 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            Ürünlerimiz
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
            Yüksek Kalite Standartlarında
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              Üretim
            </span>
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Kılçık makineleri ve sabitleme sistemleri alanında geniş ürün yelpazemizle hizmetinizdeyiz.
          </p>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <Products />
        </div>
      </section>
    </div>
  );
}