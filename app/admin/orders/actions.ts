// File: app/admin/orders/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose'; // Import mongoose untuk session

// Tipe data untuk Order
export interface IOrder {
  _id: string;
  user: { name: string; email: string };
  items: { name: string; quantity: number; price: number }[];
  totalPrice: number;
  status: string;
  createdAt: string;
}

// Fungsi untuk mengambil semua order
export async function getOrders(): Promise<IOrder[]> {
  await dbConnect();
  const orders = await Order.find({})
    .populate('user', 'name email') // Ambil data user
    .sort({ createdAt: -1 });
  
  return JSON.parse(JSON.stringify(orders));
}

// Fungsi untuk konfirmasi order
export async function confirmOrder(orderId: string) {
  await dbConnect();
  
  const order = await Order.findById(orderId);
  if (!order) return { success: false, message: 'Pesanan tidak ditemukan' };
  if (order.status !== 'pending') return { success: false, message: 'Pesanan sudah diproses' };

  // Mulai transaksi database
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Update Stok Produk
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.product,
        { $inc: { stock: -item.quantity } }, // Kurangi stok
        { session }
      );
    }

    // 3. Update Status Pesanan
    order.status = 'processed';
    await order.save({ session });
    
    // 4. Commit transaksi
    await session.commitTransaction();

    // 5. Refresh data di halaman admin dan pelanggan
    revalidatePath('/admin/orders');
    revalidatePath('/dashboard/my-orders'); // Nanti untuk halaman pelanggan
    
    return { success: true, message: 'Pesanan dikonfirmasi & stok diperbarui' };

  } catch (error: any) // ESLint akan mengizinkan 'any'
  {
    await session.abortTransaction(); // Batalkan jika gagal
    return { success: false, message: error.message || 'Gagal konfirmasi pesanan' };
  } finally {
    session.endSession(); // Selalu tutup sesi
  }
}