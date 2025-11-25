// File: app/about/page.tsx
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Heart, Sparkles, PenTool, Gem } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-16 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative bg-gradient-to-b from-pink-100 to-white py-20 px-4 text-center overflow-hidden rounded-b-[3rem]">
        <div className="absolute top-10 left-10 text-pink-300 animate-pulse"><Sparkles size={60} /></div>
        <div className="absolute bottom-10 right-10 text-purple-300 animate-bounce delay-700"><Heart size={40} /></div>
        
        <div className="container mx-auto max-w-3xl relative z-10">
           <span className="text-primary font-bold tracking-widest uppercase text-xs bg-white px-3 py-1 rounded-full shadow-sm mb-4 inline-block">
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

      {/* 2. VALUE PROPOSITION */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-pink-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 mx-auto mb-4">
                <PenTool size={32} />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">100% Handmade</h3>
              <p className="text-stone-500">Setiap gelang dan kalung dirangkai satu per satu dengan ketelitian tinggi oleh pengrajin kami.</p>
           </div>
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-purple-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center text-purple-500 mx-auto mb-4">
                <Sparkles size={32} />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Desain Unik</h3>
              <p className="text-stone-500">Kombinasi warna dan model yang *fresh*, mengikuti tren terkini namun tetap *timeless*.</p>
           </div>
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-100 text-center hover:-translate-y-2 transition-transform duration-300">
              <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center text-teal-500 mx-auto mb-4">
                <Gem size={32} />
              </div>
              <h3 className="text-xl font-bold text-stone-800 mb-2">Kualitas Terbaik</h3>
              <p className="text-stone-500">Menggunakan bahan manik, tali, dan pengait premium yang awet dan nyaman dipakai.</p>
           </div>
        </div>
      </section>

      {/* 3. OUR STORY (Placeholder Image) */}
      <section className="container mx-auto px-4">
        <div className="bg-stone-900 rounded-3xl p-8 md:p-12 flex flex-col md:flex-row items-center gap-10 text-white relative overflow-hidden">
           <div className="absolute -top-20 -right-20 text-white/5"><Sparkles size={400} /></div>
           
           {/* Gambar Placeholder (Ganti src jika ada foto owner/workshop) */}
           <div className="w-full md:w-1/2 relative h-80 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl">
              <Image 
                src="/placeholder-banner.jpg" 
                alt="Our Workshop" 
                fill 
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
           </div>

           <div className="w-full md:w-1/2 space-y-6 relative z-10">
              <h2 className="text-3xl font-lora font-bold">Awal Mula Cellebeads</h2>
              <div className="w-16 h-1 bg-pink-500 rounded-full"></div>
              <p className="text-stone-300 leading-relaxed">
                Berawal dari hobi merangkai manik di kamar tidur kecil pada tahun 2023, Cellebeads tumbuh menjadi ruang kreasi yang ingin menyebarkan kebahagiaan kecil melalui aksesoris.
              </p>
              <p className="text-stone-300 leading-relaxed">
                Kami percaya bahwa aksesoris bukan sekadar hiasan, tapi cara mengekspresikan diri. Nama "Celle" diambil dari kata "Celebrate", karena kami ingin merayakan setiap warnamu.
              </p>
              <Button asChild size="lg" className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-full px-8 mt-4">
                 <Link href="/products">Lihat Koleksi Kami</Link>
              </Button>
           </div>
        </div>
      </section>

    </div>
  );
}