'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    // Navbar putih, shadow, border bawah
    <nav className="bg-white text-foreground shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Lora, warna Primary (pink) */}
        <Link href="/" className="text-2xl font-lora font-medium text-primary hover:opacity-80">
          Cellebeads
        </Link>
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link href="/products" className="text-sm hover:text-primary">Katalog</Link>
          <Link href="/cart" className="relative hover:text-primary flex items-center text-sm">
            <ShoppingBag className="h-5 w-5 mr-1" />
            Keranjang
            {totalItems > 0 && (
              // Badge warna Primary (pink)
              <span className="absolute -top-2 -right-3 bg-primary text-primary-foreground text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>
          {session ? (
            <>
              {session.user.role === 'admin' ? (
                <>
                  {/* Link Admin (tema gelap, akses dari sini) */}
                  <Link href="/admin/products" className="text-sm hover:text-primary">Kelola Produk</Link>
                  <Link href="/admin/orders" className="text-sm hover:text-primary">Kelola Pesanan</Link>
                  <Link href="/admin/sales-history" className="text-sm hover:text-primary">Riwayat</Link>
                </>
              ) : (
                <Link href="/dashboard/my-orders" className="text-sm hover:text-primary">Pesanan Saya</Link>
              )}
              {/* Tombol Logout (Outline) */}
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Tombol Login (Warna Primary) */}
              <Button asChild size="sm">
                 <Link href="/login">Login</Link>
              </Button>
              <Link href="/register" className="text-sm hover:text-primary">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}