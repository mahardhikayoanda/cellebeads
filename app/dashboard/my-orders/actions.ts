// File: app/dashboard/my-orders/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Review from '@/models/Review';
import { auth } from '@/auth';
import { IOrder } from '@/app/admin/orders/actions'; 
import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';

// Interface untuk data order di frontend
export interface IOrderWithReview extends IOrder {
  isReviewed: boolean;
}

// 1. GET ORDERS (Ambil pesanan user & cek status review)
export async function getMyOrders(): Promise<IOrderWithReview[]> {
  const session = await auth();
  if (!session?.user) return []; 
  
  await dbConnect();
  
  // Ambil order milik user
  const orders = await Order.find({ user: session.user.id })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  
  // Cek status review untuk setiap order secara paralel
  const ordersWithReviewStatus = await Promise.all(orders.map(async (order) => {
    // Cek apakah sudah ada review dengan orderId ini
    const reviewExists = await Review.exists({ order: order._id });
    
    return {
      ...(JSON.parse(JSON.stringify(order)) as IOrder),
      isReviewed: !!reviewExists 
    };
  }));
  
  return ordersWithReviewStatus;
}

// 2. RECEIVE ORDER (Konfirmasi Terima Pesanan) - Shipped -> Delivered
export async function receiveOrder(orderId: string) {
  const session = await auth();
  if (!session?.user) return { success: false, message: 'Akses ditolak' };

  await dbConnect();
  try {
    const order = await Order.findOne({ _id: orderId, user: session.user.id });
    if (!order) return { success: false, message: 'Pesanan tidak ditemukan' };
    
    // Validasi: Hanya bisa terima jika status 'shipped'
    if (order.status !== 'shipped') {
        return { success: false, message: 'Pesanan belum dikirim admin atau sudah diterima.' };
    }

    order.status = 'delivered'; 
    order.deliveredAt = new Date(); 
    await order.save();
    
    revalidatePath('/dashboard/my-orders');
    revalidatePath('/admin/orders');
    return { success: true, message: 'Pesanan telah diterima. Terima kasih!' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// 3. SUBMIT REVIEW (Kirim Ulasan + Foto)
export async function submitReview(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { success: false, message: 'Akses ditolak' };

  try {
    const productId = formData.get('productId') as string;
    const orderId = formData.get('orderId') as string;
    const rating = Number(formData.get('rating'));
    const comment = formData.get('comment') as string;
    const imageFile = formData.get('image') as File; // Ambil file gambar

    if (!productId || !orderId || !rating || !comment) {
      return { success: false, message: 'Rating dan Komentar wajib diisi' };
    }

    await dbConnect();

    // Cek apakah sudah pernah review sebelumnya (double check)
    const existingReview = await Review.findOne({ order: orderId });
    if (existingReview) {
        return { success: false, message: 'Anda sudah mengulas pesanan ini.' };
    }
    
    let imageUrl: string | undefined = undefined;

    // --- LOGIKA UPLOAD GAMBAR ---
    if (imageFile && imageFile.size > 0) {
      // Upload ke Vercel Blob
      const blob = await put(
        `reviews/${session.user.id}/${imageFile.name}`, 
        imageFile,
        { access: 'public', addRandomSuffix: true }
      );
      imageUrl = blob.url; // Simpan URL hasil upload
    }

    // --- SIMPAN KE DATABASE ---
    await Review.create({
      product: productId,
      user: session.user.id,
      order: orderId,
      rating,
      comment,
      image: imageUrl, // URL gambar disimpan di sini
    });
    
    // Refresh halaman agar update terlihat
    revalidatePath('/dashboard/my-orders');
    revalidatePath(`/products/${productId}`); 
    revalidatePath('/admin/reviews');
    
    return { success: true, message: 'Ulasan Anda berhasil dikirim' };

  } catch (error: any) {
    console.error("Submit Review Error:", error);
    return { success: false, message: error.message || "Gagal mengirim ulasan" };
  }
}