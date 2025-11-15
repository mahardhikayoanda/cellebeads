// File: app/admin/page.tsx
import { redirect } from 'next/navigation';

export default function AdminPage() {
  // Langsung arahkan ke halaman "Kelola Produk"
  // Ini adalah halaman default saat admin login
  redirect('/admin/products');
}