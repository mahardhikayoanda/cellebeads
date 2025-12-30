// File: app/dashboard/my-orders/OrderActionsClient.tsx
'use client';
import { useState } from 'react';
import { IOrderWithReview } from './actions';
import { receiveOrder, submitReview } from './actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card"; 
import { Star, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Props { order: IOrderWithReview; }

export default function OrderActionsClient({ order }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);
  
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const handleDelivered = async () => {
    setIsLoading(true);
    const result = await receiveOrder(order._id);
    if (result.success) {
        toast.success(result.message); 
    } else {
        toast.error(result.message); 
    }
    setIsLoading(false);
  };
  
  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    formData.set('rating', rating.toString()); 

    const result = await submitReview(formData);
    
    if (result.success) {
      toast.success("Ulasan terkirim! Terima kasih."); 
      setShowReviewForm(null);
    } else {
      toast.error("Gagal: " + (result.message || 'Terjadi kesalahan'));
    }
    setIsLoading(false);
  };

  // ... (review logic same)

  // 6. Tombol Pesanan Diterima (HANYA MUNCUL JIKA STATUS 'SHIPPED')
  if (order.status === 'shipped') {
    return (
      <Button onClick={handleDelivered} disabled={isLoading} size="sm" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md hover:shadow-lg transition-all">
        {isLoading ? '...' : 'Pesanan Diterima'} 
      </Button>
    );
  }

  // 7. Status Delivered/Completed
  if (['delivered', 'completed'].includes(order.status)) {
      if (order.isReviewed) {
         return (
             <span className="flex items-center justify-center text-emerald-600 font-medium text-sm">
                 <CheckCircle className="w-4 h-4 mr-1" /> Selesai
             </span>
         );
      }
      // Lanjut ke Form Review di bawah jika belum review
  }

  // 8. Tombol & Form Ulasan (Jika 'delivered' TAPI 'isReviewed' false)
  if (order.status === 'delivered' && !order.isReviewed) {
    const productToReview = order.items[0]; 
    if (!productToReview) return <span>-</span>;

    return (
      <div>
        {showReviewForm === productToReview.name ? (
          <Card className="mt-2 text-left shadow-lg border-stone-200 w-full max-w-sm relative z-10"> 
            <CardContent className="p-4 space-y-3">
              <h4 className="text-sm font-medium mb-2 text-foreground">Bagaimana kualitas produk ini?</h4>
              
              <form onSubmit={handleReviewSubmit} id={`review-form-${order._id}`} className="space-y-3">
                <input type="hidden" name="productId" value={productToReview.product} />
                <input type="hidden" name="orderId" value={order._id} />
                
                {/* INPUT BINTANG INTERAKTIF */}
                <div className="flex flex-col gap-1">
                  <Label className="text-sm text-stone-600">Rating:</Label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button" // Penting agar tidak men-submit form
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          className={cn(
                            "w-6 h-6", 
                            (hoverRating || rating) >= star 
                              ? "text-yellow-400 fill-yellow-400" 
                              : "text-gray-300"
                          )} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`comment-${order._id}`} className="text-sm">Ulasan:</Label>
                  <Textarea id={`comment-${order._id}`} name="comment" placeholder="Tulis pengalaman Anda..." required className="min-h-[80px]" />
                </div>
                
                <div className="space-y-1">
                  <Label htmlFor={`image-${order._id}`} className="text-sm">Foto (Opsional):</Label>
                  <Input id={`image-${order._id}`} type="file" name="image" accept="image/*" className="text-xs file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-secondary file:text-secondary-foreground hover:file:cursor-pointer"/>
                </div>

                <div className="flex gap-2 pt-2">
                    <Button type="button" variant="outline" size="sm" onClick={() => setShowReviewForm(null)} className="flex-1">
                        Batal
                    </Button>
                    <Button type="submit" disabled={isLoading} size="sm" className="flex-1"> 
                        {isLoading ? '...' : 'Kirim'} 
                    </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Button onClick={() => setShowReviewForm(productToReview.name)} size="sm" variant="outline" className="border-primary text-primary hover:bg-primary/10"> 
            Beri Ulasan 
          </Button>
        )}
      </div>
    );
  }
  return <span>-</span>;
}