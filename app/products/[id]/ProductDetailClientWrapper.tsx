// File: app/products/[id]/ProductDetailClientWrapper.tsx
'use client';

import { motion } from 'framer-motion';
import { IProduct } from '@/app/admin/products/actions';
import ProductGallery from '@/components/ProductGallery';
import { Badge } from '@/components/ui/badge';
import AddToCartClient from './AddToCartClient';
import ReviewList from '@/components/ReviewList'; // Pastikan path import benar
import { ArrowLeft, Star, ShieldCheck, Truck } from 'lucide-react';
import Link from 'next/link';

// Background Animasi (Konsisten dengan halaman lain)
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fff0f5] pointer-events-none">
    <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
  </div>
);

export default function ProductDetailClientWrapper({ product, reviews }: { product: IProduct, reviews: any[] }) {
  
  // Hitung rata-rata rating untuk ditampilkan di atas
  const avgRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  return (
    <div className="min-h-screen pb-20 relative text-stone-800">
      <AnimatedBackground />

      <div className="container mx-auto px-4 pt-6 md:pt-10 max-w-6xl">
        
        {/* Breadcrumb / Back Button */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <Link href="/products" className="inline-flex items-center text-sm font-medium text-stone-500 hover:text-pink-600 transition-colors group">
            <ArrowLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
            Kembali ke Koleksi
          </Link>
        </motion.div>

        {/* --- MAIN PRODUCT CARD (GLASS) --- */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-2xl shadow-pink-100/50 overflow-hidden p-6 md:p-10 lg:p-12 mb-12"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            
            {/* KIRI: Galeri Foto */}
            <div>
               <ProductGallery images={product.images} productName={product.name} />
            </div>

            {/* KANAN: Detail Info */}
            <div className="flex flex-col justify-center space-y-8">
              <div>
                <div className="flex items-center gap-2 mb-3">
                   <Badge variant="outline" className="border-pink-200 text-pink-600 bg-pink-50 uppercase tracking-widest text-[10px] px-2 py-1">
                      {product.category}
                   </Badge>
                   {reviews.length > 0 && (
                     <div className="flex items-center text-xs font-bold text-stone-500 bg-white/50 px-2 py-1 rounded-full border border-stone-100">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                        {avgRating.toFixed(1)} ({reviews.length} ulasan)
                     </div>
                   )}
                </div>

                <h1 className="text-4xl md:text-5xl font-lora font-bold text-stone-800 leading-tight mb-4">
                  {product.name}
                </h1>
                
                <p className="text-3xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                  Rp {product.price.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-stone-200 to-transparent"></div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-stone-400">Tentang Produk</h3>
                <p className="text-stone-600 leading-relaxed text-lg whitespace-pre-wrap font-lora">
                  {product.description}
                </p>
              </div>

              {/* Action Area */}
              <div className="bg-white/50 p-6 rounded-2xl border border-white shadow-sm">
                 <AddToCartClient product={product} />
              </div>
            </div>
          </div>
        </motion.div>

        {/* --- REVIEWS SECTION --- */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto"
        >
           <h2 className="text-3xl font-lora font-bold text-stone-800 mb-8 text-center flex items-center justify-center gap-3">
              <span className="w-12 h-px bg-stone-300"></span>
              Ulasan Pembeli
              <span className="w-12 h-px bg-stone-300"></span>
           </h2>
           
           <div className="bg-white/40 backdrop-blur-md rounded-3xl p-8 border border-white/50 shadow-lg">
              <ReviewList reviews={reviews} />
           </div>
        </motion.div>

      </div>
    </div>
  );
}