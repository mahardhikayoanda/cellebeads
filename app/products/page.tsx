// File: app/products/page.tsx
import { getProducts, IProduct } from '@/app/admin/products/actions';
import ProductCard from './ProductCard'; 

// ... (Interface IProduct) ...

export default async function ProductsPage() {
  const products: IProduct[] = await getProducts();

  return (
    <div>
      {/* Judul dengan font Lora */}
      <h1 className="text-3xl font-lora font-medium text-stone-800 mb-8">Katalog Produk</h1>
      
      {products.length > 0 ? (
        // Grid responsif
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-stone-500">Belum ada produk. Silakan cek kembali nanti.</p>
      )}
    </div>
  );
}