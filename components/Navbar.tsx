// File: components/Navbar.tsx
'use client'

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Menu, Package, LayoutDashboard, Search } from 'lucide-react'; 
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion'; // Tambah animasi
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet" 

export default function Navbar() {
  const { data: session } = useSession();
  const { getTotalItems } = useCart();
  
  const totalItems = getTotalItems ? getTotalItems() : 0;
  const userRole = (session?.user as any)?.role;
  const profileComplete = (session?.user as any)?.profileComplete;

  return (
    // Ganti background solid dengan backdrop-blur (Glassmorphism)
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-md shadow-sm"
    >
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        
        {/* 1. Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white/95 backdrop-blur-xl border-r-primary/20">
              <SheetHeader>
                <SheetTitle className="text-left font-lora text-3xl font-bold text-primary mb-6 italic">Cellebeads</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" className="text-xl font-medium hover:text-primary transition-colors font-lora">Beranda</Link>
                <Link href="/products" className="text-xl font-medium hover:text-primary transition-colors font-lora">Koleksi</Link>
                <Link href="/about" className="text-xl font-medium hover:text-primary transition-colors font-lora">Cerita Kami</Link>
                
                <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent my-2" />

                {session && userRole === 'customer' && profileComplete && (
                   <>
                     <Link href="/dashboard/my-orders" className="text-lg font-medium text-stone-600 hover:text-primary">Pesanan Saya</Link>
                     <Link href="/profile" className="text-lg font-medium text-stone-600 hover:text-primary">Profil Saya</Link>
                   </>
                )}
                {session && userRole === 'admin' && (
                   <Link href="/admin/products" className="text-lg font-medium text-primary">Admin Panel</Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* 2. Logo (Tengah di Mobile, Kiri di Desktop) */}
        <Link href="/" className="text-3xl font-lora font-bold text-primary tracking-tight hover:opacity-80 transition-opacity">
          Cellebeads<span className="text-yellow-500">.</span>
        </Link>

        {/* 3. Menu Desktop (Centered) */}
        <div className="hidden md:flex items-center space-x-8 bg-stone-100/50 px-8 py-2 rounded-full border border-white/50">
          <Link href="/" className="text-sm font-medium text-stone-600 hover:text-primary uppercase tracking-widest transition-colors">
            Beranda
          </Link>
          <Link href="/products" className="text-sm font-medium text-stone-600 hover:text-primary uppercase tracking-widest transition-colors">
            Koleksi
          </Link>
          <Link href="/about" className="text-sm font-medium text-stone-600 hover:text-primary uppercase tracking-widest transition-colors">
            Tentang
          </Link>
        </div>

        {/* 4. Ikon Kanan */}
        <div className="flex items-center space-x-2">
          
          {/* Search Icon (Hiasan/Future Feature) */}
          <Button variant="ghost" size="icon" className="hidden md:flex text-stone-500 hover:text-primary hover:bg-primary/5">
            <Search className="h-5 w-5" />
          </Button>

          {(!session || (profileComplete && userRole !== 'admin')) && (
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-stone-500 hover:text-primary hover:bg-primary/5 transition-all">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Button>
            </Link>
          )}

          {session ? (
            <div className="flex items-center gap-1 pl-2 border-l border-stone-200 ml-2">
              {profileComplete && (
                <>
                  {userRole === 'admin' ? (
                    <Link href="/admin/products">
                      <Button variant="ghost" size="icon" title="Admin Panel" className="text-primary hover:bg-primary/10">
                        <LayoutDashboard className="h-5 w-5" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link href="/dashboard/my-orders">
                        <Button variant="ghost" size="icon" title="Pesanan Saya" className="hover:text-primary">
                          <Package className="h-5 w-5" />
                        </Button>
                      </Link>
                      <Link href="/profile">
                        <Button variant="ghost" size="icon" title="Profil Saya" className="hover:text-primary">
                          <User className="h-5 w-5" />
                        </Button>
                      </Link>
                    </>
                  )}
                </>
              )}
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: '/' })}
                title="Logout"
                className="text-stone-400 hover:text-red-500 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm" className="rounded-full px-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
                Masuk
              </Button>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}