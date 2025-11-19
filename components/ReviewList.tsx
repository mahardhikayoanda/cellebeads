// File: components/ReviewList.tsx
import { Star, User, Store } from 'lucide-react'; // Import ikon Toko
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

interface IReviewData {
  _id: string;
  rating: number;
  comment: string;
  image?: string;
  adminReply?: string; // <-- Tambah field ini
  user: { name: string };
  createdAt: string;
}

export default function ReviewList({ reviews }: { reviews: IReviewData[] }) {
  if (reviews.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500 bg-stone-50 rounded-lg border border-stone-100">
        <h3 className="text-lg font-medium">Belum Ada Ulasan</h3>
        <p className="text-sm">Jadilah yang pertama mengulas produk ini.</p>
      </div>
    );
  }

  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-8">
      {/* Header Statistik */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-xl border border-stone-100 shadow-sm">
        <div>
           <h3 className="text-2xl font-lora font-semibold text-stone-800">Ulasan Pelanggan</h3>
           <p className="text-stone-500 text-sm">Apa kata mereka tentang produk ini</p>
        </div>
        <div className="flex items-center gap-4 bg-stone-50 px-4 py-2 rounded-lg">
          <span className="text-4xl font-bold text-stone-800">{avgRating.toFixed(1)}</span>
          <div className="flex flex-col">
             <div className="flex">
               {[...Array(5)].map((_, i) => (
                 <Star key={i} className={cn("w-5 h-5", i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-200")} />
               ))}
             </div>
             <span className="text-xs text-stone-500 mt-1">{reviews.length} ulasan</span>
          </div>
        </div>
      </div>
      
      {/* Daftar Review */}
      <div className="grid gap-6">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-stone-100 pb-8 last:border-0">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-rose-100 to-stone-100 rounded-full flex items-center justify-center text-rose-500 font-bold shadow-sm flex-shrink-0">
                   {review.user?.name?.charAt(0).toUpperCase()}
                </div>

                <div className="w-full">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-bold text-stone-900">{review.user?.name || 'Pelanggan'}</p>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200")} />
                        ))}
                        <span className="text-xs text-stone-400 ml-2 border-l border-stone-200 pl-2">
                           {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-stone-700 text-sm mt-3 leading-relaxed">{review.comment}</p>

                  {review.image && (
                    <div className="mt-4">
                       <a href={review.image} target="_blank" rel="noopener noreferrer" className="inline-block">
                        <Image src={review.image} alt="Foto ulasan" width={100} height={100} className="rounded-lg border border-stone-200 object-cover hover:opacity-90 transition-opacity"/>
                       </a>
                    </div>
                  )}

                  {/* --- BALASAN ADMIN (TAMPILAN PELANGGAN) --- */}
                  {review.adminReply && (
                    <div className="mt-4 bg-stone-50 p-4 rounded-lg border-l-4 border-rose-200 ml-0 md:ml-4">
                       <p className="text-xs font-bold text-stone-800 flex items-center gap-2 mb-1">
                          <Store className="w-3 h-3 text-rose-500" />
                          Respon Penjual:
                       </p>
                       <p className="text-sm text-stone-600 italic">
                          "{review.adminReply}"
                       </p>
                    </div>
                  )}
                  {/* ------------------------------------------ */}
                </div>
              </div>
          </div>
        ))}
      </div>
    </div>
  );
}