// File: app/dashboard/my-orders/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Review from '@/models/Review'; // <-- 1. Import model Review
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth/next';
import { IOrder } from '@/app/admin/orders/actions';
import { revalidatePath } from 'next/cache';

// FUNGSI 1: MENGAMBIL PESANAN (Sudah ada)
export async function getMyOrders(): Promise<IOrder[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return []; 
  }
  await dbConnect();
  const orders = await Order.find({ user: session.user.id })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  
  return JSON.parse(JSON.stringify(orders));
}

// FUNGSI 2: PESANAN DITERIMA (Baru)
export async function markOrderAsDelivered(orderId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, message: 'Akses ditolak' };

  await dbConnect();
  try {
    const order = await Order.findOne({ _id: orderId, user: session.user.id });
    if (!order) return { success: false, message: 'Pesanan tidak ditemukan' };

    order.status = 'delivered'; // Ubah status
    order.deliveredAt = new Date(); // Catat tanggal diterima
    await order.save();
    
    revalidatePath('/dashboard/my-orders');
    return { success: true, message: 'Pesanan ditandai sebagai telah diterima' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// FUNGSI 3: KIRIM ULASAN (Baru)
export async function submitReview(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, message: 'Akses ditolak' };

  try {
    const productId = formData.get('productId') as string;
    const orderId = formData.get('orderId') as string;
    const rating = Number(formData.get('rating'));
    const comment = formData.get('comment') as string;

    if (!productId || !orderId || !rating || !comment) {
      return { success: false, message: 'Semua data wajib diisi' };
    }

    await dbConnect();
    
    // TODO: Cek apakah user sudah pernah mereview produk ini
    // Untuk saat ini, kita izinkan

    await Review.create({
      product: productId,
      user: session.user.id,
      rating,
      comment,
    });
    
    // TODO: Tandai di order bahwa item ini sudah di-review
    // (Ini butuh update schema Order.js, bisa kita lakukan nanti)

    revalidatePath('/dashboard/my-orders');
    revalidatePath(`/products/${productId}`); // Refresh halaman produk agar ulasan muncul
    return { success: true, message: 'Ulasan Anda berhasil dikirim' };

  } catch (error: any) {
    return { success: false, message: error.message };
  }
}