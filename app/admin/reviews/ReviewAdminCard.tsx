// File: app/admin/reviews/ReviewAdminCard.tsx
'use client';

import { useState } from 'react';
import { IReviewPopulated, replyToReview } from './actions';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Reply, Quote, CornerDownRight } from 'lucide-react';

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

  // [FIX] Ambil gambar pertama dari array images, atau fallback ke placeholder
  const productImage = review.product?.images?.[0] || '/placeholder.jpg';

  return (
    <div className="glass-super rounded-3xl p-6 relative group transition-all duration-300 hover:shadow-xl hover:shadow-pink-100">
      
      {/* Icon Kutipan Dekoratif */}
      <Quote className="absolute top-6 right-6 text-pink-100 w-12 h-12 fill-pink-50 rotate-180" />

      <div className="flex flex-col md:flex-row gap-6 relative z-10">
        
        {/* Foto Produk (Kiri) */}
        <div className="w-full md:w-32 flex-shrink-0 flex flex-col items-center">
           <div className="relative w-24 h-24 rounded-2xl overflow-hidden shadow-md border-2 border-white rotate-3 group-hover:rotate-0 transition-transform duration-500">
             <Image 
               src={productImage} // [FIX] Menggunakan variabel yang sudah diperbaiki
               alt="Product" fill className="object-cover" 
             />
           </div>
           <p className="text-[10px] text-center font-bold text-stone-400 mt-3 uppercase tracking-wider line-clamp-2">
             {review.product?.name}
           </p>
        </div>

        {/* Konten Ulasan (Kanan) */}
        <div className="flex-1 space-y-4">
           
           {/* Header User */}
           <div>
              <div className="flex items-center gap-1 mb-1">
                 {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400 drop-shadow-sm' : 'text-stone-200'}`} />
                 ))}
                 <span className="text-xs font-bold text-stone-400 ml-2 bg-stone-100 px-2 py-0.5 rounded-full">
                    {review.rating}.0
                 </span>
              </div>
              <h4 className="font-lora font-bold text-stone-800 text-lg">
                 {review.user?.name}
              </h4>
              <p className="text-xs text-stone-400">{new Date(review.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
           </div>

           {/* Isi Komentar */}
           <div className="bg-white/60 p-4 rounded-r-2xl rounded-bl-2xl border border-pink-50 shadow-sm">
              <p className="text-stone-700 italic leading-relaxed font-serif text-base">
                "{review.comment}"
              </p>
              {review.image && (
                <div className="mt-3 pt-3 border-t border-dashed border-pink-100">
                   <a href={review.image} target="_blank" rel="noreferrer" className="text-xs font-bold text-pink-500 hover:underline flex items-center gap-1">
                     Lihat Foto Pelanggan ↗
                   </a>
                </div>
              )}
           </div>

           {/* Area Balasan Admin */}
           <div className="pl-4 md:pl-8">
              {isEditing ? (
                <div className="animate-in fade-in space-y-3 bg-stone-50 p-4 rounded-2xl border border-stone-100">
                   <div className="flex items-center gap-2 text-stone-500 mb-1">
                      <CornerDownRight size={16} /> <span className="text-xs font-bold uppercase">Balasan Anda</span>
                   </div>
                   <Textarea 
                      value={replyText} 
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Terima kasih Kak cantik..."
                      className="min-h-[80px] bg-white border-stone-200 focus:border-pink-300 focus:ring-pink-100 rounded-xl resize-none"
                   />
                   <div className="flex justify-end gap-2">
                      {review.adminReply && <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="text-stone-500">Batal</Button>}
                      <Button size="sm" onClick={handleReply} disabled={isLoading} className="bg-stone-800 hover:bg-pink-600 text-white rounded-xl px-6">
                        {isLoading ? 'Mengirim...' : 'Kirim Balasan'}
                      </Button>
                   </div>
                </div>
              ) : (
                <div 
                  className="bg-gradient-to-r from-stone-800 to-stone-700 text-white p-4 rounded-2xl rounded-tl-none shadow-lg relative group cursor-pointer hover:scale-[1.01] transition-transform" 
                  onClick={() => setIsEditing(true)}
                >
                   <p className="text-[10px] font-bold text-pink-300 uppercase tracking-widest mb-1 flex items-center gap-2">
                     <Reply size={12}/> Respon Toko
                   </p>
                   <p className="text-sm font-light text-stone-100 leading-relaxed">"{review.adminReply}"</p>
                   <span className="absolute top-3 right-3 text-[9px] bg-white/10 px-2 py-1 rounded text-white opacity-0 group-hover:opacity-100 transition-opacity">Edit</span>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}