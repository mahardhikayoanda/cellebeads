// File: src/app/admin/products/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

// Konfigurasi Cloudinary (taruh di .env)
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Helper untuk upload stream ke Cloudinary
async function uploadToCloudinary(file: File) {
  const fileBuffer = await file.arrayBuffer();
  const mime = file.type;
  const encoding = 'base64';
  const base64Data = Buffer.from(fileBuffer).toString('base64');
  const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;

  const result = await cloudinary.uploader.upload(fileUri, {
    folder: 'cellebeads', // Nama folder di Cloudinary
  });
  return result;
}

// Tipe IProduct (sesuai skema Prisma)
export interface IProduct {
  id: string; // Prisma menggunakan 'id', bukan '_id'
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

// 1. CREATE (Prisma + Cloudinary)
export async function createProduct(formData: FormData) {
  const imageFile = formData.get('image') as File;
  if (!imageFile || imageFile.size === 0) {
    return { success: false, message: 'Gambar produk wajib diisi' };
  }

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = Number(formData.get('price'));
  const stock = Number(formData.get('stock'));

  try {
    // 1. Upload ke Cloudinary
    const uploadResult = await uploadToCloudinary(imageFile);
    
    // 2. Simpan ke Prisma
    await prisma.product.create({
      data: {
        name,
        description,
        price,
        stock,
        image: uploadResult.secure_url, // URL dari Cloudinary
      }
    });
    
    revalidatePath('/admin/products');
    return { success: true, message: 'Produk berhasil ditambahkan' };
    
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menambahkan produk' };
  }
}

// 2. READ (Prisma)
export async function getProducts(): Promise<IProduct[]> {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });
    // Tidak perlu JSON.parse, Prisma sudah aman untuk Server Component
    return products; 
  } catch (error) {
    console.error('Error fetching products:', error);
    return []; 
  }
}

// 3. DELETE (Prisma + Cloudinary)
export async function deleteProduct(productId: string) {
  try {
    const product = await prisma.product.findUnique({ where: { id: productId } });
    if (!product) {
      return { success: false, message: 'Produk tidak ditemukan' };
    }

    // Hapus dari Cloudinary (perlu public_id, bukan URL)
    if (product.image) {
      const publicId = product.image.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`cellebeads/${publicId}`);
      }
    }

    // Hapus dari Prisma
    await prisma.product.delete({ where: { id: productId } });
    
    revalidatePath('/admin/products');
    return { success: true, message: 'Produk berhasil dihapus' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menghapus produk' };
  }
}

// ... Tulis ulang sisa fungsi (updateProduct, getProductById) menggunakan PRISMA ...