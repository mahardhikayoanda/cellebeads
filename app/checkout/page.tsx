// File: app/checkout/page.tsx

'use client'; // <-- Ini sudah benar

// 1. IMPORT useState dan useEffect
import { useState, useEffect } from 'react'; 
import CheckoutForm from "./CheckoutForm";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CheckoutPage() {
  // 2. Tambahkan state untuk mengecek "apakah sudah di browser"
  const [isMounted, setIsMounted] = useState(false);

  // 3. Panggil useCart() (ini aman, tapi datanya mungkin belum siap)
  const { cartItems } = useCart(); 

  // 4. Gunakan useEffect untuk menandai bahwa kita sudah di browser
  // useEffect HANYA berjalan di sisi client (browser)
  useEffect(() => {
    setIsMounted(true);
  }, []); // Array kosong berarti ini hanya berjalan sekali saat mount

  // 5. JANGAN render apapun sampai kita yakin sudah di browser
  // Ini akan mencegah error saat "prerendering" di server
  if (!isMounted) {
    // Tampilkan loading spinner/teks selagi menunggu
    return <p style={{ textAlign: 'center', padding: '50px' }}>Memuat keranjang...</p>;
  }

  // 6. Setelah mounted, baru render halaman yang asli
  // Server tidak akan pernah menjalankan kode di bawah ini saat build
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