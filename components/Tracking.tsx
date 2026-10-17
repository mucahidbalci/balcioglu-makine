"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/tablet|ipad|playbook|silk/i.test(ua)) return "tablet";
  if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(ua)) return "mobile";
  return "desktop";
}

export default function Tracking() {
  const pathname = usePathname();
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent !== "accepted") return;

    const deviceType = getDeviceType();

    // Sayfa görüntülenme
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "page_view",
        url: pathname,
        deviceType,
      }),
    }).catch(() => {});

    setStartTime(Date.now());

    // Sekme kapanırken süre gönder
    const handleBeforeUnload = () => {
      const duration = Math.floor((Date.now() - startTime) / 1000);
      navigator.sendBeacon(
        "/api/track",
        JSON.stringify({
          type: "session",
          url: pathname,
          deviceType,
          duration,
        })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pathname, startTime]);

  return null;
}