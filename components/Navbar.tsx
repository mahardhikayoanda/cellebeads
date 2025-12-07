// File: components/Navbar.tsx
'use client'

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut, Menu, Package, Search } from 'lucide-react'; 
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion'; 
import { usePathname } from 'next/navigation'; 
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet" 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Navbar() {
  const { data: session, status } = useSession();
  const { getTotalItems } = useCart();
  const pathname = usePathname(); 
  
  const totalItems = getTotalItems ? getTotalItems() : 0;
  const userRole = (session?.user as any)?.role;
  const profileComplete = (session?.user as any)?.profileComplete;
  const userName = session?.user?.name || "Pengguna";

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // --- 1. LOGIKA: Sembunyikan Total di Landing Page (Tamu) ---
  if (pathname === '/' && status === 'unauthenticated') {
    return null;
  }

  // --- 2. LOGIKA KHUSUS ADMIN: Sembunyikan Navbar Sepenuhnya ---
  // Karena Admin sudah punya Sidebar sendiri di layout.tsx
  const isAdminPage = pathname?.startsWith('/admin');
  if (isAdminPage) {
    return null; // <--- UBAH DI SINI (Return null agar hilang total)
  }

  // --- 3. TAMPILAN STANDAR (CUSTOMER) ---
  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
      className="sticky top-0 z-50 border-b border-white/20 bg-white/80 backdrop-blur-md shadow-sm"
    >
      <div className="container mx-auto px-4 py-3 md:py-4 flex items-center justify-between">
        
        {/* Mobile Menu (Kiri) */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-pink-50 text-stone-600">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="bg-white/95 backdrop-blur-xl border-r-pink-100">
              <SheetHeader>
                <SheetTitle className="text-left font-lora text-3xl font-bold text-primary mb-6 italic">Cellebeads</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-6 mt-8">
                <Link href="/" className="text-xl font-medium hover:text-primary transition-colors font-lora">Beranda</Link>
                <Link href="/products" className="text-xl font-medium hover:text-primary transition-colors font-lora">Koleksi</Link>
                <Link href="/about" className="text-xl font-medium hover:text-primary transition-colors font-lora">Cerita Kami</Link>
                
                <div className="h-px bg-gradient-to-r from-transparent via-stone-300 to-transparent my-2" />

                {session ? (
                   <>
                      {userRole === 'customer' && (
                        <>
                          <Link href="/dashboard/my-orders" className="text-lg font-medium text-stone-600 hover:text-primary">Pesanan Saya</Link>
                          <Link href="/profile" className="text-lg font-medium text-stone-600 hover:text-primary">Profil Saya</Link>
                        </>
                      )}
                      <button onClick={() => signOut({ callbackUrl: '/' })} className="text-lg font-medium text-rose-500 hover:text-rose-700 text-left mt-4">
                        Keluar
                      </button>
                   </>
                ) : (
                   <Link href="/login" className="text-lg font-bold text-primary">Masuk Sekarang</Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <Link href="/" className="text-2xl md:text-3xl font-lora font-bold text-primary tracking-tight hover:opacity-80 transition-opacity flex items-center gap-2">
          Cellebeads<span className="text-yellow-500">.</span>
        </Link>

        {/* Menu Desktop */}
        <div className="hidden md:flex items-center space-x-1 bg-stone-100/50 p-1 rounded-full border border-white/50 backdrop-blur-sm">
          {['Beranda', 'Koleksi', 'Tentang'].map((item) => {
            const path = item === 'Beranda' ? '/' : (item === 'Koleksi' ? '/products' : '/about');
            return (
              <Button key={item} asChild variant="ghost" size="sm" className="rounded-full px-6 text-stone-600 hover:text-primary hover:bg-white transition-all">
                <Link href={path}>{item}</Link>
              </Button>
            )
          })}
        </div>

        {/* Ikon Kanan */}
        <div className="flex items-center gap-1 md:gap-2">
          
          <Button variant="ghost" size="icon" className="hidden md:flex text-stone-500 hover:text-primary hover:bg-pink-50 rounded-full">
            <Search className="h-5 w-5" />
          </Button>

          {/* Cart (Hanya untuk Customer / Tamu) */}
          {(!session || (profileComplete && userRole !== 'admin')) && (
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-stone-500 hover:text-primary hover:bg-pink-50 rounded-full transition-all">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-0 right-0 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center shadow-md border border-white"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </Button>
            </Link>
          )}

          {/* Dropdown Profil Customer */}
          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full text-stone-500 hover:text-primary hover:bg-pink-50 border border-transparent hover:border-pink-100">
                  <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-full flex items-center justify-center text-primary font-bold shadow-inner">
                     {getInitials(userName)}
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 border-pink-100 shadow-xl bg-white/95 backdrop-blur-lg">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none text-stone-800">{userName}</p>
                    <p className="text-xs leading-none text-stone-500 truncate">{session.user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-pink-50" />

                {userRole === 'customer' && (
                  <>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-pink-50 focus:text-primary">
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" /> Profil Saya
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-pink-50 focus:text-primary">
                      <Link href="/dashboard/my-orders" className="flex items-center">
                        <Package className="mr-2 h-4 w-4" /> Pesanan Saya
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                
                <DropdownMenuSeparator className="bg-pink-50" />
                
                <DropdownMenuItem 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-rose-500 focus:text-rose-600 focus:bg-rose-50 rounded-xl cursor-pointer font-medium"
                >
                  <LogOut className="mr-2 h-4 w-4" /> Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild variant="ghost" size="icon" className="rounded-full text-stone-500 hover:text-primary hover:bg-pink-50 transition-all" title="Masuk Akun">
               <Link href="/login">
                 <User className="h-5 w-5" />
               </Link>
            </Button>
          )}
          
        </div>
      </div>
    </motion.nav>
  );
}