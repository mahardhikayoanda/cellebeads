// File: app/components/Navbar.tsx
'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCart } from '@/context/CartContext'; 

export default function Navbar() {
  const { data: session } = useSession();
  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    // Navbar putih dengan border bawah
    <nav className="bg-white text-stone-700 shadow-sm border-b border-stone-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        
        {/* Logo */}
        <Link href="/" className="text-2xl font-lora font-medium text-rose-600 hover:text-rose-500">
          Cellebeads
        </Link>

        {/* Menu */}
        <div className="flex items-center space-x-6">
          <Link href="/products" className="hover:text-rose-500">
            Katalog
          </Link>

          <Link href="/cart" className="relative hover:text-rose-500">
            Keranjang
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-4 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Menu Login/Logout */}
          {session ? (
            <>
              {session.user.role === 'admin' ? (
                // --- BAGIAN INI YANG DIEDIT ---
                // Gunakan Fragment <>...</> karena ada lebih dari 1 link admin
                <>
                  <Link href="/admin/products" className="hover:text-rose-500 text-sm"> {/* Kecilkan font admin */}
                    Kelola Produk
                  </Link>
                  <Link href="/admin/orders" className="hover:text-rose-500 text-sm">
                    Kelola Pesanan
                  </Link>
                  {/* Link Baru Ditambahkan Di Sini */}
                  <Link href="/admin/sales-history" className="hover:text-rose-500 text-sm">
                    Riwayat Penjualan
                  </Link>
                </>
                // -----------------------------
              ) : (
                <Link href="/dashboard/my-orders" className="hover:text-rose-500">
                  Pesanan Saya
                </Link>
              )}
              {/* Tombol Logout */}
              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="bg-stone-500 hover:bg-stone-600 text-white py-1 px-3 rounded-md text-sm" // Kecilkan tombol
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Tombol Login */}
              <Link href="/login" className="bg-rose-500 hover:bg-rose-600 text-white py-1 px-3 rounded-md text-sm"> {/* Kecilkan tombol */}
                Login
              </Link>
              <Link href="/register" className="hover:text-rose-500 text-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}