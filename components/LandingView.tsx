'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Sparkles, Heart, ArrowRight, Loader2 } from 'lucide-react';

// --- KONFIGURASI ANIMASI GELEMBUNG (MANIK-MANIK MELAYANG) ---
const floatingBeads = [
  { color: 'bg-pink-300', size: 'w-16 h-16', top: '10%', left: '10%', duration: 20 },
  { color: 'bg-purple-300', size: 'w-24 h-24', top: '60%', left: '80%', duration: 25 },
  { color: 'bg-yellow-200', size: 'w-12 h-12', top: '80%', left: '20%', duration: 18 },
  { color: 'bg-teal-200', size: 'w-20 h-20', top: '20%', left: '85%', duration: 22 },
  { color: 'bg-rose-200', size: 'w-14 h-14', top: '40%', left: '50%', duration: 30 }, // Tengah
];

// Varian Animasi Manik-Manik
const beadVariants = {
  animate: (duration: number) => ({
    y: [0, -40, 0], // Gerakan naik turun
    x: [0, 20, 0],  // Gerakan kiri kanan halus
    scale: [1, 1.1, 1], // Denyutan halus
    transition: {
      duration: duration,
      repeat: Infinity,
      repeatType: "reverse" as const,
      ease: "easeInOut" as const, 
    },
  }),
};

// Varian Animasi Teks (Huruf per Huruf)
const letterContainer = {
  hidden: { opacity: 0 },
  visible: (i = 1) => ({
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.04 * i },
  }),
};

// PERBAIKAN: Tambahkan 'as const' pada tipe transisi agar TypeScript mengenali literal string 'spring'
const letterChild = {
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring" as const, // <--- TAMBAHKAN 'as const'
      damping: 12,
      stiffness: 200,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
    transition: {
      type: "spring" as const, // <--- TAMBAHKAN 'as const'
      damping: 12,
      stiffness: 200,
    },
  },
};


export default function LandingView() {
  const [isLoading, setIsLoading] = useState(false);
  // State untuk mencegah hydration error pada animasi random
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' });
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (!isMounted) return null; // Cegah flash konten

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-stone-50">
      
      {/* --- BACKGROUND ANIMATION (LAVA LAMP EFFECT) --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {/* Blob Besar (Background Dasar) */}
         <motion.div 
            animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-gradient-to-r from-pink-200/40 to-purple-200/30 rounded-full blur-[100px]"
         />
         <motion.div 
            animate={{ scale: [1, 1.1, 1], rotate: [0, -45, 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-[-20%] right-[-10%] w-[700px] h-[700px] bg-gradient-to-r from-teal-200/30 to-blue-200/30 rounded-full blur-[120px]"
         />

         {/* Manik-Manik Melayang (Floating Beads) */}
         {floatingBeads.map((bead, i) => (
            <motion.div
              key={i}
              custom={bead.duration}
              variants={beadVariants}
              animate="animate"
              className={`absolute rounded-full blur-xl opacity-60 ${bead.color} ${bead.size}`}
              style={{ top: bead.top, left: bead.left }}
            />
         ))}
      </div>

      {/* --- KONTEN UTAMA --- */}
      <div className="container mx-auto px-4 relative z-10 flex flex-col md:flex-row items-center justify-center gap-12 lg:gap-24">
        
        {/* KIRI: Teks & Branding */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
          className="flex-1 text-center md:text-left max-w-lg"
        >
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white shadow-sm mb-6"
          >
             <Sparkles className="w-4 h-4 text-yellow-500 animate-[spin_3s_linear_infinite]" />
             <span className="text-xs font-bold text-stone-600 tracking-widest uppercase">Aksesoris Handmade Unik</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-lora font-extrabold text-stone-800 leading-[1.1] mb-6"
            variants={letterContainer}
            initial="hidden"
            animate="visible"
          >
            {"Kilau Cantik,".split("").map((char, index) => (
              <motion.span key={index} variants={letterChild}>{char}</motion.span>
            ))}
            <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
              {"Penuh Warna.".split("").map((char, index) => (
                <motion.span key={index} variants={letterChild}>{char}</motion.span>
              ))}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-lg text-stone-600 leading-relaxed mb-8"
          >
            Setiap manik dirangkai dengan cinta untuk menceritakan kisahmu. 
            Masuk sekarang untuk menemukan koleksi eksklusif yang <strong>kamu banget!</strong> ✨
          </motion.p>
        </motion.div>

        {/* KANAN: Kartu Login (Glassmorphism Premium) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.4, type: 'spring' }}
          className="w-full max-w-md"
        >
          <div className="relative group">
            {/* Efek Glow di Belakang Kartu */}
            <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 via-purple-400 to-teal-400 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
            
            <Card className="relative border-none bg-white/70 backdrop-blur-xl shadow-2xl rounded-[2rem] overflow-hidden">
               <CardContent className="p-10 text-center">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="w-20 h-20 bg-gradient-to-tr from-pink-100 to-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner border border-white"
                  >
                     <Heart size={40} className="text-rose-500 fill-rose-500/20" />
                  </motion.div>
                  
                  <h2 className="text-2xl font-lora font-bold text-stone-800 mb-2">Selamat Datang!</h2>
                  <p className="text-stone-500 mb-8 text-sm">Siap untuk tampil lebih berkilau? <br/>Masuk untuk mulai berbelanja.</p>

                  <Button 
                    size="lg" 
                    className="w-full h-14 text-base font-bold rounded-xl bg-stone-900 hover:bg-primary text-white shadow-lg hover:shadow-primary/30 transition-all duration-300 group relative overflow-hidden"
                    onClick={handleLogin}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                       <Loader2 className="w-5 h-5 animate-spin mr-2" />
                    ) : (
                       <div className="absolute left-4 bg-white p-1.5 rounded-full transition-transform group-hover:scale-110 duration-300">
                         <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                       </div>
                    )}
                    <span className="ml-6">Lanjutkan dengan Google</span>
                    {!isLoading && <ArrowRight className="w-4 h-4 ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />}
                  </Button>

                  <div className="mt-8 flex items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                    <p className="text-[10px] text-stone-500 font-medium uppercase tracking-wider">
                      100% Aman & Terpercaya
                    </p>
                  </div>
               </CardContent>
            </Card>
          </div>
        </motion.div>

      </div>
    </div>
  );
}