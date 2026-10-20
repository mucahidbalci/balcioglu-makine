import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const since = new Date();
    since.setDate(since.getDate() - 30);

    const [rows, user, blocked] = await Promise.all([
      prisma.analytics.findMany({
        where: { createdAt: { gte: since } },
        select: { ip: true, deviceType: true, createdAt: true, url: true },
      }),
      prisma.user.findFirst(),
      prisma.blockedIp.findMany({ orderBy: { createdAt: 'desc' } }),
    ]);

    const blockedSet = new Set(blocked.map((b) => b.ip));
    const now = Date.now();
    const map = new Map<string, any>();

    for (const r of rows) {
      const ip = r.ip || 'unknown';
      if (!map.has(ip)) {
        map.set(ip, { ip, events: 0, events24h: 0, events1h: 0, devices: new Set(), pages: new Set(), first: r.createdAt, last: r.createdAt });
      }
      const e = map.get(ip);
      e.events++;
      const t = new Date(r.createdAt).getTime();
      if (now - t <= 86400000) e.events24h++;
      if (now - t <= 3600000) e.events1h++;
      e.devices.add(r.deviceType || 'desktop');
      e.pages.add(r.url || '/');
      if (t > new Date(e.last).getTime()) e.last = r.createdAt;
      if (t < new Date(e.first).getTime()) e.first = r.createdAt;
    }

    const ips = Array.from(map.values())
      .map((e) => ({
        ip: e.ip,
        events: e.events,
        events24h: e.events24h,
        events1h: e.events1h,
        devices: Array.from(e.devices),
        pages: e.pages.size,
        firstSeen: e.first,
        lastSeen: e.last,
        blocked: blockedSet.has(e.ip),
        suspicious: e.events1h > 60 || e.events24h > 200,
      }))
      .sort((a, b) => b.events - a.events)
      .slice(0, 50);

    return NextResponse.json({
      ips,
      suspicious: ips.filter((i) => i.suspicious && !i.blocked),
      blocked,
      account: user
        ? { username: user.username, failedAttempts: user.failedAttempts, lockedUntil: user.lockedUntil }
        : null,
    });
  } catch (error) {
    console.error('Security GET hatası:', error);
    return NextResponse.json({ error: 'Güvenlik verisi alınamadı' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, ip, reason } = await request.json();

    if (action === 'unlock') {
      const user = await prisma.user.findFirst();
      if (!user) return NextResponse.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
      await prisma.user.update({
        where: { id: user.id },
        data: { failedAttempts: 0, lockedUntil: null },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'block' && ip) {
      await prisma.blockedIp.upsert({
        where: { ip },
        update: { reason: reason || 'Manuel engelleme' },
        create: { ip, reason: reason || 'Manuel engelleme' },
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'unblock' && ip) {
      await prisma.blockedIp.deleteMany({ where: { ip } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Geçersiz işlem' }, { status: 400 });
  } catch (error) {
    console.error('Security POST hatası:', error);
    return NextResponse.json({ error: 'İşlem başarısız' }, { status: 500 });
  }
}