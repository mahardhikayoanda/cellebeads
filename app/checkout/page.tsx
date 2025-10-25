// File: app/checkout/page.tsx

'use client'; // <-- INI ADALAH KUNCI UTAMA

// Langsung import semua yang kita butuh di sini
import CheckoutForm from "./CheckoutForm";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CheckoutPage() {
  // Karena file ini sekarang 'use client', 
  // memanggil useCart() di sini 100% aman dan tidak akan error di server.
  const { cartItems } = useCart();

  return (
    <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #555', borderRadius: '8px' }}>
      {cartItems.length === 0 ? (
        <div style={{ textAlign: 'center' }}>
          <h2>Keranjang Anda Kosong</h2>
          <p>Silakan kembali ke katalog untuk berbelanja.</p>
          <Link href="/products" style={{ color: 'lightblue' }}>
            Kembali ke Katalog
          </Link>
        </div>
      ) : (
        <CheckoutForm />
      )}
    </div>
  );
}