// File: app/admin/layout.tsx
'use client'; 

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation'; 
import { motion, AnimatePresence } from 'framer-motion'; 
import { cn } from '@/lib/utils'; 
import { 
  LayoutDashboard, ShoppingBag, BarChart, Star, 
  LogOut, Menu, Store, Sparkles, ClipboardList, Gem, Heart, ArrowUpRight
} from 'lucide-react'; 
import { signOut, useSession } from 'next-auth/react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { getAdminStats } from './dashboard/actions';

// Komponen Background Bergerak
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fff0f5]">
    <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
  </div>
);

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname(); 
  const { data: session } = useSession();
  const [counts, setCounts] = useState({ orders: 0, reviews: 0 });

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const stats = await getAdminStats();
        setCounts({
          orders: stats.pendingOrdersCount,
          reviews: stats.pendingReviewsCount
        });
      } catch (error) { console.error("Error notif:", error); }
    };
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '/admin/profile', label: 'Profil Saya', icon: Heart },
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
    { href: '/admin/products', label: 'Koleksi', icon: Gem }, 
    { href: '/admin/stock', label: 'Stok', icon: ClipboardList }, 
    { href: '/admin/orders', label: 'Pesanan', icon: ShoppingBag, count: counts.orders },
    { href: '/admin/sales-history', label: 'Keuangan', icon: BarChart },
    { href: '/admin/reviews', label: 'Ulasan', icon: Star, count: counts.reviews },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white/40 backdrop-blur-2xl border-r border-white/60 relative">
        {/* Logo Area */}
        <div className="p-8 pb-4 flex flex-col items-center text-center flex-shrink-0">
            <div className="w-16 h-16 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-500/30 mb-3 animate-in zoom-in duration-500">
               <Sparkles size={32} />
            </div>
            <h2 className="text-2xl font-lora font-bold text-stone-800 tracking-tight">
              Celle<span className="text-pink-600">Beads</span>
            </h2>
            <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold mt-1">Admin Panel</p>
        </div>
        
        {/* Navigation (Termasuk Menu Tambahan) */}
        <nav className="grow px-4 space-y-2 overflow-y-auto scrollbar-hide py-4">
          
          {/* Menu Utama */}
          {navLinks.map((link) => {
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <div className={cn(
                  "relative flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-500 group overflow-hidden",
                  isActive 
                    ? "text-white shadow-lg shadow-pink-500/25" 
                    : "text-stone-600 hover:bg-white/60 hover:text-pink-600"
                )}>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabBg"
                      className="absolute inset-0 bg-gradient-to-r from-pink-600 to-rose-500"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  <span className="relative z-10 flex items-center gap-3">
                    <link.icon size={20} className={cn("transition-transform group-hover:scale-110 duration-300", isActive ? "text-white" : "text-stone-400 group-hover:text-pink-500")} />
                    <span className={isActive ? "font-bold" : ""}>{link.label}</span>
                  </span>

                  {link.count !== undefined && link.count > 0 && (
                    <span className={cn(
                      "relative z-10 flex items-center justify-center min-w-[22px] h-[22px] px-1.5 text-[10px] font-bold rounded-full shadow-sm transition-all animate-pulse",
                      isActive ? "bg-white text-pink-600" : "bg-rose-500 text-white"
                    )}>
                      {link.count}
                    </span>
                  )}
                </div>
              </Link>
            );
          })}

          {/* Separator Halus */}
          <div className="my-2 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-60" />

          {/* --- Menu Tambahan (Disatukan dalam scroll) --- */}
          
          {/* Lihat Toko */}
          <Link href="/?view=preview" target="_blank">
            <div className={cn(
              "relative flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-500 group overflow-hidden",
              "text-stone-600 hover:bg-white/60 hover:text-teal-600"
            )}>
               <span className="relative z-10 flex items-center gap-3">
                 <Store size={20} className="text-stone-400 group-hover:text-teal-500 transition-transform group-hover:scale-110 duration-300" />
                 <span>Lihat Toko</span>
               </span>
               <ArrowUpRight size={16} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-teal-500" />
            </div>
          </Link>

          {/* Keluar */}
          <button 
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full text-left"
          >
            <div className={cn(
              "relative flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-500 group overflow-hidden",
              "text-stone-600 hover:bg-white/60 hover:text-rose-600"
            )}>
               <span className="relative z-10 flex items-center gap-3">
                 <LogOut size={20} className="text-stone-400 group-hover:text-rose-500 transition-transform group-hover:scale-110 duration-300" />
                 <span>Keluar</span>
               </span>
            </div>
          </button>

        </nav>
    </div>
  );

  return (
    <div className="flex min-h-screen text-stone-800 selection:bg-pink-200 selection:text-pink-900 font-sans"> 
      <AnimatedBackground />

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-80 flex-col fixed h-full z-30">
         <SidebarContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-white/70 backdrop-blur-md border-b border-pink-100 px-6 py-4 flex items-center justify-between shadow-sm">
         <span className="font-lora font-bold text-xl text-pink-600">CelleBeads.</span>
         <Sheet>
           <SheetTrigger asChild>
             <Button variant="ghost" size="icon" className="-mr-2 text-stone-600 hover:bg-pink-50 rounded-full">
                <Menu className="h-6 w-6" />
             </Button>
           </SheetTrigger>
           <SheetContent side="left" className="p-0 w-80 border-none bg-transparent shadow-2xl">
             <SidebarContent />
           </SheetContent>
         </Sheet>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-12 pt-28 md:pt-12 md:ml-80 relative z-10 overflow-x-hidden">
        <div className="max-w-7xl mx-auto space-y-8">
           
           {/* Greeting Header */}
           <div className="flex justify-between items-center animate-fade-up">
              <div>
                 <h1 className="text-3xl md:text-4xl font-lora font-bold text-stone-800">
                   Hi, {session?.user?.name?.split(' ')[0] || 'Admin'}! 🌸
                 </h1>
                 <p className="text-stone-500">Semoga harimu menyenangkan & penuh orderan!</p>
              </div>
           </div>

           <AnimatePresence mode="wait">
             <motion.div
               key={pathname}
               initial={{ opacity: 0, y: 30, scale: 0.98 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.4, ease: "easeOut" }}
             >
               {children}
             </motion.div>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}