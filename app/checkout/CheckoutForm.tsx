// File: app/checkout/CheckoutForm.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { createOrder } from './actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CheckoutForm() {
  const { cartItems, total, clearCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      alert('Keranjang Anda kosong');
      return;
    }
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createOrder(formData, cartItems);

    setIsLoading(false);

    if (result.success && result.waUrl) {
      alert(result.message);
      // Hapus keranjang setelah berhasil
      clearCart();
      
      // Arahkan ke WhatsApp
      // Buka di tab baru agar tidak error di Vercel
      window.open(result.waUrl, '_blank');
      
      // Arahkan user kembali ke halaman produk
      router.push('/products');
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  // Style
  const inputStyle: React.CSSProperties = {
    width: '100%', color: 'white', backgroundColor: '#333',
    padding: '8px', border: '1px solid #555', borderRadius: '4px', boxSizing: 'border-box'
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Form Pemesanan</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Nama Lengkap</label>
        <input name="name" placeholder="Nama Lengkap" required style={inputStyle} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Alamat Lengkap</label>
        <textarea name="address" placeholder="Alamat Lengkap" required style={{...inputStyle, minHeight: '80px'}} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>No. HP (WhatsApp)</label>
        <input name="phone" type="tel" placeholder="Cth: 0812..." required style={inputStyle} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Metode Pembayaran</label>
        <select name="paymentMethod" required style={inputStyle}>
          <option value="">Pilih Metode Pembayaran</option>
          <option value="cash">Cash (COD)</option>
          <option value="transfer">Transfer Bank</option>
        </select>
      </div>

      <div style={{ marginTop: '20px', borderTop: '1F solid #555', paddingTop: '10px' }}>
        <h3>Ringkasan Pesanan</h3>
        {cartItems.map(item => (
          <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between' }}>
            <p>{item.name} (x{item.qty})</p>
            <p>Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
          </div>
        ))}
        <h4 style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <span>Total:</span>
          <span>Rp {total.toLocaleString('id-ID')}</span>
        </h4>
      </div>

      <button 
        type="submit" 
        disabled={isLoading}
        style={{ width: '100%', padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '20px' }}
      >
        {isLoading ? 'Memproses...' : 'Pesan Sekarang (via WhatsApp)'}
      </button>
    </form>
  );
}