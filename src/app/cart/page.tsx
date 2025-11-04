// File: app/cart/page.tsx
'use client';
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from 'lucide-react';

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, total, clearCart } = useCart();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  if (!isMounted) { 
    return <p style={{ textAlign: 'center', padding: '50px' }}>Memuat keranjang...</p>;
  }

  const handleCheckout = () => router.push('/checkout');

  return (
    <div className="max-w-3xl mx-auto p-4"> 
      <h1 className="text-3xl font-lora font-medium text-stone-800 mb-8">Keranjang Belanja</h1>
      
      {/* --- INI BAGIAN YANG DIPERBAIKI --- */}
      {cartItems.length === 0 ? (
        // Tampilan JIKA keranjang kosong (Pastikan ini ada!)
        <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md border border-stone-200">
          <p className="text-lg text-stone-600 mb-4">Keranjang Anda masih kosong.</p>
          <Button asChild className="bg-rose-500 hover:bg-rose-600">
            <Link href="/products">Mulai Belanja</Link>
          </Button>
        </div>
      ) : (
        // Tampilan JIKA ada barang (Ini sudah benar sebelumnya)
        <div>
          <div className="space-y-4"> 
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 border-b border-stone-200 pb-4">
                <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md object-cover border border-stone-200"/>
                <div className="flex-grow">
                  <Link href={`/products/${item._id}`} className="font-medium hover:text-rose-500">{item.name}</Link>
                  <p className="text-sm text-stone-600">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <Input type="number" value={item.qty} min="1" max={item.stock}
                       onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                       className="w-16 text-center h-9" 
                />
                <Button variant="destructive" size="icon" onClick={() => removeFromCart(item._id)}>
                  <Trash2 className="h-4 w-4" /> 
                </Button>
              </div>
            ))}
          </div>
          {/* Ringkasan & Tombol Aksi */}
          <div className="mt-8 pt-6 border-t border-stone-300">
            <div className="flex justify-between items-center text-xl font-semibold mb-6">
              <span>Total Harga:</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={clearCart}>Kosongkan Keranjang</Button>
              <Button size="lg" onClick={handleCheckout} className="bg-emerald-500 hover:bg-emerald-600">Lanjut ke Checkout</Button> {/* Tombol Checkout hijau */}
            </div>
          </div>
        </div>
      )}
      {/* ---------------------------------- */}
    </div>
  );
}