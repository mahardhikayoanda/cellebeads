'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose'; 

// Tipe data untuk Order
export interface IOrder {
  _id: string;
  user: { name: string; email: string };
  // --- PERBAIKAN DI SINI: Tambahkan 'product' ID ---
  items: { 
    product: string; // ID Produk
    name: string; 
    quantity: number; 
    price: number 
  }[];
  // ---------------------------------------------
  totalPrice: number;
  status: string;
  createdAt: string;
  deliveredAt?: Date; // Tambahkan ini
}

// Fungsi untuk mengambil semua order
export async function getOrders(): Promise<IOrder[]> {
  await dbConnect();
  const orders = await Order.find({})
    .populate('user', 'name email') 
    .sort({ createdAt: -1 });
  
  return JSON.parse(JSON.stringify(orders));
}

// Fungsi untuk konfirmasi order
export async function confirmOrder(orderId: string) {
  await dbConnect();
  
  const order = await Order.findById(orderId);
  if (!order) return { success: false, message: 'Pesanan tidak ditemukan' };
  if (order.status !== 'pending') return { success: false, message: 'Pesanan sudah diproses' };

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }, 
        { session }
      );
    }
    order.status = 'processed';
    await order.save({ session });
    await session.commitTransaction();

    revalidatePath('/admin/orders');
    revalidatePath('/dashboard/my-orders'); 
    
    return { success: true, message: 'Pesanan dikonfirmasi & stok diperbarui' };

  } catch (error: any) {
    await session.abortTransaction(); 
    return { success: false, message: error.message || 'Gagal konfirmasi pesanan' };
  } finally {
    session.endSession(); 
  }
}