import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-7xl font-bold text-orange-600 mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Sayfa Bulunamadı</h1>
        <p className="text-slate-600 mb-8">Aradığınız sayfa taşınmış veya kaldırılmış olabilir.</p>
        <Link
          href="/"
          className="inline-block px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-lg transition"
        >
          Ana Sayfaya Dön
        </Link>
      </div>
    </div>
  );
}