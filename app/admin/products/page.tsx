// File: app/admin/products/page.tsx
import { getProducts, IProduct } from './actions';
import ProductForm from './ProductForm';
import ProductListTabs from './ProductListTabs'; 
import { Gem } from 'lucide-react'; // Import Icon

export const dynamic = 'force-dynamic';

export default async function AdminProductsPage() {
  const products: IProduct[] = await getProducts();

  return (
    <div className="space-y-12 pb-20">
      <div className="space-y-8">
         {/* --- HEADER BARU --- */}
         <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-xl text-white shadow-lg shadow-pink-200">
               <Gem size={24} />
            </div>
            <div>
               <h1 className="text-3xl font-lora font-bold text-stone-800">Koleksi Produk</h1>
               <p className="text-stone-500">Kelola katalog, harga, dan stok produk Anda di sini.</p>
            </div>
         </div>
         {/* ------------------- */}
         
         <ProductForm /> 
      </div>
      
      <div className="space-y-4">
        <h2 className="text-xl font-lora font-bold text-stone-800 pl-1 border-l-4 border-pink-500 pl-3">
          Daftar Produk Saat Ini
        </h2>
        <ProductListTabs products={products} />
      </div>
    </div>
  );
}