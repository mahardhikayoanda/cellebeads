// File: app/checkout/page.tsx
'use client'; // Halaman "penjaga" ini juga harus 'use client'

import { useState, useEffect } from 'react';
import CheckoutContent from './CheckoutContent'; // Import komponen "Isi"

export default function CheckoutPage() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Saat server me-render, 'isMounted' akan 'false'
  // Server akan me-render <p>Loading...</p> dan build akan BERHASIL.
  if (!isMounted) {
    return <p style={{ textAlign: 'center', padding: '50px' }}>Memuat keranjang...</p>;
  }

  // Saat di browser, 'isMounted' jadi 'true',
  // dan kita me-render komponen <CheckoutContent />
  return <CheckoutContent />;
}