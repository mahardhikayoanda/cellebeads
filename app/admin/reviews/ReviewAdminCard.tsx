// File: app/admin/reviews/ReviewAdminCard.tsx
'use client';

import { useState } from 'react';
import { IReviewPopulated, replyToReview } from './actions';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Star, Reply } from 'lucide-react';

export default function ReviewAdminCard({ review }: { review: IReviewPopulated }) {
  const [replyText, setReplyText] = useState(review.adminReply || '');
  const [isEditing, setIsEditing] = useState(!review.adminReply);
  const [isLoading, setIsLoading] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setIsLoading(true);
    await replyToReview(review._id, replyText);
    setIsEditing(false);
    setIsLoading(false);
  };

  return (
    <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow bg-white rounded-xl">
      <div className="flex flex-col md:flex-row">
        
        {/* Kolom Gambar Produk */}
        <div className="w-full md:w-40 bg-stone-50 p-4 flex flex-col items-center justify-center border-r border-stone-50">
           <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-sm">
             <Image 
               src={review.product?.image || '/placeholder.jpg'} 
               alt="Product" fill className="object-cover" 
             />
           </div>
           <p className="text-[10px] text-center font-bold text-stone-500 mt-2 uppercase tracking-wide line-clamp-1">
             {review.product?.name}
           </p>
        </div>

        {/* Kolom Konten */}
        <div className="flex-1 p-6">
           
           {/* Header Rating & User */}
           <div className="flex justify-between items-start mb-3">
             <div>
                <div className="flex items-center gap-1 mb-1">
                   {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-stone-200'}`} />
                   ))}
                </div>
                <h4 className="font-semibold text-stone-800 text-sm">
                   {review.user?.name}
                   <span className="text-stone-400 font-normal ml-1">• {new Date(review.createdAt).toLocaleDateString('id-ID')}</span>
                </h4>
             </div>
           </div>

           {/* Komentar */}
           <div className="bg-stone-50/50 p-3 rounded-lg border border-stone-50 mb-4">
              <p className="text-stone-700 text-sm italic leading-relaxed">"{review.comment}"</p>
              {review.image && (
                <div className="mt-3 pt-3 border-t border-stone-100">
                   <a href={review.image} target="_blank" rel="noreferrer" className="text-xs text-primary underline hover:text-primary/80">
                     Lihat Foto Lampiran
                   </a>
                </div>
              )}
           </div>

           {/* Area Balasan */}
           <div>
              {isEditing ? (
                <div className="animate-in fade-in space-y-2">
                   <Textarea 
                      value={replyText} 
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Tulis balasan Anda..."
                      className="min-h-[60px] text-sm bg-white border-stone-200 focus:border-primary/50"
                   />
                   <div className="flex justify-end gap-2">
                      {review.adminReply && <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Batal</Button>}
                      <Button size="sm" onClick={handleReply} disabled={isLoading} className="bg-stone-800 hover:bg-stone-700 text-white">
                        {isLoading ? '...' : 'Kirim'}
                      </Button>
                   </div>
                </div>
              ) : (
                <div className="bg-primary/5 p-3 rounded-lg border border-primary/10 relative group cursor-pointer" onClick={() => setIsEditing(true)}>
                   <p className="text-xs font-bold text-primary uppercase tracking-wide mb-1 flex items-center gap-1">
                     <Reply size={12}/> Respon Anda
                   </p>
                   <p className="text-sm text-stone-600">{review.adminReply}</p>
                   <span className="absolute top-2 right-2 text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">Klik untuk edit</span>
                </div>
              )}
           </div>
        </div>
      </div>
    </Card>
  );
}