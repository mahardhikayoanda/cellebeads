// File: app/admin/reviews/page.tsx
import { getReviews, IReviewPopulated } from './actions';
import ReviewTabs from './ReviewTabs'; 
import { Star, MessageSquareQuote } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminReviewsPage() {
  const reviews: IReviewPopulated[] = await getReviews();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      {/* --- HEADER BARU --- */}
      <div className="flex items-center gap-3 border-b border-stone-200 pb-6">
        <div className="p-3 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-xl text-white shadow-lg shadow-pink-200">
           <Star size={24} />
        </div>
        <div>
           <h1 className="text-3xl font-lora font-bold text-stone-800">Ulasan Pelanggan</h1>
           <p className="text-stone-500">Kelola feedback dan rating dari pembeli.</p>
        </div>
      </div>
      {/* ------------------- */}
      
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