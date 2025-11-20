// File: app/HeroSection.tsx
'use client'; // <-- Wajib untuk animasi

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Varian animasi untuk teks
const textVariant = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 100, delay: 0.2 }
  }
};

// Varian animasi untuk deskripsi dan tombol
const contentVariant = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { type: 'spring', stiffness: 100, delay: 0.4 }
  }
};

export default function HeroSection() {
  return (
    <div className="relative z-10 text-center md:text-left md:w-1/2">
      {/* Judul yang dianimasikan */}
      <motion.h1
        className="text-4xl lg:text-5xl font-lora font-semibold text-foreground mb-4 leading-tight"
        variants={textVariant}
        initial="hidden"
        animate="visible"
      >
        Temukan Kilau Sempurna Anda
      </motion.h1>

      {/* Deskripsi & Tombol yang dianimasikan */}
      <motion.div
        variants={contentVariant}
        initial="hidden"
        animate="visible"
      >
        <p className="text-lg text-muted-foreground mb-8">
          Koleksi aksesoris wanita pilihan untuk setiap momen istimewa.
        </p>
        <Button asChild size="lg">
          <Link href="/products">Lihat Koleksi</Link>
        </Button>
      </motion.div>
    </div>
  );
}