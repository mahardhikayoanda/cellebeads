'use server';

import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import { put, del } from '@vercel/blob'; // <-- 1. IMPORT 'del' UNTUK MENGHAPUS

// --- 2. DEFINISIKAN DAN EXPORT TIPE DATA PRODUK ---
export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string; // Ini adalah URL dari Vercel Blob
}
// ------------------------------------------------

// ===================================
// 1. CREATE (Dengan Vercel Blob) - (Ini sudah ada)
// ===================================
export async function createProduct(formData: FormData) {
  await dbConnect();
  
  const imageFile = formData.get('image') as File;
  if (!imageFile || imageFile.size === 0) {
    return { success: false, message: 'Gambar produk wajib diisi' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));

  try {
    const blob = await put(imageFile.name, imageFile, { access: 'public' });

    const newProduct = new Product({
      name,
      description,
      price,
      stock,
      image: blob.url, 
    });
    
    await newProduct.save();
    
    revalidatePath('/admin/products');
    return { success: true, message: 'Produk berhasil ditambahkan' };
    
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menambahkan produk' };
  }
}

// ===================================
// 2. READ (Ini sudah ada)
// ===================================
export async function getProducts(): Promise<IProduct[]> { // <-- 3. Gunakan tipe IProduct
  await dbConnect();
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(products)); 
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; 
  }
}

// ===================================
// 3. UPDATE (Akan kita gunakan nanti)
// ===================================
export async function updateProduct(formData: FormData) {
  await dbConnect();

  try {
    const id = formData.get('id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = Number(formData.get('price'));
    const stock = Number(formData.get('stock'));
    const newImageFile = formData.get('newImage') as File;
    const oldImageUrl = formData.get('oldImageUrl') as string;

    let imageUrl = oldImageUrl; // Default-nya, pakai gambar lama

    // 1. Cek apakah ada gambar baru yang di-upload
    if (newImageFile && newImageFile.size > 0) {
      // 2. Upload gambar baru ke Vercel Blob
      const blob = await put(newImageFile.name, newImageFile, {
        access: 'public',
      });
      imageUrl = blob.url; // Gunakan URL gambar baru

      // 3. Hapus gambar lama dari Vercel Blob
      if (oldImageUrl) {
        await del(oldImageUrl);
      }
    }

    // 4. Update data produk di MongoDB
    await Product.findByIdAndUpdate(id, {
      name,
      description,
      price,
      stock,
      image: imageUrl, // Simpan URL gambar (bisa yang lama atau baru)
    });

    revalidatePath('/admin/products'); // Refresh tabel admin
    revalidatePath(`/admin/products/edit/${id}`); // Refresh halaman edit
    return { success: true, message: 'Produk berhasil diupdate' };

  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal update produk' };
  }
}

// ===================================
// 4. DELETE (Perbarui fungsi ini)
// ===================================
export async function deleteProduct(productId: string) {
  await dbConnect();
  try {
    // 1. Cari produk di database untuk dapat URL gambarnya
    const product = await Product.findById(productId);
    if (!product) {
      return { success: false, message: 'Produk tidak ditemukan' };
    }

    // 2. Hapus gambar dari Vercel Blob
    if (product.image) {
      await del(product.image); // Hapus file di cloud
    }

    // 3. Hapus produk dari database
    await Product.findByIdAndDelete(productId);
    
    revalidatePath('/admin/products');
    return { success: true, message: 'Produk berhasil dihapus' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menghapus produk' };
  }
}

export async function getProductById(productId: string): Promise<IProduct | null> {
  await dbConnect();
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return null;
    }
    return JSON.parse(JSON.stringify(product));
  } catch (error) {
    console.error('Error fetching product by ID:', error);
    return null;
  }
}