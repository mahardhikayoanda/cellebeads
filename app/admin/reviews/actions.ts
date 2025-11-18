// File: app/admin/reviews/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Review from '@/models/Review';
import { IProduct } from '../products/actions';

// Tipe data untuk Ulasan yang akan ditampilkan
export interface IReviewPopulated {
  _id: string;
  rating: number;
  comment: string;
  image?: string; // Foto ulasan
  createdAt: string;
  user: { name: string };
  product: { name: string, images: string[] }; // Tampilkan nama & gambar produk
}

export async function getReviews(): Promise<IReviewPopulated[]> {
  await dbConnect();
  try {
    const reviews = await Review.find({})
      .populate('user', 'name')
      .populate('product', 'name images') // Ambil nama & gambar produk
      .sort({ createdAt: -1 });
      
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    console.error("Gagal mengambil ulasan:", error);
    return [];
  }
}