import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const { id, status, notes } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });

    const updated = await prisma.order.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Sipariş güncelleme hatası:', error);
    return NextResponse.json({ error: 'Güncellenemedi' }, { status: 500 });
  }
}