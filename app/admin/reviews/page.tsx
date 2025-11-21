// File: app/admin/reviews/page.tsx
import { getReviews, IReviewPopulated } from './actions';
import ReviewTabs from './ReviewTabs'; // <-- Import komponen baru
import { MessageSquareQuote } from 'lucide-react';

export default async function AdminReviewsPage() {
  // Ambil semua ulasan dari server
  const reviews: IReviewPopulated[] = await getReviews();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-stone-200 pb-6">
        <div className="p-3 bg-yellow-50 rounded-xl text-yellow-600 shadow-sm">
           <MessageSquareQuote className="w-8 h-8" />
        </div>
        <div>
           <h1 className="text-3xl font-lora font-bold text-stone-800">Ulasan Pelanggan</h1>
           <p className="text-stone-500">Kelola feedback dan rating per kategori produk.</p>
        </div>
      </div>
      
      {/* Tampilkan Tab Kategori jika ada ulasan */}
      {reviews.length > 0 ? (
         <ReviewTabs reviews={reviews} />
      ) : (
         <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-stone-200 shadow-sm">
            <div className="inline-flex p-4 bg-stone-50 rounded-full mb-4">
               <MessageSquareQuote className="w-8 h-8 text-stone-300" />
            </div>
            <h3 className="text-lg font-medium text-stone-700">Belum Ada Ulasan</h3>
            <p className="text-stone-400 mt-1">Ulasan dari pelanggan akan muncul di sini.</p>
         </div>
      )}
    </div>
  );
}