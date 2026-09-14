import Products from "@/components/Products";

export default function Urunler() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-slate-900 mb-4">Ürünlerimiz</h1>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">
          Yüksek kalite standartlarında ürettiğimiz kılçık makineleri ve sabitleme sistemleri
        </p>
        <Products />
      </div>
    </div>
  );
}