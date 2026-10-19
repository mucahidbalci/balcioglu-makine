"use client";

import { useState, useEffect } from "react";

export default function Dashboard({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const [stats, setStats] = useState({ today: 0, pending: 0, products: 0, active: 0 });
  const [week, setWeek] = useState<{ label: string; value: number }[]>([]);
  const [latestOrders, setLatestOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [dayRes, ordersRes, productsRes, weekRes] = await Promise.all([
          fetch("/api/track?period=day"),
          fetch("/api/orders"),
          fetch("/api/admin/products"),
          fetch("/api/track?period=week"),
        ]);
        const day = await dayRes.json();
        const orders = await ordersRes.json();
        const products = await productsRes.json();
        const weekData = await weekRes.json();

        setStats({
          today: day.uniqueVisitors || 0,
          pending: (orders || []).filter((o: any) => o.status === "PENDING").length,
          products: (products || []).length,
          active: (products || []).filter((p: any) => p.isActive).length,
        });
        setLatestOrders((orders || []).slice(0, 5));
        setWeek(weekData.daily || []);
      } catch (e) {
        console.error("Dashboard yüklenemedi:", e);
      } finally {
        setLoading(false);
      }
    };
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  const max = Math.max(...week.map((w) => w.value), 1);

  if (loading) return <div className="p-12 text-center text-gray-400">Panel yükleniyor...</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight mb-1">Genel Bakış</h2>
      <p className="text-sm text-gray-400 mb-8">İşletmenin günlük durumu — 30 saniyede bir otomatik yenilenir.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
          <p className="text-sm font-medium text-gray-400 mb-2">Bugünkü Tekil Ziyaretçi</p>
          <p className="text-3xl font-bold text-white">{stats.today}</p>
        </div>
        <button onClick={() => onNavigate("sales")} className="text-left bg-[#161b22] rounded-2xl border border-gray-800 p-6 hover:border-amber-700 transition-colors">
          <p className="text-sm font-medium text-gray-400 mb-2">Bekleyen Teklif</p>
          <p className={`text-3xl font-bold ${stats.pending > 0 ? "text-amber-400" : "text-white"}`}>{stats.pending}</p>
        </button>
        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
          <p className="text-sm font-medium text-gray-400 mb-2">Toplam Ürün</p>
          <p className="text-3xl font-bold text-white">{stats.products}</p>
        </div>
        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
          <p className="text-sm font-medium text-gray-400 mb-2">Aktif Ürün</p>
          <p className="text-3xl font-bold text-emerald-400">{stats.active}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6">
          <h3 className="text-base font-bold mb-6">Son 7 Gün Ziyaret Trafiği</h3>
          <div className="flex items-end gap-3 h-40">
            {week.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end" style={{ height: "120px" }}>
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(d.value / max) * 100}%`, minHeight: d.value > 0 ? "6px" : "2px" }}
                    title={`${d.value} ziyaret`}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-bold">Son Teklifler</h3>
            <button onClick={() => onNavigate("sales")} className="text-xs text-blue-400 hover:text-blue-300 font-medium">Tümünü Gör →</button>
          </div>
          {latestOrders.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-10">Henüz teklif talebi yok.</p>
          ) : (
            <div className="space-y-2">
              {latestOrders.map((o) => (
                <div key={o.id} className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-gray-900/40 border border-gray-800">
                  <div>
                    <p className="text-sm font-semibold text-white">{o.customerName}</p>
                    <p className="text-xs text-gray-500">{o.productName}</p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-md border ${
                    o.status === "PENDING" ? "bg-amber-900/30 text-amber-400 border-amber-800" :
                    o.status === "CONTACTED" ? "bg-blue-900/30 text-blue-400 border-blue-800" :
                    "bg-gray-800 text-gray-400 border-gray-700"
                  }`}>
                    {o.status === "PENDING" ? "Bekliyor" : o.status === "CONTACTED" ? "İletişimde" : "Kapandı"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}