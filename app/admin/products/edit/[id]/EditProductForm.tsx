// File: app/admin/products/edit/[id]/EditProductForm.tsx
'use client';

import { useState } from 'react';
import { IProduct, updateProduct } from '@/app/admin/products/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface EditProductFormProps {
  product: IProduct;
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // --- INI LOGIKA YANG SEBELUMNYA HILANG ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Kita perlu menambahkan ID dan URL gambar lama secara manual
      // karena server action membutuhkannya, tapi tidak ada input untuk itu di form
      formData.append('id', product._id);
      formData.append('oldImageUrl', product.images[0]);

      const result = await updateProduct(formData);

      if (result.success) {
        alert('Produk berhasil diperbarui!');
        router.push('/admin/products'); // Kembali ke daftar produk
        router.refresh(); // Refresh data agar perubahan terlihat
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (error) {
      console.error("Edit error:", error);
      alert('Terjadi kesalahan saat menyimpan perubahan.');
    } finally {
      setIsLoading(false);
    }
  };
  // -----------------------------------------

  return (
    <Card className="bg-gray-800 border-gray-700 text-gray-300">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-gray-400">Nama Produk</Label>
            <Input 
              id="name" 
              name="name" 
              required 
              defaultValue={product.name}
              className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-gray-400">Deskripsi</Label>
            <Textarea 
              id="description" 
              name="description" 
              required 
              defaultValue={product.description}
              className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500 min-h-[120px]" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-gray-400">Harga</Label>
              <Input 
                id="price" 
                name="price" 
                type="number" 
                required 
                defaultValue={product.price}
                className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock" className="text-gray-400">Stok</Label>
              <Input 
                id="stock" 
                name="stock" 
                type="number" 
                required 
                defaultValue={product.stock}
                className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500" 
              />
            </div>
          </div>
          
          <div className="space-y-3 border-t border-gray-700 pt-4">
            <div className="space-y-1.5">
              <Label className="text-gray-400">Gambar Saat Ini</Label>
              <div className="relative w-24 h-24">
                <Image 
                  src={product.images[0]} 
                  alt={product.name} 
                  fill
                  className="object-cover rounded-md border border-gray-600" 
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="newImage" className="text-gray-400">Ganti Gambar (Opsional)</Label>
              <Input 
                id="newImage" 
                name="newImage" 
                type="file" 
                accept="image/*" 
                className="bg-gray-700 border-gray-600 text-gray-400 file:bg-gray-600 file:text-gray-200 file:border-0 file:hover:bg-gray-500 file:mr-3 file:px-3 file:py-1.5" 
              />
              <p className="text-xs text-gray-500">Biarkan kosong jika tidak ingin mengubah gambar.</p>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}