'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Review from '@/models/Review';
import { auth } from '@/auth';
import { IOrder } from '@/app/admin/orders/actions'; // Kita gunakan IOrder yang sudah diperbaiki
import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';

// Tipe data baru yang dikirim ke client
export interface IOrderWithReview extends IOrder {
  isReviewed: boolean;
}

// 1. GET ORDERS (Diperbarui untuk cek status review)
export async function getMyOrders(): Promise<IOrderWithReview[]> {
  const session = await auth();
  if (!session?.user) return []; 
  
  await dbConnect();
  const orders = await Order.find({ user: session.user.id })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  
  // Cek apakah setiap order sudah direview
  const ordersWithReviewStatus = await Promise.all(orders.map(async (order) => {
    // Cek di koleksi Review apakah ada review yang terkait 'order' ini
    const reviewExists = await Review.exists({ order: order._id });
    
    return {
      ...(JSON.parse(JSON.stringify(order)) as IOrder),
      isReviewed: !!reviewExists // True jika reviewExists tidak null
    };
  }));
  
  return ordersWithReviewStatus;
}

// 2. MARK DELIVERED (Tetap sama)
export async function markOrderAsDelivered(orderId: string) {
  const session = await auth();
  if (!session?.user) return { success: false, message: 'Akses ditolak' };

  await dbConnect();
  try {
    const order = await Order.findOne({ _id: orderId, user: session.user.id });
    if (!order) return { success: false, message: 'Pesanan tidak ditemukan' };

    order.status = 'delivered'; 
    order.deliveredAt = new Date(); 
    await order.save();
    
    revalidatePath('/dashboard/my-orders');
    return { success: true, message: 'Pesanan telah diterima' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}

// 3. SUBMIT REVIEW (Diperbarui untuk simpan OrderID & handle Foto)
export async function submitReview(formData: FormData) {
  const session = await auth();
  if (!session?.user) return { success: false, message: 'Akses ditolak' };

  try {
    const productId = formData.get('productId') as string;
    const orderId = formData.get('orderId') as string; // Ambil orderId dari form
    const rating = Number(formData.get('rating'));
    const comment = formData.get('comment') as string;
    const imageFile = formData.get('image') as File;

    if (!productId || !orderId || !rating || !comment) {
      return { success: false, message: 'Rating dan Komentar wajib diisi' };
    }

    await dbConnect();

    // Cek duplikasi review untuk order ini
    const existingReview = await Review.findOne({ order: orderId });
    if (existingReview) {
        return { success: false, message: 'Anda sudah mengulas pesanan ini.' };
    }
    
    let imageUrl: string | undefined = undefined;

    // Upload foto jika ada
    if (imageFile && imageFile.size > 0) {
      const blob = await put(
        `reviews/${session.user.id}/${imageFile.name}`, 
        imageFile,
        { access: 'public', addRandomSuffix: true }
      );
      imageUrl = blob.url;
    }

    // Buat ulasan baru
    await Review.create({
      product: productId,
      user: session.user.id,
      order: orderId, // <-- SIMPAN ID ORDER
      rating,
      comment,
      image: imageUrl,
    });
    
    revalidatePath('/dashboard/my-orders');
    revalidatePath(`/products/${productId}`); 
    revalidatePath('/admin/reviews');
    
    return { success: true, message: 'Ulasan Anda berhasil dikirim' };

  } catch (error: any) {
    return { success: false, message: error.message };
  }
}