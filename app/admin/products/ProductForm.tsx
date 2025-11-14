// File: app/admin/products/ProductForm.tsx
'use client'; 

import { useState, useRef } from 'react';
import { createProduct } from './actions'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProductForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  const [category, setCategory] = useState("Gelang"); // State untuk kategori

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // --- PERBAIKAN PENTING DI SINI ---
      // Paksa set nilai 'category' dari state React ke dalam FormData
      // Ini menjamin kategori terkirim meskipun input hidden Select tidak terbaca
      formData.set('category', category); 
      // ---------------------------------

      const result = await createProduct(formData);

      if (result.success) {
        alert("Produk berhasil ditambahkan!");
        formRef.current?.reset();
        setCategory("Gelang"); 
      } else {
        alert("Gagal: " + result.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan server.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700 text-gray-300">
      <CardHeader>
        <CardTitle className="text-white">Tambah Produk Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5"> 
            <Label htmlFor="name" className="text-gray-400">Nama Produk</Label>
            <Input id="name" name="name" placeholder="Nama Produk" required className="bg-gray-700 border-gray-600 text-white" />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category" className="text-gray-400">Kategori</Label>
            <Select 
              value={category} 
              onValueChange={setCategory} 
              name="category" // name tetap ada sebagai cadangan
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gelang">Gelang</SelectItem>
                <SelectItem value="Kalung">Kalung</SelectItem>
                <SelectItem value="Cincin">Cincin</SelectItem>
                <SelectItem value="Keychain">Keychain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-gray-400">Deskripsi</Label>
            <Textarea id="description" name="description" placeholder="Deskripsi" required className="bg-gray-700 border-gray-600 text-white min-h-[80px]" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price" className="text-gray-400">Harga</Label>
              <Input id="price" name="price" type="number" required className="bg-gray-700 border-gray-600 text-white" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock" className="text-gray-400">Stok</Label>
              <Input id="stock" name="stock" type="number" required className="bg-gray-700 border-gray-600 text-white" />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="images" className="text-gray-400">Gambar Produk</Label>
            <Input 
              id="images" name="images" type="file" accept="image/*" multiple required 
              className="bg-gray-700 border-gray-600 text-gray-400 file:bg-gray-600 file:text-gray-200 file:border-0" 
            />
            <p className="text-xs text-gray-500">Tekan Ctrl/Cmd untuk memilih banyak foto.</p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {isLoading ? 'Mengupload...' : 'Tambah Produk'} 
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}