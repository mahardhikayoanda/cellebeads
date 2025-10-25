import { getProducts } from '@/app/admin/products/actions'; // Kita pakai ulang action tadi
import ProductCard from './ProductCard';

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <h1>Katalog Produk</h1>
      <div>
        {products.map(product => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}