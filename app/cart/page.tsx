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
import { Checkbox } from "@/components/ui/checkbox";
// 1. IMPORT motion dan AnimatePresence
import { motion, AnimatePresence } from 'framer-motion';

export default function CartPage() {
  const { 
    cartItems, removeFromCart, updateQuantity, getTotalPrice, 
    clearCart, toggleCartItemSelection, selectedItems 
  } = useCart();
  
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => { setIsMounted(true); }, []);

  const total = getTotalPrice ? getTotalPrice() : 0; 

  if (!isMounted) { 
    return <p style={{ textAlign: 'center', padding: '50px' }}>Memuat keranjang...</p>;
  }

  const handleCheckout = () => router.push('/checkout');

  // 2. Definisikan varian animasi untuk item
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } } // Animasi saat keluar
  };

  return (
    <div className="container mx-auto p-4 min-h-screen"> 
      <h1 className="text-2xl md:text-3xl font-lora font-medium text-stone-800 mb-6 md:mb-8">Keranjang Belanja</h1>
      
      {cartItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-10 px-6 bg-white rounded-lg shadow-md border border-stone-200"
        >
          <p className="text-lg text-stone-600 mb-4">Keranjang Anda masih kosong.</p>
          <Button asChild className="bg-rose-500 hover:bg-rose-600">
            <Link href="/products">Mulai Belanja</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* DAFTAR ITEM (Kiri/Atas) */}
          <motion.div 
            className="flex-grow space-y-4"
            // 3. Varian untuk stagger (muncul satu per satu)
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            initial="hidden"
            animate="visible"
          > 
            {/* 4. BUNGKUS DENGAN AnimatePresence */}
            <AnimatePresence>
              {cartItems.map((item) => (
                // 5. GANTI <div> MENJADI motion.div
                <motion.div 
                  key={item._id} 
                  variants={itemVariants}
                  exit="exit" // Terapkan animasi keluar
                  layout // <-- Ini penting agar item lain bergeser dengan mulus
                  className="flex items-start gap-4 border border-stone-200 rounded-lg p-4 bg-white shadow-sm"
                >
                  <Checkbox
                    id={`select-${item._id}`}
                    checked={item.selected}
                    onCheckedChange={() => toggleCartItemSelection(item._id)}
                    className="mt-1"
                  />
                  <div className="relative w-20 h-20 flex-shrink-0">
                     <Image src={item.image} alt={item.name} fill className="rounded-md object-cover border border-stone-100"/>
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <Link href={`/products/${item._id}`} className="font-medium text-stone-900 line-clamp-2 text-sm md:text-base hover:text-primary">
                        {item.name}
                      </Link>
                      <p className="text-sm text-primary font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                       <div className="flex items-center border rounded-md">
                          <Input 
                             type="number" value={item.quantity} min="1" 
                             onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                             className="w-12 h-8 text-center border-none p-0 text-sm focus-visible:ring-0" 
                          />
                       </div>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-red-500" onClick={() => removeFromCart(item._id)}>
                          <Trash2 className="h-4 w-4" /> 
                       </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* RINGKASAN BELANJA (Kanan/Bawah) */}
          {/* 6. Animasi untuk Ringkasan */}
          <motion.div 
            className="lg:w-1/3 flex-shrink-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2, type: 'spring' } }}
          >
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm sticky top-24">
              <h3 className="text-lg font-semibold mb-4">Ringkasan</h3>
              <div className="flex justify-between mb-4 text-stone-600">
                <span>Total Barang</span>
                <span>{selectedItems.length} item</span>
              </div>
              <div className="flex justify-between text-xl font-bold mb-6 text-stone-900 border-t pt-4">
                <span>Total Harga</span>
                <span>Rp {total.toLocaleString('id-ID')}</span> 
              </div>
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  onClick={handleCheckout} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                  disabled={selectedItems.length === 0} 
                >
                  Checkout via WhatsApp
                </Button>
                <Button variant="outline" onClick={clearCart} className="w-full text-xs text-muted-foreground">
                  Kosongkan Keranjang
                </Button>
              </div>
            </div>
          </motion.div>

        </div>
      )}
    </div>
  );
}