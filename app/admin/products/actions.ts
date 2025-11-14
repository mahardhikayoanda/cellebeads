// File: app/admin/products/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob';

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: string;
}

// 1. CREATE
export async function createProduct(formData: FormData) {
  await dbConnect();
  
  const imageFiles = formData.getAll('images') as File[];
  if (!imageFiles || imageFiles.length === 0 || imageFiles[0].size === 0) {
    return { success: false, message: 'Minimal satu gambar wajib diisi' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));
  const category = formData.get('category') as string; 

  try {
    const uploadPromises = imageFiles.map(file => 
      put(file.name, file, { access: 'public', addRandomSuffix: true })
    );
    const blobs = await Promise.all(uploadPromises);
    const imageUrls = blobs.map(blob => blob.url);

    const newProduct = new Product({
      name, description, price, stock, category,
      images: imageUrls, 
    });
    
    await newProduct.save();
    
    revalidatePath('/admin/products'); // Refresh admin
    revalidatePath('/products'); // <-- TAMBAHAN: Refresh halaman katalog pelanggan
    
    return { success: true, message: 'Produk berhasil ditambahkan' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menambahkan produk' };
  }
}

// 2. READ (Dengan Filter Kategori)
export async function getProducts(categoryFilter?: string): Promise<IProduct[]> {
  await dbConnect();
  try {
    // Logika filter: Jika filter ada dan bukan 'Semua', filter berdasarkan kategori
    const query = categoryFilter && categoryFilter !== 'Semua' ? { category: categoryFilter } : {};
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    return JSON.parse(JSON.stringify(products)).map((p: any) => ({
      ...p,
      images: p.images || (p.image ? [p.image] : []) 
    }));
  } catch (error) {
    return []; 
  }
}

export async function getProductById(productId: string): Promise<IProduct | null> {
  await dbConnect();
  try {
    const product = await Product.findById(productId);
    if (!product) return null;
    const p = JSON.parse(JSON.stringify(product));
    p.images = p.images || (p.image ? [p.image] : []);
    return p;
  } catch (error) { return null; }
}

// 3. DELETE
export async function deleteProduct(productId: string) {
  await dbConnect();
  try {
    const product = await Product.findById(productId);
    if (!product) return { success: false, message: 'Produk tidak ditemukan' };

    const imagesToDelete = product.images || (product.image ? [product.image] : []);
    if (imagesToDelete.length > 0) {
      await Promise.all(imagesToDelete.map((url: string) => del(url)));
    }

    await Product.findByIdAndDelete(productId);
    revalidatePath('/admin/products');
    revalidatePath('/products'); // Refresh halaman pelanggan juga
    return { success: true, message: 'Produk berhasil dihapus' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

export async function updateProduct(formData: FormData) {
    return { success: false, message: "Fitur Edit belum support update." };
}