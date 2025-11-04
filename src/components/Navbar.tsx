// File: components/Navbar.tsx
'use client';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext';
import { Button } from "@/components/ui/button";
import { ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession(); // Ini tetap sama
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  // Akses role dengan aman (casting ke 'any' jika perlu)
  const userRole = (session?.user as any)?.role;

  return (
    <nav className="bg-white text-foreground shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* ... (Logo, Katalog, Keranjang tetap sama) ... */}
        <div className="flex items-center space-x-4 md:space-x-6">
          <Link href="/products" className="text-sm hover:text-primary">Katalog</Link>
          <Link href="/cart" className="relative hover:text-primary flex items-center text-sm">{/* ... (isi keranjang) ... */}</Link>
          
          {session ? (
            <>
              {/* --- PERBAIKAN AKSES ROLE --- */}
              {userRole === 'admin' ? (
                <>
                  <Link href="/admin/products" className="text-sm hover:text-primary">Kelola Produk</Link>
                  <Link href="/admin/orders" className="text-sm hover:text-primary">Kelola Pesanan</Link>
                  <Link href="/admin/sales-history" className="text-sm hover:text-primary">Riwayat</Link>
                </>
              ) : (
                <Link href="/dashboard/my-orders" className="text-sm hover:text-primary">Pesanan Saya</Link>
              )}
              {/* --------------------------- */}
              <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: '/' })}>
                Logout
              </Button>
            </>
          ) : (
             <>
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