import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: 'Ürünler alınamadı' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, price, features, imageUrl, images } = body;

    const featuresArray = Array.isArray(features)
      ? features
      : features
        ? String(features).split(',').map((f: string) => f.trim()).filter(Boolean)
        : [];

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: price || null,
        features: featuresArray,
        imageUrl: imageUrl || null,
        images: Array.isArray(images) ? images : [],
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    return NextResponse.json({ error: 'Ürün eklenemedi' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, description, price, features, imageUrl, images } = body;

    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });

    const featuresArray = Array.isArray(features)
      ? features
      : features
        ? String(features).split(',').map((f: string) => f.trim()).filter(Boolean)
        : [];

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price: price || null,
        features: featuresArray,
        imageUrl: imageUrl || null,
        images: Array.isArray(images) ? images : [],
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });

    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ürün silinemedi' }, { status: 500 });
  }
}