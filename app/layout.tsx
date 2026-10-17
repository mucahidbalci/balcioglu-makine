import type { Metadata } from "next";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.balcioglumakina.com"),
  title: {
    default: "Balcıoğlu Makina | Kılçık Makinesi ve Sabitleme Sistemleri",
    template: "%s | Balcıoğlu Makina",
  },
  description:
    "2006'dan beri kılçık makinesi, rulo kılçık, çorap kılçık ve sabitleme sistemleri imalatı. İstanbul Bağcılar'da yüksek kalite standartlarında üretim, ithalat ve ihracat.",
  keywords: [
    "kılçık makinesi",
    "rulo kılçık makinesi",
    "çorap kılçık makinesi",
    "kılçıklama makinesi",
    "sabitleme sistemleri",
    "tekstil makinaları",
    "Balcıoğlu Makina",
  ],
  authors: [{ name: "Balcıoğlu Makina" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "https://www.balcioglumakina.com",
    siteName: "Balcıoğlu Makina",
    title: "Balcıoğlu Makina | Kılçık Makinesi ve Sabitleme Sistemleri",
    description:
      "2006'dan beri kılçık makinesi ve sabitleme sistemlerinde güvenilir çözüm ortağınız.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Balcıoğlu Makina | Kılçık Makinesi ve Sabitleme Sistemleri",
    description:
      "Kılçık makinesi ve sabitleme sistemlerinde 2006'dan beri güvenilir çözüm ortağınız.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "-UA4wXF0F-wSsPEIYzsLOOwMbVerQR1eTMWnrEnrD54",
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="tr">
      <body className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}