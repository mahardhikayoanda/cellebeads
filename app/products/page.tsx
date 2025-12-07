// File: app/products/page.tsx
import { getPaginatedProducts } from '@/app/admin/products/actions'; // <-- Gunakan fungsi baru
import ProductGrid from './ProductGrid';
import Pagination from '@/components/Pagination'; // <-- Import komponen baru
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ProductsPageProps {
  searchParams: Promise<{ 
    category?: string;
    page?: string; // <-- Tambahkan parameter page
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  
  // 1. Ambil Parameter
  const activeCategory = resolvedSearchParams.category || 'Semua';
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const itemsPerPage = 12; // Tampilkan 12 produk per halaman

  // 2. Ambil Data dengan Pagination
  const { products, totalPages } = await getPaginatedProducts(
    activeCategory, 
    currentPage, 
    itemsPerPage
  );

  const categories = ['Semua', 'Gelang', 'Kalung', 'Cincin', 'Keychain', 'Strap Handphone', 'Jam Manik'];

  return (
    <div className="container mx-auto px-4 py-8 min-h-[80vh]">
      <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
         <div>
            <h1 className="text-3xl font-lora font-medium text-foreground mb-2">Katalog Produk</h1>
            <p className="text-stone-500 text-sm">Temukan aksesoris favoritmu di sini.</p>
         </div>
      </div>

      {/* MENU FILTER KATEGORI (Preserve Page = 1 saat ganti kategori) */}
      <div className="flex flex-wrap gap-2 mb-8 justify-center md:justify-start">
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            asChild
            className="rounded-full transition-all hover:-translate-y-0.5"
          >
            {/* Reset ke page 1 saat ganti kategori */}
            <Link href={cat === 'Semua' ? '/products' : `/products?category=${cat}&page=1`}>
              {cat}
            </Link>
          </Button>
        ))}
      </div>

      {/* GRID PRODUK */}
      {products.length > 0 ? (
        <>
          <ProductGrid products={products} />
          
          {/* COMPONENT PAGINATION */}
          <Pagination currentPage={currentPage} totalPages={totalPages} />
        </>
      ) : (
        <div className="text-center py-24 bg-stone-50/50 rounded-3xl border border-dashed border-stone-200">
          <p className="text-stone-400 text-lg font-lora">Belum ada produk di kategori ini.</p>
          {activeCategory !== 'Semua' && (
             <Button variant="link" asChild className="mt-2 text-primary font-bold">
               <Link href="/products">Lihat semua koleksi</Link>
             </Button>
          )}
        </div>
      )}
    </div>
  );
}