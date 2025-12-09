// File: components/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Menu, Package, Search, Heart, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Navbar() {
  // 1. Ambil status sesi (status)
  const { data: session, status } = useSession();
  const { getTotalItems } = useCart();
  const pathname = usePathname();
  
  const [isVisible, setIsVisible] = useState(true); 
  const [scrolled, setScrolled] = useState(false); 
  
  const { scrollY } = useScroll();
  const totalItems = getTotalItems ? getTotalItems() : 0;

  useMotionValueEvent(scrollY, "change", (current) => {
    const previous = scrollY.getPrevious() || 0;
    const diff = current - previous;

    setScrolled(current > 20);

    if (current < 20) {
      setIsVisible(true);
    } else if (diff > 0 && current > 100) {
      setIsVisible(false);
    } else if (diff < 0) {
      setIsVisible(true);
    }
  });

  // --- LOGIKA SEMBUNYIKAN NAVBAR ---
  // 1. Sembunyikan di halaman admin (sudah ada)
  if (pathname?.startsWith('/admin')) return null;

  // 2. [BARU] Sembunyikan di Halaman Utama (Landing) jika belum login
  // Sesuai permintaan gambar (lingkaran merah)
  if (pathname === '/' && status === 'unauthenticated') {
    return null;
  }
  // ---------------------------------

  const userName = session?.user?.name || "Tamu";
  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  const links = [
    { name: 'Beranda', href: '/' },
    { name: 'Koleksi', href: '/products' },
    { name: 'Tentang', href: '/about' },
  ];

  return (
    <motion.nav
      initial={{ y: 0 }}
      animate={{ y: isVisible ? 0 : "-100%" }} 
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 px-4 md:px-8 transition-all duration-300",
        scrolled 
          ? "bg-white/80 backdrop-blur-xl shadow-lg shadow-pink-100/50 py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* --- 1. LOGO & BRAND (KIRI) --- */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
            <Image src="/logo_celle.jpg" alt="Cellebeads Logo" fill className="object-cover" />
          </div>
          <div className="flex flex-col">
            <span className={cn(
              "font-lora font-bold text-xl md:text-2xl leading-none tracking-tight transition-colors",
              scrolled ? "text-stone-800" : "text-stone-900"
            )}>
              Cellebeads<span className="text-pink-500"></span>
            </span>
            <span className="text-[10px] md:text-xs font-medium text-stone-500 tracking-widest uppercase">
              Handmade Jewelry
            </span>
          </div>
        </Link>

        {/* --- 2. MENU CAPSULE (TENGAH - DESKTOP) --- */}
        <div className="hidden md:flex items-center bg-white/50 backdrop-blur-md border border-white/60 rounded-full px-2 py-1.5 shadow-sm">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.name} href={link.href} className="relative px-5 py-2 rounded-full text-sm font-medium transition-colors">
                {isActive && (
                  <motion.div
                    layoutId="navbar-pill"
                    className="absolute inset-0 bg-stone-900 rounded-full"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={cn("relative z-10 transition-colors", isActive ? "text-white" : "text-stone-600 hover:text-pink-600")}>
                  {link.name}
                </span>
              </Link>
            );
          })}
        </div>

        {/* --- 3. ACTIONS (KANAN) --- */}
        <div className="flex items-center gap-2 md:gap-3">
          
          {/* A. Tombol Cart */}
          {(!session || (session.user as any).role !== 'admin') && (
            <Link href="/cart">
              <div className="relative group/cart">
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50 hover:text-pink-600 text-stone-600 transition-all">
                  <ShoppingCart className="w-5 h-5" />
                </Button>
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.span
                      initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute top-0 right-0 -mt-1 -mr-1 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
          )}

          {/* B. Tombol 'Pesanan Saya' (NEW: Terletak di sini, khusus customer) */}
          {session && (session.user as any).role === 'customer' && (
             <Link href="/dashboard/my-orders">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "rounded-full hover:bg-pink-50 hover:text-pink-600 transition-all",
                    pathname.startsWith('/dashboard/my-orders') ? "text-pink-600 bg-pink-50" : "text-stone-600"
                  )}
                  title="Pesanan Saya"
                >
                  <Package className="w-5 h-5" />
                </Button>
             </Link>
          )}

          {/* C. Profile Dropdown */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full pl-2 pr-4 py-1 h-auto border border-transparent hover:border-pink-100 hover:bg-pink-50/50 gap-2 transition-all ml-1">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 p-[2px] shadow-sm">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                          <span className="font-lora font-bold text-stone-700 text-xs">{getInitials(userName)}</span>
                      </div>
                   </div>
                   <span className="hidden md:inline text-sm font-medium text-stone-700 max-w-[80px] truncate">
                     {userName.split(' ')[0]}
                   </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-white/60 bg-white/95 backdrop-blur-xl shadow-xl">
                <DropdownMenuLabel className="font-normal px-3 py-2">
                  <p className="font-bold text-stone-800">{userName}</p>
                  <p className="text-xs text-stone-500 truncate">{session.user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-pink-100/50" />
                
                {/* MENU CUSTOMER - Pesanan Saya & Profil Saya dihapus dari sini */}
                {/* Karena sudah ada di Navbar (ikon Package) & User Icon (klik avatar itu sendiri) */}
                {(session.user as any).role === 'customer' && (
                   <>
                      {/* Opsional: Tambahkan kembali link Profil jika ingin eksplisit */}
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-pink-50 focus:text-pink-700">
                        <Link href="/profile" className="flex items-center gap-2"><User size={16}/> Profil Saya</Link>
                      </DropdownMenuItem>
                   </>
                )}
                
                <DropdownMenuSeparator className="bg-pink-100/50" />
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="rounded-xl cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600 font-medium flex items-center gap-2"
                >
                  <LogOut size={16}/> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="rounded-full bg-stone-900 hover:bg-pink-600 text-white font-bold px-6 shadow-md transition-all hover:-translate-y-0.5 ml-2">
              <Link href="/login">Masuk</Link>
            </Button>
          )}

          {/* Mobile Menu Trigger */}
          <div className="md:hidden ml-1">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-stone-600">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-white/95 backdrop-blur-xl border-r-pink-100 p-0">
                <div className="h-full flex flex-col">
                   <SheetHeader className="p-6 border-b border-pink-50">
                      <SheetTitle className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden border border-stone-100 shadow-sm relative">
                           <Image src="/logo_celle.jpg" alt="Logo" fill className="object-cover" />
                        </div>
                        <span className="font-lora font-bold text-xl text-stone-800">Cellebeads.</span>
                      </SheetTitle>
                   </SheetHeader>
                   
                   <div className="flex-1 px-4 py-6 flex flex-col gap-2">
                      {links.map((link) => (
                        <Link 
                          key={link.href} 
                          href={link.href}
                          className={cn(
                            "flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium transition-all",
                            pathname === link.href 
                              ? "bg-pink-50 text-pink-600 shadow-sm" 
                              : "text-stone-600 hover:bg-stone-50"
                          )}
                        >
                          {link.name === 'Beranda' && <Heart size={20} />}
                          {link.name === 'Koleksi' && <Sparkles size={20} />}
                          {link.name === 'Tentang' && <User size={20} />}
                          {link.name}
                        </Link>
                      ))}
                      
                      {/* Mobile: Link Pesanan Saya */}
                      {session && (session.user as any).role === 'customer' && (
                         <Link 
                           href="/dashboard/my-orders"
                           className={cn(
                             "flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium transition-all",
                             pathname.startsWith('/dashboard/my-orders')
                               ? "bg-pink-50 text-pink-600 shadow-sm" 
                               : "text-stone-600 hover:bg-stone-50"
                           )}
                         >
                           <Package size={20} />
                           Pesanan Saya
                         </Link>
                      )}
                   </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

        </div>
      </div>
    </motion.nav>
  );
}