// File: app/admin/layout.tsx
'use client'; 

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { motion } from 'framer-motion'; 
import { cn } from '@/lib/utils'; 
import { 
  LayoutDashboard, // Ikon Dashboard
  Box, 
  ShoppingBag, 
  BarChart, 
  Star, 
  ExternalLink, // Ikon Lihat Toko
  LogOut 
} from 'lucide-react'; 
import { signOut } from 'next-auth/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 

  const navLinks = [
    // 1. Link Dashboard Baru (Paling Atas)
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Kelola Produk', icon: Box },
    { href: '/admin/orders', label: 'Kelola Pesanan', icon: ShoppingBag },
    { href: '/admin/sales-history', label: 'Riwayat Penjualan', icon: BarChart },
    { href: '/admin/reviews', label: 'Kelola Ulasan', icon: Star },
  ];

  return (
    <div className="flex min-h-screen bg-stone-50"> 
      
      <aside className="w-64 bg-white text-stone-800 border-r border-stone-200 flex flex-col shadow-sm fixed h-full z-10">
        <div className="p-6 border-b border-stone-100">
            <h2 className="text-2xl font-lora font-bold text-primary">
            Admin Panel
            </h2>
            <p className="text-xs text-stone-500 mt-1">Cellebeads Management</p>
        </div>
        
        <nav className="grow p-4 overflow-y-auto">
          <ul className="space-y-1">
            {navLinks.map((link) => {
              // Logika active state yang lebih presisi
              const isActive = link.exact 
                ? pathname === link.href
                : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link 
                    href={link.href} 
                    className={cn(
                      "flex items-center p-3 rounded-md font-medium transition-all duration-200",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-stone-600 hover:bg-stone-100 hover:text-stone-900" 
                    )}
                  >
                    <link.icon size={20} className="mr-3" />
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Sidebar */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-2">
             {/* 2. Tombol Lihat Toko */}
             <Link 
                href="/" 
                target="_blank" // Buka di tab baru agar admin tidak tertutup
                className="flex items-center justify-center w-full p-2 rounded-md border border-stone-300 bg-white text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
             >
                <ExternalLink size={16} className="mr-2" />
                Lihat Tampilan Toko
             </Link>

             <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center justify-center w-full p-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
             >
                <LogOut size={16} className="mr-2" />
                Logout
             </button>
        </div>
      </aside>

      {/* Area Konten Utama */}
      <motion.main 
        key={pathname} 
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-1 p-8 ml-64 overflow-y-auto min-h-screen"
      >
        {children}
      </motion.main>
    </div>
  );
}