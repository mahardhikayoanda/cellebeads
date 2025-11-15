// File: app/admin/products/page.tsx
import { getProducts, IProduct } from './actions';
import ProductForm from './ProductForm';
import ProductActions from './ProductActions';
import Image from 'next/image';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function AdminProductsPage() {
  const products: IProduct[] = await getProducts();

  return (
    <div className="space-y-8">
      {/* Hapus text-white */}
      <h1 className="text-3xl font-lora font-semibold">Kelola Produk</h1>
      
      {/* ProductForm sekarang akan jadi terang */}
      <ProductForm /> 
      
      {/* Hapus bg-gray-800, border-gray-700, dll. */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Produk Saat Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Gambar</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Harga</TableHead>
                <TableHead className="text-center">Stok</TableHead>
                <TableHead className="text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell>
                    <div className="relative w-12 h-12">
                      <Image 
                        src={product.images && product.images.length > 0 ? product.images[0] : '/placeholder-banner.jpg'} 
                        alt={product.name} fill className="object-cover rounded-md border"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{product.category}</Badge>
                  </TableCell>
                  <TableCell className="max-w-xs truncate" title={product.description}>
                    {product.description}
                  </TableCell>
                  <TableCell className="text-right">Rp {product.price.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-center">{product.stock}</TableCell>
                  <TableCell className="text-center">
                     <ProductActions product={product} />
                  </TableCell>
                </TableRow>
              ))}
              {products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-10">Belum ada produk.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}