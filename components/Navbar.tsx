// File: components/Navbar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Menu, Package, Search, Heart, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
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
  const { data: session, status } = useSession();
  const { getTotalItems } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  
  const totalItems = getTotalItems ? getTotalItems() : 0;
  
  // Deteksi Scroll untuk Efek Glass
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // --- LOGIKA SEMBUNYIKAN NAVBAR DI PANEL ADMIN ---
  if (pathname?.startsWith('/admin')) return null;

  // Data User
  const userRole = session?.user?.role;
  const userName = session?.user?.name || "Tamu";
  const userImage = session?.user?.image;

  // Helper Initials
  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  // Menu Links
  const links = [
    { name: 'Beranda', href: '/' },
    { name: 'Koleksi', href: '/products' },
    { name: 'Tentang', href: '/about' },
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 md:px-8 py-4",
        scrolled 
          ? "bg-white/70 backdrop-blur-xl shadow-lg shadow-pink-100/20 py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* --- 1. LOGO & BRAND (KIRI) --- */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300">
            {/* Logo Image dari Public Folder */}
            <Image 
              src="/logo_celle.jpg" 
              alt="Cellebeads Logo" 
              fill 
              className="object-cover"
            />
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
        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Search Button (Icon Only) */}
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-pink-50 hover:text-pink-600 text-stone-600">
             <Search className="w-5 h-5" />
          </Button>

          {/* Cart Button */}
          {userRole !== 'admin' && (
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

          {/* Profile / Login */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="rounded-full pl-2 pr-4 py-1 h-auto border border-transparent hover:border-pink-100 hover:bg-pink-50/50 gap-2 transition-all">
                   <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-pink-300 to-purple-300 p-[2px] shadow-sm">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        {userImage ? (
                          <Image src={userImage} alt="User" width={32} height={32} className="object-cover" />
                        ) : (
                          <span className="font-lora font-bold text-stone-700 text-xs">{getInitials(userName)}</span>
                        )}
                      </div>
                   </div>
                   <span className="hidden md:inline text-sm font-medium text-stone-700 max-w-[80px] truncate">
                     {userName.split(' ')[0]}
                   </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-white/60 bg-white/80 backdrop-blur-xl shadow-xl">
                <DropdownMenuLabel className="font-normal px-3 py-2">
                  <p className="font-bold text-stone-800">{userName}</p>
                  <p className="text-xs text-stone-500 truncate">{session.user?.email}</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-pink-100/50" />
                
                {userRole === 'customer' && (
                  <>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-pink-50 focus:text-pink-700">
                      <Link href="/profile" className="flex items-center gap-2"><User size={16}/> Profil Saya</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-pink-50 focus:text-pink-700">
                      <Link href="/dashboard/my-orders" className="flex items-center gap-2"><Package size={16}/> Pesanan Saya</Link>
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
            <Button asChild size="sm" className="rounded-full bg-stone-900 hover:bg-pink-600 text-white font-bold px-6 shadow-md transition-all hover:-translate-y-0.5">
              <Link href="/login">Masuk</Link>
            </Button>
          )}

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
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
                   </div>

                   <div className="p-6 border-t border-pink-50 bg-pink-50/30">
                      {!session ? (
                         <Button asChild className="w-full bg-stone-900 text-white rounded-xl h-12 font-bold">
                           <Link href="/login">Masuk / Daftar</Link>
                         </Button>
                      ) : (
                         <Button 
                           onClick={() => signOut({ callbackUrl: '/' })}
                           variant="outline" 
                           className="w-full border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl h-12 font-bold"
                         >
                           Keluar
                         </Button>
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