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
  
  // 1. UBAH DI SINI: Inisialisasi dengan string kosong "" agar muncul placeholder
  const [category, setCategory] = useState(""); 
  
  // State untuk tampilan harga (Rp ...)
  const [displayPrice, setDisplayPrice] = useState(""); 

  // Fungsi format Rupiah
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numberString = value.replace(/[^0-9]/g, '');
    
    if (!numberString) {
      setDisplayPrice("");
      return;
    }

    const formatted = new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(Number(numberString));

    setDisplayPrice(formatted);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi tambahan: Pastikan kategori dipilih
    if (!category) {
        alert("Mohon pilih kategori produk terlebih dahulu.");
        return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      
      // Proses harga (hapus Rp dan titik)
      const rawPrice = displayPrice.replace(/[^0-9]/g, '');
      formData.set('price', rawPrice); 
      
      // Set kategori dari state
      formData.set('category', category); 

      const result = await createProduct(formData);

      if (result.success) {
        alert("Produk berhasil ditambahkan!");
        formRef.current?.reset();
        
        // 2. UBAH DI SINI: Reset kategori kembali ke kosong
        setCategory(""); 
        
        setDisplayPrice(""); // Reset harga
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
            {/* 3. Select akan menampilkan placeholder karena value awalnya "" */}
            <Select 
              value={category} 
              onValueChange={setCategory} 
              name="category" 
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Gelang">Gelang</SelectItem>
                <SelectItem value="Kalung">Kalung</SelectItem>
                <SelectItem value="Cincin">Cincin</SelectItem>
                <SelectItem value="Keychain">Keychain</SelectItem>
                <SelectItem value="Strap Handphone">Strap Handphone</SelectItem>
                <SelectItem value="Jam Manik">Jam Manik</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1.5">
            <Label htmlFor="description">Deskripsi</Label>
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
              <Input 
                id="price" 
                name="price" 
                type="text" 
                placeholder="Rp 0" 
                value={displayPrice}
                onChange={handlePriceChange}
                required 
              />
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