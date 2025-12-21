// File: app/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
// Menambahkan import 'PenTool' untuk ikon Request
import { 
  Search, Sparkles, Gem, CircleDashed, Key, 
  Smartphone, Watch, ArrowRight, ShoppingBag, Heart, PenTool 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProducts, IProduct } from '@/app/admin/products/actions'; 
import ProductGrid from '@/app/products/ProductGrid'; 
import LandingView from '@/components/LandingView'; 
import { Loader2 } from 'lucide-react';

const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fff0f5]">
    <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
  </div>
);

export default function HomePage() {
  const { data: session, status } = useSession();
  const [productsToShow, setProductsToShow] = useState<IProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProductsToShow(data);
      setLoadingProducts(false);
    };
    if (status === 'authenticated') fetchData();
  }, [status]);

  const filteredProducts = productsToShow.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
      </div>
    );
  }
  
  if (status === 'unauthenticated') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-pink-50" />}>
        <LandingView />
      </Suspense>
    );
  }

  // --- PEMBARUAN DI SINI: Menambahkan Kategori 'Request' ---
  const categories = [
    { name: 'Gelang', icon: CircleDashed, href: '/products?category=Gelang', color: 'text-pink-600', bg: 'bg-pink-100', border: 'border-pink-200' },
    { name: 'Kalung', icon: Gem, href: '/products?category=Kalung', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
    { name: 'Cincin', icon: Sparkles, href: '/products?category=Cincin', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
    { name: 'Keychain', icon: Key, href: '/products?category=Keychain', color: 'text-teal-600', bg: 'bg-teal-100', border: 'border-teal-200' },
    { name: 'Strap HP', icon: Smartphone, href: '/products?category=Strap Handphone', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
    { name: 'Jam Manik', icon: Watch, href: '/products?category=Jam Manik', color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200' },
    // Kategori Request Baru
    { name: 'Request', icon: PenTool, href: '/products?category=Request', color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200' },
  ];
  // --------------------------------------------------------

  return (
    <div className="min-h-screen text-stone-800 pb-20 relative">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 pt-4 md:pt-8 space-y-12">
        
        {/* HERO SECTION */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-pink-500/10 group"
        >
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl border border-white/60 z-0"></div>
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 animate-pulse"></div>
          
          {/* Floating Particles Animation */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
             {[...Array(6)].map((_, i) => (
                <motion.div
                   key={i}
                   className="absolute bg-white/40 rounded-full blur-sm"
                   initial={{ 
                      x: Math.random() * 100 + "%", 
                      y: Math.random() * 100 + "%", 
                      scale: Math.random() * 0.5 + 0.5,
                      opacity: 0.3
                   }}
                   animate={{ 
                      y: [null, Math.random() * -100 + "px"],
                      x: [null, (Math.random() - 0.5) * 50 + "px"],
                      opacity: [0.3, 0.6, 0.3]
                   }}
                   transition={{ 
                      duration: Math.random() * 5 + 5, 
                      repeat: Infinity, 
                      ease: "linear"
                   }}
                   style={{
                      width: Math.random() * 20 + 10 + "px",
                      height: Math.random() * 20 + 10 + "px",
                   }}
                />
             ))}
          </div>

          <div className="relative z-10 p-8 md:p-14 flex flex-col items-center text-center space-y-6">
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/60 border border-white/60 shadow-sm backdrop-blur-md mb-6"
             >
                <Sparkles className="w-4 h-4 text-pink-600 animate-[spin_4s_linear_infinite]" />
                <span className="text-sm font-bold uppercase tracking-[0.2em] text-pink-900/80">
                  SELAMAT DATANG
                </span>
             </motion.div>

             <div className="relative z-10">
                <motion.h1 
                  className="text-5xl md:text-7xl font-lora font-bold text-stone-900 leading-tight tracking-tighter mb-4 relative drop-shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  Celle<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 font-serif italic pr-2">beads</span>.
                </motion.h1>
                
                {/* Decorative underline */}
                <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: "80px" }}
                   transition={{ duration: 1, delay: 0.8 }}
                   className="h-1.5 bg-stone-800 mx-auto rounded-full mb-8 opacity-80"
                ></motion.div>
             </div>

             <motion.p
               className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               transition={{ duration: 0.8, delay: 0.5 }}
             >
               Beauty in every bead, stories in every strand. <br/>
               <span className="italic text-stone-500 font-normal">Menyempurnakan setiap momen berhargamu.</span>
             </motion.p>

             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="w-full max-w-2xl p-8 rounded-[2rem] bg-gradient-to-br from-white/60 to-white/30 backdrop-blur-md border border-white/80 shadow-[0_10px_40px_rgba(255,192,203,0.2)] relative group overflow-hidden hover:shadow-[0_15px_50px_rgba(255,192,203,0.3)] transition-shadow duration-500"
             >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-60"></div>
                <div className="relative z-10">
                   <p className="text-lg font-lora text-stone-800 leading-loose italic">
                      "Selamat datang di dunia Cellebeads. Kami menghadirkan aksesoris manik 
                      <span className="font-bold text-pink-700 mx-1 not-italic border-b-2 border-pink-200">100% buatan tangan</span>
                      dengan desain yang siap mewarnai harimu. Temukan kilau unikmu di sini."
                   </p>
                </div>
             </motion.div>
          </div>
        </motion.div>


        {/* KEY FEATURES SECTION (NEW) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
           {/* Feature 1 */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-[2.5rem] text-center hover:shadow-xl hover:shadow-pink-100 transition-all duration-300 group"
           >
              <div className="w-16 h-16 mx-auto mb-6 bg-pink-100/80 rounded-2xl flex items-center justify-center text-pink-600 group-hover:scale-110 transition-transform duration-300">
                 <PenTool size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">100% Handmade</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Setiap gelang dan kalung dirangkai satu per satu dengan ketelitian tinggi oleh pengrajin kami.
              </p>
           </motion.div>

           {/* Feature 2 */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
             className="bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-[2.5rem] text-center hover:shadow-xl hover:shadow-purple-100 transition-all duration-300 group"
           >
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-100/80 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform duration-300">
                 <Sparkles size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Desain Unik</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Kombinasi warna dan model yang <em>fresh</em>, mengikuti tren terkini namun tetap <em>timeless</em>.
              </p>
           </motion.div>

           {/* Feature 3 */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.3 }}
             className="bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-[2.5rem] text-center hover:shadow-xl hover:shadow-teal-100 transition-all duration-300 group"
           >
              <div className="w-16 h-16 mx-auto mb-6 bg-teal-100/80 rounded-2xl flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform duration-300">
                 <Gem size={28} />
              </div>
              <h3 className="text-xl font-bold text-stone-900 mb-3">Kualitas Terbaik</h3>
              <p className="text-stone-500 text-sm leading-relaxed">
                Menggunakan bahan manik, tali, dan pengait premium yang awet dan nyaman dipakai.
              </p>
           </motion.div>
        </section>

        {/* KATEGORI PILIHAN */}
        <section>
           <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-2xl font-lora font-bold text-stone-800 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-pink-500 rounded-full"></div>
                Kategori Pilihan
              </h2>
              <Link href="/products" className="text-sm font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 group">
                Lihat Semua <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform"/>
              </Link>
           </div>

           {/* Grid Kategori diperbarui untuk mengakomodasi item baru */}
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
              {categories.map((cat, idx) => (
                <Link key={cat.name} href={cat.href}>
                  <motion.div 
                    whileHover={{ y: -5 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex flex-col items-center justify-center gap-3 p-5 rounded-[1.5rem] bg-white/60 border border-white shadow-sm hover:shadow-xl hover:shadow-pink-100/50 backdrop-blur-sm transition-all duration-300 h-full group"
                  >
                     <div className={`w-14 h-14 ${cat.bg} rounded-2xl flex items-center justify-center ${cat.color} shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                       <cat.icon size={26} strokeWidth={1.5} />
                     </div>
                     <span className="font-bold text-stone-700 text-sm">{cat.name}</span>
                  </motion.div>
                </Link>
              ))}
           </div>
        </section>

        {/* PRODUK TERBARU */}
        <section>
           <div className="flex items-center gap-3 mb-8 px-2">
              <div className="p-2 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-lg text-white shadow-md">
                 <ShoppingBag size={20} />
              </div>
              <h2 className="text-2xl font-lora font-bold text-stone-800">
                 {searchTerm ? `Hasil Pencarian "${searchTerm}"` : "Koleksi Terbaru"}
              </h2>
           </div>

           <div className="bg-white/40 backdrop-blur-md p-6 md:p-8 rounded-[2rem] border border-white/50 shadow-sm min-h-[400px]">
              {loadingProducts ? (
                 <div className="flex justify-center py-20">
                    <Loader2 className="w-8 h-8 text-pink-400 animate-spin" />
                 </div>
              ) : filteredProducts.length > 0 ? (
                 <ProductGrid products={searchTerm ? filteredProducts : filteredProducts.slice(0, 8)} />
              ) : (
                 <div className="text-center py-20 text-stone-400">
                    <p className="font-lora italic text-lg">Produk tidak ditemukan.</p>
                 </div>
              )}

              {!searchTerm && !loadingProducts && (
                 <div className="mt-10 text-center">
                    <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-2 border-stone-200 text-stone-600 hover:border-pink-300 hover:text-pink-600 hover:bg-white bg-transparent h-12 font-bold transition-all">
                       <Link href="/products">Lihat Semua Koleksi</Link>
                    </Button>
                 </div>
              )}
           </div>
        </section>

        {/* PROMO BANNER */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="relative rounded-[2rem] overflow-hidden bg-stone-900 text-white p-8 md:p-12 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-stone-200"
        >
           <div className="absolute top-0 right-0 w-64 h-64 bg-pink-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500 rounded-full blur-[80px] opacity-20 pointer-events-none"></div>
           
           <div className="relative z-10 space-y-4 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 border border-pink-500/30 text-pink-300 text-xs font-bold uppercase tracking-widest">
                 <Heart size={12} className="fill-current" /> Member Special
              </div>
              <h3 className="text-3xl md:text-4xl font-lora font-bold leading-tight">
                 Dapatkan Diskon Spesial untuk Pembelian Pertama!
              </h3>
              <p className="text-stone-400">Daftar sekarang dan nikmati potongan harga eksklusif untuk member baru.</p>
           </div>

           <div className="relative z-10 flex-shrink-0">
              <Button asChild size="lg" className="bg-white text-stone-900 hover:bg-pink-50 font-bold rounded-xl h-14 px-8 shadow-xl">
                 <Link href="/products">Belanja Sekarang</Link>
              </Button>
           </div>
        </motion.div>

      </div>
    </div>
  );
}