// File: components/ReviewList.tsx
'use client';

import { Star, Store } from 'lucide-react'; 
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface IReviewData {
  _id: string;
  rating: number;
  comment: string;
  image?: string; // URL Gambar Ulasan
  adminReply?: string;
  user: { 
    name: string;
    image?: string; // Foto Profil User
  };
  createdAt: string;
}

export default function ReviewList({ reviews }: { reviews: IReviewData[] }) {
  
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500 bg-stone-50/50 rounded-2xl border border-stone-100 border-dashed">
        <h3 className="text-lg font-bold font-lora">Belum Ada Ulasan</h3>
        <p className="text-sm mt-1">Jadilah yang pertama memberikan ulasan untuk produk ini!</p>
      </div>
    );
  }

  // Hitung rata-rata rating
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-10">
      
      {/* Header Statistik Ulasan */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 bg-white p-6 rounded-2xl border border-stone-100 shadow-sm">
        <div>
           <h3 className="text-2xl font-lora font-bold text-stone-800">Ulasan Pelanggan</h3>
           <p className="text-stone-500 text-sm mt-1">Apa kata mereka yang sudah membeli</p>
        </div>
        <div className="flex items-center gap-5 bg-stone-50 px-6 py-3 rounded-xl border border-stone-100">
          <span className="text-5xl font-bold text-stone-800 tracking-tighter">{avgRating.toFixed(1)}</span>
          <div className="flex flex-col gap-1">
             <div className="flex">
               {[...Array(5)].map((_, i) => (
                 <Star key={i} className={cn("w-5 h-5", i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200")} />
               ))}
             </div>
             <span className="text-xs font-bold text-stone-500">{reviews.length} Ulasan</span>
          </div>
        </div>
      </div>
      
      {/* Daftar Review Grid */}
      <div className="grid gap-8">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-stone-100 pb-8 last:border-0 last:pb-0">
              <div className="flex items-start gap-4">
                
                {/* Avatar User */}
                <Avatar className="w-12 h-12 border-2 border-white shadow-sm">
                  <AvatarImage src={review.user.image} alt={review.user.name} />
                  <AvatarFallback className="bg-gradient-to-br from-pink-100 to-rose-200 text-rose-600 font-bold">
                    {review.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="w-full space-y-2">
                  {/* Nama & Rating */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-stone-900">{review.user.name}</p>
                      <div className="flex items-center mt-1 space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200 fill-gray-200")} />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-stone-400">
                       {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  {/* Isi Komentar */}
                  <p className="text-stone-700 text-sm leading-relaxed">{review.comment}</p>

                  {/* --- TAMPILAN GAMBAR ULASAN --- */}
                  {review.image && (
                    <div className="pt-2">
                       <a 
                         href={review.image} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="relative inline-block w-28 h-28 rounded-xl overflow-hidden border border-stone-200 shadow-sm group cursor-zoom-in"
                       >
                        <Image 
                          src={review.image} 
                          alt="Foto ulasan pelanggan" 
                          fill 
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 768px) 100px, 120px"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                       </a>
                    </div>
                  )}

                  {/* Balasan Admin */}
                  {review.adminReply && (
                    <div className="mt-4 bg-stone-50 p-4 rounded-xl border-l-4 border-pink-300 ml-0 md:ml-2">
                       <div className="flex items-center gap-2 mb-1">
                          <Store className="w-3 h-3 text-pink-600" />
                          <span className="text-xs font-bold text-stone-800">Respon Penjual</span>
                       </div>
                       <p className="text-sm text-stone-600 italic">
                          "{review.adminReply}"
                       </p>
                    </div>
                  )}
                </div>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}