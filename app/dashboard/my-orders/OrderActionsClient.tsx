// File: app/dashboard/my-orders/OrderActionsClient.tsx
'use client';
import { useState } from 'react';
import { IOrder } from '@/app/admin/orders/actions';
import { markOrderAsDelivered, submitReview } from './actions';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card"; 

interface Props { order: IOrder; }

export default function OrderActionsClient({ order }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);

  const handleDelivered = async () => {
    setIsLoading(true);
    const result = await markOrderAsDelivered(order._id);
    if (!result.success) alert(result.message);
    setIsLoading(false);
  };
  
  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await submitReview(formData);
    if (result.success) {
      alert("Ulasan terkirim!");
      setShowReviewForm(null);
    } else {
      alert("Gagal: " + result.message);
    }
    setIsLoading(false);
  };

  // Tombol Pesanan Diterima
  if (order.status === 'processed') {
    return (
      <Button onClick={handleDelivered} disabled={isLoading} size="sm" 
              className="bg-emerald-600 hover:bg-emerald-700">
        {isLoading ? '...' : 'Pesanan Diterima'} 
      </Button>
    );
  }

  // Tombol & Form Ulasan
  if (order.status === 'delivered') {
    const productToReview = order.items[0]; 
    return (
      <div>
        {showReviewForm === productToReview.name ? (
          // Hapus class tema gelap dari Card
          <Card className="mt-2 text-left shadow-lg border-stone-200"> 
            <CardContent className="p-4 space-y-2">
              <h4 className="text-sm font-medium mb-2 text-foreground">Ulasan untuk {productToReview.name}:</h4>
              <form onSubmit={handleReviewSubmit} id={`review-form-${order._id}`} className="space-y-2">
                <input type="hidden" name="productId" value={(productToReview as any).product} />
                <input type="hidden" name="orderId" value={order._id} />
                <div className="flex items-center gap-2">
                  <Label htmlFor={`rating-${order._id}`} className="text-sm">Rating (1-5):</Label>
                  <Input id={`rating-${order._id}`} type="number" name="rating" min="1" max="5" required className="w-16 h-8 text-center"/>
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`comment-${order._id}`} className="text-sm">Ulasan:</Label>
                  <Textarea id={`comment-${order._id}`} name="comment" required />
                </div>
              </form>
               <Button type="submit" form={`review-form-${order._id}`} disabled={isLoading} size="sm" className="w-full"> 
                  {isLoading ? 'Mengirim...' : 'Kirim Ulasan'} 
               </Button>
            </CardContent>
          </Card>
        ) : (
          <Button onClick={() => setShowReviewForm(productToReview.name)} size="sm"> 
            Beri Ulasan 
          </Button>
        )}
      </div>
    );
  }
  return <span>-</span>;
}