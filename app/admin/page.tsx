"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Product {
  id: string;
  name: string;
  description: string;
  price: string | null;
  features: string[];
  imageUrl: string | null;
  images: string[];
  isActive: boolean;
  createdAt: string;
}

type TabKey = "products" | "visitors" | "sales" | "security" | "settings";

function resizeImage(file: File, maxW = 1920, quality = 0.85): Promise<File> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxW / img.width);
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        URL.revokeObjectURL(url);
        return reject(new Error("canvas"));
      }
      ctx.drawImage(img, 0, 0, w, h);
      URL.revokeObjectURL(url);
      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error("blob"));
          const outName = file.name.replace(/\.[^.]+$/, "") + ".jpg";
          resolve(new File([blob], outName, { type: "image/jpeg" }));
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("img"));
    };
    img.src = url;
  });
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<TabKey>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [imageMode, setImageMode] = useState<"url" | "file">("url");
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [extraImageFiles, setExtraImageFiles] = useState<File[]>([]);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    features: "",
    imageUrl: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("admin-theme");
    if (saved === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("admin-theme", newMode ? "dark" : "light");
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      showToast("Ürünler yüklenemedi", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

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
    setMainImageFile(null);
    setExtraImageFiles([]);
    setEditingProduct(null);
    setShowForm(false);
    setImageMode("url");
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
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload-image", {
          method: "POST",
          body: fd,
        });
        if (res.ok) {
          const { url } = await res.json();
          uploadedUrls.push(url);
        }
      } catch (err) {
        console.error("Resim yüklenemedi:", original.name, err);
      }
    }

    const finalImageUrl =
      imageMode === "url" ? formData.imageUrl : uploadedUrls[0] || "";
    const extraImages = imageMode === "url" ? uploadedUrls : uploadedUrls.slice(1);

    const payload = {
      id: editingProduct?.id,
      name: formData.name,
      description: formData.description,
      price: formData.price,
      features: formData.features,
      imageUrl: finalImageUrl,
      images: extraImages,
    };

    try {
      const res = await fetch("/api/admin/products", {
        method: editingProduct ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        showToast(editingProduct ? "Ürün güncellendi" : "Ürün eklendi", "success");
        resetForm();
        fetchProducts();
      } else {
        showToast("İşlem başarısız", "error");
      }
    } catch (error) {
      showToast("Bağlantı hatası", "error");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price || "",
      features: product.features?.join(", ") || "",
      imageUrl: product.imageUrl || "",
    });
    setShowForm(true);
    setViewingProduct(null);
    setImageMode("url");
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch(`/api/admin/products?id=${deleteTarget.id}`, { method: "DELETE" });
      if (res.ok) {
        showToast("Ürün silindi", "success");
        fetchProducts();
      } else {
        showToast("Silme işlemi başarısız", "error");
      }
    } catch (error) {
      showToast("Bağlantı hatası", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: products.length,
    active: products.filter((p) => p.isActive).length,
    withImage: products.filter((p) => p.imageUrl).length,
  };

  const navItems: { key: TabKey; label: string; icon: JSX.Element }[] = [
    {
      key: "products",
      label: "Ürünler",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
    },
    {
      key: "visitors",
      label: "Ziyaretçiler",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      key: "sales",
      label: "Satışlar",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3v18h18M7 14l4-4 4 4 5-5" />
        </svg>
      ),
    },
    {
      key: "security",
      label: "Güvenlik",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      key: "settings",
      label: "Ayarlar",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${
            toast.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* SOL MENÜ */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col fixed left-0 top-0 h-screen">
        <div className="px-6 py-5 border-b border-slate-800">
          <h1 className="text-lg font-semibold tracking-tight">Balcıoğlu Makina</h1>
          <p className="text-xs text-slate-400 mt-0.5">Yönetim Paneli</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                activeTab === item.key
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800 hover:text-white"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
        <div className="px-3 py-4 border-t border-slate-800 space-y-1">
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            {darkMode ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
            {darkMode ? "Aydınlık Tema" : "Karanlık Tema"}
          </button>
          <button
            onClick={() => window.open("/", "_blank")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Siteyi Görüntüle
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-900/30 transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* İÇERİK */}
      <main className="flex-1 ml-64 p-8">
        {activeTab === "products" && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Ürün Yönetimi</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Toplam {stats.total} ürün</p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                </svg>
                Yeni Ürün Ekle
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Toplam Ürün</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Aktif Ürün</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Görselli Ürün</p>
                <p className="text-2xl font-bold text-blue-600">{stats.withImage}</p>
              </div>
            </div>

            <div className="mb-6 relative max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Ürün ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {showForm && (
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 mb-8 shadow-sm">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {editingProduct ? "Ürün Düzenle" : "Yeni Ürün Ekle"}
                  </h3>
                  <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ürün Adı *</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Fiyat</label>
                      <input
                        type="text"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Örn: 5.000 TL"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Açıklama *</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Özellikler</label>
                    <input
                      type="text"
                      value={formData.features}
                      onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Virgülle ayırın: Hızlı, Pratik, Dayanıklı"
                    />
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Ana Görsel</label>
                    <div className="flex gap-3 mb-3">
                      <button
                        type="button"
                        onClick={() => setImageMode("url")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          imageMode === "url"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        Link ile Ekle
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageMode("file")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                          imageMode === "file"
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                        }`}
                      >
                        Bilgisayardan Yükle
                      </button>
                    </div>
                    {imageMode === "url" ? (
                      <input
                        type="url"
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://ornek.com/resim.jpg"
                      />
                    ) : (
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Ek Görseller (Çoklu)</label>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => setExtraImageFiles(Array.from(e.target.files || []))}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {extraImageFiles.length > 0 && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1.5">{extraImageFiles.length} dosya seçildi</p>
                    )}
                  </div>
                  <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                    >
                      {editingProduct ? "Güncelle" : "Kaydet"}
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Ürünler ({filteredProducts.length})</h3>
              </div>
              {loading ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">Yükleniyor...</div>
              ) : filteredProducts.length === 0 ? (
                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                  {searchQuery ? "Arama sonucu bulunamadı" : "Henüz ürün eklenmemiş"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Ürün</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Fiyat</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Özellikler</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              {product.imageUrl ? (
                                <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                              ) : (
                                <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                </div>
                              )}
                              <div>
                                <div className="font-medium text-gray-900 dark:text-white">{product.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-xs">{product.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{product.price || "-"}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {product.features?.slice(0, 2).map((f, i) => (
                                <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded">
                                  {f}
                                </span>
                              ))}
                              {(product.features?.length ?? 0) > 2 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">+{product.features.length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => setViewingProduct(product)}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                              >
                                Detay
                              </button>
                              <button
                                onClick={() => handleEdit(product)}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
                              >
                                Düzenle
                              </button>
                              <button
                                onClick={() => setDeleteTarget(product)}
                                className="text-sm text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition"
                              >
                                Sil
                              </button>
                            </div>
                          </td>
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
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Ziyaretçi Analitiği</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Sayfa görüntülenme, ürün tıklama, resim etkileşimi ve cihaz kırılımları.</p>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: "Bugün", value: "—" },
                { label: "Bu Hafta", value: "—" },
                { label: "Bu Ay", value: "—" },
                { label: "Şu An Aktif", value: "—" },
              ].map((c) => (
                <div key={c.label} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-5">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{c.label}</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{c.value}</p>
                </div>
              ))}
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-10 text-center">
              <p className="text-gray-500 dark:text-gray-400">Analitik modülü sıradaki adımda kuruluyor. Veriler burada canlı görünecek.</p>
            </div>
          </div>
        )}

        {activeTab === "sales" && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Satışlar</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">Sanal pos ve sipariş takibi (e‑ticaret fazı).</p>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-10 text-center">
              <p className="text-gray-500 dark:text-gray-400">Ziraat Bankası sanal pos entegrasyonu planlanan fazda eklenecek.</p>
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Güvenlik</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">IP logları, şüpheli girişimler, brute‑force koruması.</p>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-10 text-center">
              <p className="text-gray-500 dark:text-gray-400">Güvenlik logları analitik altyapısıyla birlikte gelecek.</p>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-1">Site Ayarları</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">İletişim bilgileri, hero metinleri, KVKK ve çerez ayarları.</p>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-10 text-center">
              <p className="text-gray-500 dark:text-gray-400">Ayarlar formu ve KVKK/çerez modülü sıradaki adımda.</p>
            </div>
          </div>
        )}
      </main>

      {/* DETAY MODAL */}
      {viewingProduct && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setViewingProduct(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Ürün Detayları</h2>
              <button onClick={() => setViewingProduct(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              {viewingProduct.imageUrl && (
                <img src={viewingProduct.imageUrl} alt={viewingProduct.name} className="w-full h-64 object-cover rounded-lg mb-4" />
              )}
              {(viewingProduct.images?.length ?? 0) > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {viewingProduct.images.map((img, i) => (
                    <img key={i} src={img} alt={`${viewingProduct.name} ${i + 1}`} className="w-full h-20 object-cover rounded" />
                  ))}
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{viewingProduct.name}</h3>
              {viewingProduct.price && <p className="text-blue-600 font-semibold mb-3">{viewingProduct.price}</p>}
              <p className="text-gray-600 dark:text-gray-300 mb-4">{viewingProduct.description}</p>
              {(viewingProduct.features?.length ?? 0) > 0 && (
                <div className="mb-4">
                  <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Özellikler:</h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-1">
                    {viewingProduct.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => handleEdit(viewingProduct)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => setViewingProduct(null)}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SİLME MODAL */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Ürünü Sil</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <span className="font-medium">{deleteTarget.name}</span> ürünü kalıcı olarak silinecek. Bu işlem geri alınamaz.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition"
              >
                Vazgeç
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                Evet, Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}