// File: app/products/ProductCard.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { IProduct } from '@/app/admin/products/actions';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProductCard({ product }: { product: IProduct }) {
  const formatPrice = (price: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(price);

  // Jika ada displayPrice (Rentang), gunakan itu.
  const priceLabel = product.displayPrice 
    ? <span className="text-sm font-bold">{product.displayPrice}</span> 
    : <span className="text-lg font-bold">{formatPrice(product.price)}</span>;

  return (
    <Link href={`/products/${product._id}`} className="group h-full block">
      <motion.div 
        whileHover={{ y: -8 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="h-full bg-white rounded-3xl overflow-hidden border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-300 flex flex-col relative"
      >
        <div className="relative aspect-square overflow-hidden bg-stone-50">
           {product.images && product.images.length > 0 ? (
             <Image src={product.images[0]} alt={product.name} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
           ) : ( <div className="w-full h-full flex items-center justify-center text-stone-300">No Image</div> )}
           
           <div className="absolute top-3 left-3">
              <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-stone-600 shadow-sm">{product.category}</span>
           </div>

           <div className="absolute bottom-3 right-3 translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
              <div className="bg-white text-stone-800 p-3 rounded-full shadow-lg hover:bg-pink-600 hover:text-white transition-colors">
                 <ShoppingCart size={18} />
              </div>
           </div>
        </div>

        <div className="p-5 flex flex-col flex-grow">
           <h3 className="font-lora font-bold text-lg text-stone-800 line-clamp-1 group-hover:text-pink-600 transition-colors mb-1">{product.name}</h3>
           <p className="text-xs text-stone-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
           <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed border-stone-100">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">{priceLabel}</div>
              <span className="text-[10px] font-medium text-stone-400 bg-stone-50 px-2 py-1 rounded">Stok: {product.stock}</span>
           </div>
        </div>
      </motion.div>
    </Link>
  );
}