// File: app/admin/reviews/ReviewAdminCard.tsx
'use client';

import { useState } from 'react';
import { IReviewPopulated, replyToReview } from './actions';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, User, Calendar, Reply } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ReviewAdminCard({ review }: { review: IReviewPopulated }) {
  const [replyText, setReplyText] = useState(review.adminReply || '');
  const [isEditing, setIsEditing] = useState(!review.adminReply);
  const [isLoading, setIsLoading] = useState(false);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setIsLoading(true);
    const res = await replyToReview(review._id, replyText);
    if (res.success) {
      alert("Balasan terkirim!");
      setIsEditing(false);
    } else {
      alert("Gagal: " + res.message);
    }
    setIsLoading(false);
  };

  return (
    <Card className="overflow-hidden border-stone-200 shadow-sm hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col md:flex-row">
        
        {/* KIRI: Info Produk & Foto */}
        <div className="w-full md:w-48 bg-stone-50 p-4 flex flex-col items-center justify-center border-r border-stone-100">
           <div className="relative w-24 h-24 rounded-md overflow-hidden border border-stone-200 mb-3">
             {/* Gambar Produk */}
             <Image 
               src={review.product?.image || '/placeholder.jpg'} 
               alt="Product" fill className="object-cover" 
             />
           </div>
           <p className="text-xs text-center font-medium text-stone-600 line-clamp-2">
             {review.product?.name || 'Produk Dihapus'}
           </p>
        </div>

        {/* KANAN: Konten Ulasan */}
        <div className="flex-1 p-6 flex flex-col">
           
           {/* Header Ulasan */}
           <div className="flex justify-between items-start mb-4">
             <div>
                <div className="flex items-center gap-2 mb-1">
                   <Badge variant="outline" className="gap-1 bg-yellow-50 text-yellow-700 border-yellow-200">
                      {review.rating} <Star className="w-3 h-3 fill-yellow-500 text-yellow-500" />
                   </Badge>
                   <span className="text-sm text-stone-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(review.createdAt).toLocaleDateString('id-ID')}
                   </span>
                </div>
                <h4 className="font-semibold text-stone-800 flex items-center gap-2">
                   <User className="w-4 h-4 text-stone-400" />
                   {review.user?.name}
                   <span className="text-xs font-normal text-stone-400">({review.user?.email})</span>
                </h4>
             </div>
           </div>

           {/* Isi Komentar & Foto Ulasan */}
           <div className="mb-6">
              <p className="text-stone-700 text-sm leading-relaxed bg-stone-50/50 p-3 rounded-lg border border-stone-100 italic">
                "{review.comment}"
              </p>
              {review.image && (
                <div className="mt-3">
                   <p className="text-xs text-stone-400 mb-1">Foto dari pelanggan:</p>
                   <a href={review.image} target="_blank" rel="noopener noreferrer" className="inline-block">
                     <Image 
                        src={review.image} alt="Review" width={80} height={80} 
                        className="rounded-md border border-stone-200 hover:scale-105 transition-transform"
                     />
                   </a>
                </div>
              )}
           </div>

           {/* AREA BALASAN ADMIN */}
           <div className="mt-auto border-t border-stone-100 pt-4">
              {isEditing ? (
                <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                   <p className="text-sm font-medium text-stone-700 flex items-center gap-2">
                      <Reply className="w-4 h-4" /> Balas Ulasan:
                   </p>
                   <Textarea 
                      value={replyText} 
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Tulis ucapan terima kasih atau tanggapan Anda..."
                      className="min-h-[80px] bg-stone-50"
                   />
                   <div className="flex justify-end gap-2">
                      {review.adminReply && (
                        <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Batal</Button>
                      )}
                      <Button size="sm" onClick={handleReply} disabled={isLoading} className="bg-blue-500 hover:bg-blue-500">
                        {isLoading ? 'Mengirim...' : 'Kirim Balasan'}
                      </Button>
                   </div>
                </div>
              ) : (
                <div className="bg-blue-50/50 p-3 rounded-md border border-blue-100">
                   <div className="flex justify-between items-start mb-1">
                      <p className="text-xs font-bold text-blue-700 uppercase tracking-wide">Respon Anda</p>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsEditing(true)}>
                         <MessageSquare className="w-3 h-3 text-blue-400" />
                      </Button>
                   </div>
                   <p className="text-sm text-stone-700">{review.adminReply}</p>
                   <p className="text-[10px] text-stone-400 mt-1 text-right">
                      {review.adminReplyDate ? new Date(review.adminReplyDate).toLocaleString('id-ID') : ''}
                   </p>
                </div>
              )}
           </div>

        </div>
      </div>
    </Card>
  );
}