// File: app/products/ProductGrid.tsx (BUAT FILE BARU INI)
'use client';

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import { IProduct } from '@/app/admin/products/actions';

interface ProductGridProps {
  products: IProduct[];
}

// 1. Varian untuk container grid
const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1 // Efek stagger: setiap anak muncul dengan jeda 0.1 detik
    }
  }
};

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <motion.div 
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6"
      variants={gridVariants} // Terapkan varian container
      initial="hidden"
      animate="visible"
    >
      {/* ProductCard sudah memiliki varian 'hidden' dan 'visible' 
        dari Langkah 2, jadi dia akan otomatis mengikuti animasi 'staggerChildren' 
      */}
      {products.map(product => (
        <ProductCard key={product._id} product={product} />
      ))}
    </motion.div>
  );
}