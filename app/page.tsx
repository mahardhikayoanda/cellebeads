// File: app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getProducts } from '@/app/admin/products/actions'; // <-- 1. Import getProducts
import ProductGrid from '@/app/products/ProductGrid'; // <-- 2. Import ProductGrid
import HeroSection from './HeroSection'; // <-- 3. Import HeroSection

export default async function HomePage() {
  // Ambil 4 produk terbaru
  const latestProducts = await getProducts();
  const productsToShow = latestProducts.slice(0, 4);

  return (
    <div className="space-y-20">
      
      {/* Hero Section */}
      <Card className="overflow-hidden shadow-lg border-stone-200">
        <CardContent className="p-0">
          <div className="relative bg-gradient-to-br from-rose-50 via-white to-stone-50 py-20 px-8 md:flex md:items-center min-h-[450px]">
            
            {/* 4. Ganti teks statis dengan Komponen Animasi */}
            <HeroSection />

            <div className="hidden md:block md:w-1/2 mt-8 md:mt-0 relative h-64 md:h-96">
              <Image
                src="/placeholder-banner.jpg"
                alt="Aksesoris Wanita Cantik"
                fill
                style={{objectFit:"cover"}}
                className="rounded-md opacity-90"
                priority
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Produk Unggulan */}
      <section>
        <h2 className="text-3xl font-lora font-medium text-foreground mb-8 text-center">
          Produk Terbaru
        </h2>
        
        {/* 5. Ganti placeholder dengan ProductGrid asli */}
        <ProductGrid products={productsToShow} />

        <div className="text-center mt-10">
          <Button
            asChild
            variant="outline"
            size="lg" // <-- Buat tombol lebih besar
            className="border-primary text-primary hover:bg-primary/5 hover:text-primary"
          >
            <Link href="/products">Lihat Semua Produk →</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}