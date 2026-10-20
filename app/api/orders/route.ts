import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, productName, customerName, customerEmail, customerPhone, message } = body;

    const newOrder = await prisma.order.create({
      data: {
        type: type || "QUOTE_REQUEST",
        productName,
        customerName,
        customerEmail,
        customerPhone,
        message: message || "",
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, id: newOrder.id }, { status: 201 });
  } catch (error) {
    console.error('Teklif hatası:', error);
    return NextResponse.json({ error: 'Kayıt oluşturulamadı' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ error: 'Kayıtlar alınamadı' }, { status: 500 });
  }
}