// File: app/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, Sparkles, Gem, CircleDashed, Key, 
  Smartphone, Watch, ArrowRight, ShoppingBag, Heart 
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProducts, IProduct } from '@/app/admin/products/actions'; 
import ProductGrid from '@/app/products/ProductGrid'; 
import LandingView from '@/components/LandingView'; 
import { Loader2 } from 'lucide-react';

// --- 1. BACKGROUND ANIMASI (SAMA DENGAN ADMIN) ---
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

  // Fetch Data Produk
  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts();
      setProductsToShow(data);
      setLoadingProducts(false);
    };
    if (status === 'authenticated') fetchData();
  }, [status]);

  // Filter Produk Client-Side (Sederhana)
  const filteredProducts = productsToShow.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Loading Screen Awal
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
      </div>
    );
  }
  
  // Jika Belum Login -> Tampilkan Landing Page
  if (status === 'unauthenticated') {
    return <LandingView />;
  }

  // Kategori dengan Icon & Warna Admin Style
  const categories = [
    { name: 'Gelang', icon: CircleDashed, href: '/products?category=Gelang', color: 'text-pink-600', bg: 'bg-pink-100', border: 'border-pink-200' },
    { name: 'Kalung', icon: Gem, href: '/products?category=Kalung', color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
    { name: 'Cincin', icon: Sparkles, href: '/products?category=Cincin', color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200' },
    { name: 'Keychain', icon: Key, href: '/products?category=Keychain', color: 'text-teal-600', bg: 'bg-teal-100', border: 'border-teal-200' },
    { name: 'Strap HP', icon: Smartphone, href: '/products?category=Strap Handphone', color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
    { name: 'Jam Manik', icon: Watch, href: '/products?category=Jam Manik', color: 'text-rose-600', bg: 'bg-rose-100', border: 'border-rose-200' },
  ];

  return (
    <div className="min-h-screen text-stone-800 pb-20 relative">
      <AnimatedBackground />
      
      <div className="container mx-auto px-4 pt-4 md:pt-8 space-y-12">
        
        {/* --- HERO SECTION: GLASS CARD MEWAH --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-[2.5rem] shadow-2xl shadow-pink-500/10 group"
        >
          {/* Layer Glass Super */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-xl border border-white/60 z-0"></div>
          
          {/* Dekorasi Gradient Halus */}
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-pink-400/20 to-purple-400/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>

          <div className="relative z-10 p-8 md:p-14 flex flex-col items-center text-center space-y-6">
             
             {/* Greeting Badge */}
             <motion.div 
               initial={{ scale: 0.9, opacity: 0 }}
               animate={{ scale: 1, opacity: 1 }}
               transition={{ delay: 0.2 }}
               className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 border border-pink-100 shadow-sm backdrop-blur-md"
             >
                <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-stone-500">
                  Selamat Datang, {session?.user?.name?.split(' ')[0]}
                </span>
             </motion.div>

             <h1 className="text-4xl md:text-6xl font-lora font-bold text-stone-800 leading-tight">
               Temukan Kilau <br className="hidden md:block" />
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-500 to-rose-500">
                 Gaya Unikmu.
               </span>
             </h1>

             <p className="text-lg text-stone-600 max-w-xl mx-auto leading-relaxed">
               Koleksi aksesoris handmade eksklusif yang dirancang untuk menyempurnakan setiap momen bahagiamu.
             </p>

             {/* Search Bar Floating */}
             <div className="w-full max-w-lg relative group/search mt-4">
                <div className="absolute inset-0 bg-gradient-to-r from-pink-300 to-purple-300 rounded-full blur opacity-20 group-hover/search:opacity-40 transition-opacity duration-500"></div>
                <div className="relative flex items-center bg-white/80 backdrop-blur-md rounded-full px-2 py-2 border border-white shadow-lg transition-transform transform group-hover/search:scale-[1.02]">
                   <div className="pl-4 text-stone-400">
                      <Search size={20} />
                   </div>
                   <Input 
                      placeholder="Cari 'Gelang Mutiara'..." 
                      className="border-none shadow-none focus-visible:ring-0 bg-transparent h-10 text-base px-3"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                   />
                   <Button size="icon" className="rounded-full bg-stone-900 hover:bg-pink-600 text-white w-10 h-10 shadow-md transition-colors">
                      <ArrowRight size={18} />
                   </Button>
                </div>
             </div>
          </div>
        </motion.div>

        {/* --- KATEGORI: WIDGET STYLE --- */}
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

           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
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

        {/* --- PRODUK TERBARU --- */}
        <section>
           <div className="flex items-center gap-3 mb-8 px-2">
              <div className="p-2 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-lg text-white shadow-md">
                 <ShoppingBag size={20} />
              </div>
              <h2 className="text-2xl font-lora font-bold text-stone-800">
                 {searchTerm ? `Hasil Pencarian "${searchTerm}"` : "Koleksi Terbaru"}
              </h2>
           </div>

           {/* Container Grid dengan Glass Effect */}
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

              {/* Tombol Lihat Semua (Jika tidak sedang mencari) */}
              {!searchTerm && !loadingProducts && (
                 <div className="mt-10 text-center">
                    <Button asChild size="lg" variant="outline" className="rounded-full px-8 border-2 border-stone-200 text-stone-600 hover:border-pink-300 hover:text-pink-600 hover:bg-white bg-transparent h-12 font-bold transition-all">
                       <Link href="/products">Lihat Semua Koleksi</Link>
                    </Button>
                 </div>
              )}
           </div>
        </section>

        {/* --- PROMO BANNER (FOOTER DECORATION) --- */}
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