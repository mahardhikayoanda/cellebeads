'use server';

import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';

export interface IStockItem {
  _id: string;
  name: string;
  image: string;
  category: string;
  stock: number;
}

// Ambil data khusus untuk tabel stok (lebih ringan)
export async function getStockData(): Promise<IStockItem[]> {
  await dbConnect();
  try {
    const products = await Product.find({}).select('name images category stock').sort({ stock: 1 }); // Sort dari stok paling sedikit
    
    return JSON.parse(JSON.stringify(products)).map((p: any) => ({
        _id: p._id,
        name: p.name,
        image: p.images && p.images.length > 0 ? p.images[0] : '/placeholder-banner.jpg',
        category: p.category,
        stock: p.stock
    }));
  } catch (error) {
    return [];
  }
}

// Update Stok Cepat
export async function updateStock(productId: string, newStock: number) {
  await dbConnect();
  try {
    if (newStock < 0) return { success: false, message: 'Stok tidak boleh minus' };
    
    await Product.findByIdAndUpdate(productId, { stock: newStock });
    
    revalidatePath('/admin/stock');
    revalidatePath('/admin/products');
    revalidatePath('/products');
    
    return { success: true, message: 'Stok berhasil diupdate' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}