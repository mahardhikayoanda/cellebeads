// File: app/admin/reviews/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Review from '@/models/Review';
import Product from '@/models/Product'; // Pastikan model Product ter-load
import { revalidatePath } from 'next/cache';

export interface IReviewPopulated {
  _id: string;
  rating: number;
  comment: string;
  image?: string;
  createdAt: string;
  // Info tambahan
  adminReply?: string;
  adminReplyDate?: string;
  // Relasi
  user: { name: string; email: string };
  product: {
      category: string; 
      _id: string; 
      name: string; 
      images: string[]; // [FIX] Ubah jadi array images
  };
}

// 1. AMBIL SEMUA ULASAN
export async function getReviews(): Promise<IReviewPopulated[]> {
  await dbConnect();
  try {
    const reviews = await Review.find({})
      .populate('user', 'name email')
      .populate('product', 'name images') // [FIX] Ambil field 'images'
      .sort({ createdAt: -1 }); 
      
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    console.error("Gagal mengambil ulasan:", error);
    return [];
  }
}

// 2. KIRIM BALASAN
export async function replyToReview(reviewId: string, replyText: string) {
  await dbConnect();
  try {
    const review = await Review.findById(reviewId);
    if (!review) return { success: false, message: "Ulasan tidak ditemukan" };

    review.adminReply = replyText;
    review.adminReplyDate = new Date();
    await review.save();

    revalidatePath('/admin/reviews');
    revalidatePath(`/products/${review.product}`); 
    
    return { success: true, message: "Balasan berhasil dikirim" };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}