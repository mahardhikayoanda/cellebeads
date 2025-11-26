// File: app/admin/layout.tsx
'use client'; 

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { motion } from 'framer-motion'; 
import { cn } from '@/lib/utils'; 
import { 
  LayoutDashboard, Box, ShoppingBag, BarChart, Star, 
  LogOut, Menu, Store, ArrowUpRight // Ikon baru
} from 'lucide-react'; 
import { signOut } from 'next-auth/react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 

  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Produk', icon: Box },
    { href: '/admin/orders', label: 'Pesanan', icon: ShoppingBag },
    { href: '/admin/sales-history', label: 'Laporan', icon: BarChart },
    { href: '/admin/reviews', label: 'Ulasan', icon: Star },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-stone-100">
        <div className="p-8 pb-6">
            <h2 className="text-2xl font-lora font-bold text-stone-800 tracking-tight">
              Celle<span className="text-rose-500">.</span> Admin
            </h2>
        </div>
        
        <nav className="grow px-4 space-y-1 overflow-y-auto scrollbar-hide">
          <p className="px-4 text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3 mt-2">Menu</p>
          {navLinks.map((link) => {
            const isActive = link.exact 
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link 
                key={link.href} 
                href={link.href} 
                className={cn(
                  "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                  isActive 
                    ? "bg-stone-900 text-white shadow-md shadow-stone-900/10" 
                    : "text-stone-500 hover:bg-stone-50 hover:text-stone-900" 
                )}
              >
                <link.icon size={18} className={cn("mr-3 transition-colors", isActive ? "text-rose-400" : "text-stone-400 group-hover:text-stone-600")} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-stone-100 space-y-2">
             {/* TOMBOL KHUSUS KE HOME PAGE */}
             <Button asChild variant="outline" className="w-full justify-start h-10 border-stone-200 text-stone-600 hover:text-rose-600 hover:bg-rose-50">
                <Link href="/" target="_blank">
                   <Store size={16} className="mr-2" />
                   Lihat Web Utama
                   <ArrowUpRight size={12} className="ml-auto opacity-50" />
                </Link>
             </Button>

             <Button 
                variant="ghost" 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full justify-start h-10 text-red-500 hover:text-red-600 hover:bg-red-50"
             >
                <LogOut size={16} className="mr-2" />
                Keluar
             </Button>
        </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]"> 
      
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 flex-col fixed h-full z-30 shadow-sm">
         <SidebarContent />
      </aside>

      {/* Header Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-stone-200 px-4 py-3 flex items-center justify-between shadow-sm">
         <span className="font-lora font-bold text-lg text-stone-800">Admin Panel</span>
         <Sheet>
           <SheetTrigger asChild>
             <Button variant="ghost" size="icon" className="-mr-2 text-stone-600">
                <Menu className="h-6 w-6" />
             </Button>
           </SheetTrigger>
           <SheetContent side="left" className="p-0 w-72">
             <SidebarContent />
           </SheetContent>
         </Sheet>
      </div>

      {/* Main Content Area */}
      <motion.main 
        key={pathname} 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="flex-1 p-6 md:p-10 pt-24 md:pt-10 md:ml-72 overflow-y-auto min-h-screen"
      >
        <div className="max-w-7xl mx-auto">
           {children}
        </div>
      </motion.main>
    </div>
  );
}