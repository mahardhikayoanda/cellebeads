// File: app/admin/stock/StockClient.tsx
'use client';

// ... (Import tetap sama, pastikan ada motion)
import { useState } from 'react';
import Image from 'next/image';
import { IStockItem, updateStock } from './actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Minus, Save, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';

export default function StockClient({ initialProducts }: { initialProducts: IStockItem[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [tempStocks, setTempStocks] = useState<{ [key: string]: number }>({});

  const categories = ['Semua', 'Gelang', 'Kalung', 'Cincin', 'Keychain', 'Strap Handphone', 'Jam Manik'];

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || p.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleStockChange = (id: string, val: string) => {
    const num = parseInt(val);
    if (!isNaN(num) && num >= 0) setTempStocks(prev => ({ ...prev, [id]: num }));
  };

  const adjustStock = (id: string, currentStock: number, amount: number) => {
    const currentTemp = tempStocks[id] !== undefined ? tempStocks[id] : currentStock;
    const newVal = currentTemp + amount;
    if (newVal >= 0) setTempStocks(prev => ({ ...prev, [id]: newVal }));
  };

  const saveStock = async (id: string) => {
    const newStock = tempStocks[id];
    if (newStock === undefined) return;
    setLoadingId(id);
    const res = await updateStock(id, newStock);
    if (res.success) {
      setProducts(prev => prev.map(p => p._id === id ? { ...p, stock: newStock } : p));
      setTempStocks(prev => { const next = { ...prev }; delete next[id]; return next; });
    } else { alert("Gagal: " + res.message); }
    setLoadingId(null);
  };

  return (
    <div className="space-y-8">
      
      {/* Search & Filter Bar - Glass Style */}
      <div className="flex flex-col md:flex-row gap-6 p-4 glass-super rounded-3xl">
        <div className="relative flex-1">
           <Search className="absolute left-4 top-3.5 text-pink-400 h-5 w-5" />
           <Input 
             placeholder="Cari koleksi..." 
             className="pl-12 h-12 bg-white/50 border-pink-100 rounded-2xl focus:ring-pink-300 focus:border-pink-300 transition-all font-lora text-stone-700"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-thin items-center">
           {categories.map(cat => (
             <button
               key={cat}
               onClick={() => setActiveCategory(cat)}
               className={`px-5 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                 activeCategory === cat 
                   ? 'bg-gradient-to-r from-stone-800 to-stone-700 text-white shadow-lg shadow-stone-300 transform scale-105' 
                   : 'bg-white text-stone-500 hover:text-pink-600 hover:bg-pink-50 border border-stone-100'
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
                transition={{ duration: 0.3 }}
              >
                {/* KARTU STOK: Efek Kotak Perhiasan */}
                <Card className={`border-none shadow-lg hover-float overflow-hidden relative group ${isChanged ? 'ring-2 ring-pink-400 bg-pink-50/80' : 'bg-white/80 backdrop-blur-sm'}`}>
                  
                  {/* Decorative Background Blob */}
                  <div className="absolute -right-10 -top-10 w-24 h-24 bg-gradient-to-br from-pink-200 to-purple-200 rounded-full opacity-30 group-hover:scale-150 transition-transform duration-700 blur-xl pointer-events-none" />

                  <CardContent className="p-5 flex items-center gap-5 relative z-10">
                    {/* Gambar */}
                    <div className="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white shadow-md">
                      <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      {isLow && (
                        <div className="absolute inset-0 bg-rose-500/80 backdrop-blur-[2px] flex items-center justify-center">
                          <span className="text-white text-[10px] font-bold uppercase tracking-widest">Low Stock</span>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-3">
                        <div className="pr-2">
                           <h3 className="font-lora font-bold text-stone-800 text-lg truncate leading-tight" title={item.name}>{item.name}</h3>
                           <p className="text-xs text-pink-500 font-bold uppercase tracking-wider mt-1">{item.category}</p>
                        </div>
                        
                        {/* Tombol Simpan (Muncul jika berubah) */}
                        <AnimatePresence>
                          {isChanged && (
                            <motion.button 
                              initial={{ scale: 0, rotate: -180 }}
                              animate={{ scale: 1, rotate: 0 }}
                              exit={{ scale: 0 }}
                              className="h-9 w-9 flex items-center justify-center rounded-full bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-200 hover:shadow-xl transition-shadow"
                              onClick={() => saveStock(item._id)}
                              disabled={loadingId === item._id}
                            >
                              {loadingId === item._id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            </motion.button>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Kontrol Stok */}
                      <div className="flex items-center justify-between bg-white/60 rounded-xl p-1.5 border border-pink-100 shadow-inner">
                        <button 
                          onClick={() => adjustStock(item._id, item.stock, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-stone-400 hover:text-rose-500 hover:bg-rose-50 transition-colors shadow-sm"
                        >
                          <Minus size={14} />
                        </button>
                        
                        <input 
                          type="number" 
                          className="w-12 text-center bg-transparent border-none p-0 font-bold text-stone-800 text-lg focus:ring-0"
                          value={displayStock}
                          onChange={(e) => handleStockChange(item._id, e.target.value)}
                        />

                        <button 
                          onClick={() => adjustStock(item._id, item.stock, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white text-stone-400 hover:text-teal-500 hover:bg-teal-50 transition-colors shadow-sm"
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
        <div className="text-center py-20 text-stone-400 glass-super rounded-3xl">
          <p className="font-lora italic">Produk tidak ditemukan.</p>
        </div>
      )}
    </div>
  );
}