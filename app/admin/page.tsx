// File: app/admin/page.tsx (BUAT FILE BARU INI)
import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Langsung arahkan ke halaman "Kelola Produk"
  // Ini akan menjadi halaman default saat admin login
  redirect('/admin/products');
}