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

const deviceMeta: Record<string, { label: string; color: string; icon: JSX.Element }> = {
  desktop: {
    label: "Masaüstü",
    color: "bg-blue-500",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  },
  mobile: {
    label: "Mobil",
    color: "bg-emerald-500",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  },
  tablet: {
    label: "Tablet",
    color: "bg-amber-500",
    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  },
};

export default function VisitorsPanel() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const [dayRes, weekRes, monthRes] = await Promise.all([
          fetch("/api/track?period=day"),
          fetch("/api/track?period=week"),
          fetch("/api/track?period=month"),
        ]);
        setData({
          day: await dayRes.json(),
          week: await weekRes.json(),
          month: await monthRes.json(),
        });
      } catch (e) {
        console.error("Ziyaretçi paneli yüklenemedi:", e);
      }
    };
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  if (!data) return <div className="p-12 text-center text-gray-400">Yükleniyor...</div>;

  const devices = data.month.devices || { desktop: 0, mobile: 0, tablet: 0 };
  const deviceTotal = Math.max(devices.desktop + devices.mobile + devices.tablet, 1);
  const daily = data.week.daily || [];
  const maxDaily = Math.max(...daily.map((d: any) => d.count), 1);

  return (
    <div>
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-1">Ziyaretçi Analitiği</h2>
          <p className="text-sm text-gray-400">Tekil ziyaretçi bazlı gerçek sayım • 30 sn'de bir yenilenir</p>
        </div>
        <span className="px-3 py-1.5 rounded-lg bg-emerald-900/20 border border-emerald-800 text-emerald-400 text-xs font-medium">
          ● Canlı
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-5">
        {[
          { label: "Bugün", value: data.day.uniqueVisitors || 0 },
          { label: "Bu Hafta", value: data.week.uniqueVisitors || 0 },
          { label: "Bu Ay", value: data.month.uniqueVisitors || 0 },
        ].map((s, i) => (
          <div key={i} className="bg-[#161b22] rounded-2xl border border-gray-800 p-6 hover:border-gray-700 transition-colors">
            <p className="text-sm font-medium text-gray-400 mb-2">{s.label} • Tekil Ziyaretçi</p>
            <p className="text-4xl font-bold text-white tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6">
          <h3 className="text-base font-bold mb-6">Cihaz Dağılımı <span className="text-xs font-normal text-gray-500">(bu ay, tekil)</span></h3>
          <div className="space-y-5">
            {Object.entries(devices).map(([key, count]: [string, any]) => {
              const meta = deviceMeta[key] || deviceMeta.desktop;
              const pct = Math.round((count / deviceTotal) * 100);
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="flex items-center gap-2 text-sm text-gray-300">
                      <span className={`w-6 h-6 rounded-md ${meta.color}/20 text-${key === 'desktop' ? 'blue' : key === 'mobile' ? 'emerald' : 'amber'}-400 flex items-center justify-center`}>{meta.icon}</span>
                      {meta.label}
                    </span>
                    <span className="text-sm font-semibold text-white">{count} <span className="text-xs text-gray-500 font-normal">(%{pct})</span></span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-800 overflow-hidden">
                    <div className={`h-full rounded-full ${meta.color} transition-all duration-700`} style={{ width: `${pct}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6">
          <h3 className="text-base font-bold mb-6">Son 7 Gün Trafik</h3>
          <div className="flex items-end gap-3 h-40">
            {daily.map((d: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex items-end" style={{ height: "120px" }}>
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-cyan-400 rounded-t-lg transition-all duration-500"
                    style={{ height: `${(d.count / maxDaily) * 100}%`, minHeight: d.count > 0 ? "6px" : "2px" }}
                    title={`${d.count} olay`}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{d.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-[#161b22] rounded-2xl border border-gray-800 p-6">
        <h3 className="text-base font-bold mb-4">Son Ziyaretler</h3>
        {data.month.records?.length === 0 ? (
          <p className="text-gray-500 text-center py-8">Henüz ziyaret kaydı yok. Kendi ziyaretlerin sayılmaz.</p>
        ) : (
          <div className="space-y-1">
            {data.month.records?.map((v: any, i: number) => {
              const meta = deviceMeta[v.deviceType] || deviceMeta.desktop;
              return (
                <div key={i} className="flex justify-between items-center py-3 px-3 rounded-xl hover:bg-gray-900/30 transition-colors border-b border-gray-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-lg bg-gray-800 text-gray-400 flex items-center justify-center">{meta.icon}</span>
                    <div>
                      <p className="text-sm font-semibold text-white">{v.url || "Ana Sayfa"}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{meta.label} • {timeAgo(v.createdAt)} • <span className="font-mono">{v.ip}</span></p>
                    </div>
                  </div>
                  {v.duration ? <span className="text-xs font-medium text-gray-300 bg-gray-800 px-2.5 py-1 rounded-md">{v.duration > 120 ? `${Math.floor(v.duration / 60)} dk` : `${v.duration} sn`}</span> : null}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}