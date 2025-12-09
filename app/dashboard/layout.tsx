// File: app/dashboard/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Package, User, LayoutDashboard, LogOut, Home, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

// Background Animasi (Sama seperti Admin)
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fff0f5]">
    <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
  </div>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  // --- PEMBARUAN DI SINI (Menghapus 'Profil Saya') ---
  // Sesuai gambar 2 yang Anda lingkari
  const navLinks = [
    { href: '/dashboard', label: 'Ringkasan', icon: LayoutDashboard, exact: true },
    { href: '/dashboard/my-orders', label: 'Pesanan Saya', icon: Package },
    // Item 'Profil Saya' dihapus dari sini
  ];
  // -------------------------------------------------

  return (
    <div className="flex min-h-screen text-stone-800 font-sans">
      <AnimatedBackground />

      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-72 flex-col fixed h-full z-30 bg-white/40 backdrop-blur-xl border-r border-white/60">
        
        {/* Header Sidebar */}
        <div className="p-8 flex flex-col items-center text-center">
            <div className="w-14 h-14 bg-gradient-to-tr from-pink-400 to-rose-400 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200 mb-3">
               <span className="font-lora font-bold text-2xl">{session?.user?.name?.charAt(0) || 'C'}</span>
            </div>
            <h2 className="text-xl font-lora font-bold text-stone-800">
              {session?.user?.name?.split(' ')[0] || 'Pelanggan'}
            </h2>
            <p className="text-xs text-stone-500 uppercase tracking-widest mt-1">Member Setia</p>
        </div>

        {/* Menu Navigasi */}
        <nav className="flex-1 px-4 space-y-2 py-4">
          {navLinks.map((link) => {
            const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
            return (
              <Link key={link.href} href={link.href}>
                <div className={cn(
                  "relative flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 group overflow-hidden",
                  isActive 
                    ? "text-white shadow-md shadow-pink-500/20" 
                    : "text-stone-600 hover:bg-white/60 hover:text-pink-600"
                )}>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTabCust"
                      className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-400"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <link.icon size={18} className={cn("relative z-10", isActive ? "text-white" : "text-stone-400 group-hover:text-pink-500")} />
                  <span className="relative z-10">{link.label}</span>
                </div>
              </Link>
            );
          })}

          <div className="my-4 h-px bg-gradient-to-r from-transparent via-pink-200 to-transparent opacity-50" />

          <Link href="/">
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-white/60 hover:text-teal-600 transition-all cursor-pointer">
               <Home size={18} className="text-stone-400 group-hover:text-teal-500" />
               <span>Ke Beranda Toko</span>
            </div>
          </Link>

          <button onClick={() => signOut({ callbackUrl: '/' })} className="w-full text-left">
            <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-white/60 hover:text-rose-600 transition-all cursor-pointer">
               <LogOut size={18} className="text-stone-400 group-hover:text-rose-500" />
               <span>Keluar</span>
            </div>
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 pt-24 md:pt-10 md:ml-72 relative z-10">
        <div className="max-w-5xl mx-auto">
           {/* Greeting Mobile */}
           <div className="md:hidden mb-6 flex items-center gap-3">
              <div className="p-2 bg-pink-100 rounded-lg text-pink-600"><Sparkles size={20}/></div>
              <h1 className="text-2xl font-lora font-bold text-stone-800">Dashboard</h1>
           </div>

           <AnimatePresence mode="wait">
             <motion.div
               key={pathname}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               transition={{ duration: 0.4 }}
             >
               {children}
             </motion.div>
           </AnimatePresence>
        </div>
      </main>
    </div>
  );
}