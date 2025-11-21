// File: app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { getProducts } from '@/app/admin/products/actions'; 
import ProductGrid from '@/app/products/ProductGrid'; 
import HeroSection from './HeroSection'; 

export default async function HomePage() {
  const latestProducts = await getProducts();
  const productsToShow = latestProducts.slice(0, 4);

  return (
    <div className="space-y-24 pb-20">
      
      {/* HERO SECTION - Full Width Modern Layout */}
      <section className="relative w-full min-h-[85vh] flex items-center rounded-3xl overflow-hidden mx-auto mt-4 shadow-2xl shadow-stone-200 border border-white">
        
        {/* Background Image dengan Overlay Halus */}
        <div className="absolute inset-0 z-0">
             <Image
                src="/placeholder-banner.jpg" // Pastikan gambar ini high-quality
                alt="Background"
                fill
                className="object-cover object-center"
                priority
              />
              {/* Gradient Overlay agar teks terbaca */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        </div>

        {/* Konten Hero */}
        <HeroSection />
      </section>

      {/* Kategori Singkat (Opsional) */}
      <section className="container mx-auto px-4">
         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {['Gelang', 'Kalung', 'Cincin', 'Strap HP'].map((cat) => (
               <Link key={cat} href={`/products?category=${cat}`} className="group overflow-hidden rounded-xl relative aspect-[4/3] shadow-md hover:shadow-xl transition-all">
                  <div className="absolute inset-0 bg-stone-200 group-hover:bg-primary/20 transition-colors" /> 
                  {/* Disini harusnya ada gambar kategori, sementara pakai placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <span className="font-lora font-bold text-xl text-stone-800 group-hover:scale-110 transition-transform">{cat}</span>
                  </div>
               </Link>
            ))}
         </div>
      </section>

      {/* Produk Unggulan */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center mb-12">
          <span className="text-primary text-sm font-bold tracking-widest uppercase mb-2">Pilihan Favorit</span>
          <h2 className="text-4xl font-lora font-medium text-stone-900">
            Produk Terbaru
          </h2>
          <div className="w-20 h-1 bg-primary mt-4 rounded-full" />
        </div>
        
        <ProductGrid products={productsToShow} />

        <div className="text-center mt-16">
          <Button
            asChild
            variant="outline"
            size="lg" 
            className="rounded-full px-10 py-6 border-stone-300 text-stone-600 hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-all"
          >
            <Link href="/products">Lihat Semua Produk</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}