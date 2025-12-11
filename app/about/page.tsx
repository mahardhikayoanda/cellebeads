// File: app/about/page.tsx
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, Sparkles, PenTool, Gem } from 'lucide-react';

// 1. Tambahkan Komponen Background Animasi (Konsisten dengan halaman lain)
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fff0f5] pointer-events-none">
    <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
  </div>
);

export default function AboutPage() {
  return (
    <div className="min-h-screen pb-20 relative text-stone-800 font-sans">
      
      {/* 2. Pasang Background di sini */}
      <AnimatedBackground />

      <div className="container mx-auto px-4 pt-8 space-y-16">
        
        {/* 3. HERO SECTION (Diubah jadi Glassmorphism agar background terlihat) */}
        <section className="relative bg-white/60 backdrop-blur-xl border border-white/60 py-20 px-4 text-center overflow-hidden rounded-[3rem] shadow-xl shadow-pink-100/50">
          {/* Hiasan Dekoratif */}
          <div className="absolute top-10 left-10 text-pink-400 animate-pulse"><Sparkles size={60} /></div>
          <div className="absolute bottom-10 right-10 text-purple-400 animate-bounce delay-700"><Heart size={40} /></div>
          
          <div className="max-w-3xl mx-auto relative z-10">
             <span className="text-pink-600 font-bold tracking-widest uppercase text-xs bg-pink-50 border border-pink-100 px-4 py-1.5 rounded-full shadow-sm mb-6 inline-block">
                Tentang Kami
             </span>
             <h1 className="text-4xl md:text-6xl font-lora font-bold text-stone-800 mb-6 leading-tight">
               Merangkai Cerita <br/> dalam Setiap <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">Manik.</span>
             </h1>
             <p className="text-lg text-stone-600 leading-relaxed">
               Cellebeads hadir untuk menemani setiap momen spesialmu dengan aksesoris buatan tangan yang penuh warna, unik, dan dibuat dengan sepenuh hati.
             </p>
          </div>
        </section>

        {/* 4. VALUE PROPOSITION */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-pink-100 text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-500 mx-auto mb-4 shadow-inner">
                  <PenTool size={32} />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">100% Handmade</h3>
                <p className="text-stone-500 text-sm leading-relaxed">Setiap gelang dan kalung dirangkai satu per satu dengan ketelitian tinggi oleh pengrajin kami.</p>
             </div>
             <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-purple-100 text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-500 mx-auto mb-4 shadow-inner">
                  <Sparkles size={32} />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Desain Unik</h3>
                <p className="text-stone-500 text-sm leading-relaxed">Kombinasi warna dan model yang *fresh*, mengikuti tren terkini namun tetap *timeless*.</p>
             </div>
             <div className="bg-white/70 backdrop-blur-md p-8 rounded-[2rem] shadow-sm border border-teal-100 text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-500 mx-auto mb-4 shadow-inner">
                  <Gem size={32} />
                </div>
                <h3 className="text-xl font-bold text-stone-800 mb-2">Kualitas Terbaik</h3>
                <p className="text-stone-500 text-sm leading-relaxed">Menggunakan bahan manik, tali, dan pengait premium yang awet dan nyaman dipakai.</p>
             </div>
          </div>
        </section>

        {/* 5. OUR STORY */}
        <section>
          <div className="bg-stone-900 rounded-[3rem] p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 text-white relative overflow-hidden shadow-2xl">
             <div className="absolute -top-20 -right-20 text-white/5"><Sparkles size={400} /></div>
             
             {/* Gambar Placeholder */}
             <div className="w-full md:w-1/2 relative h-80 rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl group">
                <Image 
                  src="/placeholder-banner.jpg" 
                  alt="Our Workshop" 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
             </div>

             <div className="w-full md:w-1/2 space-y-6 relative z-10">
                <div>
                  <span className="text-pink-400 font-bold tracking-widest text-xs uppercase mb-2 block">Story of Us</span>
                  <h2 className="text-3xl md:text-4xl font-lora font-bold">Awal Mula Cellebeads</h2>
                </div>
                <p className="text-stone-300 leading-relaxed">
                  Berawal dari hobi merangkai manik di kamar tidur kecil pada tahun 2023, Cellebeads tumbuh menjadi ruang kreasi yang ingin menyebarkan kebahagiaan kecil melalui aksesoris.
                </p>
                <p className="text-stone-300 leading-relaxed">
                  Kami percaya bahwa aksesoris bukan sekadar hiasan, tapi cara mengekspresikan diri. Nama "Celle" diambil dari kata "Celebrate", karena kami ingin merayakan setiap warnamu.
                </p>
                <Button asChild size="lg" className="bg-white hover:bg-pink-50 text-stone-900 font-bold rounded-xl px-8 mt-4 shadow-lg transition-all hover:scale-105">
                   <Link href="/products">Lihat Koleksi Kami</Link>
                </Button>
             </div>
          </div>
        </section>

      </div>
    </div>
  );
}