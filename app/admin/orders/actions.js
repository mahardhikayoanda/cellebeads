'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { revalidatePath } from 'next/cache';

// Fungsi untuk admin mengambil semua pesanan
export async function getOrders() {
  await dbConnect();
  const orders = await Order.find({})
    .populate('user', 'name email') // Ambil data user
    .sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(orders));
}

// Fungsi untuk admin konfirmasi pesanan
export async function confirmOrder(orderId) {
  await dbConnect();
  
  try {
    const order = await Order.findById(orderId);
    if (!order) throw new Error('Pesanan tidak ditemukan');
    if (order.status !== 'pending') throw new Error('Pesanan sudah diproses');

    // 1. Mulai transaksi (Penting agar data konsisten)
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // 2. Update Stok Produk
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.product,
          { $inc: { stock: -item.quantity } }, // $inc untuk mengurangi stok
          { session }
        );
      }

      // 3. Update Status Pesanan
      order.status = 'processed'; // Status berubah
      await order.save({ session });
      
      // 4. Commit transaksi
      await session.commitTransaction();

      // 5. Refresh data di halaman admin dan pelanggan
      revalidatePath('/admin/orders');
      revalidatePath('/dashboard/my-orders');
      
      return { success: true, message: 'Pesanan dikonfirmasi & stok diperbarui' };

    } catch (error) {
      // Jika terjadi error, batalkan semua perubahan
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    return { success: false, message: error.message };
  }
}