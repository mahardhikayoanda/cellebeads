// File: app/admin/orders/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose'; 

export interface IOrder {
  _id: string;
  user: { name: string; email: string };
  items: { 
    product: string; 
    name: string; 
    quantity: number; 
    price: number 
  }[];
  totalPrice: number;
  status: string;
  createdAt: string;
  deliveredAt?: Date;
}

// --- Fungsi Baca Data (DENGAN FILTER TAHUNAN) ---
export async function getOrders(filter: string = 'all'): Promise<IOrder[]> {
  await dbConnect();

  let dateQuery: any = {};
  const now = new Date();

  if (filter === 'daily') {
    const startOfDay = new Date(now.setHours(0, 0, 0, 0));
    dateQuery = { $gte: startOfDay };
  } else if (filter === 'weekly') {
    const lastWeek = new Date();
    lastWeek.setDate(now.getDate() - 7);
    dateQuery = { $gte: lastWeek };
  } else if (filter === 'monthly') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    dateQuery = { $gte: startOfMonth };
  } else if (filter === 'yearly') {
    // Filter Tahunan: Mulai dari 1 Januari tahun ini
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    dateQuery = { $gte: startOfYear };
  }

  const query: any = {};
  if (filter !== 'all') {
    query.createdAt = dateQuery;
  }

  const orders = await Order.find(query)
    .populate('user', 'name email') 
    .sort({ createdAt: -1 });
  
  return JSON.parse(JSON.stringify(orders));
}

// ... (Fungsi confirmOrder dan deliverOrder biarkan tetap sama seperti sebelumnya)
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
    return { success: false, message: error.message || 'Gagal konfirmasi pesanan.' };
  } finally {
    session.endSession();
  }
}

export async function deliverOrder(orderId: string) {
  await dbConnect();
  try {
    const order = await Order.findById(orderId);
    if (!order) return { success: false, message: 'Pesanan tidak ditemukan' };
    if (order.status !== 'processed') {
        return { success: false, message: 'Pesanan belum diproses' };
    }
    order.status = 'delivered';
    order.deliveredAt = new Date();
    await order.save();
    revalidatePath('/admin/orders');
    revalidatePath('/dashboard/my-orders'); 
    return { success: true, message: 'Pesanan ditandai selesai' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal update pesanan' };
  }
}