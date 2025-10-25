// File: app/admin/products/page.tsx
// Ini adalah Server Component, jadi kita bisa langsung ambil data

import { getProducts } from './actions';
import ProductForm from './ProductForm';

// Tipe data untuk produk (sesuaikan dengan model Mongoose Anda)
interface IProduct {
  _id: string;
  name: string;
  price: number;
  stock: number;
}

export default async function AdminProductsPage() {
  // 1. Ambil data produk langsung di server
  const products: IProduct[] = await getProducts();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard Admin - Kelola Produk</h1>
      
      {/* 2. Tampilkan Form (Client Component) */}
      <ProductForm />

      {/* 3. Tampilkan Daftar Produk */}
      <h2>Daftar Produk Saat Ini</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#333' }}>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Nama</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Harga</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Stok</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product._id}>
              <td style={{ border: '1px solid #555', padding: '8px' }}>{product.name}</td>
              <td style={{ border: '1px solid #555', padding: '8px' }}>Rp {product.price.toLocaleString('id-ID')}</td>
              <td style={{ border: '1px solid #555', padding: '8px' }}>{product.stock}</td>
              <td style={{ border: '1px solid #555', padding: '8px' }}>
                {/* TODO: Buat tombol Edit/Delete */}
                <button style={{ marginRight: '5px', backgroundColor: 'orange' }}>Edit</button>
                <button style={{ backgroundColor: 'red' }}>Hapus</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}