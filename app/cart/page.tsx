// File: app/cart/page.tsx
'use client';
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen"> 
      <h1 className="text-3xl font-lora font-bold text-stone-800 mb-8 flex items-center gap-3">
        <ShoppingBag className="text-primary" /> Keranjang Belanja
      </h1>
      
      {cartItems.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 px-6 bg-white rounded-3xl shadow-sm border border-stone-100"
        >
          <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
             <ShoppingBag className="w-10 h-10 text-pink-300" />
          </div>
          <h2 className="text-xl font-bold text-stone-700 mb-2">Keranjangmu Masih Kosong</h2>
          <p className="text-stone-500 mb-6">Yuk, isi dengan aksesoris cantik pilihanmu!</p>
          <Button asChild className="bg-primary hover:bg-pink-600 text-white rounded-full px-8">
            <Link href="/products">Mulai Belanja</Link>
          </Button>
        </motion.div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* DAFTAR ITEM */}
          <motion.div 
            className="flex-grow space-y-4"
            variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
            initial="hidden"
            animate="visible"
          > 
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div 
                  key={item._id} 
                  variants={itemVariants}
                  exit="exit" 
                  layout 
                  className="flex items-start gap-4 border border-pink-100/50 rounded-2xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
                >
                  <Checkbox
                    id={`select-${item._id}`}
                    checked={item.selected}
                    onCheckedChange={() => toggleCartItemSelection(item._id)}
                    className="mt-1 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden border border-stone-100">
                     <Image src={item.image} alt={item.name} fill className="object-cover"/>
                  </div>
                  
                  <div className="flex-grow flex flex-col justify-between gap-2">
                    <div>
                      <Link href={`/products/${item._id}`} className="font-bold text-stone-800 line-clamp-2 text-sm md:text-base hover:text-primary transition-colors">
                        {item.name}
                      </Link>
                      <p className="text-sm text-primary font-bold mt-1">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                       <div className="flex items-center border border-stone-200 rounded-full px-2 py-1 bg-stone-50">
                          <span className="text-xs text-stone-400 mr-2">Qty:</span>
                          <Input 
                             type="number" value={item.quantity} min="1" 
                             onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                             className="w-12 h-6 text-center border-none p-0 text-sm bg-transparent focus-visible:ring-0" 
                          />
                       </div>
                       <Button variant="ghost" size="icon" className="h-8 w-8 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-full" onClick={() => removeFromCart(item._id)}>
                          <Trash2 className="h-4 w-4" /> 
                       </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* RINGKASAN BELANJA */}
          <motion.div 
            className="lg:w-1/3 flex-shrink-0"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0, transition: { delay: 0.2, type: 'spring' } }}
          >
            <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xl shadow-pink-50 sticky top-24">
              <h3 className="text-lg font-bold mb-4 text-stone-800 border-b border-stone-100 pb-4">Ringkasan Pesanan</h3>
              <div className="flex justify-between mb-4 text-stone-600 text-sm">
                <span>Total Barang</span>
                <span className="font-medium">{selectedItems.length} item</span>
              </div>
              <div className="flex justify-between text-xl font-extrabold mb-6 text-primary">
                <span>Total Harga</span>
                <span>Rp {total.toLocaleString('id-ID')}</span> 
              </div>
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  onClick={handleCheckout} 
                  className="w-full bg-primary hover:bg-pink-700 text-white font-bold rounded-xl shadow-lg shadow-pink-200"
                  disabled={selectedItems.length === 0} 
                >
                  Checkout Sekarang <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
                <Button variant="outline" onClick={clearCart} className="w-full text-xs text-stone-400 hover:text-red-500 border-none bg-stone-50 hover:bg-red-50 rounded-xl">
                  Hapus Semua
                </Button>
              </div>
            </div>
          </motion.div>

        </div>
      )}
    </div>
  );
}