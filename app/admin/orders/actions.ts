// File: app/admin/orders/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose'; 

// --- Interface Data ---
export interface IOrder {
  _id: string;
  user: { name: string; email: string };
  items: { 
    product: string; // ID Produk
    name: string; 
    quantity: number; 
    price: number 
  }[];
  totalPrice: number;
  status: string;
  createdAt: string;
  deliveredAt?: Date;
}

// --- Fungsi Baca Data ---
export async function getOrders(): Promise<IOrder[]> {
  await dbConnect();
  const orders = await Order.find({})
    .populate('user', 'name email') 
    .sort({ createdAt: -1 });
  
  return JSON.parse(JSON.stringify(orders));
}

// ===========================================
// FUNGSI 1: KONFIRMASI (Pending -> Processed)
// ===========================================
export async function confirmOrder(orderId: string) {
  await dbConnect();
  
  const order = await Order.findById(orderId);
  if (!order) return { success: false, message: 'Pesanan tidak ditemukan' };
  if (order.status !== 'pending') return { success: false, message: 'Pesanan sudah diproses' };

  // Mulai transaksi database (Penting untuk konsistensi stok)
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Update Stok Produk
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }, 
        { session }
      );
    }

    // 2. Update Status Pesanan
    order.status = 'processed';
    await order.save({ session });
    
    await session.commitTransaction();

    revalidatePath('/admin/orders');
    revalidatePath('/dashboard/my-orders'); 
    
    return { success: true, message: 'Pesanan dikonfirmasi & stok diperbarui' };

  } catch (error: any)
  {
    await session.abortTransaction(); 
    return { success: false, message: error.message || 'Gagal konfirmasi pesanan. Stok mungkin bermasalah.' };
  } finally {
    session.endSession();
  }
}

// ===========================================
// FUNGSI 2: SELESAI (Processed -> Delivered)
// ===========================================
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
    
    return { success: true, message: 'Pesanan ditandai selesai (delivered)' };

  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal update pesanan' };
  }
}