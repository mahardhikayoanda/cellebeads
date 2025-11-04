// File: app/products/page.tsx
import { getProducts, IProduct } from '@/app/admin/products/actions';
import ProductCard from './ProductCard'; 

export default async function ProductsPage() {
  const products: IProduct[] = await getProducts();

  return (
    <div>
      <h1 className="text-3xl font-lora font-medium text-foreground mb-8">Katalog Produk</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground">Belum ada produk.</p>
      )}
    </div>
  );
}