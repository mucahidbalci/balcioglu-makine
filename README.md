# Balcıoğlu Makina

2006'dan beri kılçık makinesi, rulo kılçık ve sabitleme sistemleri üreten, İstanbul Bağcılar merkezli bir imalat firmasının kurumsal web sitesi ve yönetim paneli.

## Özellikler

- **Dinamik ürün yönetimi:** Ürünler veritabanından çekilir; admin panelinden ekle, düzenle, sil.
- **Çoklu görsel galerisi:** Ürün başına ana görsel + ek görseller, detay sayfasında zoom ve galeri.
- **Tarayıcı tarafı görsel optimizasyonu:** Yüklenen resimler gönderilmeden önce küçültülüp sıkıştırılır; depolama maliyeti ve sayfa hızı dengelenir.
- **KVKK'ya uygun iletişim formu:** Doğrulamalı, e-posta bildirimli.
- **SEO paketi:** Meta/Open Graph/Twitter kartları, otomatik sitemap.xml ve robots.txt, Google Search Console doğrulaması, özel 404.
- **Yönetim paneli:** Sol menülü, aydınlık/karanlık temalı, arama ve istatistikli.

## Teknoloji Yığını

- Framework: Next.js 14 (App Router)
- Dil: TypeScript
- Stil: Tailwind CSS
- Veritabanı: PostgreSQL (Neon) + Prisma ORM
- Depolama: Vercel Blob (görseller)
- Kimlik doğrulama: JWT tabanlı, cookie destekli
- Hosting: Vercel

## Kurulum

1. npm install
2. .env dosyasını oluştur ve gerekli değişkenleri doldur
3. npx prisma db push
4. npm run dev

Gerekli ortam değişkenleri: DATABASE_URL, BLOB_READ_WRITE_TOKEN, JWT_SECRET, ADMIN_USERNAME, ADMIN_PASSWORD.

## Yayın

1. npm run build
2. npm start

Vercel'e bağlandığında her main push'unda otomatik derlenir.

---

Powered by mucahidbalci (https://mucahidbalci.github.io)