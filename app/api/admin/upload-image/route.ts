import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'Dosya yok' }, { status: 400 });
    }
    const blob = await put(
      `products/${Date.now()}-${Math.random().toString(36).slice(2)}-${file.name}`,
      file,
      { access: 'public' }
    );
    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error('Yükleme hatası:', error);
    return NextResponse.json({ error: 'Yükleme başarısız' }, { status: 500 });
  }
}