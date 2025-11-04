// File: app/admin/products/ProductForm.tsx
'use client'; 
import { useState } from 'react';
import { createProduct } from './actions'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; // Import Card

export default function ProductForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { /* ... (logika sama) ... */ };

  return (
    // Gunakan Card shadcn dengan style gelap
    <Card className="bg-gray-800 border-gray-700 text-gray-300">
      <CardHeader>
        <CardTitle className="text-white">Tambah Produk Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4"> {/* Beri jarak antar field */}
          
          <div className="space-y-1.5"> {/* Grup Label & Input */}
            <Label htmlFor="name" className="text-gray-400">Nama Produk</Label>
            <Input id="name" name="name" placeholder="Nama Produk" required 
                   className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500" />
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-gray-400">Deskripsi</Label>
            <Textarea id="description" name="description" placeholder="Deskripsi produk" required 
                      className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500 min-h-[80px]" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-gray-400">Harga</Label>
              <Input id="price" name="price" type="number" placeholder="50000" required 
                     className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock" className="text-gray-400">Stok</Label>
              <Input id="stock" name="stock" type="number" placeholder="10" required 
                     className="bg-gray-700 border-gray-600 text-white focus:ring-blue-500" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="image" className="text-gray-400">Gambar Produk</Label>
            {/* Input file sedikit berbeda stylingnya */}
            <Input id="image" name="image" type="file" accept="image/*" required 
                   className="bg-gray-700 border-gray-600 text-gray-400 file:bg-gray-600 file:text-gray-200 file:border-0 file:hover:bg-gray-500 file:mr-3 file:px-3 file:py-1.5" />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700">
            {isLoading ? 'Mengupload...' : 'Tambah Produk'} 
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}