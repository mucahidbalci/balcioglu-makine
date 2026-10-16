import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { put } from '@vercel/blob';

// ÜRÜNLERİ LİSTELE
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

// YENİ ÜRÜN EKLE
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const features = formData.get('features') as string;
    const imageUrlInput = formData.get('imageUrl') as string;
    const imageFile = formData.get('imageFile') as File;
    const multipleImages = formData.getAll('multipleImages') as File[];

    let finalImageUrl = imageUrlInput;
    const uploadedImages: string[] = [];

    // Ana görsel yükle (varsa)
    if (imageFile && imageFile.size > 0) {
      try {
        const blob = await put(`products/${Date.now()}-${imageFile.name}`, imageFile, {
          access: 'public',
        });
        finalImageUrl = blob.url;
        uploadedImages.push(blob.url);
      } catch (uploadError) {
        console.error('Ana görsel yükleme hatası:', uploadError);
      }
    }

    // Çoklu görseller yükle (varsa)
    for (let i = 0; i < multipleImages.length; i++) {
      const file = multipleImages[i];
      if (file && file.size > 0) {
        try {
          const blob = await put(`products/${Date.now()}-${i}-${file.name}`, file, {
            access: 'public',
          });
          uploadedImages.push(blob.url);
        } catch (error) {
          console.error('Görsel yükleme hatası:', error);
        }
      }
    }

    const featuresArray = features
      ? features.split(',').map(f => f.trim()).filter(f => f)
      : [];

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price,
        features: featuresArray,
        imageUrl: finalImageUrl || null,
        images: uploadedImages,
      },
    });

    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    return NextResponse.json({ error: 'Ürün eklenemedi' }, { status: 500 });
  }
}

// ÜRÜN GÜNCELLE (PUT)
export async function PUT(request: NextRequest) {
  try {
    const formData = await request.formData();
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const features = formData.get('features') as string;
    const imageFile = formData.get('imageFile') as File;
    const multipleImages = formData.getAll('multipleImages') as File[];

    // Mevcut ürünü getir
    const existingProduct = await prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Ürün bulunamadı' }, { status: 404 });
    }

    let finalImageUrl = existingProduct.imageUrl;
    const uploadedImages: string[] = [...existingProduct.images];

    // Yeni ana görsel yüklendiyse
    if (imageFile && imageFile.size > 0) {
      try {
        const blob = await put(`products/${Date.now()}-${imageFile.name}`, imageFile, {
          access: 'public',
        });
        finalImageUrl = blob.url;
        uploadedImages.push(blob.url);
      } catch (error) {
        console.error('Görsel yükleme hatası:', error);
      }
    }

    // Yeni çoklu görseller
    for (let i = 0; i < multipleImages.length; i++) {
      const file = multipleImages[i];
      if (file && file.size > 0) {
        try {
          const blob = await put(`products/${Date.now()}-${i}-${file.name}`, file, {
            access: 'public',
          });
          uploadedImages.push(blob.url);
        } catch (error) {
          console.error('Görsel yükleme hatası:', error);
        }
      }
    }

    const featuresArray = features
      ? features.split(',').map(f => f.trim()).filter(f => f)
      : [];

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        features: featuresArray,
        imageUrl: finalImageUrl,
        images: uploadedImages,
      },
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error('Ürün güncelleme hatası:', error);
    return NextResponse.json({ error: 'Ürün güncellenemedi' }, { status: 500 });
  }
}

// ÜRÜN SİL
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID gerekli' }, { status: 400 });
    }

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Ürün silinemedi' }, { status: 500 });
  }
}