// File: app/admin/layout.tsx
import React from 'react';
import Link from 'next/link';
// Anda mungkin ingin menambahkan ikon nanti
// import { Box, ShoppingBag, BarChart } from 'react-feather'; 

export default function AdminLayout({
  children, // children di sini adalah page.tsx di dalam folder /admin/*
}: {
  children: React.ReactNode;
}) {
  return (
    // Kita buat container flex utama
    <div className="flex min-h-screen"> 
      {/* Sidebar Navigasi Admin */}
      <aside className="w-64 bg-gray-800 text-gray-300 p-6 border-r border-gray-700 flex flex-col">
        <h2 className="text-xl font-semibold text-white mb-8">Admin Dashboard</h2>
        <nav className="grow">
          <ul>
            <li className="mb-4">
              <Link href="/admin/products" className="flex items-center p-2 rounded hover:bg-gray-700 hover:text-white transition-colors">
                {/* <Box size={18} className="mr-3" /> */}
                Kelola Produk
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/orders" className="flex items-center p-2 rounded hover:bg-gray-700 hover:text-white transition-colors">
                {/* <ShoppingBag size={18} className="mr-3" /> */}
                Kelola Pesanan
              </Link>
            </li>
            <li className="mb-4">
              <Link href="/admin/sales-history" className="flex items-center p-2 rounded hover:bg-gray-700 hover:text-white transition-colors">
                {/* <BarChart size={18} className="mr-3" /> */}
                Riwayat Penjualan
              </Link>
            </li>
            {/* Tambahkan link admin lainnya jika perlu */}
          </ul>
        </nav>
        {/* Link kembali ke Halaman Utama (Pelanggan) */}
        <div className="mt-auto">
             <Link href="/" className="text-sm text-gray-500 hover:text-gray-300">
                &larr; Kembali ke Toko
             </Link>
        </div>
      </aside>

      {/* Area Konten Utama */}
      {/* Kita beri background gelap juga untuk area konten */}
      <main className="flex-1 p-8 bg-gray-900 text-gray-200 overflow-y-auto">
        {children} {/* Ini adalah tempat page.tsx admin akan dirender */}
      </main>
    </div>
  );
}