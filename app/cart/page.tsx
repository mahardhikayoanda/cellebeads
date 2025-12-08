// File: app/cart/page.tsx
'use client';

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, ArrowRight, ShoppingBag, Minus, Plus, Sparkles } from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from 'framer-motion';

// --- BACKGROUND ANIMASI (Sama seperti halaman lain) ---
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fff0f5]">
    <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
  </div>
);

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
    return (
        <div className="flex h-screen items-center justify-center bg-pink-50/50">
            <div className="animate-pulse flex flex-col items-center">
                <Sparkles className="h-10 w-10 text-pink-400 mb-4" />
                <p className="font-lora text-stone-500">Memuat keranjang...</p>
            </div>
        </div>
    );
  }

  const handleCheckout = () => router.push('/checkout');

  return (
    <div className="min-h-screen pb-20 relative font-sans text-stone-800">
      <AnimatedBackground />

      <div className="container mx-auto px-4 pt-8">
        
        {/* Header Page */}
        <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-2xl text-white shadow-lg shadow-pink-200">
                <ShoppingBag size={28} />
            </div>
            <div>
                <h1 className="text-3xl md:text-4xl font-lora font-bold text-stone-800">Keranjang Belanja</h1>
                <p className="text-stone-500 mt-1">Kelola item pilihanmu sebelum checkout.</p>
            </div>
        </div>
        
        {cartItems.length === 0 ? (
          // --- EMPTY STATE YANG CANTIK ---
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-20 px-6 bg-white/60 backdrop-blur-xl rounded-[2.5rem] border border-white/60 shadow-xl text-center max-w-2xl mx-auto"
          >
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-pink-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                <div className="relative w-24 h-24 bg-gradient-to-br from-pink-100 to-white rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                   <ShoppingBag className="w-10 h-10 text-pink-400" />
                </div>
            </div>
            <h2 className="text-2xl font-lora font-bold text-stone-800 mb-2">Keranjangmu Masih Kosong</h2>
            <p className="text-stone-500 mb-8 max-w-xs mx-auto">Sepertinya kamu belum menambahkan aksesoris cantik ke sini.</p>
            <Button asChild size="lg" className="rounded-full px-10 h-12 bg-stone-900 hover:bg-pink-600 text-white font-bold shadow-lg transition-all hover:-translate-y-1">
              <Link href="/products">Mulai Belanja</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* --- DAFTAR ITEM (KIRI) --- */}
            <div className="flex-grow w-full space-y-4">
              <AnimatePresence mode="popLayout">
                {cartItems.map((item) => (
                  <motion.div 
                    key={item._id} 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100, transition: { duration: 0.2 } }}
                    className="group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-white/70 backdrop-blur-md border border-white/60 rounded-[1.5rem] shadow-sm hover:shadow-lg hover:shadow-pink-100/50 transition-all duration-300"
                  >
                    
                    {/* Checkbox & Gambar */}
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <Checkbox
                            id={`select-${item._id}`}
                            checked={item.selected}
                            onCheckedChange={() => toggleCartItemSelection(item._id)}
                            className="w-5 h-5 border-2 border-stone-300 data-[state=checked]:bg-pink-500 data-[state=checked]:border-pink-500 rounded-md transition-all"
                        />
                        <div className="relative w-24 h-24 flex-shrink-0 rounded-2xl overflow-hidden border border-stone-100 shadow-inner bg-stone-50">
                           <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500"/>
                        </div>
                        {/* Mobile Title (visible only on small screens) */}
                        <div className="sm:hidden flex-1">
                            <Link href={`/products/${item._id}`} className="font-bold text-stone-800 line-clamp-2 text-sm leading-tight mb-1">
                                {item.name}
                            </Link>
                            <p className="text-pink-600 font-bold text-sm">Rp {item.price.toLocaleString('id-ID')}</p>
                        </div>
                    </div>
                    
                    {/* Info Produk (Desktop) */}
                    <div className="flex-grow hidden sm:block">
                      <Link href={`/products/${item._id}`} className="font-lora font-bold text-stone-800 text-lg hover:text-pink-600 transition-colors line-clamp-1">
                        {item.name}
                      </Link>
                      <p className="text-stone-500 text-xs uppercase tracking-wider font-bold mt-1 mb-2">Harga Satuan</p>
                      <p className="text-pink-600 font-bold">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                    
                    {/* Kontrol Qty & Hapus */}
                    <div className="flex items-center justify-between w-full sm:w-auto gap-4 mt-2 sm:mt-0 bg-stone-50/50 p-2 rounded-xl border border-stone-100">
                       <div className="flex items-center gap-1">
                          <Button 
                            variant="ghost" size="icon" 
                            className="h-8 w-8 rounded-lg hover:bg-white hover:text-pink-600 hover:shadow-sm"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          >
                             <Minus size={14} />
                          </Button>
                          <span className="w-8 text-center font-bold text-stone-800">{item.quantity}</span>
                          <Button 
                            variant="ghost" size="icon" 
                            className="h-8 w-8 rounded-lg hover:bg-white hover:text-pink-600 hover:shadow-sm"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          >
                             <Plus size={14} />
                          </Button>
                       </div>
                       <div className="h-6 w-px bg-stone-200 mx-1"></div>
                       <Button 
                          variant="ghost" size="icon" 
                          className="h-8 w-8 text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors" 
                          onClick={() => removeFromCart(item._id)}
                       >
                          <Trash2 size={16} /> 
                       </Button>
                    </div>

                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* --- RINGKASAN BELANJA (KANAN) --- */}
            <motion.div 
              className="lg:w-[380px] w-full flex-shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="sticky top-24">
                  <div className="bg-white/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white shadow-2xl shadow-pink-100/50 relative overflow-hidden">
                    
                    {/* Dekorasi Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-pink-100 to-transparent rounded-bl-full opacity-50 pointer-events-none"></div>

                    <h3 className="text-xl font-lora font-bold mb-6 text-stone-800 flex items-center gap-2">
                        <Sparkles size={18} className="text-yellow-500 fill-yellow-500" />
                        Ringkasan
                    </h3>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-stone-600 text-sm">
                            <span>Total Item</span>
                            <span className="font-bold">{selectedItems.length} barang</span>
                        </div>
                        <div className="flex justify-between text-stone-600 text-sm">
                            <span>Subtotal</span>
                            <span>Rp {total.toLocaleString('id-ID')}</span>
                        </div>
                        <div className="h-px bg-stone-100 my-2 border-t border-dashed border-stone-200" />
                        <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-stone-800">Total Bayar</span>
                            <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                                Rp {total.toLocaleString('id-ID')}
                            </span> 
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Button 
                        size="lg" 
                        onClick={handleCheckout} 
                        className="w-full h-14 bg-stone-900 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-stone-900/20 hover:shadow-pink-500/30 transition-all duration-500 group"
                        disabled={selectedItems.length === 0} 
                        >
                        Checkout Sekarang 
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                        
                        <Button 
                            variant="ghost" 
                            onClick={clearCart} 
                            className="w-full text-xs font-bold text-stone-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl py-3"
                        >
                        Kosongkan Keranjang
                        </Button>
                    </div>
                  </div>
              </div>
            </motion.div>

          </div>
        )}
      </div>
    </div>
  );
}