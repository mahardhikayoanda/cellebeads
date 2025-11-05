// File: app/dashboard/my-orders/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Review from '@/models/Review';

// --- PERUBAHAN DI SINI ---
// 1. Hapus import 'authOptions' dan 'getServerSession'
// 2. Impor 'auth' dari file @/auth.ts baru Anda
import { auth } from '@/auth';
// -------------------------

import { IOrder } from '@/app/admin/orders/actions';
import { revalidatePath } from 'next/cache';

// FUNGSI 1: MENGAMBIL PESANAN
export async function getMyOrders(): Promise<IOrder[]> {
  // --- PERUBAHAN DI SINI ---
  const session = await auth();
  // -------------------------

  if (!session?.user) {
    return []; 
  }
  await dbConnect();
  const orders = await Order.find({ user: session.user.id }) // Gunakan session.user.id
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  
  return JSON.parse(JSON.stringify(orders));
}

// FUNGSI 2: PESANAN DITERIMA
export async function markOrderAsDelivered(orderId: string) {
  // --- PERUBAHAN DI SINI ---
  const session = await auth();
  // -------------------------

  if (!session?.user) return { success: false, message: 'Akses ditolak' };

  await dbConnect();
  try {
    const order = await Order.findOne({ _id: orderId, user: session.user.id });
    if (!order) return { success: false, message: 'Pesanan tidak ditemukan' };

    order.status = 'delivered'; 
    order.deliveredAt = new Date(); 
    await order.save();
    
    revalidatePath('/dashboard/my-orders');
    return { success: true, message: 'Pesanan ditandai sebagai telah diterima' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// FUNGSI 3: KIRIM ULASAN
export async function submitReview(formData: FormData) {
  // --- PERUBAHAN DI SINI ---
  const session = await auth();
  // -------------------------

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
    
    await Review.create({
      product: productId,
      user: session.user.id, // Gunakan session.user.id
      rating,
      comment,
    });
    
    revalidatePath('/dashboard/my-orders');
    revalidatePath(`/products/${productId}`); 
    return { success: true, message: 'Ulasan Anda berhasil dikirim' };

  } catch (error: any) {
    return { success: false, message: error.message };
  }
}