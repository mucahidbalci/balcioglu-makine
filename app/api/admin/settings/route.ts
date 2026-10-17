import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const settings = await prisma.settings.findFirst({
      orderBy: { updatedAt: 'desc' }
    });
    return NextResponse.json(settings || {});
  } catch (error) {
    return NextResponse.json({ error: 'Ayarlar alınamadı' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const existing = await prisma.settings.findFirst();
    
    const settings = existing 
      ? await prisma.settings.update({ where: { id: existing.id }, data: body })
      : await prisma.settings.create({ data: body });
      
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Ayarlar güncellenemedi' }, { status: 500 });
  }
}