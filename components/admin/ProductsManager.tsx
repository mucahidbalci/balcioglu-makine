"use client";

import { useState, useEffect } from "react";

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

export default function ProductsManager() {
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
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", features: "", imageUrl: "" });

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProducts = async () => {
    setLoading(true);
    try { setProducts(await (await fetch("/api/admin/products")).json()); }
    catch { showToast("Ürünler yüklenemedi", "error"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProducts(); }, []);

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

  const handleDrop = async (to: number) => {
    const from = dragIndex;
    setDragIndex(null); setOverIndex(null);
    if (from === null || from === to) return;
    const list = [...products];
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
    setProducts(list);
    try {
      const res = await fetch("/api/admin/products/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: list.map((p) => p.id) }),
      });
      if (res.ok) showToast("Sıralama kaydedildi", "success");
      else showToast("Sıralama kaydedilemedi", "error");
    } catch { showToast("Bağlantı hatası", "error"); }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.description.toLowerCase().includes(searchQuery.toLowerCase()));
  const canDrag = searchQuery === "";
  const stats = { total: products.length, active: products.filter((p) => p.isActive).length, withImage: products.filter((p) => p.imageUrl).length };
  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";

  return (
    <>
      {toast && <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-white font-medium ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>{toast.message}</div>}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Ürün Yönetimi</h2>
          <p className="text-sm text-gray-400 mt-1">Toplam {stats.total} ürün • Sıralamak için satırları sürükleyip bırakın</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(true); }} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          Yeni Ürün Ekle
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        {[{ label: "Toplam Ürün", value: stats.total, color: "text-white" }, { label: "Aktif Ürün", value: stats.active, color: "text-emerald-400" }, { label: "Görselli Ürün", value: stats.withImage, color: "text-blue-400" }].map((s, i) => (
          <div key={i} className="bg-[#161b22] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
            <p className="text-sm font-medium text-gray-400 mb-2">{s.label}</p>
            <p className={`text-3xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6 relative max-w-sm">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
        <input type="text" placeholder="Ürün ara..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-3 rounded-xl bg-[#161b22] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" />
      </div>

      {showForm && (
        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6 lg:p-8 mb-8">
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
                  <button key={mode} type="button" onClick={() => setImageMode(mode)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${imageMode === mode ? "bg-blue-600 text-white" : "bg-gray-800 text-gray-400 hover:bg-gray-700"}`}>
                    {mode === "url" ? "Link ile Ekle" : "Bilgisayardan Yükle"}
                  </button>
                ))}
              </div>
              {imageMode === "url" ? <input type="url" value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className={inputClass} placeholder="https://ornek.com/resim.jpg" /> : <input type="file" accept="image/*" onChange={(e) => setMainImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-8 rounded-xl border-2 border-dashed border-gray-700 bg-gray-800/50 text-gray-400 text-sm text-center hover:border-blue-500 transition-all cursor-pointer" />}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Ek Görseller (Çoklu)</label>
              <input type="file" accept="image/*" multiple onChange={(e) => setExtraImageFiles(Array.from(e.target.files || []))} className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-900/30 file:text-blue-400 transition-all" />
              {extraImageFiles.length > 0 && <p className="text-xs text-blue-400 mt-2 font-medium">{extraImageFiles.length} dosya seçildi</p>}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
              <button type="button" onClick={resetForm} className="px-6 py-2.5 text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all">İptal</button>
              <button type="submit" className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-lg shadow-blue-600/20 transition-all">{editingProduct ? "Güncelle" : "Kaydet"}</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-[#161b22] rounded-2xl border border-gray-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-800"><h3 className="text-base font-bold tracking-tight">Ürün Listesi ({filteredProducts.length})</h3></div>
        {loading ? <div className="p-12 text-center text-gray-400">Yükleniyor...</div> : filteredProducts.length === 0 ? <div className="p-12 text-center text-gray-400">{searchQuery ? "Arama sonucu bulunamadı" : "Henüz ürün eklenmemiş"}</div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  {canDrag && <th className="w-10"></th>}
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Ürün</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Fiyat</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Özellikler</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredProducts.map((product, i) => (
                  <tr
                    key={product.id}
                    draggable={canDrag}
                    onDragStart={() => setDragIndex(i)}
                    onDragOver={(e) => { e.preventDefault(); setOverIndex(i); }}
                    onDrop={() => handleDrop(i)}
                    onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
                    className={`transition-colors duration-150 ${canDrag ? "cursor-grab active:cursor-grabbing" : ""} ${overIndex === i && dragIndex !== null && dragIndex !== i ? "bg-blue-900/20 border-l-2 border-l-blue-500" : "hover:bg-gray-900/30"} ${dragIndex === i ? "opacity-50" : ""}`}
                  >
                    {canDrag && (
                      <td className="pl-4 py-4 text-gray-600">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M9 5h2v2H9V5zm4 0h2v2h-2V5zM9 9h2v2H9V9zm4 0h2v2h-2V9zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2zm-4 4h2v2H9v-2zm4 0h2v2h-2v-2z" /></svg>
                      </td>
                    )}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        {product.imageUrl ? <img src={product.imageUrl} alt={product.name} className="w-12 h-12 rounded-xl object-cover border border-gray-700" /> : <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center border border-gray-700"><svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>}
                        <div><div className="font-semibold text-white">{product.name}</div><div className="text-sm text-gray-400 truncate max-w-[200px]">{product.description}</div></div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-300">{product.price || "-"}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {product.features?.slice(0, 2).map((f, fi) => <span key={fi} className="text-xs font-medium bg-gray-800 text-gray-300 px-2.5 py-1 rounded-md border border-gray-700">{f}</span>)}
                        {(product.features?.length ?? 0) > 2 && <span className="text-xs font-medium text-gray-500 px-2 py-1">+{product.features.length - 2}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => setViewingProduct(product)} className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg transition-all" title="Detay"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg></button>
                        <button onClick={() => handleEdit(product)} className="p-2 text-gray-400 hover:text-amber-400 hover:bg-amber-900/20 rounded-lg transition-all" title="Düzenle"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg></button>
                        <button onClick={() => setDeleteTarget(product)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg transition-all" title="Sil"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewingProduct && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setViewingProduct(null)}>
          <div className="bg-[#161b22] rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
              <h2 className="text-lg font-bold tracking-tight">Ürün Detayları</h2>
              <button onClick={() => setViewingProduct(null)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>
            </div>
            <div className="p-6">
              {viewingProduct.imageUrl && <img src={viewingProduct.imageUrl} alt={viewingProduct.name} className="w-full h-64 object-cover rounded-xl mb-4 border border-gray-800" />}
              {(viewingProduct.images?.length ?? 0) > 0 && <div className="grid grid-cols-4 gap-3 mb-4">{viewingProduct.images.map((img, i) => <img key={i} src={img} alt={`${viewingProduct.name} ${i + 1}`} className="w-full h-20 object-cover rounded-lg border border-gray-800" />)}</div>}
              <h3 className="text-xl font-bold mb-2">{viewingProduct.name}</h3>
              {viewingProduct.price && <p className="text-lg font-semibold text-blue-400 mb-3">{viewingProduct.price}</p>}
              <p className="text-gray-300 mb-6 leading-relaxed">{viewingProduct.description}</p>
              <div className="flex gap-3 pt-6 border-t border-gray-800">
                <button onClick={() => handleEdit(viewingProduct)} className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all">Düzenle</button>
                <button onClick={() => setViewingProduct(null)} className="px-5 py-2.5 bg-gray-800 text-gray-300 hover:bg-gray-700 font-semibold rounded-xl transition-all">Kapat</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setDeleteTarget(null)}>
          <div className="bg-[#161b22] rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-800" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-900/20 flex items-center justify-center flex-shrink-0"><svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg></div>
              <div className="flex-1"><h3 className="text-lg font-bold mb-1">Ürünü Sil</h3><p className="text-sm text-gray-400"><span className="font-semibold text-white">{deleteTarget.name}</span> kalıcı olarak silinecek. Bu işlem geri alınamaz.</p></div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button onClick={() => setDeleteTarget(null)} className="px-5 py-2.5 text-sm font-semibold text-gray-300 bg-gray-800 hover:bg-gray-700 rounded-xl transition-all">Vazgeç</button>
              <button onClick={confirmDelete} className="px-5 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 rounded-xl transition-all">Evet, Sil</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}