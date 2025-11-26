// File: app/admin/products/page.tsx
import { getProducts, IProduct } from './actions';
import ProductForm from './ProductForm';
import ProductListTabs from './ProductListTabs'; 

// --- TAMBAHAN: Force Dynamic Rendering ---
export const dynamic = 'force-dynamic';
// ---------------------------------------

export default async function AdminProductsPage() {
  // Ambil semua produk (nanti difilter di client)
  const products: IProduct[] = await getProducts();

  return (
    <div className="space-y-12 pb-20">
      {/* Header & Form Tambah */}
      <div className="space-y-6">
         <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-lora font-semibold text-stone-800">Inventaris Produk</h1>
            <p className="text-stone-500">Kelola katalog, harga, dan stok produk Anda di sini.</p>
         </div>
         <ProductForm /> 
      </div>
      
      {/* Daftar Produk dengan Tab Kategori */}
      <div className="space-y-4">
        <h2 className="text-xl font-lora font-medium text-stone-800 pl-1 border-l-4 border-primary pl-3">
          Daftar Produk Saat Ini
        </h2>
        
        {/* Render Komponen Tab */}
        <ProductListTabs products={products} />
      </div>
    </div>
  );
}