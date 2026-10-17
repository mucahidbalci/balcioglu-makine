import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, url, productId, deviceType, duration, metadata } = body;

    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    await prisma.analytics.create({
      data: {
        type,
        url: url || null,
        productId: productId || null,
        deviceType: deviceType || null,
        ip,
        duration: duration || null,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Analytics hatası:', error);
    return NextResponse.json({ error: 'Analytics kaydedilemedi' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const period = searchParams.get('period') || 'day';

    let startDate = new Date();
    if (period === 'day') {
      startDate.setDate(startDate.getDate() - 1);
    } else if (period === 'week') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (period === 'month') {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const where: any = {
      createdAt: { gte: startDate },
    };

    if (type) {
      where.type = type;
    }

    const analytics = await prisma.analytics.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100,
    });

    return NextResponse.json(analytics);
  } catch (error) {
    console.error('Analytics okuma hatası:', error);
    return NextResponse.json({ error: 'Analytics okunamadı' }, { status: 500 });
  }
}