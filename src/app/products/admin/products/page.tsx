// File: app/admin/products/page.tsx
import { getProducts, IProduct } from './actions';
import ProductForm from './ProductForm';
import ProductActions from './ProductActions';
import Image from 'next/image';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"; // Import Table shadcn
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card

export default async function AdminProductsPage() {
  const products: IProduct[] = await getProducts();

  return (
    <div className="space-y-8"> {/* Beri jarak antar elemen */}
      <h1 className="text-3xl font-semibold text-white">Kelola Produk</h1>
      
      {/* Form Tambah Produk (sudah diupdate sebelumnya) */}
      <ProductForm />

      {/* Tabel Daftar Produk (Gunakan Card & Table shadcn) */}
      <Card className="bg-gray-800 border-gray-700 text-gray-300">
        <CardHeader>
          <CardTitle className="text-white">Daftar Produk Saat Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-700 border-gray-700">
                <TableHead className="text-gray-400">Gambar</TableHead>
                <TableHead className="text-gray-400">Nama</TableHead>
                <TableHead className="text-gray-400 text-right">Harga</TableHead>
                <TableHead className="text-gray-400 text-center">Stok</TableHead>
                <TableHead className="text-gray-400 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id} className="hover:bg-gray-750 border-gray-700"> {/* Sedikit lebih gelap saat hover */}
                  <TableCell>
                    <Image 
                      src={product.image} alt={product.name}
                      width={50} height={50} // Kecilkan gambar
                      className="object-cover rounded-md border border-gray-600"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="text-right">Rp {product.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-center">{product.stock}</TableCell>
                  {/* Komponen Aksi (akan diupdate di bawah) */}
                  <TableCell className="text-center">
                     <ProductActions product={product} />
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-10">
                    Belum ada produk.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}