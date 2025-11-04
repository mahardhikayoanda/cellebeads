// File: app/page.tsx

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// import { getProducts, IProduct } from '@/app/admin/products/actions';
// import ProductCard from '@/app/products/ProductCard';

export default async function HomePage() {
  // const featuredProducts: IProduct[] = (await getProducts()).slice(0, 4);

  return (
    <div className="space-y-16"> {/* Jarak lebih besar */}
      {/* Hero Section */}
      <Card className="overflow-hidden shadow-lg border-stone-200">
        <CardContent className="p-0">
          {/* Background gradasi lembut */}
          <div className="relative bg-gradient-to-br from-rose-50 via-white to-stone-50 py-20 px-8 md:flex md:items-center min-h-[450px]">
            <div className="md:w-1/2 relative z-10 text-center md:text-left">
              <h1 className="text-4xl lg:text-5xl font-lora font-semibold text-foreground mb-4 leading-tight">
                Temukan Kilau Sempurna Anda
              </h1>
              <p className="text-lg text-muted-foreground mb-8"> {/* Warna teks muted */}
                Koleksi aksesoris wanita pilihan untuk setiap momen istimewa.
              </p>
              <Button asChild size="lg"> {/* Tombol Primary */}
                <Link href="/products">Lihat Koleksi</Link>
              </Button>
            </div>
            <div className="hidden md:block md:w-1/2 mt-8 md:mt-0 relative h-64 md:h-96">
               <Image src="/placeholder-banner.jpg" alt="Aksesoris Wanita Cantik" fill
                 style={{objectFit:"cover"}} className="rounded-md opacity-90" priority />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Produk Unggulan */}
      <section>
        <h2 className="text-3xl font-lora font-medium text-foreground mb-8 text-center">
          Produk Terbaru
        </h2>
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => <ProductCard key={product._id} product={product} />)}
        </div> */}
         <p className="text-center mt-4 text-muted-foreground">(Tampilkan beberapa ProductCard di sini)</p>
         <div className="text-center mt-8">
             {/* Tombol Outline Primary */}
             <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/5 hover:text-primary">
                 <Link href="/products">Lihat Semua Produk &rarr;</Link>
             </Button>
         </div>
      </section>
    </div>
  );
}