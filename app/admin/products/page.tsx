// File: app/admin/products/page.tsx
import { getProducts, IProduct } from './actions';
import ProductForm from './ProductForm';
import ProductActions from './ProductActions';
import Image from 'next/image';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Import Badge untuk kategori

export default async function AdminProductsPage() {
  const products: IProduct[] = await getProducts();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-white">Kelola Produk</h1>
      <ProductForm />
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
                <TableHead className="text-gray-400">Kategori</TableHead> {/* Kolom Baru */}
                <TableHead className="text-gray-400">Deskripsi</TableHead>
                <TableHead className="text-gray-400 text-right">Harga</TableHead>
                <TableHead className="text-gray-400 text-center">Stok</TableHead>
                <TableHead className="text-gray-400 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id} className="hover:bg-gray-750 border-gray-700">
                  <TableCell>
                    <div className="relative w-12 h-12">
                      <Image 
                        src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-banner.jpg'} 
                        alt={product.name} fill className="object-cover rounded-md border border-gray-600"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-white">{product.name}</TableCell>
                  
                  {/* Tampilkan Kategori */}
                  <TableCell>
                    <Badge variant="outline" className="text-gray-300 border-gray-500">{product.category}</Badge>
                  </TableCell>

                  <TableCell className="max-w-xs truncate text-white" title={product.description}>
                    {product.description}
                  </TableCell>
                  <TableCell className="text-right text-white">Rp {product.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-center text-white">{product.stock}</TableCell>
                  <TableCell className="text-center">
                     <ProductActions product={product} />
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500 py-10">Belum ada produk.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}