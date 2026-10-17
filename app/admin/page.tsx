"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string; name: string; description: string; price: string | null;
  features: string[]; imageUrl: string | null; images: string[];
  isActive: boolean; createdAt: string;
}

type TabKey = "products" | "visitors" | "sales" | "security" | "settings";

// ============ SALES TABLE COMPONENT ============
function SalesTable() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/orders")
      .then(res => res.json())
      .then(data => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
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
          {orders.map((order) => (
            <tr key={order.id} className="hover:bg-gray-900/30 transition-colors duration-150">
              <td className="px-6 py-4 text-sm text-gray-400">{new Date(order.createdAt).toLocaleDateString('tr-TR')}</td>
              <td className="px-6 py-4">
                <div className="text-sm font-semibold text-white">{order.customerName}</div>
                <div className="text-xs text-gray-500">{order.message?.substring(0, 30)}{order.message?.length > 30 ? '...' : ''}</div>
              </td>
              <td className="px-6 py-4 text-sm text-gray-300">{order.productName}</td>
              <td className="px-6 py-4 text-sm text-gray-400">
                <div>{order.customerEmail}</div>
                <div>{order.customerPhone}</div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${statusColors[order.status] || statusColors.PENDING}`}>
                  {order.status === "PENDING" ? "Bekliyor" : order.status === "CONTACTED" ? "İletişime Geçildi" : "Kapandı"}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// ================================================

function resizeImage(file: File, maxW = 1920, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) { URL.revokeObjectURL(url); return reject(new Error("canvas")); }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((blob) => {
        if (!blob) return reject(new Error("blob"));
        resolve(new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", { type: "image/jpeg" }));
      }, "image/jpeg", quality);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("img")); };
    img.src = url;
  });
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);
  
  const [visitorStats, setVisitorStats] = useState({ today: 0, week: 0, month: 0, desktop: 0, mobile: 0, tablet: 0 });
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const router = useRouter();

  const [formData, setFormData] = useState({ name: "", description: "", price: "", features: "", imageUrl: "" });
  const [settings, setSettings] = useState({
    siteTitle: "Balcıoğlu Makina", phone: "0535 396 97 68", address: "Barbaros, 163. Sk No:5 Kat:3, 34165 Bağcılar/İstanbul",
    email: "balcioglumakina@gmail.com", instagramUrl: "#", facebookUrl: "#", linkedinUrl: "#", youtubeUrl: "#",
    heroText: "2006'dan beri kılçık makinesi ve sabitleme sistemlerinde güvenilir çözüm ortağınız.",
    metaDescription: "Kılçık makinesi ve sabitleme sistemleri", googleAnalyticsId: "", maintenanceMode: false,
  });
  const [savingSettings, setSavingSettings] = useState(false);

  useEffect(() => { document.documentElement.classList.add("dark"); }, []);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dayRes, weekRes, monthRes] = await Promise.all([
          fetch("/api/track?period=day"), fetch("/api/track?period=week"), fetch("/api/track?period=month"),
        ]);
        const dayData = await dayRes.json();
        const weekData = await weekRes.json();
        const monthData = await monthRes.json();
        setVisitorStats({
          today: dayData.uniqueVisitors || 0, week: weekData.uniqueVisitors || 0, month: monthData.uniqueVisitors || 0,
          desktop: monthData.records.filter((v: any) => v.deviceType === "desktop").length,
          mobile: monthData.records.filter((v: any) => v.deviceType === "mobile").length,
          tablet: monthData.records.filter((v: any) => v.deviceType === "tablet").length,
        });
        setRecentVisits(monthData.records.slice(0, 10));
      } catch (error) { console.error("Analytics yüklenemedi:", error); }
    };
    fetchAnalytics();
    const interval = setInterval(fetchAnalytics, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeTab === "settings") {
      fetch("/api/admin/settings").then(res => res.json()).then(data => { if (data.siteTitle) setSettings(data); });
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try { setProducts(await (await fetch("/api/admin/products")).json()); }
    catch { showToast("Ürünler yüklenemedi", "error"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchProducts(); }, []);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", price: "", features: "", imageUrl: "" });
    setMainImageFile(null); setExtraImageFiles([]); setEditingProduct(null); setShowForm(false); setImageMode("url");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const filesToUpload: File[] = [];
    if (imageMode === "file" && mainImageFile) filesToUpload.push(mainImageFile);
    filesToUpload.push(...extraImageFiles);

    const uploadedUrls: string[] = [];
    for (const original of filesToUpload) {
      try {
        const file = await resizeImage(original);
        const fd = new FormData(); fd.append("file", file);
        const res = await fetch("/api/admin/upload-image", { method: "POST", body: fd });
        if (res.ok) { const { url } = await res.json(); uploadedUrls.push(url); }
      } catch (err) { console.error("Resim yüklenemedi:", original.name, err); }
    }

    const finalImageUrl = imageMode === "url" ? formData.imageUrl : uploadedUrls[0] || "";
    const extraImages = imageMode === "url" ? uploadedUrls : uploadedUrls.slice(1);

    try {
      const res = await fetch("/api/admin/products", {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingProduct?.id, name: formData.name, description: formData.description, price: formData.price, features: formData.features, imageUrl: finalImageUrl, images: extraImages }),
      });
      if (res.ok) { showToast(editingProduct ? "Ürün güncellendi" : "Ürün eklendi", "success"); resetForm(); fetchProducts(); }
      else { showToast("İşlem başarısız", "error"); }
    } catch { showToast("Bağlantı hatası", "error"); }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, description: product.description, price: product.price || "", features: product.features?.join(", ") || "", imageUrl: product.imageUrl || "" });
    setShowForm(true); setViewingProduct(null); setImageMode("url");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/products?id=${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) { showToast("Ürün silindi", "success"); fetchProducts(); }
      else { showToast("Silme işlemi başarısız", "error"); }
    } catch { showToast("Bağlantı hatası", "error"); }
    finally { setDeleteTarget(null); }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault(); setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(settings) });
      if (res.ok) showToast("Ayarlar başarıyla kaydedildi", "success");
      else showToast("Ayarlar kaydedilemedi", "error");
    } catch { showToast("Bağlantı hatası", "error"); }
    finally { setSavingSettings(false); }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
  const stats = { total: products.length, active: products.filter((p) => p.isActive).length, withImage: products.filter((p) => p.imageUrl).length };
  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

  const navItems: { key: TabKey; label: string; icon: JSX.Element }[] = [
    { key: "products", label: "Ürünler", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
    { key: "visitors", label: "Ziyaretçiler", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
    { key: "sales", label: "Satışlar", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3v18h18M7 14l4-4 4 4 5-5" /></svg> },
    { key: "security", label: "Güvenlik", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg> },
    { key: "settings", label: "Ayarlar", icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
  ];

  return (
    <div className="min-h-screen flex bg-[#0d1117] text-white font-sans">
      {toast && <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-white font-medium transition-all duration-300 ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>{toast.message}</div>}

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
          <button onClick={() => window.open("/", "_blank")} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            Siteyi Görüntüle
          </button>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Çıkış Yap
          </button>
        </div>
      </aside>

      <main className="flex-1 ml-64 p-8 lg:p-10">
        {activeTab === "products" && (
          <>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div><h2 className="text-2xl font-bold tracking-tight">Ürün Yönetimi</h2><p className="text-sm text-gray-400 mt-1">Toplam {stats.total} ürün kayıtlı</p></div>
              <button onClick={() => { resetForm(); setShowForm(true); }} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg> Yeni Ürün Ekle
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
              {[{ label: "Toplam Ürün", value: stats.total, color: "text-white" }, { label: "Aktif Ürün", value: stats.active, color: "text-emerald-400" }, { label: "Görselli Ürün", value: stats.withImage, color: "text-blue-400" }].map((stat, i) => (
                <div key={i} className="bg-[#161b22] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-colors duration-300">
                  <p className="text-sm font-medium text-gray-400 mb-2">{stat.label}</p><p className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
            <div className="mb-6 relative max-w-sm">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input type="text" placeholder="Ürün ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#161b22] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
            </div>
            {showForm && (
              <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6 lg:p-8 mb-8 animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold tracking-tight">{editingProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}</h3>
                  <button onClick={resetForm} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div><label className="block text-sm font-semibold text-gray-300 mb-2">Ürün Adı *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={inputClass} required /></div>
                    <div><label className="block text-sm font-semibold text-gray-300 mb-2">Fiyat</label><input type="text" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} className={inputClass} placeholder="Örn: 5.000 TL" /></div>
                  </div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Açıklama *</label><textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} className={`${inputClass} resize-none`} required /></div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Özellikler</label><input type="text" value={formData.features} onChange={(e) => setFormData({ ...formData, features: e.target.value })} className={inputClass} placeholder="Virgülle ayırın: Hızlı, Pratik, Dayanıklı" /></div>
                  <div className="border-t border-gray-800 pt-6">
                    <label className="block text-sm font-semibold text-gray-300 mb-3">Ana Görsel</label>
                    <div className="flex gap-3 mb-4">
                      {(["url", "file"] as const).map((mode) => (
                        <button key={mode} type="button" onClick={() => setImageMode(mode)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${imageMode === mode ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
                          {mode === "url" ? "Link ile Ekle" : "Bilgisayardan Yükle"}
                        </button>
                      ))}
                    </div>
                    {imageMode === "url" ? <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className={inputClass} placeholder="https://ornek.com/resim.jpg" /> : <input type="file" accept="image/*" onChange={(e) => setMainImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-8 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/50 text-gray-400 text-sm text-center hover:border-blue-500 hover:bg-blue-900/10 transition-all cursor-pointer" />}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-2">Ek Görseller (Çoklu)</label>
                    <input type="file" accept="image/*" multiple onChange={(e) => setExtraImageFiles(Array.from(e.target.files || []))} className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-900/30 file:text-blue-400 hover:file:bg-blue-900/50 transition-all" />
                    {extraImageFiles.length > 0 && <p className="text-xs text-blue-400 mt-2 font-medium">{extraImageFiles.length} dosya seçildi</p>}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                    <button type="button" onClick={resetForm} className="px-6 py-2.5 text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-200">İptal</button>
                    <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200">{editingProduct ? "Güncelle" : "Kaydet"}</button>
                  </div>
                </form>
              </div>
            )}
            <div className="bg-[#161b22] rounded-2xl border border-gray-800 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center"><h3 className="text-base font-bold tracking-tight">Ürün Listesi ({filteredProducts.length})</h3></div>
              {loading ? <div className="p-12 text-center text-gray-400">Yükleniyor...</div> : filteredProducts.length === 0 ? <div className="p-12 text-center text-gray-400">{searchQuery ? "Arama sonucu bulunamadı" : "Henüz ürün eklenmemiş"}</div> : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-900/50"><tr><th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Ürün</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Fiyat</th><th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Özellikler</th><th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">İşlemler</th></tr></thead>
                    <tbody className="divide-y divide-gray-800">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-900/30 transition-colors duration-150">
                          <td className="px-6 py-4"><div className="flex items-center gap-4">{product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-gray-700" /> : <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center border border-gray-700"><svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>}<div><div className="font-semibold text-white">{product.name}</div><div className="text-sm text-gray-400 truncate max-w-[200px]">{product.description}</div></div></div></td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-300">{product.price || "-"}</td>
                          <td className="px-6 py-4"><div className="flex flex-wrap gap-1.5">{product.features?.slice(0, 2).map((f, i) => <span key={i} className="text-xs font-medium bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md border border-gray-700">{f}</span>)}{(product.features?.length ?? 0) > 2 && <span className="text-xs font-medium text-gray-500 px-2 py-1">+{product.features.length - 2}</span>}</div></td>
                          <td className="px-6 py-4 text-right"><div className="flex justify-end gap-2">
                            <button onClick={() => setViewingProduct(product)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-all duration-200" title="Detay"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                            <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-900/20 rounded-lg transition-all duration-200" title="Düzenle"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                            <button onClick={() => setDeleteTarget(product)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all duration-200" title="Sil"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                          </div></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "visitors" && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Ziyaretçi Analitiği</h2>
            <p className="text-sm text-gray-400 mb-8">Tekil ziyaretçi sayıları (aynı IP tekrar sayılmaz)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {[{ label: "Bugün (Tekil)", value: visitorStats.today, color: "text-white" }, { label: "Bu Hafta (Tekil)", value: visitorStats.week, color: "text-white" }, { label: "Bu Ay (Tekil)", value: visitorStats.month, color: "text-white" }, { label: "Masaüstü / Mobil / Tablet", value: `${visitorStats.desktop} / ${visitorStats.mobile} / ${visitorStats.tablet}`, color: "text-blue-400" }].map((stat, i) => (
                <div key={i} className="bg-[#161b22] rounded-2xl border border-gray-800 p-6"><p className="text-sm font-medium text-gray-400 mb-2">{stat.label}</p><p className={`text-2xl font-bold tracking-tight ${stat.color}`}>{stat.value}</p></div>
              ))}
            </div>
            <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6">
              <h3 className="text-base font-bold tracking-tight mb-4">Son Ziyaretler</h3>
              {recentVisits.length === 0 ? <p className="text-gray-400 text-center py-8">Henüz ziyaret kaydı yok.</p> : (
                <div className="space-y-1">{recentVisits.map((visit, i) => (
                  <div key={i} className="flex justify-between items-center py-3 px-3 rounded-xl hover:bg-gray-900/30 transition-colors border-b border-gray-800 last:border-0">
                    <div><p className="text-sm font-semibold text-white">{visit.url || "Ana Sayfa"}</p><p className="text-xs text-gray-400 mt-0.5">{visit.deviceType} • {new Date(visit.createdAt).toLocaleString('tr-TR')} • IP: {visit.ip || 'Bilinmiyor'}</p></div>
                    {visit.duration && <span className="text-sm font-medium text-gray-300 bg-gray-800 px-2.5 py-1 rounded-md">{visit.duration}s</span>}
                  </div>
                ))}</div>
              )}
            </div>
          </div>
        )}

        {activeTab === "sales" && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Teklif ve Siparişler</h2>
            <p className="text-sm text-gray-400 mb-8">Müşterilerden gelen teklif talepleri ve siparişler.</p>
            
            <div className="bg-[#161b22] rounded-2xl border border-gray-800 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-base font-bold tracking-tight">Son Talepler</h3>
              </div>
              <SalesTable />
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-900/20 flex items-center justify-center mb-4"><svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg></div>
            <h2 className="text-xl font-bold mb-2">Güvenlik Merkezi</h2>
            <p className="text-sm text-gray-400 max-w-md">IP logları, şüpheli giriş denemeleri ve brute-force koruması analitik altyapısıyla birlikte bu panelden izlenebilecektir.</p>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Site Ayarları</h2>
            <p className="text-sm text-gray-400 mb-8">Site genel bilgilerini, SEO ayarlarını ve sosyal medya linklerini buradan yönetin.</p>
            <form onSubmit={handleSaveSettings} className="bg-[#161b22] rounded-2xl border border-gray-800 p-6 lg:p-8 max-w-3xl space-y-6">
              <div className="border-b border-gray-800 pb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>Genel Bilgiler</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Site Başlığı</label><input type="text" value={settings.siteTitle} onChange={(e) => setSettings({...settings, siteTitle: e.target.value})} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Telefon</label><input type="text" value={settings.phone} onChange={(e) => setSettings({...settings, phone: e.target.value})} className={inputClass} /></div>
                </div>
                <div className="mt-6"><label className="block text-sm font-semibold text-gray-300 mb-2">Adres</label><textarea value={settings.address} onChange={(e) => setSettings({...settings, address: e.target.value})} rows={2} className={`${inputClass} resize-none`} /></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">E-posta</label><input type="email" value={settings.email} onChange={(e) => setSettings({...settings, email: e.target.value})} className={inputClass} /></div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Bakım Modu</label>
                    <button type="button" onClick={() => setSettings({...settings, maintenanceMode: !settings.maintenanceMode})} className={`w-full px-4 py-2.5 rounded-xl font-semibold transition-all ${settings.maintenanceMode ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-400'}`}>{settings.maintenanceMode ? 'Aktif' : 'Pasif'}</button>
                  </div>
                </div>
              </div>
              <div className="border-b border-gray-800 pb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>SEO Ayarları</h3>
                <div><label className="block text-sm font-semibold text-gray-300 mb-2">Meta Açıklama</label><textarea value={settings.metaDescription} onChange={(e) => setSettings({...settings, metaDescription: e.target.value})} rows={2} className={`${inputClass} resize-none`} placeholder="Google'da görünecek açıklama" /></div>
                <div className="mt-6"><label className="block text-sm font-semibold text-gray-300 mb-2">Google Analytics ID</label><input type="text" value={settings.googleAnalyticsId} onChange={(e) => setSettings({...settings, googleAnalyticsId: e.target.value})} className={inputClass} placeholder="G-XXXXXXXXXX" /></div>
              </div>
              <div className="border-b border-gray-800 pb-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><svg className="w-5 h-5 text-pink-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>Sosyal Medya Linkleri</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Instagram</label><input type="url" value={settings.instagramUrl} onChange={(e) => setSettings({...settings, instagramUrl: e.target.value})} className={inputClass} placeholder="https://instagram.com/..." /></div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">Facebook</label><input type="url" value={settings.facebookUrl} onChange={(e) => setSettings({...settings, facebookUrl: e.target.value})} className={inputClass} placeholder="https://facebook.com/..." /></div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">LinkedIn</label><input type="url" value={settings.linkedinUrl} onChange={(e) => setSettings({...settings, linkedinUrl: e.target.value})} className={inputClass} placeholder="https://linkedin.com/..." /></div>
                  <div><label className="block text-sm font-semibold text-gray-300 mb-2">YouTube</label><input type="url" value={settings.youtubeUrl} onChange={(e) => setSettings({...settings, youtubeUrl: e.target.value})} className={inputClass} placeholder="https://youtube.com/..." /></div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>Ana Sayfa İçeriği</h3>
                <div><label className="block text-sm font-semibold text-gray-300 mb-2">Hero Metni</label><textarea value={settings.heroText} onChange={(e) => setSettings({...settings, heroText: e.target.value})} rows={3} className={`${inputClass} resize-none`} /></div>
              </div>
              <div className="pt-6 border-t border-gray-800 flex justify-end">
                <button type="submit" disabled={savingSettings} className="px-8 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                  {savingSettings && <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                  {savingSettings ? "Kaydediliyor..." : "Tüm Ayarları Kaydet"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {viewingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={() => setViewingProduct(null)}>
          <div className="bg-[#161b22] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-bold tracking-tight">Ürün Detayları</h2>
              <button onClick={() => setViewingProduct(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6">
              {viewingProduct.imageUrl && <img src={viewingProduct.imageUrl} alt={viewingProduct.name} className="w-full h-64 object-cover rounded-xl mb-4 border border-gray-800" />}
              {(viewingProduct.images?.length ?? 0) > 0 && <div className="grid grid-cols-4 gap-3 mb-4">{viewingProduct.images.map((img, i) => <img key={i} src={img} alt={`${viewingProduct.name} ${i + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-800" />)}</div>}
              <h3 className="text-xl font-bold mb-2 tracking-tight">{viewingProduct.name}</h3>
              {viewingProduct.price && <p className="text-lg font-semibold text-blue-400 mb-3">{viewingProduct.price}</p>}
              <p className="text-gray-300 mb-6 leading-relaxed">{viewingProduct.description}</p>
              {(viewingProduct.features?.length ?? 0) > 0 && (
                <div className="mb-6"><h4 className="font-semibold mb-3">Özellikler:</h4><ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">{viewingProduct.features.map((f, i) => <li key={i} className="flex items-center gap-2 text-sm text-gray-300"><span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />{f}</li>)}</ul></div>
              )}
              <div className="flex gap-3 pt-6 border-t border-gray-800">
                <button onClick={() => handleEdit(viewingProduct)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200">Düzenle</button>
                <button onClick={() => setViewingProduct(null)} className="px-5 py-2.5 bg-gray-800 text-gray-300 hover:bg-gray-700 font-semibold rounded-xl transition-all duration-200">Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200" onClick={() => setDeleteTarget(null)}>
          <div className="bg-[#161b22] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-900/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
              </div>
              <div className="flex-1"><h3 className="text-lg font-bold mb-1 tracking-tight">Ürünü Sil</h3><p className="text-sm text-gray-400 leading-relaxed"><span className="font-semibold text-white">{deleteTarget.name}</span> ürünü kalıcı olarak silinecek. Bu işlem geri alınamaz.</p></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="px-5 py-2.5 text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all duration-200">Vazgeç</button>
              <button onClick={confirmDelete} className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl shadow-lg shadow-red-600/20 transition-all duration-200">Evet, Sil</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}