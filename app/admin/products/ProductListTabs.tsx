// File: app/admin/products/ProductListTabs.tsx
'use client';

import { IProduct } from './actions';
import ProductActions from './ProductActions';
import Image from 'next/image';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, PackageOpen, Sparkles } from 'lucide-react';

const categories = ['Semua', 'Gelang', 'Kalung', 'Cincin', 'Keychain', 'Strap Handphone', 'Jam Manik'];

export default function ProductListTabs({ products }: { products: IProduct[] }) {
  
  const getFilteredProducts = (category: string) => {
    if (category === 'Semua') return products;
    return products.filter(p => p.category === category);
  };

  return (
    <Tabs defaultValue="Semua" className="w-full">
      
      {/* Header Tabs yang Lebih Cantik */}
      <div className="mb-8 overflow-x-auto pb-4 scrollbar-hide">
        <TabsList className="flex h-auto w-max gap-3 bg-transparent p-0">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat} 
              value={cat}
              className="rounded-full border border-pink-100 bg-white/60 backdrop-blur-md px-6 py-2.5 text-sm font-lora font-medium text-stone-600 shadow-sm transition-all 
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-600 data-[state=active]:to-rose-500 
              data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-pink-500/30 data-[state=active]:scale-105 hover:bg-white"
            >
              {cat === 'Semua' && <LayoutGrid size={14} className="mr-2" />}
              {cat}
              <span className="ml-2 text-[10px] bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                {getFilteredProducts(cat).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Konten Tabel Glassmorphism */}
      {categories.map((cat) => {
        const filteredProducts = getFilteredProducts(cat);

        return (
          <TabsContent key={cat} value={cat} className="mt-0">
            {filteredProducts.length > 0 ? (
              <div className="glass-super rounded-3xl overflow-hidden">
                
                <div className="overflow-x-auto">
                  <Table className="min-w-[900px]">
                    <TableHeader className="bg-pink-50/50">
                      <TableRow className="hover:bg-transparent border-pink-100">
                        <TableHead className="pl-8 w-[120px] font-lora font-bold text-stone-700">Foto</TableHead>
                        <TableHead className="font-lora font-bold text-stone-700">Nama Produk</TableHead>
                        <TableHead className="hidden md:table-cell font-lora font-bold text-stone-700">Deskripsi</TableHead>
                        <TableHead className="text-right font-lora font-bold text-stone-700">Harga</TableHead>
                        <TableHead className="text-center font-lora font-bold text-stone-700">Stok</TableHead>
                        <TableHead className="text-center pr-8 font-lora font-bold text-stone-700">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    
                    <motion.tbody 
                      initial="hidden" 
                      animate="visible" 
                      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
                    >
                      <AnimatePresence mode='popLayout'>
                        {filteredProducts.map((product) => (
                          <motion.tr 
                            key={product._id}
                            layout 
                            variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="hover:bg-pink-50/40 border-pink-50 transition-colors group"
                          >
                            <TableCell className="pl-8 py-4">
                              <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-md group-hover:scale-110 transition-transform duration-500 group-hover:shadow-pink-200">
                                <Image 
                                  src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-banner.jpg'} 
                                  alt={product.name} fill className="object-cover"
                                />
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="font-lora font-bold text-stone-800 text-lg group-hover:text-pink-600 transition-colors whitespace-nowrap">
                                  {product.name}
                                </span>
                                <span className="text-xs text-stone-400 mt-1 font-bold uppercase tracking-widest bg-stone-100 px-2 py-0.5 rounded-md w-fit">
                                  {product.category}
                                </span>
                              </div>
                            </TableCell>

                            <TableCell className="hidden md:table-cell max-w-xs">
                              <p className="truncate text-stone-500 text-sm italic" title={product.description}>
                                "{product.description}"
                              </p>
                            </TableCell>

                            <TableCell className="text-right font-sans text-stone-700 font-bold whitespace-nowrap text-base">
                              Rp {product.price.toLocaleString('id-ID')}
                            </TableCell>

                            <TableCell className="text-center">
                              {product.stock > 5 ? (
                                 <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-emerald-200 font-medium whitespace-nowrap px-3 py-1">
                                   Ready: {product.stock}
                                 </Badge>
                              ) : product.stock > 0 ? (
                                 <Badge variant="secondary" className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-amber-200 font-medium whitespace-nowrap animate-pulse px-3 py-1">
                                   Sisa {product.stock}
                                 </Badge>
                              ) : (
                                 <Badge variant="destructive" className="bg-rose-100 text-rose-600 border-rose-200 hover:bg-rose-200 font-medium shadow-none whitespace-nowrap px-3 py-1">
                                   Habis
                                 </Badge>
                              )}
                            </TableCell>

                            <TableCell className="text-center pr-8">
                               <ProductActions product={product} />
                            </TableCell>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </motion.tbody>
                  </Table>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 glass-super rounded-3xl border-dashed border-2 border-pink-200">
                <div className="p-6 bg-pink-50 rounded-full mb-4 animate-bounce">
                  <Sparkles className="w-10 h-10 text-pink-300" />
                </div>
                <p className="text-stone-600 font-lora font-bold text-lg">Belum ada koleksi di sini.</p>
                <p className="text-stone-400 text-sm">Tambahkan produk baru agar etalase makin cantik!</p>
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}