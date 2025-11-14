// File: app/cart/page.tsx (GANTI ISINYA)
'use client';
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox"; // <-- 1. IMPORT CHECKBOX

export default function CartPage() {
  // 2. Ambil fungsi & state baru
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getTotalPrice, 
    clearCart, 
    toggleCartItemSelection, // <-- fungsi baru
    selectedItems // <-- data baru
  } = useCart();
  
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  // 3. Panggil fungsi total (sekarang ini HANYA menghitung yang terpilih)
  const total = getTotalPrice ? getTotalPrice() : 0; 

  if (!isMounted) { 
    return <p style={{ textAlign: 'center', padding: '50px' }}>Memuat keranjang...</p>;
  }

  const handleCheckout = () => router.push('/checkout');

  return (
    <div className="max-w-3xl mx-auto p-4"> 
      <h1 className="text-3xl font-lora font-medium text-stone-800 mb-8">Keranjang Belanja</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-10 px-6 bg-white rounded-lg shadow-md border border-stone-200">
          <p className="text-lg text-stone-600 mb-4">Keranjang Anda masih kosong.</p>
          <Button asChild className="bg-rose-500 hover:bg-rose-600">
            <Link href="/products">Mulai Belanja</Link>
          </Button>
        </div>
      ) : (
        <div>
          <div className="space-y-4"> 
            {/* 4. Tampilkan barang dengan checkbox */}
            {cartItems.map((item) => (
              <div key={item._id} className="flex items-center gap-4 border-b border-stone-200 pb-4">
                <Checkbox
                  id={`select-${item._id}`}
                  checked={item.selected}
                  onCheckedChange={() => toggleCartItemSelection(item._id)}
                  className="mt-1" // Beri sedikit margin
                />
                <Image src={item.image} alt={item.name} width={80} height={80} className="rounded-md object-cover border border-stone-200"/>
                <div className="flex-grow">
                  <Link href={`/products/${item._id}`} className="font-medium hover:text-rose-500">{item.name}</Link>
                  <p className="text-sm text-stone-600">Rp {item.price.toLocaleString('id-ID')}</p>
                </div>
                <Input type="number" value={item.quantity} min="1" 
                       onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                       className="w-16 text-center h-9" 
                />
                <Button variant="destructive" size="icon" onClick={() => removeFromCart(item._id)}>
                  <Trash2 className="h-4 w-4" /> 
                </Button>
              </div>
            ))}
          </div>
          {/* 5. Perbarui Ringkasan */}
          <div className="mt-8 pt-6 border-t border-stone-300">
            <div className="flex justify-between items-center text-xl font-semibold mb-6">
              <span>Total Harga (Hanya barang terpilih):</span>
              <span>Rp {total.toLocaleString('id-ID')}</span> 
            </div>
            <div className="flex justify-between">
              <Button variant="outline" onClick={clearCart}>Kosongkan Keranjang</Button>
              <Button 
                size="lg" 
                onClick={handleCheckout} 
                className="bg-emerald-500 hover:bg-emerald-600"
                // 6. Disable tombol jika tidak ada item terpilih
                disabled={selectedItems.length === 0} 
              >
                Lanjut ke Checkout ({selectedItems.length} barang)
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}