// File: app/page.tsx
'use client'; // Ubah ke Client Component untuk animasi

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProducts, IProduct } from '@/app/admin/products/actions'; 
import ProductGrid from '@/app/products/ProductGrid'; 
import { Search, ShieldCheck, Truck, Gem, Watch, Smartphone, Key, CircleDashed, Sparkles, Heart, ArrowRight } from 'lucide-react';
import { auth } from '@/auth'; 
import LandingView from '@/components/LandingView'; 
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion'; // Wajib ada
import { useState, useEffect } from 'react';

// --- KOMPONEN BACKGROUND BERGERAK (Sama seperti Admin tapi lebih soft) ---
const AnimatedBackground = () => (
  <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
    <motion.div 
       animate={{ x: [0, 100, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
       transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
       className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-pink-300/30 rounded-full mix-blend-multiply filter blur-[80px]"
    />
    <motion.div 
       animate={{ x: [0, -100, 0], y: [0, 50, 0], scale: [1, 1.1, 1] }}
       transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
       className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-purple-300/30 rounded-full mix-blend-multiply filter blur-[80px]"
    />
    <motion.div 
       animate={{ x: [0, 50, 0], y: [0, 100, 0] }}
       transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
       className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-yellow-200/30 rounded-full mix-blend-multiply filter blur-[80px]"
    />
  </div>
);

export default function HomePage() {
  const { data: session, status } = useSession();
  const [productsToShow, setProductsToShow] = useState<IProduct[]>([]);

  // Fetch data di client side karena kita ubah jadi 'use client'
  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProductsToShow(data.slice(0, 8));
    };
    if (status === 'authenticated') fetchData();
  }, [status]);

  if (status === 'loading') return null; // Atau loading spinner
  
  // Jika BELUM LOGIN -> Tampilkan Landing Page Khusus
  if (status === 'unauthenticated') {
    return <LandingView />;
  }

  // --- KATEGORI ---
  const categories = [
    { name: 'Gelang', icon: CircleDashed, href: '/products?category=Gelang', color: 'text-pink-600', bg: 'bg-pink-100', border: 'border-pink-200' },
    { name: 'Kalung', icon: Gem, href: '/products?category=Kalung', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
    { name: 'Cincin', icon: Sparkles, href: '/products?category=Cincin', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
    { name: 'Keychain', icon: Key, href: '/products?category=Keychain', color: 'text-teal-600', bg: 'bg-teal-100', border: 'border-teal-200' },
    { name: 'Strap HP', icon: Smartphone, href: '/products?category=Strap Handphone', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
    { name: 'Jam Manik', icon: Watch, href: '/products?category=Jam Manik', color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200' },
  ];

  return (
    <div className="space-y-20 pb-24 overflow-hidden">
      
      {/* --- HERO SECTION MEWAH --- */}
      <section className="relative px-4 pt-6">
        <AnimatedBackground />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto"
        >
          {/* Kartu Glass Utama */}
          <div className="relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-[3rem] p-8 md:p-16 text-center shadow-2xl shadow-pink-500/10 overflow-hidden group">
            
            {/* Dekorasi Mengambang (Floating Elements) */}
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-10 left-10 text-pink-400 opacity-80"><Sparkles size={40} /></motion.div>
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-20 right-10 text-purple-400 opacity-80"><Heart size={30} fill="currentColor" /></motion.div>
            
            {/* Konten Hero */}
            <div className="relative z-10 max-w-3xl mx-auto space-y-8">
              
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2 py-2 px-6 rounded-full bg-white/80 border border-pink-100 shadow-sm"
              >
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
                <span className="text-xs font-bold tracking-widest uppercase text-stone-600">
                  Selamat Datang, {session?.user?.name?.split(' ')[0]}!
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl font-lora font-extrabold text-stone-800 leading-tight">
                Kilau Cantik, <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-500 to-indigo-500 animate-gradient-x">
                  Gaya Unikmu.
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-stone-600 font-medium leading-relaxed max-w-2xl mx-auto">
                Temukan aksesoris manik *handmade* eksklusif yang dirancang untuk menyempurnakan setiap momen bahagiamu.
              </p>

              {/* Search Bar Glassmorphism */}
              <div className="max-w-xl mx-auto relative group/search">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur opacity-20 group-hover/search:opacity-40 transition-opacity"></div>
                <form action="/products" className="relative flex items-center bg-white/80 backdrop-blur-md rounded-full p-2 pl-6 border border-white shadow-lg transition-transform transform group-hover/search:scale-[1.01]">
                  <Search className="w-6 h-6 text-stone-400" />
                  <Input 
                    name="search"
                    className="border-none shadow-none focus-visible:ring-0 pl-4 h-12 text-lg bg-transparent w-full placeholder:text-stone-400 text-stone-800"
                    placeholder="Cari 'Gelang Mutiara'..."
                  />
                  <Button type="submit" size="lg" className="rounded-full h-12 px-8 bg-stone-900 hover:bg-pink-600 text-white font-bold shadow-lg transition-all">
                    Cari
                  </Button>
                </form>
              </div>

              {/* Fitur Pills */}
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                {[
                  { icon: ShieldCheck, text: "Aman & Terpercaya", color: "text-emerald-600", bg: "bg-emerald-50" },
                  { icon: Truck, text: "Pengiriman Cepat", color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: Gem, text: "100% Handmade", color: "text-rose-600", bg: "bg-rose-50" },
                ].map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white px-4 py-2 rounded-xl shadow-sm hover:-translate-y-1 transition-transform cursor-default">
                     <div className={`p-1.5 rounded-full ${feature.bg} ${feature.color}`}>
                       <feature.icon size={16} />
                     </div>
                     <span className="text-sm font-bold text-stone-600">{feature.text}</span>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </motion.div>
      </section>

      {/* --- KATEGORI (Hover Effect Baru) --- */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4">
           <div>
             <h2 className="text-3xl font-lora font-bold text-stone-800">Jelajahi Kategori</h2>
             <p className="text-stone-500 mt-1">Pilih sesuai gaya favoritmu.</p>
           </div>
           <Link href="/products" className="group flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-pink-600 transition-colors">
             Lihat Semua <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform"/>
           </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
           {categories.map((cat, idx) => (
             <Link key={cat.name} href={cat.href}>
               <motion.div 
                 whileHover={{ y: -5 }}
                 className="flex flex-col items-center justify-center gap-4 p-6 rounded-[2rem] bg-white border border-stone-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300 h-full relative overflow-hidden group"
               >
                  <div className={`absolute top-0 left-0 w-full h-1 ${cat.bg.replace('100', '400')}`} />
                  <div className={`w-16 h-16 ${cat.bg} rounded-2xl flex items-center justify-center ${cat.color} shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                    <cat.icon size={28} strokeWidth={1.5} />
                  </div>
                  <span className="font-bold text-stone-700 text-sm">{cat.name}</span>
               </motion.div>
             </Link>
           ))}
        </div>
      </section>

      {/* --- PRODUK TERBARU --- */}
      <section className="container mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-8 w-1 bg-pink-500 rounded-full"></div>
          <h2 className="text-3xl font-lora font-bold text-stone-900">New Arrivals</h2>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[2.5rem] border border-white shadow-sm">
           <ProductGrid products={productsToShow} />
        </div>
        
        <div className="text-center mt-12">
            <Button asChild size="lg" className="rounded-full h-14 px-10 bg-white border-2 border-stone-100 text-stone-800 hover:bg-stone-50 hover:border-pink-200 hover:text-pink-600 font-bold shadow-sm transition-all text-base">
              <Link href="/products">Lihat Koleksi Lengkap</Link>
            </Button>
        </div>
      </section>

    </div>
  );
}