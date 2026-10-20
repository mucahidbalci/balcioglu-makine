"use client";

import { useState, useEffect } from "react";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "az önce";
  if (m < 60) return `${m} dk önce`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} sa önce`;
  return `${Math.floor(h / 24)} gün önce`;
}

export default function SecurityCenter() {
  const [data, setData] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [blockIp, setBlockIp] = useState("");
  const [blockReason, setBlockReason] = useState("");

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const load = async () => {
    try {
      const res = await fetch("/api/admin/security");
      setData(await res.json());
    } catch (e) {
      console.error("Güvenlik verisi yüklenemedi:", e);
    }
  };

  useEffect(() => {
    load();
    const int = setInterval(load, 60000);
    return () => clearInterval(int);
  }, []);

  const act = async (action: string, ip?: string, reason?: string) => {
    try {
      const res = await fetch("/api/admin/security", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ip, reason }),
      });
      if (res.ok) {
        showToast(
          action === "unlock" ? "Hesap kilidi açıldı, sayaç sıfırlandı" :
          action === "block" ? "IP engellendi" : "Engel kaldırıldı",
          "success"
        );
        load();
      } else showToast("İşlem başarısız", "error");
    } catch {
      showToast("Bağlantı hatası", "error");
    }
  };

  if (!data) return <div className="p-12 text-center text-gray-400">Güvenlik merkezi yükleniyor...</div>;

  const locked = data.account?.lockedUntil && new Date(data.account.lockedUntil).getTime() > Date.now();

  return (
    <div>
      {toast && <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl text-white font-medium ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}>{toast.message}</div>}

      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Güvenlik Merkezi</h2>
          <p className="text-sm text-gray-400">IP logları, şüpheli aktivite ve hesap koruması • 60 sn'de bir yenilenir</p>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-emerald-900/20 border border-emerald-800 text-emerald-400 text-xs font-medium">● Koruma Aktif</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6">
          <p className="text-sm font-medium text-gray-400 mb-2">Takip Edilen IP (30 gün)</p>
          <p className="text-3xl font-bold text-white">{data.ips.length}</p>
        </div>
        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6">
          <p className="text-sm font-medium text-gray-400 mb-2">Şüpheli IP</p>
          <p className={`text-3xl font-bold ${data.suspicious.length > 0 ? "text-amber-400" : "text-white"}`}>{data.suspicious.length}</p>
        </div>
        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6">
          <p className="text-sm font-medium text-gray-400 mb-2">Engelli IP</p>
          <p className={`text-3xl font-bold ${data.blocked.length > 0 ? "text-red-400" : "text-white"}`}>{data.blocked.length}</p>
        </div>
        <div className={`rounded-2xl border p-6 ${locked ? "bg-red-950/30 border-red-800" : "bg-[#161b22] border-gray-800"}`}>
          <p className="text-sm font-medium text-gray-400 mb-2">Admin Hesap Kilidi</p>
          <p className={`text-3xl font-bold ${locked ? "text-red-400" : "text-emerald-400"}`}>{locked ? "KİLİTLİ" : "Açık"}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* HESAP GÜVENLİĞİ */}
        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6">
          <h3 className="text-base font-bold mb-4">Hesap Güvenliği</h3>
          {data.account ? (
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">Kullanıcı adı</span>
                <span className="text-sm font-semibold text-white">{data.account.username}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">Başarısız giriş denemesi</span>
                <span className={`text-sm font-semibold ${data.account.failedAttempts > 0 ? "text-amber-400" : "text-white"}`}>{data.account.failedAttempts}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-800">
                <span className="text-sm text-gray-400">Kilit durumu</span>
                <span className={`text-sm font-semibold ${locked ? "text-red-400" : "text-emerald-400"}`}>
                  {locked ? `Kilitli (${timeAgo(data.account.lockedUntil)})` : "Kilit yok"}
                </span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">Politika: 3 başarısız denemede hesap 15 dakika kilitlenir. Patron kilitlenirse buradan tek tıkla açabilirsin.</p>
              <button
                onClick={() => act("unlock")}
                className="w-full px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-sm font-semibold text-white transition-all"
              >
                Sayacı Sıfırla / Kilidi Aç
              </button>
            </div>
          ) : (
            <p className="text-sm text-gray-500">Hesap bilgisi bulunamadı.</p>
          )}
        </div>

        {/* ENGEL LİSTESİ */}
        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6">
          <h3 className="text-base font-bold mb-4">Engel Listesi</h3>
          {data.blocked.length === 0 ? (
            <p className="text-sm text-gray-500 mb-4">Engellenmiş IP yok.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {data.blocked.map((b: any) => (
                <div key={b.id} className="flex justify-between items-center py-2 px-3 rounded-xl bg-red-950/20 border border-red-900/40">
                  <div>
                    <p className="text-sm font-mono font-semibold text-red-300">{b.ip}</p>
                    <p className="text-xs text-gray-500">{b.reason} • {timeAgo(b.createdAt)}</p>
                  </div>
                  <button onClick={() => act("unblock", b.ip)} className="text-xs font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-all">
                    Engeli Kaldır
                  </button>
                </div>
              ))}
            </div>
          )}
          <div className="space-y-3 pt-4 border-t border-gray-800">
            <input
              type="text"
              value={blockIp}
              onChange={(e) => setBlockIp(e.target.value)}
              placeholder="Engellenecek IP (örn: 1.2.3.4)"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <input
              type="text"
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="Sebep (örn: bot trafiği)"
              className="w-full px-4 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
            />
            <button
              onClick={() => { if (!blockIp.trim()) return showToast("IP girin", "error"); act("block", blockIp.trim(), blockReason.trim() || "Manuel engelleme"); setBlockIp(""); setBlockReason(""); }}
              className="w-full px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-sm font-semibold text-white transition-all"
            >
              IP'yi Engelle
            </button>
          </div>
        </div>
      </div>

      {/* ŞÜPHELİ AKTİVİTE */}
      {data.suspicious.length > 0 && (
        <div className="bg-amber-950/20 border border-amber-800/50 rounded-2xl p-6 mb-5">
          <h3 className="text-base font-bold text-amber-300 mb-4">⚠ Şüpheli Aktivite Tespit Edildi</h3>
          <div className="space-y-2">
            {data.suspicious.map((s: any) => (
              <div key={s.ip} className="flex justify-between items-center py-2.5 px-3 rounded-xl bg-gray-900/40 border border-amber-900/40">
                <div>
                  <p className="text-sm font-mono font-semibold text-white">{s.ip}</p>
                  <p className="text-xs text-amber-400/80">Son 1 saatte {s.events1h} istek • bot şüphesi</p>
                </div>
                <button onClick={() => act("block", s.ip, "Otomatik tespit: aşırı istek")} className="text-xs font-semibold text-white bg-red-600 hover:bg-red-500 px-4 py-2 rounded-lg transition-all">
                  Engelle
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* IP LOG TABLOSU */}
      <div className="bg-[#161b22] rounded-2xl border border-gray-800 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-800"><h3 className="text-base font-bold">IP Logları (son 30 gün, en aktif 50)</h3></div>
        {data.ips.length === 0 ? (
          <p className="text-gray-500 text-center py-12">Kayıtlı ziyaret yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">IP Adresi</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Olay (30g / 24s / 1s)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Sayfa</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Cihaz</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Son Görülme</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Durum</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {data.ips.map((r: any) => (
                  <tr key={r.ip} className="hover:bg-gray-900/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-mono text-white">{r.ip}</td>
                    <td className="px-6 py-4 text-sm text-gray-300">{r.events} / {r.events24h} / {r.events1h}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{r.pages}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{r.devices.join(", ")}</td>
                    <td className="px-6 py-4 text-sm text-gray-400">{timeAgo(r.lastSeen)}</td>
                    <td className="px-6 py-4">
                      {r.blocked ? (
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-red-900/30 text-red-400 border border-red-800">Engelli</span>
                      ) : r.suspicious ? (
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-amber-900/30 text-amber-400 border border-amber-800">Şüpheli</span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-900/30 text-emerald-400 border border-emerald-800">Normal</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {r.blocked ? (
                        <button onClick={() => act("unblock", r.ip)} className="text-xs font-semibold text-gray-300 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-all">Engeli Kaldır</button>
                      ) : (
                        <button onClick={() => act("block", r.ip, "Manuel engelleme")} className="text-xs font-semibold text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 px-3 py-1.5 rounded-lg transition-all">Engelle</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}