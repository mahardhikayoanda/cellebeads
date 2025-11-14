// File: app/products/page.tsx
import { getProducts, IProduct } from '@/app/admin/products/actions';
import ProductCard from './ProductCard';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ProductsPageProps {
  // Terima searchParams untuk filtering (Next.js 16: harus Promise)
  searchParams: Promise<{ category?: string }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  // Tunggu params di-resolve
  const resolvedSearchParams = await searchParams;
  const activeCategory = resolvedSearchParams.category || 'Semua';

  // Ambil produk sesuai filter
  const products: IProduct[] = await getProducts(activeCategory);

  const categories = ['Semua', 'Gelang', 'Kalung', 'Cincin', 'Keychain'];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-lora font-medium text-foreground mb-6 text-center md:text-left">Katalog Produk</h1>
      
      {/* MENU FILTER KATEGORI */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
        {categories.map((cat) => (
          <Button 
            key={cat} 
            variant={activeCategory === cat ? "default" : "outline"} 
            asChild
            className="rounded-full"
          >
            <Link href={cat === 'Semua' ? '/products' : `/products?category=${cat}`}>
              {cat}
            </Link>
          </Button>
        ))}
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-stone-50 rounded-xl border border-stone-100">
          <p className="text-muted-foreground text-lg">Belum ada produk di kategori <span className="font-semibold">"{activeCategory}"</span>.</p>
          {activeCategory !== 'Semua' && (
             <Button variant="link" asChild className="mt-2 text-rose-500">
               <Link href="/products">Lihat semua produk</Link>
             </Button>
          )}
        </div>
      )}
    </div>
  );
}