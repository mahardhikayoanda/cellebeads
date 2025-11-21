// File: app/admin/products/ProductListTabs.tsx
'use client';

import { useState } from 'react';
import { IProduct } from './actions';
import ProductActions from './ProductActions';
import Image from 'next/image';
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutGrid, PackageOpen } from 'lucide-react';

// Daftar Kategori (Sesuaikan dengan Enum di Model Product)
const categories = ['Semua', 'Gelang', 'Kalung', 'Cincin', 'Keychain', 'Strap Handphone', 'Jam Manik'];

export default function ProductListTabs({ products }: { products: IProduct[] }) {
  
  // Helper untuk filter produk berdasarkan tab aktif
  const getFilteredProducts = (category: string) => {
    if (category === 'Semua') return products;
    return products.filter(p => p.category === category);
  };

  return (
    <Tabs defaultValue="Semua" className="w-full">
      
      {/* Header Tabs (Pills Style) */}
      <div className="mb-6 overflow-x-auto pb-2">
        <TabsList className="flex h-auto w-max gap-2 bg-transparent p-0">
          {categories.map((cat) => (
            <TabsTrigger 
              key={cat} 
              value={cat}
              className="rounded-full border border-stone-200 bg-white px-5 py-2 text-sm font-medium text-stone-600 shadow-sm transition-all 
              data-[state=active]:bg-stone-800 data-[state=active]:text-white data-[state=active]:border-stone-800 hover:bg-stone-50"
            >
              {cat === 'Semua' && <LayoutGrid size={14} className="mr-2" />}
              {cat}
              <span className="ml-2 text-[10px] opacity-60 bg-stone-200/50 px-1.5 py-0.5 rounded-md">
                {getFilteredProducts(cat).length}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {/* Konten Tabel per Kategori */}
      {categories.map((cat) => {
        const filteredProducts = getFilteredProducts(cat);

        return (
          <TabsContent key={cat} value={cat} className="mt-0">
            {filteredProducts.length > 0 ? (
              <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-stone-50/50">
                    <TableRow className="hover:bg-transparent border-stone-100">
                      <TableHead className="pl-6 w-[100px]">Foto</TableHead>
                      <TableHead className="font-semibold text-stone-600">Nama Produk</TableHead>
                      <TableHead className="hidden md:table-cell font-semibold text-stone-600">Deskripsi</TableHead>
                      <TableHead className="text-right font-semibold text-stone-600">Harga</TableHead>
                      <TableHead className="text-center font-semibold text-stone-600">Stok</TableHead>
                      <TableHead className="text-center pr-6 font-semibold text-stone-600">Aksi</TableHead>
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
                          layout // Animasi layout saat filter berubah
                          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="hover:bg-stone-50/40 border-stone-50 transition-colors group"
                        >
                          {/* Foto */}
                          <TableCell className="pl-6 py-4">
                            <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-stone-100 shadow-sm group-hover:scale-105 transition-transform bg-white">
                              <Image 
                                src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-banner.jpg'} 
                                alt={product.name} fill className="object-cover"
                              />
                            </div>
                          </TableCell>
                          
                          {/* Nama & Kategori */}
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-lora font-medium text-stone-800 text-base group-hover:text-primary transition-colors">
                                {product.name}
                              </span>
                              <span className="text-xs text-stone-400 mt-1 font-medium uppercase tracking-wider">
                                {product.category}
                              </span>
                            </div>
                          </TableCell>

                          {/* Deskripsi (Hidden di Mobile) */}
                          <TableCell className="hidden md:table-cell max-w-xs">
                            <p className="truncate text-stone-500 text-sm" title={product.description}>
                              {product.description}
                            </p>
                          </TableCell>

                          {/* Harga */}
                          <TableCell className="text-right font-mono text-stone-700 font-medium">
                            Rp {product.price.toLocaleString('id-ID')}
                          </TableCell>

                          {/* Stok dengan Badge Warna */}
                          <TableCell className="text-center">
                            {product.stock > 5 ? (
                               <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border-emerald-100 font-normal">
                                 {product.stock} Tersedia
                               </Badge>
                            ) : product.stock > 0 ? (
                               <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 hover:bg-yellow-100 border-yellow-100 font-normal">
                                 Sisa {product.stock}
                               </Badge>
                            ) : (
                               <Badge variant="destructive" className="bg-red-50 text-red-600 hover:bg-red-100 border-red-100 font-normal shadow-none">
                                 Habis
                               </Badge>
                            )}
                          </TableCell>

                          {/* Aksi */}
                          <TableCell className="text-center pr-6">
                             <ProductActions product={product} />
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </motion.tbody>
                </Table>
              </div>
            ) : (
              // Tampilan Kosong
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-stone-200">
                <div className="p-4 bg-stone-50 rounded-full mb-3">
                  <PackageOpen className="w-8 h-8 text-stone-300" />
                </div>
                <p className="text-stone-500 font-medium">Belum ada produk di kategori ini.</p>
                <p className="text-stone-400 text-sm">Silakan tambahkan produk baru di formulir atas.</p>
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}