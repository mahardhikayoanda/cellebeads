// File: app/checkout/page.tsx
import dynamic from 'next/dynamic';

// Impor komponen page.tsx secara dinamis dan matikan Server-Side Rendering (SSR)
const CheckoutPageClient = dynamic(
  () => import('./CheckoutPageClient'), 
  { 
    ssr: false, // <-- INI ADALAH KUNCINYA

    // Tampilkan ini saat halaman sedang loading
    loading: () => <p style={{textAlign: 'center', padding: '50px'}}>Memuat Keranjang...</p>
  }
);

export default function CheckoutPage() {
  // Halaman server ini sekarang hanya me-render loader dinamis
  return <CheckoutPageClient />;
}