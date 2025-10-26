// File: app/dashboard/my-orders/OrderActionsClient.tsx
'use client';

import { useState } from 'react';
import { IOrder } from '@/app/admin/orders/actions';
import { markOrderAsDelivered, submitReview } from './actions';

interface Props {
  order: IOrder;
}

export default function OrderActionsClient({ order }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState<string | null>(null);

  const handleDelivered = async () => {
    if (confirm('Konfirmasi bahwa Anda sudah menerima pesanan ini?')) {
      setIsLoading(true);
      const result = await markOrderAsDelivered(order._id);
      if (!result.success) alert(`Error: ${result.message}`);
      setIsLoading(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await submitReview(formData);
    
    if (result.success) {
      alert(result.message);
      setShowReviewForm(null); // Tutup form
    } else {
      alert(`Error: ${result.message}`);
    }
    setIsLoading(false);
  };

  // --- STYLE DIPERBAIKI DI BAWAH INI ---
  const reviewInputStyle: React.CSSProperties = {
    color: 'white', // Teks menjadi putih
    backgroundColor: '#333', // Background menjadi abu-abu gelap
    border: '1px solid #555',
    borderRadius: '4px',
    padding: '5px',
    width: '100%',
    boxSizing: 'border-box'
  };
  // ------------------------------------

  // Tampilan "Pesanan Diterima"
  if (order.status === 'processed') {
    return (
      <button 
        onClick={handleDelivered} 
        disabled={isLoading}
        style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
      >
        {isLoading ? 'Memproses...' : 'Pesanan Diterima'}
      </button>
    );
  }

  // Tampilan "Beri Ulasan"
  if (order.status === 'delivered') {
    const productToReview = order.items[0]; 

    return (
      <div>
        {showReviewForm === productToReview.name ? (
          <form onSubmit={handleReviewSubmit}>
            <input type="hidden" name="productId" value={productToReview.product} />
            <input type="hidden" name="orderId" value={order._id} />
            
            <div style={{ marginBottom: '5px' }}>
              <label>Rating (1-5):</label>
              <input 
                type="number" 
                name="rating" 
                min="1" 
                max="5" 
                required 
                style={{...reviewInputStyle, width: '70px', marginLeft: '10px'}} // Terapkan style
              />
            </div>
            
            <div style={{ marginBottom: '5px' }}>
              <label>Ulasan:</label>
              <textarea 
                name="comment" 
                required 
                style={{...reviewInputStyle, minHeight: '60px'}} // Terapkan style
              />
            </div>
            
            <button 
              type="submit" 
              disabled={isLoading} 
              style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
            >
              {isLoading ? 'Mengirim...' : 'Kirim Ulasan'}
            </button>
          </form>
        ) : (
          <button 
            onClick={() => setShowReviewForm(productToReview.name)}
            style={{ backgroundColor: 'blue', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
          >
            Beri Ulasan
          </button>
        )}
      </div>
    );
  }

  // Tampilan default
  return <span>-</span>;
}