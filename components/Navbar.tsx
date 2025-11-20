// File: components/Navbar.tsx
'use client'

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Menu, Package, LayoutDashboard } from 'lucide-react'; 
import { useCart } from '@/context/CartContext';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet" 

export default function Navbar() {
  const { data: session } = useSession();
  const { getTotalItems } = useCart();
  
  const totalItems = getTotalItems ? getTotalItems() : 0;
  const userRole = (session?.user as any)?.role;
  const profileComplete = (session?.user as any)?.profileComplete;

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        
        {/* 1. Menu Mobile (Hamburger) - Kiri */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <SheetHeader>
                <SheetTitle className="text-left font-lora text-2xl font-bold text-primary mb-4">Cellebeads</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-4">
                <Link href="/" className="text-lg font-medium hover:text-primary">Beranda</Link>
                <Link href="/products" className="text-lg font-medium hover:text-primary">Katalog Produk</Link>
                <Link href="/about" className="text-lg font-medium hover:text-primary">Tentang Kami</Link>
                
                {/* Link Dinamis di Mobile */}
                {session && userRole === 'customer' && profileComplete && (
                   <>
                     <Link href="/dashboard/my-orders" className="text-lg font-medium text-emerald-600">Pesanan Saya</Link>
                     <Link href="/profile" className="text-lg font-medium">Profil Saya</Link>
                   </>
                )}
                {session && userRole === 'admin' && (
                   <Link href="/admin/products" className="text-lg font-medium text-primary">Admin Panel</Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* 2. Logo */}
        <Link href="/" className="text-2xl font-lora font-semibold text-primary">
          Cellebeads
        </Link>

        {/* 3. Menu Desktop */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/products" className="text-foreground hover:text-primary transition-colors">
            Produk
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            Tentang
          </Link>
        </div>

        {/* 4. Ikon Kanan (Cart & User) */}
        <div className="flex items-center space-x-1 md:space-x-2">
          
          {/* Tombol Keranjang - DIHILANGKAN UNTUK ADMIN */}
          {/* Logika: Tampil jika (Belum Login) ATAU (Sudah Login DAN Profil Lengkap DAN Bukan Admin) */}
          {(!session || (profileComplete && userRole !== 'admin')) && (
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative" title="Keranjang">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          )}

          {/* 5. User Menu */}
          {session ? (
            <div className="flex items-center">
              {/* Tampilkan ikon HANYA JIKA profil sudah lengkap */}
              {profileComplete && (
                <>
                  {userRole === 'admin' ? (
                    <Link href="/admin/products">
                      <Button variant="ghost" size="icon" title="Admin Panel">
                        <LayoutDashboard className="h-5 w-5" />
                      </Button>
                    </Link>
                  ) : (
                    <>
                      {/* Tombol PESANAN SAYA (Paket) */}
                      <Link href="/dashboard/my-orders">
                        <Button variant="ghost" size="icon" title="Pesanan Saya">
                          <Package className="h-5 w-5" />
                        </Button>
                      </Link>
                      
                      {/* Tombol PROFIL SAYA (User) */}
                      <Link href="/profile">
                        <Button variant="ghost" size="icon" title="Profil Saya">
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
              >
                <LogOut className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          ) : (
            // Tombol Login
            <Link href="/login">
              <Button variant="default" size="sm" className="hidden md:flex">Masuk</Button>
              <Button variant="ghost" size="icon" className="md:hidden" title="Login"><User className="h-5 w-5"/></Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}