'use client'; 

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { cn } from '@/lib/utils'; 
import { 
  LayoutDashboard, Box, ShoppingBag, BarChart, Star, 
  LogOut, Menu, Store, Sparkles, ClipboardList 
} from 'lucide-react'; 
import { signOut } from 'next-auth/react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 

  // Menu Navigasi Terbaru (Produk & Stok Terpisah)
  const navLinks = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Data Produk', icon: Box }, // Halaman Edit Info Produk
    { href: '/admin/stock', label: 'Stok Gudang', icon: ClipboardList }, // Halaman Khusus Stok
    { href: '/admin/orders', label: 'Pesanan Masuk', icon: ShoppingBag },
    { href: '/admin/sales-history', label: 'Laporan', icon: BarChart },
    { href: '/admin/reviews', label: 'Ulasan', icon: Star },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-md border-r border-pink-100/50 relative overflow-hidden">
        {/* Dekorasi Background Sidebar */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-100/50 to-transparent pointer-events-none" />
        
        <div className="p-8 pb-6 z-10">
            <div className="flex items-center gap-2 text-primary mb-1">
               <Sparkles size={18} className="animate-pulse" />
               <span className="text-xs font-bold tracking-widest uppercase">Admin Panel</span>
            </div>
            <h2 className="text-2xl font-lora font-bold text-stone-800 tracking-tight">
              Celle<span className="text-primary">Beads.</span>
            </h2>
        </div>
        
        <nav className="grow px-4 space-y-2 overflow-y-auto scrollbar-thin z-10 py-4">
          {navLinks.map((link) => {
            const isActive = link.exact 
              ? pathname === link.href
              : pathname.startsWith(link.href);

            return (
              <Link key={link.href} href={link.href}>
                <div className={cn(
                  "relative flex items-center px-4 py-3.5 rounded-2xl text-sm font-medium transition-all duration-300 group overflow-hidden",
                  isActive ? "text-white shadow-lg shadow-pink-500/20" : "text-stone-500 hover:bg-pink-50 hover:text-primary"
                )}>
                  {/* Background Aktif dengan Animasi */}
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-stone-800 to-stone-900"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <span className="relative z-10 flex items-center">
                    <link.icon size={20} className={cn("mr-3 transition-transform group-hover:scale-110", isActive ? "text-pink-300" : "text-stone-400 group-hover:text-primary")} />
                    {link.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 m-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-2 z-10">
             <Button asChild variant="outline" className="w-full justify-start h-10 bg-white border-stone-200 text-stone-600 hover:text-primary hover:border-primary/30 shadow-sm">
                <Link href="/" target="_blank">
                   <Store size={16} className="mr-2" />
                   Lihat Website
                </Link>
             </Button>

             <Button 
                variant="ghost" 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="w-full justify-start h-10 text-rose-500 hover:text-rose-600 hover:bg-rose-50"
             >
                <LogOut size={16} className="mr-2" />
                Keluar
             </Button>
        </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#FAFAFA] selection:bg-pink-100 selection:text-pink-900"> 
      {/* Background Gradient Mesh Halus */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
         <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-pink-200 blur-[100px]" />
         <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-purple-100 blur-[100px]" />
      </div>

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 flex-col fixed h-full z-30 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
         <SidebarContent />
      </aside>

      {/* Header Mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-pink-100 px-4 py-3 flex items-center justify-between shadow-sm">
         <span className="font-lora font-bold text-lg text-primary">Cellebeads Admin</span>
         <Sheet>
           <SheetTrigger asChild>
             <Button variant="ghost" size="icon" className="-mr-2 text-stone-600">
                <Menu className="h-6 w-6" />
             </Button>
           </SheetTrigger>
           <SheetContent side="left" className="p-0 w-72 border-none">
             <SidebarContent />
           </SheetContent>
         </Sheet>
      </div>

      {/* Main Content Area with Page Transition */}
      <main className="flex-1 p-6 md:p-10 pt-24 md:pt-10 md:ml-72 relative z-10 overflow-x-hidden">
        <div className="max-w-7xl mx-auto">
           <AnimatePresence mode="wait">
             <motion.div
               key={pathname}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.3 }}
             >
               {children}
             </motion.div>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}