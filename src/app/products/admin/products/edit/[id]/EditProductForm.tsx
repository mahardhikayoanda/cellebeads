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

interface EditProductFormProps { product: IProduct; }

export default function EditProductForm({ product }: EditProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { /* ... (logika sama) ... */ };

  return (
    // Form gelap (tidak perlu Card karena halaman sudah gelap)
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="name" className="text-gray-400">Nama Produk</Label>
        <Input id="name" name="name" required defaultValue={product.name}
               className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description" className="text-gray-400">Deskripsi</Label>
        <Textarea id="description" name="description" required defaultValue={product.description}
                  className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500 min-h-[80px]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="price" className="text-gray-400">Harga</Label>
          <Input id="price" name="price" type="number" required defaultValue={product.price}
                 className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stock" className="text-gray-400">Stok</Label>
          <Input id="stock" name="stock" type="number" required defaultValue={product.stock}
                 className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500" />
        </div>
      </div>
      
      <div className="space-y-1.5">
        <Label className="text-gray-400">Gambar Saat Ini</Label>
        <Image src={product.image} alt={product.name} width={100} height={100} className="object-cover rounded-md border border-gray-700" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="newImage" className="text-gray-400">Ganti Gambar (Opsional)</Label>
        <Input id="newImage" name="newImage" type="file" accept="image/*" 
               className="bg-gray-700 border-gray-600 text-gray-400 file:bg-gray-600 file:text-gray-200 file:border-0 file:hover:bg-gray-500 file:mr-3 file:px-3 file:py-1.5" />
      </div>

      <Button type="submit" disabled={isLoading} 
              className="w-full bg-green-600 hover:bg-green-700" // Tombol hijau
      >
        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </Button>
    </form>
  );
}