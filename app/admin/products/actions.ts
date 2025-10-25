'use server'; // Wajib ada untuk Server Actions

import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product'; // Pastikan model Anda ada di models/Product.js
import { revalidatePath } from 'next/cache';

// CREATE
export async function createProduct(formData: FormData) { // Beri tipe FormData
  await dbConnect();
  try {
    const { name, description, price, stock, image } = Object.fromEntries(formData);

    // TODO: Logika upload gambar
    const newProduct = new Product({
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      image, // Ini harusnya URL gambar
    });
    await newProduct.save();
    
    revalidatePath('/admin/products'); // Beritahu Next.js untuk refresh halaman
    return { success: true, message: 'Produk berhasil ditambahkan' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menambahkan produk' };
  }
}

// READ (Ini yang dicari oleh page.tsx)
export async function getProducts() {
  await dbConnect();
  const products = await Product.find({}).sort({ createdAt: -1 });
  // Kita perlu serialize manual untuk Server Component
  return JSON.parse(JSON.stringify(products)); 
}

// UPDATE (Tambahkan tipe data)
export async function updateProduct(formData: FormData) {
  await dbConnect();
  try {
    const { id, name, description, price, stock, image } = Object.fromEntries(formData);
    
    await Product.findByIdAndUpdate(id, {
      name,
      description,
      price: Number(price),
      stock: Number(stock),
      image,
    });
    
    revalidatePath('/admin/products');
    revalidatePath(`/products/${id}`); 
    return { success: true, message: 'Produk berhasil diupdate' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal update produk' };
  }
}

// DELETE (Tambahkan tipe data)
export async function deleteProduct(productId: string) {
  await dbConnect();
  try {
    await Product.findByIdAndDelete(productId);
    revalidatePath('/admin/products');
    return { success: true, message: 'Produk berhasil dihapus' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menghapus produk' };
  }
}