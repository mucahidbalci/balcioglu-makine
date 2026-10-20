"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Dashboard from "@/components/admin/Dashboard";
import NotificationBell from "@/components/admin/NotificationBell";
import ProductsManager from "@/components/admin/ProductsManager";
import VisitorsPanel from "@/components/admin/VisitorsPanel";
import SecurityCenter from "@/components/admin/SecurityCenter";

type TabKey = "dashboard" | "products" | "visitors" | "sales" | "security" | "settings";

function SalesTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders").then(r => r.json()).then(d => { setOrders(d || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-12 text-center text-gray-400">Yükleniyor...</div>;
  if (orders.length === 0) return <div className="p-12 text-center text-gray-400">Henüz teklif veya sipariş talebi yok.</div>;

  const statusColors: Record<string, string> = {
    PENDING: "bg-amber-900/30 text-amber-400 border-amber-800",
    CONTACTED: "bg-blue-900/30 text-blue-400 border-blue-800",
    CLOSED: "bg-gray-800 text-gray-400 border-gray-700",
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-900/50">
          <tr>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Tarih</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Müşteri</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Ürün</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">İletişim</th>
            <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Durum</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-gray-900/30 transition-colors">
              <td className="px-6 py-4 text-sm text-gray-400">{new Date(o.createdAt).toLocaleDateString("tr-TR")}</td>
              <td className="px-6 py-4"><div className="text-sm font-semibold text-white">{o.customerName}</div><div className="text-xs text-gray-500">{o.message?.substring(0, 30)}{o.message?.length > 30 ? "..." : ""}</div></td>
              <td className="px-6 py-4 text-sm text-gray-300">{o.productName}</td>
              <td className="px-6 py-4 text-sm text-gray-400"><div>{o.customerEmail}</div><div>{o.customerPhone}</div></td>
              <td className="px-6 py-4"><span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-medium border ${statusColors[o.status] || statusColors.PENDING}`}>{o.status === "PENDING" ? "Bekliyor" : o.status === "CONTACTED" ? "İletişimde" : "Kapandı"}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("dashboard");
  const [settings, setSettings] = useState({
    siteTitle: "Balcıoğlu Makina", phone: "0535 396 97 68", address: "Barbaros, 163. Sk No:5 Kat:3, 34165 Bağcılar/İstanbul",
    email: "balcioglumakina@gmail.com", instagramUrl: "#", facebookUrl: "#", linkedinUrl: "#", youtubeUrl: "#",
    heroText: "2006'dan beri kılçık makinesi ve sabitleme sistemlerinde güvenilir çözüm ortağınız.",
    metaDescription: "Kılçık makinesi ve sabitleme sistemleri", googleAnalyticsId: "", maintenanceMode: false,
  });
  const [excludedIps, setExcludedIps] = useState<string[]>([]);
  const [savingSettings, setSavingSettings] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();

  useEffect(() => { document.documentElement.classList.add("dark"); }, []);

  useEffect(() => {
    if (activeTab === "settings") {
      fetch("/api/admin/settings").then(r => r.json()).then(d => {
        if (d.siteTitle) setSettings(d);
        setExcludedIps((d.excludedIps || "").split(",").map((s: string) => s.trim()).filter(Boolean));
      });
    }
  }, [activeTab]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault(); setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      if (res.ok) showToast("Ayarlar kaydedildi", "success");
      else showToast("Ayarlar kaydedilemedi", "error");
    } catch { showToast("Bağlantı hatası", "error"); }
    finally { setSavingSettings(false); }
  };

  const handleExcludeMyIp = async () => {
    try {
      const res = await fetch("/api/admin/settings/exclude-ip", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setExcludedIps((data.excludedIps || "").split(",").map((s: string) => s.trim()).filter(Boolean));
        showToast("IP'niz hariç tutuldu, artık sayılmıyorsunuz", "success");
      } else showToast("IP eklenemedi", "error");
    } catch { showToast("Bağlantı hatası", "error"); }
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

  const navItems: { key: TabKey; label: string; icon: JSX.Element }[] = [
    { key: "dashboard", label: "Panel", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
    { key: "products", label: "Ürünler", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { key: "visitors", label: "Ziyaretçiler", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
    { key: "sales", label: "Satışlar", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3v18h18M7 14l4-4 4 4 5-5" /></svg> },
    { key: "security", label: "Güvenlik", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
    { key: "settings", label: "Ayarlar", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <div className="min-h-screen flex bg-[#0d1117] text-white font-sans">
      {toast && <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-white font-medium ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>{toast.message}</div>}

      <aside className="w-64 bg-[#161b22] flex flex-col fixed left-0 top-0 h-screen border-r border-gray-800 z-40">
        <div className="px-6 py-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            </div>
            <div><h1 className="text-base font-semibold tracking-tight">Balcıoğlu Makina</h1><p className="text-xs text-gray-500 font-medium">Yönetim Paneli</p></div>
          </div>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => (
            <button key={item.key} onClick={() => setActiveTab(item.key)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === item.key ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-gray-400 hover:text-white hover:bg-gray-800"}`}>
              {item.icon}{item.label}
            </button>
          ))}
        </nav>
        <div className="px-4 py-6 border-t border-gray-800 space-y-1.5">
          <button onClick={() => window.open("/", "_blank")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            Siteyi Görüntüle
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 lg:p-10">
        <div className="flex justify-end mb-6">
          <NotificationBell onOpenSales={() => setActiveTab("sales")} />
        </div>

        {activeTab === "dashboard" && <Dashboard onNavigate={(tab) => setActiveTab(tab as TabKey)} />}

        {activeTab === "products" && <ProductsManager />}

        {activeTab === "visitors" && <VisitorsPanel />}

        {activeTab === "sales" && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Teklif ve Siparişler</h2>
            <p className="text-sm text-gray-400 mb-8">Müşterilerden gelen teklif talepleri ve siparişler.</p>
            <div className="bg-[#161b22] rounded-2xl border border-gray-800 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-800"><h3 className="text-base font-bold tracking-tight">Son Talepler</h3></div>
              <SalesTable />
            </div>
          </div>
        )}

                {activeTab === "security" && <SecurityCenter />}

        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Site Ayarları</h2>
            <p className="text-sm text-gray-400 mb-8">Site genel bilgilerini, SEO ayarlarını ve ziyaretçi sayımını buradan yönetin.</p>
            <form onSubmit={handleSaveSettings} className="bg-[#161b22] rounded-2xl border border-gray-800 p-6 lg:p-8 max-w-3xl space-y-6">
              <div className="border-b border-gray-800 pb-6">
                <h3 className="text-lg font-semibold mb-4">Genel Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Site Başlığı</label><input type="text" value={settings.siteTitle} onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Telefon</label><input type="text" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className={inputClass} /></div>
                </div>
                <div className="mt-6"><label className="block text-sm font-semibold text-gray-300 mb-2">Adres</label><textarea value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} rows={2} className={`${inputClass} resize-none`} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">E-posta</label><input type="email" value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Bakım Modu</label>
                    <button type="button" onClick={() => setSettings({ ...settings, maintenanceMode: !settings.maintenanceMode })} className={`w-full px-4 py-2.5 rounded-xl font-semibold transition-all ${settings.maintenanceMode ? "bg-amber-600 text-white" : "bg-gray-800 text-gray-400"}`}>{settings.maintenanceMode ? "Aktif" : "Pasif"}</button>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-800 pb-6">
                <h3 className="text-lg font-semibold mb-2">Ziyaretçi Sayımı</h3>
                <p className="text-sm text-gray-400 mb-4">Bu listedeki IP adresleri ziyaretçi istatistiklerine <strong className="text-white">dahil edilmez</strong>. Kendi IP'nizi eklemek için butona basın; IP'niz değişirse tekrar basın.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {excludedIps.map((ip) => (
                    <span key={ip} className="px-3 py-1.5 rounded-lg bg-gray-800 border border-gray-700 text-xs font-mono text-gray-300">{ip}</span>
                  ))}
                  {excludedIps.length === 0 && <span className="text-xs text-gray-500">Kayıtlı IP yok.</span>}
                </div>
                <button type="button" onClick={handleExcludeMyIp} className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-sm font-semibold text-white transition-all">
                  IP'mi Hariç Tut (Beni Sayma)
                </button>
              </div>

              <div className="border-b border-gray-800 pb-6">
                <h3 className="text-lg font-semibold mb-4">SEO Ayarları</h3>
                <div><label className="block text-sm font-semibold text-gray-300 mb-2">Meta Açıklama</label><textarea value={settings.metaDescription} onChange={(e) => setSettings({ ...settings, metaDescription: e.target.value })} rows={2} className={`${inputClass} resize-none`} /></div>
                <div className="mt-6"><label className="block text-sm font-semibold text-gray-300 mb-2">Google Analytics ID</label><input type="text" value={settings.googleAnalyticsId} onChange={(e) => setSettings({ ...settings, googleAnalyticsId: e.target.value })} className={inputClass} placeholder="G-XXXXXXXXXX" /></div>
              </div>

              <div className="border-b border-gray-800 pb-6">
                <h3 className="text-lg font-semibold mb-4">Sosyal Medya Linkleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Instagram</label><input type="url" value={settings.instagramUrl} onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Facebook</label><input type="url" value={settings.facebookUrl} onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">LinkedIn</label><input type="url" value={settings.linkedinUrl} onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">YouTube</label><input type="url" value={settings.youtubeUrl} onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })} className={inputClass} /></div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Ana Sayfa İçeriği</h3>
                <div><label className="block text-sm font-semibold text-gray-300 mb-2">Hero Metni</label><textarea value={settings.heroText} onChange={(e) => setSettings({ ...settings, heroText: e.target.value })} rows={3} className={`${inputClass} resize-none`} /></div>
              </div>

              <div className="pt-6 border-t border-gray-800 flex justify-end">
                <button type="submit" disabled={savingSettings} className="px-8 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 flex items-center gap-2">
                  {savingSettings && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                  {savingSettings ? "Kaydediliyor..." : "Tüm Ayarları Kaydet"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}