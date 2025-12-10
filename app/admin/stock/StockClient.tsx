'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IStockItem } from './actions';
import { Input } from '@/components/ui/input';
import { Search, Box, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function StockClient({ initialProducts }: { initialProducts: IStockItem[] }) {
  const [products] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');

  const categories = ['Semua', 'Gelang', 'Kalung', 'Cincin', 'Keychain', 'Strap Handphone', 'Jam Manik'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      
      {/* Search & Filter Bar */}
      {/* [UBAH 1] Tambahkan border-pink-200 pada container utama pencarian */}
      <div className="flex flex-col md:flex-row gap-6 p-4 glass-super rounded-3xl border border-pink-200 shadow-sm">
        <div className="relative flex-1">
           <Search className="absolute left-4 top-3.5 text-pink-400 h-5 w-5" />
           {/* [UBAH 2] Border Input jadi pink-200 */}
           <Input 
             placeholder="Cari koleksi untuk cek stok..." 
             className="pl-12 h-12 bg-white/50 border-pink-200 rounded-2xl focus:ring-pink-300 focus:border-pink-300 transition-all font-lora text-stone-700"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin items-center">
           {categories.map(cat => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               /* [UBAH 3] Border tombol kategori jadi border-pink-200 (sebelumnya border-stone-100) */
               className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                 activeCategory === cat 
                   ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 transform scale-105 border border-transparent' 
                   : 'bg-white text-stone-500 hover:text-pink-600 hover:bg-pink-50 border border-pink-200'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Grid Card Stok */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        layout
      >
        <AnimatePresence>
          {filteredProducts.map((item) => {
            const isLow = item.stock < 5;
            const isEmpty = item.stock === 0;

            return (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                {/* [UBAH 4] Tambahkan border-pink-100 pada Kartu Produk (sebelumnya border-none) */}
                <Card className={`border border-pink-100 shadow-lg hover-float overflow-hidden relative group bg-white/80 backdrop-blur-sm ${isEmpty ? 'opacity-80 grayscale-[0.5]' : ''}`}>
                  
                  <div className="absolute -right-10 -top-10 w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-700 blur-xl pointer-events-none" />

                  <CardContent className="p-5 flex items-center gap-5 relative z-10">
                    {/* Gambar Produk */}
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                      <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      
                      {isEmpty ? (
                         <div className="absolute inset-0 bg-stone-800/80 backdrop-blur-[1px] flex items-center justify-center">
                            <span className="text-white text-[10px] font-bold uppercase tracking-widest text-center px-1">Habis</span>
                         </div>
                      ) : isLow && (
                        <div className="absolute inset-0 bg-rose-500/80 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold uppercase tracking-widest">Low</span>
                        </div>
                      )}
                    </div>

                    {/* Info Produk */}
                    <div className="flex-grow min-w-0">
                      <div className="mb-2">
                           <h3 className="font-lora font-bold text-stone-800 text-lg truncate leading-tight" title={item.name}>{item.name}</h3>
                           <p className="text-xs text-pink-500 font-bold uppercase tracking-wider mt-1">{item.category}</p>
                      </div>

                      {/* TAMPILAN STOK READ-ONLY */}
                      <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border w-fit shadow-sm transition-colors ${
                          isEmpty 
                            ? 'bg-stone-100 border-stone-200 text-stone-400' 
                            : isLow 
                                ? 'bg-rose-50 border-rose-100 text-rose-600' 
                                : 'bg-white border-pink-200 text-stone-700' 
                      }`}>
                        <div className="flex items-center gap-2">
                            {isLow || isEmpty ? <AlertCircle size={16} /> : <Box size={16} />}
                            <span className="text-xs font-bold uppercase tracking-wide">Sisa Stok:</span>
                        </div>
                        <span className="text-xl font-bold leading-none">
                            {item.stock}
                        </span>
                      </div>
                      
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-20 text-stone-400 glass-super rounded-3xl border border-pink-100">
          <p className="font-lora italic">Produk tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
}