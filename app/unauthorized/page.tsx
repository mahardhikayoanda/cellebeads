// File: app/unauthorized/page.tsx
import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div style={{ textAlign: 'center', padding: '50px' }}>
      <h1>Akses Ditolak</h1>
      <p>Anda tidak memiliki izin untuk mengakses halaman ini.</p>
      <Link href="/" style={{ color: 'lightblue' }}>
        Kembali ke Halaman Utama
      </Link>
    </div>
  );
}