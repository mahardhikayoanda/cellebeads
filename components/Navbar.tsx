// File: components/Navbar.tsx (Fixed)

'use client'

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { data: session } = useSession();
  const { cartItems, getTotalItems } = useCart();
  
  // Gunakan function getTotalItems() atau hitung manual
  const totalItems = getTotalItems();

  // Akses role dengan aman
  const userRole = (session?.user as any)?.role;

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-lora font-semibold text-primary">
          Cellebeads
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/products" className="text-foreground hover:text-primary transition-colors">
            Produk
          </Link>
          <Link href="/about" className="text-foreground hover:text-primary transition-colors">
            Tentang
          </Link>
          <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
            Kontak
          </Link>
        </div>

        {/* Right side buttons */}
        <div className="flex items-center space-x-4">
          {/* Cart Button */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>

          {/* User Menu */}
          {session ? (
            <div className="flex items-center space-x-2">
              {userRole === 'admin' && (
                <Link href="/admin">
                  <Button variant="outline" size="sm">
                    Admin Panel
                  </Button>
                </Link>
              )}
              
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm">{session.user?.name || session.user?.email}</span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut({ callbackUrl: '/' })}
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="default" size="sm">
                Masuk
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Navigation (opsional) */}
      <div className="md:hidden border-t border-stone-200 py-2">
        <div className="container mx-auto px-4 flex justify-around">
          <Link href="/products" className="text-sm text-foreground hover:text-primary">
            Produk
          </Link>
          <Link href="/about" className="text-sm text-foreground hover:text-primary">
            Tentang
          </Link>
          <Link href="/contact" className="text-sm text-foreground hover:text-primary">
            Kontak
          </Link>
        </div>
      </div>
    </nav>
  );
}