'use client';

import { useCart } from '@/context/CartContext';
import { createOrder } from './actions';
import { useRouter } from 'next/navigation';

export default function CheckoutForm() {
  const { cartItems, total, clearCart } = useCart();
  const router = useRouter();

  const handleSubmit = async (formData) => {
    if (cartItems.length === 0) {
      alert('Keranjang Anda kosong');
      return;
    }

    const result = await createOrder(formData, cartItems);

    if (result.success) {
      // Hapus keranjang setelah berhasil
      clearCart();
      
      // Arahkan ke WhatsApp
      router.push(result.waUrl);
      
      // Anda mungkin ingin mengarahkan user ke halaman "pesanan sukses"
      // router.push('/order-success');
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  return (
    <form action={handleSubmit}>
      <h2>Form Pemesanan</h2>
      <input name="name" placeholder="Nama Lengkap" required />
      <textarea name="address" placeholder="Alamat Lengkap" required />
      <input name="phone" type="tel" placeholder="No. HP (cth: 0812...)" required />
      <select name="paymentMethod" required>
        <option value="">Pilih Metode Pembayaran</option>
        <option value="cash">Cash (COD)</option>
        <option value="transfer">Transfer Bank</option>
      </select>

      <div>
        <h3>Ringkasan Pesanan</h3>
        {cartItems.map(item => (
          <div key={item._id}>
            <p>{item.name} (x{item.qty}) - Rp {(item.price * item.qty).toLocaleString('id-ID')}</p>
          </div>
        ))}
        <h4>Total: Rp {total.toLocaleString('id-ID')}</h4>
      </div>

      <button type="submit">Pesan Sekarang (via WhatsApp)</button>
    </form>
  );
}