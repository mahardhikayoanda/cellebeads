// File: app/admin/layout.tsx
'use client'; 

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { motion } from 'framer-motion'; 
import { cn } from '@/lib/utils'; 
import { Box, ShoppingBag, BarChart, Home, Star } from 'lucide-react'; // <-- 1. IMPORT IKON 'Star'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 

  const navLinks = [
    { href: '/admin/products', label: 'Kelola Produk', icon: Box },
    { href: '/admin/orders', label: 'Kelola Pesanan', icon: ShoppingBag },
    { href: '/admin/sales-history', label: 'Riwayat Penjualan', icon: BarChart },
    // 2. TAMBAHKAN LINK BARU DI SINI
    { href: '/admin/reviews', label: 'Kelola Ulasan', icon: Star },
  ];

  return (
    <div className="flex min-h-screen"> 
      
      <aside className="w-64 bg-stone-100 text-stone-800 p-6 border-r border-stone-200 flex flex-col">
        <h2 className="text-2xl font-lora font-semibold text-primary mb-8">
          Admin Panel
        </h2>
        <nav className="grow">
          <ul className="space-y-2">
            {navLinks.map((link) => {
              // 3. UBAH LOGIKA 'isActive' agar lebih fleksibel
              // Sekarang /admin/products/edit akan tetap menyorot /admin/products
              const isActive = pathname.startsWith(link.href);
              return (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={cn(
                      "flex items-center p-3 rounded-lg font-medium transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground" 
                        : "text-stone-700 hover:bg-stone-200" 
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
        <div className="mt-auto">
             <Link href="/" className="flex items-center text-sm text-stone-500 hover:text-primary transition-colors">
                <Home size={16} className="mr-2" />
                Kembali ke Toko
             </Link>
        </div>
      </aside>

      <motion.main 
        key={pathname} 
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