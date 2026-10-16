import Products from "@/components/Products";

export const metadata = {
  title: "Ürünlerimiz | Balcıoğlu Makina",
  description: "Kılçık makineleri ve sabitleme sistemleri ürünlerimiz",
};

export default function UrunlerPage() {
  return (
    <div className="pt-16">
      <Products />
    </div>
  );
}