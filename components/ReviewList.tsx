// File: components/ReviewList.tsx
import { Star, User } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

// Tipe data ulasan yang kita terima
interface IReviewData {
  _id: string;
  rating: number;
  comment: string;
  image?: string;
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

  // Hitung rating rata-rata
  const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h3 className="text-2xl font-lora font-semibold">
          Ulasan Pelanggan ({reviews.length})
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold">{avgRating.toFixed(1)}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={cn(
                  "w-5 h-5", 
                  i < Math.round(avgRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                )} 
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">dari {reviews.length} ulasan</span>
        </div>
      </div>
      
      {/* Daftar Ulasan */}
      <div className="grid gap-6">
        {reviews.map((review) => (
          <Card key={review._id} className="border-stone-100 shadow-sm">
            <CardContent className="p-4 md:p-6">
              <div className="flex items-start gap-4">
                {/* Avatar Pengguna */}
                <div className="w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-500 flex-shrink-0">
                  <User size={20} />
                </div>

                <div className="w-full">
                  <div className="flex justify-between items-center">
                    {/* Nama dan Tanggal */}
                    <div>
                      <p className="text-sm font-semibold text-stone-900">{review.user?.name || 'Pelanggan'}</p>
                      <p className="text-xs text-stone-400">
                        {new Date(review.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    {/* Bintang */}
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn(
                            "w-4 h-4", 
                            i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                          )} 
                        />
                      ))}
                    </div>
                  </div>

                  {/* Komentar */}
                  <p className="text-stone-700 text-sm mt-3 leading-relaxed">
                    {review.comment}
                  </p>

                  {/* Foto Ulasan */}
                  {review.image && (
                    <div className="mt-4">
                      <a href={review.image} target="_blank" rel="noopener noreferrer">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-stone-200 cursor-pointer hover:opacity-90 transition-opacity">
                          <Image 
                            src={review.image} 
                            alt="Foto ulasan" 
                            fill 
                            className="object-cover"
                          />
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}