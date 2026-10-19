"use client";

import { useState, useEffect, useRef } from "react";

export default function NotificationBell({ onOpenSales }: { onOpenSales: () => void }) {
  const [pending, setPending] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/orders");
        const orders = await res.json();
        setPending((orders || []).filter((o: any) => o.status === "PENDING"));
      } catch {}
    };
    load();
    const int = setInterval(load, 30000);
    return () => clearInterval(int);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-all duration-200"
        title="Bildirimler"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {pending.length > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-600 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {pending.length}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-[#161b22] border border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-800 flex justify-between items-center">
            <h4 className="text-sm font-bold text-white">Yeni Teklifler</h4>
            <span className="text-xs text-gray-500">{pending.length} bekleyen</span>
          </div>
          {pending.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">Bekleyen teklif yok. Her şey güncel. ✓</p>
          ) : (
            <div className="max-h-72 overflow-y-auto">
              {pending.map((o) => (
                <button
                  key={o.id}
                  onClick={() => { onOpenSales(); setOpen(false); }}
                  className="w-full text-left px-4 py-3 hover:bg-gray-900/60 transition-colors border-b border-gray-800 last:border-0"
                >
                  <p className="text-sm font-semibold text-white">{o.customerName}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{o.productName} • {o.customerPhone}</p>
                  <p className="text-[11px] text-gray-500 mt-1">{new Date(o.createdAt).toLocaleString("tr-TR")}</p>
                </button>
              ))}
            </div>
          )}
          <button
            onClick={() => { onOpenSales(); setOpen(false); }}
            className="w-full px-4 py-3 text-sm font-semibold text-blue-400 hover:text-blue-300 hover:bg-gray-900/60 transition-colors"
          >
            Tüm Teklifleri Gör →
          </button>
        </div>
      )}
    </div>
  );
}