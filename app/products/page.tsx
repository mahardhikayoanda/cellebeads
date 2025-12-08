// File: app/products/page.tsx
import { getPaginatedProducts } from '@/app/admin/products/actions';
import ProductGrid from './ProductGrid';
import Pagination from '@/components/Pagination';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, Filter } from 'lucide-react';

interface ProductsPageProps {
  searchParams: Promise<{ 
    category?: string;
    page?: string;
    search?: string;
  }>;
}

const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fff0f5] pointer-events-none">
    <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
  </div>
);

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedSearchParams = await searchParams;
  
  const activeCategory = resolvedSearchParams.category || 'Semua';
  const currentPage = Number(resolvedSearchParams.page) || 1;
  const itemsPerPage = 12;

  const { products, totalPages } = await getPaginatedProducts(
    activeCategory, 
    currentPage, 
    itemsPerPage
  );

  const categories = ['Semua', 'Gelang', 'Kalung', 'Cincin', 'Keychain', 'Strap Handphone', 'Jam Manik', 'Request'];

  return (
    <div className="min-h-screen pb-20 relative text-stone-800 font-sans">
      <AnimatedBackground />

      <div className="container mx-auto px-4 pt-8">
        
        {/* --- HEADER SECTION --- */}
        <div className="flex flex-col items-center text-center mb-8 space-y-4">
           <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/60 border border-pink-100 shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-pink-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-stone-500">Koleksi Eksklusif</span>
           </div>
           <h1 className="text-4xl md:text-5xl font-lora font-bold text-stone-800">
              Katalog Cellebeads
           </h1>
           <p className="text-stone-500 max-w-lg mx-auto">
              Telusuri keindahan kerajinan tangan yang dibuat dengan penuh cinta untuk melengkapi gayamu.
           </p>
        </div>

        {/* --- FILTER KATEGORI (FIX: TIDAK LAGI STICKY) --- */}
        {/* Saya menghapus 'sticky top-24' dan menggantinya dengan 'relative' */}
        <div className="relative z-30 mb-10">
          <div className="flex justify-center">
            <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-white/70 backdrop-blur-xl border border-white/50 rounded-full shadow-lg shadow-pink-100/20 max-w-full overflow-x-auto scrollbar-hide">
              {categories.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <Button
                    key={cat}
                    asChild
                    variant="ghost"
                    className={`rounded-full px-6 transition-all duration-300 ${
                      isActive 
                        ? "bg-stone-800 text-white shadow-md hover:bg-stone-700" 
                        : "text-stone-600 hover:bg-pink-50 hover:text-pink-600"
                    }`}
                  >
                    <Link href={cat === 'Semua' ? '/products' : `/products?category=${cat}&page=1`}>
                      {cat}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- GRID PRODUK --- */}
        {products.length > 0 ? (
          <div className="bg-white/40 backdrop-blur-sm p-6 md:p-8 rounded-[2.5rem] border border-white/50 shadow-sm min-h-[500px]">
             <ProductGrid products={products} />
             
             {/* Pagination */}
             <div className="mt-12">
                <Pagination currentPage={currentPage} totalPages={totalPages} />
             </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 bg-white/40 backdrop-blur-md rounded-[2.5rem] border border-white/50 text-center">
             <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mb-4 text-stone-300">
                <Filter size={32} />
             </div>
             <h3 className="text-xl font-lora font-bold text-stone-700">Produk Tidak Ditemukan</h3>
             <p className="text-stone-500 mt-2">Coba pilih kategori lain atau cek kembali nanti ya.</p>
             <Button asChild variant="link" className="mt-4 text-pink-600 font-bold">
               <Link href="/products">Reset Filter</Link>
             </Button>
          </div>
        )}

      </div>
    </div>
  );
}