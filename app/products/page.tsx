// File: app/products/page.tsx
// Ini adalah Server Component

import { getProducts } from '@/app/admin/products/actions'; // Kita pakai ulang Server Action admin
import ProductCard from './ProductCard'; // Import komponen .tsx kita

// Tipe data untuk produk
interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

export default async function ProductsPage() {
  const products: IProduct[] = await getProducts();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Katalog Produk</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        {products.length > 0 ? (
          products.map(product => (
            // Sekarang ini akan meng-import ProductCard.tsx
            <ProductCard key={product._id} product={product} />
          ))
        ) : (
          <p>Belum ada produk.</p>
        )}
      </div>
    </div>
  );
}