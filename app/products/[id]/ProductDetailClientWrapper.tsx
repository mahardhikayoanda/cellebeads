// File: app/products/[id]/ProductDetailClientWrapper.tsx
'use client';

import { motion } from 'framer-motion';
import { IProduct } from '@/app/admin/products/actions';
import ProductGallery from '@/components/ProductGallery';
import { Badge } from '@/components/ui/badge';
import AddToCartClient from './AddToCartClient';

// Varian untuk galeri (muncul dari kiri)
const galleryVariant = {
  hidden: { opacity: 0, x: -50 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { type: 'spring', stiffness: 100, delay: 0.1 }
  }
};

// Varian untuk kontainer info (muncul dari kanan + stagger)
const infoContainerVariant = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { 
      type: 'spring', 
      stiffness: 100, 
      delay: 0.2,
      staggerChildren: 0.1 // Animasi anak-anaknya satu per satu
    }
  }
};

// Varian untuk setiap anak di kontainer info
const infoChildVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function ProductDetailClientWrapper({ product }: { product: IProduct }) {
  
  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        
        {/* KIRI: Galeri Foto (Dianimasikan) */}
        <motion.div
          variants={galleryVariant}
          initial="hidden"
          animate="visible"
        >
           <ProductGallery images={product.images} productName={product.name} />
        </motion.div>

        {/* KANAN: Detail Produk (Dianimasikan) */}
        <motion.div 
          className="flex flex-col justify-start space-y-6"
          variants={infoContainerVariant}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={infoChildVariant}>
            <h1 className="text-4xl font-lora font-semibold text-stone-900 mb-2">
              {product.name}
            </h1>
            <p className="text-3xl font-light text-primary">
              Rp {product.price.toLocaleString('id-ID')}
            </p>
          </motion.div>

          <motion.div variants={infoChildVariant}>
            {product.stock > 0 ? (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                Stok Tersedia: {product.stock}
              </Badge>
            ) : (
              <Badge variant="destructive">Stok Habis</Badge>
            )}
          </motion.div>

          <motion.div variants={infoChildVariant} className="text-stone-600 space-y-2">
            <h3 className="text-lg font-medium text-stone-800 border-b pb-1">Deskripsi</h3>
            <p style={{ whiteSpace: 'pre-wrap' }} className="leading-relaxed">
              {product.description}
            </p>
          </motion.div>

          <motion.div variants={infoChildVariant} className="pt-4">
            <AddToCartClient product={product} />
          </motion.div>
          
        </motion.div>
      </div>
    </div>
  );
}