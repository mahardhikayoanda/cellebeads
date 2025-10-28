// File: app/dashboard/my-orders/OrderActionsClient.tsx
'use client';

import { useState } from 'react';
import { IOrder } from '@/app/admin/orders/actions';
import { markOrderAsDelivered, submitReview } from './actions';

interface Props { order: IOrder; }

export default function OrderActionsClient({ order }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);

  const handleDelivered = async () => {/* ... (kode sama) ... */};
  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {/* ... (kode sama) ... */};

  // Style
  const reviewInputClassName = "w-full bg-white border-stone-300 text-stone-800 rounded-md p-2 shadow-sm focus:ring-rose-500 focus:border-rose-500";

  // Tombol Pesanan Diterima (Hijau)
  if (order.status === 'processed') {
    return (
      <button onClick={handleDelivered} disabled={isLoading}
        className="bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-1 px-3 rounded-md shadow-sm transition-colors disabled:opacity-50"
      > {isLoading ? '...' : 'Pesanan Diterima'} </button>
    );
  }

  // Tombol & Form Ulasan (Biru)
  if (order.status === 'delivered') {
    const productToReview = order.items[0]; 
    return (
      <div>
        {showReviewForm === productToReview.name ? (
          <form onSubmit={handleReviewSubmit} className="mt-2 p-3 border border-stone-200 rounded-md bg-stone-50">
            <h4 className="text-sm font-medium mb-2 text-stone-700">Ulasan untuk {productToReview.name}:</h4>
            <input type="hidden" name="productId" value={productToReview.product} />
            <input type="hidden" name="orderId" value={order._id} />
            
            <div className="mb-2 flex items-center">
              <label className="text-sm font-medium text-stone-600 mr-2">Rating (1-5):</label>
              <input type="number" name="rating" min="1" max="5" required 
                className={`${reviewInputClassName} w-16 text-center`} // Style input
              />
            </div>
            
            <div className="mb-2">
              <label className="block text-sm font-medium text-stone-600 mb-1">Ulasan:</label>
              <textarea name="comment" required 
                className={`${reviewInputClassName} min-h-[60px]`} // Style input
              />
            </div>
            
            <button type="submit" disabled={isLoading} 
              // Style Tombol (Biru)
              className="w-full py-1 px-3 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-md shadow-sm transition-colors disabled:opacity-50"
            > {isLoading ? 'Mengirim...' : 'Kirim Ulasan'} </button>
          </form>
        ) : (
          <button onClick={() => setShowReviewForm(productToReview.name)}
            // Style Tombol (Biru)
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm py-1 px-3 rounded-md shadow-sm transition-colors"
          > Beri Ulasan </button>
        )}
      </div>
    );
  }

  return <span>-</span>;
}