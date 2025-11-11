// File: components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { ShoppingBag } from 'lucide-react';
import React from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // akses role dengan aman (casting bila perlu)
  const userRole = (session?.user as any)?.role;

  return (
    <nav className="bg-white text-foreground shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Left: Logo / Brand */}
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold">
            Cellebeads
          </Link>
        </div>

        {/* Center / Links */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link href="/products" className="text-sm hover:text-primary">Katalog</Link>

          {/* Cart link — pastikan satu elemen anak */}
          <Link href="/cart" className="relative hover:text-primary flex items-center text-sm">
            <div className="flex items-center gap-2">
              <ShoppingBag size={18} />
              <span className="sr-only">Keranjang</span>
              {totalItems > 0 && (
                <span className="ml-1 rounded-full bg-red-600 text-white text-xs px-2">
                  {totalItems}
                </span>
              )}
            </div>
          </Link>

          {/* Auth / Admin Links */}
          {session ? (
            <div className="flex items-center gap-3">
              {userRole === 'admin' ? (
                <div className="flex items-center gap-3">
                  <Link href="/admin/products" className="text-sm hover:text-primary">Kelola Produk</Link>
                  <Link href="/admin/orders" className="text-sm hover:text-primary">Kelola Pesanan</Link>
                  <Link href="/admin/sales-history" className="text-sm hover:text-primary">Riwayat</Link>
                </div>
              ) : (
                <Link href="/dashboard/my-orders" className="text-sm hover:text-primary">Pesanan Saya</Link>
              )}

              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                Logout
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              {/* Bungkus Button dengan Link (hindari asChild) */}
              <Link href="/login">
                <Button size="sm">Login</Button>
              </Link>

              <Link href="/register" className="text-sm hover:text-primary">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
