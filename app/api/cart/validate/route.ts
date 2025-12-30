import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { items } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: true, validItems: [] });
    }

    // Ambil ID unik dari item di keranjang
    const itemIds = items.map((item: any) => item._id);

    // Cari produk yang ID-nya ada di database
    const validProducts = await Product.find({ 
      _id: { $in: itemIds } 
    }).select('_id name price image stock'); // Ambil field yang penting saja

    // Map kembali ke format item keranjang, tapi update data terbaru (harga/stok/gambar)
    // Filter item yang TIDAK ditemukan di database
    const validItems = items.filter((item: any) => {
        const product = validProducts.find((p: any) => p._id.toString() === item._id);
        return !!product; // Hanya return true jika produk ditemukan
    }).map((item: any) => {
        const product = validProducts.find((p: any) => p._id.toString() === item._id);
        return {
            ...item,
            // Update info terbaru dari DB (opsional, tapi bagus untuk sinkronisasi harga)
            name: product.name,
            price: product.price,
            image: product.image,
            // Opsional: Cek stok, jika stok < qty, sesuaikan qty (bisa ditambahkan nanti)
        };
    });

    return NextResponse.json({ 
        success: true, 
        validItems,
        removedCount: items.length - validItems.length 
    });

  } catch (error: any) {
    console.error('Cart Validation Error:', error);
    return NextResponse.json(
      { success: false, message: 'Gagal memvalidasi keranjang' },
      { status: 500 }
    );
  }
}
