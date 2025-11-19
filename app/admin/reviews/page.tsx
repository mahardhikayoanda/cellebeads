// File: app/admin/reviews/page.tsx
import { getReviews, IReviewPopulated } from './actions';
import ReviewAdminCard from './ReviewAdminCard'; // <-- Import komponen baru
import { MessageSquare } from 'lucide-react';

export default async function AdminReviewsPage() {
  const reviews: IReviewPopulated[] = await getReviews();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-stone-100 rounded-lg">
           <MessageSquare className="w-6 h-6 text-stone-600" />
        </div>
        <div>
           <h1 className="text-2xl font-lora font-bold text-stone-800">Kelola Ulasan</h1>
           <p className="text-stone-500 text-sm">Tanggapi umpan balik dari pelanggan Anda.</p>
        </div>
      </div>
      
      <div className="grid gap-6">
        {reviews.length > 0 ? (
           reviews.map((review) => (
             <ReviewAdminCard key={review._id} review={review} />
           ))
        ) : (
           <div className="text-center py-20 bg-white rounded-xl border border-dashed border-stone-200">
              <p className="text-stone-400">Belum ada ulasan yang masuk.</p>
           </div>
        )}
      </div>
    </div>
  );
}