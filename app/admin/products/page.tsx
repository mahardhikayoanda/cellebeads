// File: app/admin/products/page.tsx

// 1. Import tipe data dan fungsi dari actions
import { getProducts, IProduct } from './actions';
import ProductForm from './ProductForm';
// 2. Import komponen tombol aksi
import ProductActions from './ProductActions';
import Image from 'next/image'; // Import Image

export default async function AdminProductsPage() {
  // 3. Ambil data produk (sekarang menggunakan tipe IProduct)
  const products: IProduct[] = await getProducts();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard Admin - Kelola Produk</h1>
      
      <ProductForm />

      <h2>Daftar Produk Saat Ini</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#333' }}>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Gambar</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Nama</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Harga</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Stok</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              {/* Tambahkan kolom gambar */}
              <td style={{ border: '1px solid #555', padding: '8px', textAlign: 'center' }}>
                <Image 
                  src={product.image} 
                  alt={product.name}
                  width={60}
                  height={60}
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                />
              </td>
              <td style={{ border: '1px solid #555', padding: '8px' }}>{product.name}</td>
              <td style={{ border: '1px solid #555', padding: '8px' }}>Rp {product.price.toLocaleString('id-ID')}</td>
              <td style={{ border: '1px solid #555', padding: '8px' }}>{product.stock}</td>
              
              {/* 4. Ganti tombol lama dengan komponen baru */}
              <ProductActions product={product} />
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                Belum ada produk.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}