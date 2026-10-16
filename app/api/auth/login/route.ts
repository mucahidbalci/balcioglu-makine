import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    const user = await prisma.user.findUnique({ where: { username } });

    if (!user) {
      return NextResponse.json({ error: 'Kullanıcı adı veya şifre hatalı!' }, { status: 401 });
    }

    // 3. ADIM: Kilitli mi kontrol et
    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const remainingMinutes = Math.ceil((user.lockedUntil.getTime() - Date.now()) / 60000);
      return NextResponse.json({ error: `Hesap ${remainingMinutes} dakika süreyle kilitlendi.` }, { status: 403 });
    }

    // 4. ADIM: Şifre kontrolü
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      // Yanlış şifre: Deneme sayısını artır
      const newAttempts = user.failedAttempts + 1;
      let lockedUntil = null;

      if (newAttempts >= 3) {
        const lockoutMinutes = parseInt(process.env.LOCKOUT_MINUTES || '15');
        lockedUntil = new Date(Date.now() + lockoutMinutes * 60 * 1000);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: newAttempts, lockedUntil },
      });

      return NextResponse.json(
        { error: lockedUntil ? 'Çok fazla hatalı deneme! Hesap geçici olarak kilitlendi.' : 'Kullanıcı adı veya şifre hatalı!' },
        { status: 401 }
      );
    }

    // 5. ADIM: Başarılı giriş! Sayacı sıfırla ve Token oluştur
    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, lockedUntil: null },
    });

    const token = jwt.sign({ userId: user.id, username: user.username }, process.env.JWT_SECRET!, { expiresIn: '7d' });

    // Cookie'yi ayarla (HttpOnly = güvenli)
    const cookieStore = await cookies();
    cookieStore.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: '/',
    });

    return NextResponse.json({ success: true, message: 'Giriş başarılı!' });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Sunucu hatası oluştu.' }, { status: 500 });
  }
}