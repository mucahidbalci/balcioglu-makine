import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose'; // jose kütüphanesi Next.js middleware için daha uyumludur

// jose kurulu değilse terminalde: npm install jose
export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  // Sadece /admin ile başlayan yolları koru
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Login sayfasının kendisini koruma
    if (request.nextUrl.pathname === '/admin/login') {
      if (token) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
      }

    // Token yoksa login'e yönlendir
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Token'ın geçerliliğini kontrol et (Opsiyonel ama önerilir)
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      // Token geçersizse sil ve login'e at
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};