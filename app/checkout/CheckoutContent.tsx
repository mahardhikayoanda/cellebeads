// File: app/checkout/CheckoutContent.tsx
'use client'; // Ini adalah komponen Client

import CheckoutForm from "./CheckoutForm";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CheckoutContent() {
  // Panggil useCart() di sini, ini 100% aman
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