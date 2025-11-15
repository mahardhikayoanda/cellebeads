// File: app/admin/layout.tsx
'use client'; // <-- Ubah jadi Client Component

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; // <-- Import hook
import { motion } from 'framer-motion'; // <-- Import motion
import { cn } from '@/lib/utils'; // <-- Import 'cn' untuk class kondisional
import { Box, ShoppingBag, BarChart, Home } from 'lucide-react'; // <-- Tambahkan Ikon

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); // Hook untuk mendapatkan URL saat ini

  // Daftar link navigasi
  const navLinks = [
    { href: '/admin/products', label: 'Kelola Produk', icon: Box },
    { href: '/admin/orders', label: 'Kelola Pesanan', icon: ShoppingBag },
    { href: '/admin/sales-history', label: 'Riwayat Penjualan', icon: BarChart },
  ];

  return (
    <div className="flex min-h-screen"> 
      
      {/* Sidebar (Tema Terang) */}
      <aside className="w-64 bg-stone-100 text-stone-800 p-6 border-r border-stone-200 flex flex-col">
        <h2 className="text-2xl font-lora font-semibold text-primary mb-8">
          Admin Panel
        </h2>
        <nav className="grow">
          <ul className="space-y-2">
            {navLinks.map((link) => {
              // Cek apakah link ini aktif (pathname SAMA DENGAN href)
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={cn(
                      "flex items-center p-3 rounded-lg font-medium transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" // Warna Pink jika Aktif
                        : "text-stone-700 hover:bg-stone-200" // Warna biasa
                    )}
                  >
                    <link.icon size={18} className="mr-3" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        {/* Link kembali ke Toko */}
        <div className="mt-auto">
             <Link href="/" className="flex items-center text-sm text-stone-500 hover:text-primary transition-colors">
                <Home size={16} className="mr-2" />
                Kembali ke Toko
             </Link>
        </div>
      </aside>

      {/* Area Konten Utama (Dengan Animasi Fade-in) */}
      <motion.main 
        key={pathname} // <-- Kunci animasi agar berjalan saat pindah halaman
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex-1 p-8 bg-white text-foreground overflow-y-auto"
      >
        {children}
      </motion.main>
    </div>
  );
}