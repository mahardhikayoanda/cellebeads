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
  const [category, setCategory] = useState("Gelang"); 

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set('category', category); 
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
    // Menggunakan Card tema terang (default)
    <Card>
      <CardHeader>
        <CardTitle>Tambah Produk Baru</CardTitle>
      </CardHeader>
      <CardContent>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          
          <div className="space-y-1.5"> 
            <Label htmlFor="name">Nama Produk</Label>
            <Input id="name" name="name" placeholder="Nama Produk" required />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="category">Kategori</Label>
            <Select 
              value={category} 
              onValueChange={setCategory} 
              name="category" 
            >
              <SelectTrigger>
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
            <Label htmlFor="description">Deskripsi</Label>
            {/* PERBAIKAN DI SINI: 
              'min-h-[80px]' dipindahkan ke dalam 'className'
            */}
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Deskripsi" 
              required 
              className="min-h-[80px]" 
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="price">Harga</Label>
              <Input id="price" name="price" type="number" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="stock">Stok</Label>
              <Input id="stock" name="stock" type="number" required />
            </div>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="images">Gambar Produk</Label>
            <Input id="images" name="images" type="file" accept="image/*" multiple required />
            <p className="text-xs text-muted-foreground">Tekan Ctrl/Cmd untuk memilih banyak foto.</p>
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? 'Mengupload...' : 'Tambah Produk'} 
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}