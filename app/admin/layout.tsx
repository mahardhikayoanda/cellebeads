// File: app/admin/layout.tsx
'use client'; 

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { motion } from 'framer-motion'; 
import { cn } from '@/lib/utils'; 
import { 
  LayoutDashboard, Box, ShoppingBag, BarChart, Star, ExternalLink, LogOut, Menu 
} from 'lucide-react'; 
import { signOut } from 'next-auth/react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"; // Import Sheet untuk Mobile
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Produk', icon: Box },
    { href: '/admin/orders', label: 'Pesanan', icon: ShoppingBag },
    { href: '/admin/sales-history', label: 'Laporan Penjualan', icon: BarChart },
    { href: '/admin/reviews', label: 'Ulasan', icon: Star },
  ];

  // --- KONTEN SIDEBAR (Dipisahkan agar bisa dipakai di Desktop & Mobile) ---
  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-md">
        <div className="p-8 border-b border-stone-100">
            <h2 className="text-3xl font-lora font-bold text-stone-800 tracking-tight">
              Celle<span className="text-primary">.</span>
            </h2>
            <p className="text-xs text-stone-400 mt-1 uppercase tracking-widest font-medium">Admin Panel</p>
        </div>
        
        <nav className="grow p-6 overflow-y-auto space-y-8 scrollbar-hide">
          <div>
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4 px-3">Menu Utama</p>
            <ul className="space-y-2">
              {navLinks.map((link) => {
                const isActive = link.exact 
                  ? pathname === link.href
                  : pathname.startsWith(link.href);

                return (
                  <li key={link.href}>
                    <Link 
                      href={link.href} 
                      className={cn(
                        "flex items-center p-3 rounded-xl text-sm font-medium transition-all duration-300 group relative overflow-hidden",
                        isActive 
                          ? "text-primary bg-primary/5" 
                          : "text-stone-500 hover:text-stone-800 hover:bg-stone-50" 
                      )}
                    >
                      {isActive && (
                        <motion.div 
                          layoutId="activeNav"
                          className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-primary"
                        />
                      )}
                      <link.icon size={18} className={cn("mr-3 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-stone-400")} />
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </nav>

        <div className="p-6 border-t border-stone-100 bg-stone-50/50 space-y-3">
             <Link 
                href="/" 
                target="_blank" 
                className="flex items-center justify-center w-full p-2.5 rounded-lg bg-white border border-stone-200 text-xs font-bold text-stone-600 hover:border-primary/30 hover:text-primary transition-all shadow-sm"
             >
                <ExternalLink size={14} className="mr-2" />
                Lihat Toko
             </Link>

             <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="flex items-center justify-center w-full p-2.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
             >
                <LogOut size={14} className="mr-2" />
                Keluar
             </button>
        </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FDFBF7]"> 
      
      {/* 1. SIDEBAR DESKTOP (Hidden di Mobile) */}
      <aside className="hidden md:flex w-64 border-r border-stone-200 flex-col shadow-[4px_0_24px_rgba(0,0,0,0.02)] fixed h-full z-20">
         <SidebarContent />
      </aside>

      {/* 2. HEADER MOBILE (Visible di Mobile) */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white/90 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-sm">
         <span className="font-lora font-bold text-xl text-stone-800">Celle.</span>
         
         {/* Tombol Hamburger Menu */}
         <Sheet>
           <SheetTrigger asChild>
             <Button variant="ghost" size="icon" className="-mr-2">
                <Menu className="h-6 w-6 text-stone-700" />
             </Button>
           </SheetTrigger>
           <SheetContent side="left" className="p-0 w-72 bg-white border-r-stone-100">
             <SidebarContent />
           </SheetContent>
         </Sheet>
      </div>

      {/* 3. AREA KONTEN UTAMA */}
      <motion.main 
        key={pathname} 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        // Responsive Margin & Padding:
        // Mobile: ml-0 (full width) & pt-20 (biar ga ketutup header)
        // Desktop: ml-64 (geser kanan sidebar) & pt-8
        className="flex-1 p-4 md:p-8 pt-20 md:pt-8 ml-0 md:ml-64 overflow-y-auto min-h-screen"
      >
        <div className="max-w-6xl mx-auto">
           {children}
        </div>
      </motion.main>
    </div>
  );
}