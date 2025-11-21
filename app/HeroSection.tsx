// File: app/HeroSection.tsx
'use client'; 

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HeroSection() {
  return (
    <div className="relative z-10 flex flex-col items-start justify-center h-full max-w-2xl text-left px-6 md:px-12">
      
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-[0.2em] uppercase mb-6 border border-primary/20">
          Koleksi Eksklusif 2025
        </span>
      </motion.div>

      <motion.h1
        className="text-5xl md:text-7xl font-lora font-medium text-stone-900 mb-6 leading-[1.1]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        Kilau Cantik <br/> 
        <span className="italic font-light text-stone-500">di Setiap Detik.</span>
      </motion.h1>

      <motion.p
        className="text-lg text-stone-600 mb-10 max-w-md leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
      >
        Jelajahi ragam aksesoris buatan tangan yang dirancang untuk menonjolkan keanggunan alami Anda. Mewah, namun tetap terjangkau.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="flex gap-4"
      >
        <Button asChild size="lg" className="rounded-full px-8 bg-stone-900 text-white hover:bg-primary hover:text-white transition-all duration-300 shadow-xl shadow-stone-900/20">
          <Link href="/products">
            Belanja Sekarang <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full px-8 border-stone-300 text-stone-600 hover:bg-white hover:text-primary hover:border-primary">
          <Link href="/about">Tentang Kami</Link>
        </Button>
      </motion.div>
    </div>
  );
}