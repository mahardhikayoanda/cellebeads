'use client';

import { useState } from 'react';
import Image from 'next/image';
import { IStockItem, updateStock } from './actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Minus, Save, RefreshCw, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function StockClient({ initialProducts }: { initialProducts: IStockItem[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // State untuk stok sementara (sebelum disimpan)
  const [tempStocks, setTempStocks] = useState<{ [key: string]: number }>({});

  const categories = ['Semua', 'Gelang', 'Kalung', 'Cincin', 'Keychain', 'Strap Handphone', 'Jam Manik'];

  // Filter Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  // Handle Change Input Manual
  const handleStockChange = (id: string, val: string) => {
    const num = parseInt(val);
    if (!isNaN(num) && num >= 0) {
      setTempStocks(prev => ({ ...prev, [id]: num }));
    }
  };

  // Handle Tombol Plus/Minus
  const adjustStock = (id: string, currentStock: number, amount: number) => {
    const currentTemp = tempStocks[id] !== undefined ? tempStocks[id] : currentStock;
    const newVal = currentTemp + amount;
    if (newVal >= 0) {
      setTempStocks(prev => ({ ...prev, [id]: newVal }));
    }
  };

  // Simpan ke Server
  const saveStock = async (id: string) => {
    const newStock = tempStocks[id];
    if (newStock === undefined) return; // Tidak ada perubahan

    setLoadingId(id);
    const res = await updateStock(id, newStock);
    
    if (res.success) {
      // Update state produk utama agar UI sync
      setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));
      // Hapus dari temp
      setTempStocks(prev => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      // Feedback visual (Ganti alert dengan toast jika mau lebih cantik)
      // alert("Stok tersimpan!"); 
    } else {
      alert("Gagal: " + res.message);
    }
    setLoadingId(null);
  };

  return (
    <div className="space-y-6">
      
      {/* Toolbar: Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
           <Search className="absolute left-4 top-3.5 text-stone-400 h-5 w-5" />
           <Input 
             placeholder="Cari nama produk..." 
             className="pl-12 h-12 bg-white border-stone-200 rounded-2xl focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin">
           {categories.map(cat => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                 activeCategory === cat 
                   ? 'bg-stone-800 text-white shadow-lg shadow-stone-800/20' 
                   : 'bg-white text-stone-500 hover:bg-pink-50 hover:text-primary border border-stone-100'
               }`}
             >
               {cat}
             </button>
           ))}
        </div>
      </div>

      {/* Grid Card Stok */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        layout
      >
        <AnimatePresence>
          {filteredProducts.map((item) => {
            const isChanged = tempStocks[item._id] !== undefined && tempStocks[item._id] !== item.stock;
            const displayStock = tempStocks[item._id] !== undefined ? tempStocks[item._id] : item.stock;
            const isLow = displayStock < 5;

            return (
              <motion.div
                key={item._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card className={`border-none shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${isChanged ? 'ring-2 ring-primary/50 bg-pink-50/30' : 'bg-white'}`}>
                  <CardContent className="p-4 flex items-center gap-4">
                    {/* Gambar */}
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 bg-stone-100">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      {isLow && (
                        <div className="absolute bottom-0 left-0 right-0 bg-rose-500 text-white text-[10px] font-bold text-center py-0.5">
                          MENIPIS
                        </div>
                      )}
                    </div>

                    {/* Info & Kontrol */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                           <h3 className="font-bold text-stone-800 truncate pr-2" title={item.name}>{item.name}</h3>
                           <p className="text-xs text-stone-400 uppercase tracking-wide">{item.category}</p>
                        </div>
                        {isChanged && (
                          <Button 
                            size="icon" 
                            className="h-8 w-8 rounded-full bg-primary hover:bg-pink-600 shadow-lg shadow-pink-200"
                            onClick={() => saveStock(item._id)}
                            disabled={loadingId === item._id}
                          >
                            {loadingId === item._id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                          </Button>
                        )}
                      </div>

                      {/* Stok Control */}
                      <div className="flex items-center gap-2 bg-stone-50 rounded-xl p-1 border border-stone-100 w-fit">
                        <button 
                          onClick={() => adjustStock(item._id, item.stock, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:text-rose-500 text-stone-400 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        
                        <input 
                          type="number" 
                          className="w-12 text-center bg-transparent border-none p-0 font-bold text-stone-800 focus:ring-0 [appearance:textfield]"
                          value={displayStock}
                          onChange={(e) => handleStockChange(item._id, e.target.value)}
                        />

                        <button 
                          onClick={() => adjustStock(item._id, item.stock, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white hover:text-emerald-500 text-stone-400 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
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
        <div className="text-center py-20 text-stone-400 bg-white/50 rounded-3xl border border-dashed border-stone-200">
          <p>Tidak ada produk yang ditemukan.</p>
        </div>
      )}
    </div>
  );
}