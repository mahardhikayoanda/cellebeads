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
    if (cartItems.length === 0) { alert('Keranjang Anda kosong'); return; }
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createOrder(formData, cartItems);
    setIsLoading(false);
    if (result.success && result.waUrl) {
      alert(result.message); clearCart(); 
      window.open(result.waUrl, '_blank'); router.push('/products');
    } else { alert(`Error: ${result.message}`); }
  };

  // Style
  const inputClassName = "w-full bg-white border-stone-300 text-stone-800 rounded-md p-2 shadow-sm focus:ring-rose-500 focus:border-rose-500";

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-lora font-medium text-stone-800 mb-6">Form Pemesanan</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-stone-600 mb-1">Nama Lengkap</label>
        <input name="name" placeholder="Nama Anda" required className={inputClassName} />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-stone-600 mb-1">Alamat Lengkap</label>
        <textarea name="address" placeholder="Jalan, Nomor Rumah, Kota, Kode Pos" required className={`${inputClassName} min-h-[80px]`} />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-stone-600 mb-1">No. HP (WhatsApp)</label>
        <input name="phone" type="tel" placeholder="0812..." required className={inputClassName} />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-stone-600 mb-1">Metode Pembayaran</label>
        <select name="paymentMethod" required className={inputClassName}>
          <option value="">Pilih Metode Pembayaran</option>
          <option value="cash">Cash (COD)</option>
          <option value="transfer">Transfer Bank</option>
        </select>
      </div>

      {/* Ringkasan Pesanan */}
      <div className="mt-8 pt-4 border-t border-stone-300">
        <h3 className="text-xl font-lora font-medium text-stone-800 mb-4">Ringkasan Pesanan</h3>
        {cartItems.map(item => (
          <div key={item._id} className="flex justify-between items-center text-sm mb-2 text-stone-600">
            <span>{item.name} (x{item.qty})</span>
            <span>Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
          </div>
        ))}
        <div className="flex justify-between items-center text-lg font-bold mt-4 pt-2 border-t border-stone-300">
          <span>Total:</span>
          <span>Rp {total.toLocaleString('id-ID')}</span>
        </div>
      </div>

      {/* Tombol Pesan (Hijau) */}
      <button 
        type="submit" 
        disabled={isLoading}
        className="w-full mt-8 py-3 px-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-md shadow-md transition-colors disabled:opacity-50 text-lg"
      >
        {isLoading ? 'Memproses...' : 'Pesan Sekarang (via WhatsApp)'}
      </button>
    </form>
  );
}