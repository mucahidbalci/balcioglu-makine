"use client";

import { useState } from "react";

const subjects = ["Teklif Al", "Teknik Destek", "Yedek Parça", "Genel Bilgi", "Diğer"];

export default function IletisimPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "fail">("idle");

  const update = (key: string, value: string) => {
    if (key === "phone") value = value.replace(/\D/g, "");
    if (key === "message") value = value.slice(0, 1000);
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => { const next = { ...e }; delete next[key]; return next; });
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Adınızı girin.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Geçerli bir e-posta girin.";
    if (form.phone.replace(/\D/g, "").length < 10) e.phone = "Telefon numaranızı eksiksiz girin.";
    if (!form.subject) e.subject = "Bir konu seçin.";
    if (form.message.trim().length < 10) e.message = "Mesajınız en az 10 karakter olmalı.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      setStatus(res.ok ? "ok" : "fail");
      if (res.ok) setForm({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch { setStatus("fail"); }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200";
  const errClass = "w-full px-4 py-3 rounded-xl bg-white border-2 border-red-400 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200";

  return (
    <div>
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-32 px-4 overflow-hidden">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-300 text-sm font-semibold mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
            İletişim
          </div>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6 tracking-tight">
            Bizimle
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              İletişime Geçin
            </span>
          </h1>
          <p className="text-slate-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Sorularınız, teklif talepleriniz veya teknik destek için bize ulaşın. En kısa sürede dönüş yapalım.
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="py-24 px-4 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* SOL: BİLGİLER */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">İletişim Bilgileri</h2>
                <ul className="space-y-5">
                  <li className="flex gap-4">
                    <span className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">Adres</p>
                      <p className="text-slate-600">Barbaros, 163. Sk No:5 Kat:3<br />34165 Bağcılar/İstanbul</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">Telefon</p>
                      <p className="text-slate-600">0535 396 97 68</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">E-posta</p>
                      <p className="text-slate-600">balcioglumakina@gmail.com</p>
                    </div>
                  </li>
                  <li className="flex gap-4">
                    <span className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 mb-1">İletişim Kişisi</p>
                      <p className="text-slate-600">Ekrem BALCI</p>
                    </div>
                  </li>
                </ul>
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <a href="tel:05353969768" className="px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold text-center transition-all duration-300 shadow-lg shadow-blue-600/25">Hemen Ara</a>
                  <a href="https://wa.me/905353969768" target="_blank" rel="noopener noreferrer" className="px-4 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white text-sm font-semibold text-center transition-all duration-300 shadow-lg shadow-green-600/25">WhatsApp</a>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
                <h2 className="text-xl font-bold text-slate-900 mb-3 px-2">Konum</h2>
                <iframe
                  title="Balcıoğlu Makina Konum"
                  src="https://maps.google.com/maps?q=Barbaros%2C%20163.%20Sk.%20No%3A5%2C%2034165%20Ba%C4%9Fc%C4%B1lar%2F%C4%B0stanbul&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-64 rounded-xl border-0"
                  loading="lazy"
                />
                <a href="https://www.google.com/maps/search/?api=1&query=Barbaros+163.+Sk+No:5+34165+Bagcilar/Istanbul" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium mt-3 px-2">
                  Haritada Aç
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
              </div>
            </div>

            {/* SAĞ: FORM */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Bize Ulaşın</h2>
              <p className="text-slate-600 mb-6">Proje detaylarınızı paylaşın, size en kısa sürede dönüş yapalım.</p>

              {status === "ok" && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm">
                  Mesajınız alındı. En kısa sürede size dönüş yapacağız.
                </div>
              )}
              {status === "fail" && (
                <div className="mb-5 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  Mesaj gönderilemedi. Lütfen tekrar deneyin veya bizi arayın.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Adınız Soyadınız</label>
                  <input type="text" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Adınızı girin" className={errors.name ? errClass : inputClass} />
                  {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">E-posta Adresiniz</label>
                  <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="ornek@email.com" className={errors.email ? errClass : inputClass} />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon Numaranız</label>
                  <input type="tel" inputMode="numeric" value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="05XX XXX XX XX" className={errors.phone ? errClass : inputClass} />
                  <p className="text-xs text-slate-500 mt-1">Sadece rakam girebilirsiniz.</p>
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Konu</label>
                  <div className="relative">
                    <select value={form.subject} onChange={(e) => update("subject", e.target.value)} className={`${errors.subject ? errClass : inputClass} appearance-none pr-10 ${form.subject ? "text-slate-900" : "text-slate-400"}`}>
                      <option value="" disabled>Seçiniz</option>
                      {subjects.map((s) => <option key={s} value={s} className="text-slate-900">{s}</option>)}
                    </select>
                    <svg className="w-4 h-4 text-slate-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                  </div>
                  {errors.subject && <p className="text-xs text-red-600 mt-1">{errors.subject}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Mesajınız</label>
                  <textarea value={form.message} onChange={(e) => update("message", e.target.value)} placeholder="Mesajınızı buraya yazın..." rows={5} maxLength={1000} className={`${errors.message ? errClass : inputClass} resize-none`} />
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-slate-500">Minimum 10 karakter</p>
                    <p className="text-xs text-slate-500">{form.message.length}/1000</p>
                  </div>
                  {errors.message && <p className="text-xs text-red-600 mt-1">{errors.message}</p>}
                </div>
                <button type="submit" disabled={status === "sending"} className="w-full px-6 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all duration-300 shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 disabled:opacity-50 flex items-center justify-center gap-2">
                  {status === "sending" ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                      Gönderiliyor...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                      Gönder
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}