// File: app/admin/reviews/ReviewTabs.tsx
'use client';

import { useState } from 'react';
import { IReviewPopulated } from './actions';
import ReviewAdminCard from './ReviewAdminCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid } from 'lucide-react';

export default function ReviewTabs({ reviews }: { reviews: IReviewPopulated[] }) {
  // Daftar Kategori sesuai Product.js
  const categories = ['Semua', 'Gelang', 'Kalung', 'Cincin', 'Keychain', 'Strap Handphone', 'Jam Manik'];

  // Helper: Hitung ulasan yang BELUM DIBALAS (adminReply kosong)
  const getUnrepliedCount = (category: string) => {
    return reviews.filter(r => {
      const matchesCategory = category === 'Semua' || r.product?.category === category;
      const isUnreplied = !r.adminReply; // Belum ada balasan
      return matchesCategory && isUnreplied;
    }).length;
  };

  // Helper: Filter ulasan untuk ditampilkan
  const getReviewsByCategory = (category: string) => {
    return reviews.filter(r => category === 'Semua' || r.product?.category === category);
  };

  return (
    <Tabs defaultValue="Semua" className="w-full">
      {/* Tab Navigasi Kategori */}
      <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 mb-6 justify-start">
        {categories.map((cat) => {
          const count = getUnrepliedCount(cat);
          return (
            <TabsTrigger 
              key={cat} 
              value={cat}
              className="rounded-full border border-stone-200 bg-white px-4 py-2 data-[state=active]:bg-stone-800 data-[state=active]:text-white data-[state=active]:border-stone-800 hover:border-stone-300 transition-all relative"
            >
              {cat === 'Semua' && <LayoutGrid size={14} className="mr-2" />}
              {cat}
              
              {/* Badge Notifikasi (Hanya muncul jika ada ulasan belum dibalas) */}
              {count > 0 && (
                <Badge 
                  className="absolute -top-2 -right-1 h-5 w-5 flex items-center justify-center rounded-full bg-rose-500 text-[10px] border-2 border-white shadow-sm hover:bg-rose-600 p-0"
                >
                  {count}
                </Badge>
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>

      {/* Konten Tab */}
      {categories.map((cat) => {
        const filteredReviews = getReviewsByCategory(cat);
        
        return (
          <TabsContent key={cat} value={cat} className="mt-0">
            {filteredReviews.length > 0 ? (
              <motion.div 
                className="grid gap-6"
                initial="hidden"
                animate="visible"
                variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
              >
                <AnimatePresence mode='popLayout'>
                  {filteredReviews.map((review) => (
                    <motion.div
                      key={review._id}
                      layout
                      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                      exit={{ opacity: 0, scale: 0.95 }}
                    >
                      <ReviewAdminCard review={review} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-stone-200">
                <p className="text-stone-400 text-sm">Tidak ada ulasan di kategori <span className="font-semibold text-stone-600">{cat}</span>.</p>
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}