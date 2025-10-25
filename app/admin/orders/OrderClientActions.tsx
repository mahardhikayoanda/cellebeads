// File: app/admin/orders/OrderClientActions.tsx
'use client';

import { confirmOrder } from './actions';
import { useState } from 'react';

interface Props {
  orderId: string;
}

export default function OrderClientActions({ orderId }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    // Minta konfirmasi
    if (!confirm('Anda yakin ingin mengkonfirmasi pesanan ini? Stok akan dikurangi.')) {
      return;
    }
    setIsLoading(true);
    const result = await confirmOrder(orderId);
    if (result.success) {
      alert('Pesanan berhasil dikonfirmasi!');
      // Halaman akan di-refresh oleh revalidatePath di server action
    } else {
      alert(`Error: ${result.message}`);
    }
    setIsLoading(false);
  };

  return (
    <button 
      onClick={handleConfirm} 
      disabled={isLoading}
      style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
    >
      {isLoading ? 'Memproses...' : 'Konfirmasi Pesanan'}
    </button>
  );
}