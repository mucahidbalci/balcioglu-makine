import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function getExcludedIps(): Promise<string[]> {
  try {
    const settings = await prisma.settings.findFirst();
    return (settings?.excludedIps || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, url, productId, deviceType, duration, metadata } = body;

    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'unknown';

    const excluded = await getExcludedIps();
    if (excluded.includes(ip)) {
      return NextResponse.json({ success: true, skipped: true });
    }

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
    const period = searchParams.get('period') || 'day';

    let startDate = new Date();
    if (period === 'day') startDate.setDate(startDate.getDate() - 1);
    else if (period === 'week') startDate.setDate(startDate.getDate() - 7);
    else if (period === 'month') startDate.setMonth(startDate.getMonth() - 1);

    const rows = await prisma.analytics.findMany({
      where: { createdAt: { gte: startDate } },
      orderBy: { createdAt: 'desc' },
      select: { ip: true, deviceType: true, createdAt: true, url: true, duration: true, type: true },
    });

    const excluded = await getExcludedIps();
    const filtered = rows.filter((r) => !r.ip || !excluded.includes(r.ip));

    const uniqueIps = new Set(filtered.map((r) => r.ip).filter(Boolean));

    const deviceSets: Record<string, Set<string>> = {
      desktop: new Set(),
      mobile: new Set(),
      tablet: new Set(),
    };
    for (const r of filtered) {
      const d = deviceSets[r.deviceType || 'desktop'] ? r.deviceType || 'desktop' : 'desktop';
      deviceSets[d].add(r.ip || 'unknown');
    }

    const daily: { label: string; count: number }[] = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      daily.push({
        label: d.toLocaleDateString('tr-TR', { weekday: 'short' }),
        count: filtered.filter((r) => new Date(r.createdAt).toDateString() === key).length,
      });
    }

    return NextResponse.json({
      records: filtered.slice(0, 15),
      uniqueVisitors: uniqueIps.size,
      devices: {
        desktop: deviceSets.desktop.size,
        mobile: deviceSets.mobile.size,
        tablet: deviceSets.tablet.size,
      },
      daily,
      totalEvents: filtered.length,
    });
  } catch (error) {
    console.error('Analytics okuma hatası:', error);
    return NextResponse.json({ error: 'Analytics okunamadı' }, { status: 500 });
  }
}