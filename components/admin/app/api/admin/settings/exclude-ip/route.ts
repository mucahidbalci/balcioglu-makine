import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

    let settings = await prisma.settings.findFirst();
    if (!settings) {
      settings = await prisma.settings.create({ data: {} });
    }

    const list = (settings.excludedIps || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!list.includes(ip)) list.push(ip);

    const updated = await prisma.settings.update({
      where: { id: settings.id },
      data: { excludedIps: list.join(", ") },
    });

    return NextResponse.json({ excludedIps: updated.excludedIps });
  } catch (error) {
    console.error('IP hariç tutma hatası:', error);
    return NextResponse.json({ error: 'IP eklenemedi' }, { status: 500 });
  }
}