// File: app/admin/products/ProductForm.tsx
'use client'; 

import { useState, useRef } from 'react';
import { createProduct } from './actions'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'; 
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Package, DollarSign, Layers, AlignLeft, Image as ImageIcon, UploadCloud, Loader2, Plus } from 'lucide-react';

export default function ProductForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const formRef = useRef<HTMLFormElement>(null);
  
  const [category, setCategory] = useState(""); 
  const [displayPrice, setDisplayPrice] = useState(""); 
  const [fileName, setFileName] = useState<string>(""); // State untuk nama file

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // Tampilkan nama file pertama + jumlah file lainnya jika ada
      const count = e.target.files.length;
      if (count === 1) setFileName(e.target.files[0].name);
      else setFileName(`${count} gambar dipilih`);
    } else {
      setFileName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!category) {
        alert("Mohon pilih kategori produk terlebih dahulu.");
        return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const rawPrice = displayPrice.replace(/[^0-9]/g, '');
      formData.set('price', rawPrice); 
      formData.set('category', category); 

      const result = await createProduct(formData);

      if (result.success) {
        alert("Produk berhasil ditambahkan!");
        formRef.current?.reset();
        setCategory(""); 
        setDisplayPrice(""); 
        setFileName("");
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
    <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden">
      <CardHeader className="bg-stone-50/50 border-b border-stone-100 px-8 py-6">
        <div className="flex items-center gap-3">
           <div className="p-2 bg-primary/10 rounded-lg text-primary">
             <Plus size={20} />
           </div>
           <div>
             <CardTitle className="text-xl font-lora font-medium text-stone-800">Tambah Produk Baru</CardTitle>
             <CardDescription className="text-stone-500 text-sm mt-1">Lengkapi formulir di bawah untuk menambahkan item ke katalog.</CardDescription>
           </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-8">
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-8">
          
          {/* Section 1: Informasi Dasar (Grid 2 Kolom) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2"> 
              <Label htmlFor="name" className="text-stone-600 font-medium flex items-center gap-2">
                <Package size={14} /> Nama Produk
              </Label>
              <Input id="name" name="name" placeholder="Contoh: Gelang Mutiara..." required className="h-11 bg-stone-50 border-stone-200 focus:border-primary/50 focus:ring-primary/20" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category" className="text-stone-600 font-medium flex items-center gap-2">
                <Layers size={14} /> Kategori
              </Label>
              <Select value={category} onValueChange={setCategory} name="category" required>
                <SelectTrigger className="h-11 bg-stone-50 border-stone-200 focus:ring-primary/20">
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
          </div>
          
          {/* Section 2: Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-stone-600 font-medium flex items-center gap-2">
              <AlignLeft size={14} /> Deskripsi
            </Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Jelaskan detail produk, bahan, dan ukurannya..." 
              required 
              className="min-h-[120px] bg-stone-50 border-stone-200 focus:border-primary/50 focus:ring-primary/20 resize-none" 
            />
          </div>
          
          {/* Section 3: Harga & Stok */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-stone-600 font-medium flex items-center gap-2">
                <DollarSign size={14} /> Harga
              </Label>
              <div className="relative">
                 <Input 
                    id="price" 
                    name="price" 
                    type="text" 
                    placeholder="Rp 0" 
                    value={displayPrice}
                    onChange={handlePriceChange}
                    required 
                    className="h-11 pl-4 bg-stone-50 border-stone-200 focus:border-primary/50 focus:ring-primary/20 font-medium text-stone-800"
                  />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-stone-600 font-medium flex items-center gap-2">
                <Package size={14} /> Stok
              </Label>
              <Input 
                id="stock" name="stock" type="number" placeholder="0" required 
                className="h-11 bg-stone-50 border-stone-200 focus:border-primary/50 focus:ring-primary/20" 
              />
            </div>
          </div>
          
          {/* Section 4: Upload Gambar (Modern Dropzone Look) */}
          <div className="space-y-2">
            <Label htmlFor="images" className="text-stone-600 font-medium flex items-center gap-2">
              <ImageIcon size={14} /> Foto Produk
            </Label>
            
            <div className="relative group">
              <div className="border-2 border-dashed border-stone-300 rounded-xl p-8 transition-all duration-300 bg-stone-50 hover:bg-stone-100 hover:border-primary/50 flex flex-col items-center justify-center text-center cursor-pointer">
                 <div className="p-3 bg-white rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform text-primary">
                    <UploadCloud size={24} />
                 </div>
                 {fileName ? (
                    <p className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">{fileName}</p>
                 ) : (
                    <>
                      <p className="text-sm font-medium text-stone-700">Klik untuk upload gambar</p>
                      <p className="text-xs text-stone-400 mt-1">Format: JPG, PNG (Bisa pilih banyak)</p>
                    </>
                 )}
              </div>
              {/* Input File yang Sebenarnya (Hidden tapi menutupi area) */}
              <Input 
                id="images" name="images" type="file" accept="image/*" multiple required 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full h-12 text-base font-medium bg-stone-800 hover:bg-stone-900 shadow-lg shadow-stone-900/10 transition-all hover:-translate-y-0.5">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menyimpan...
                </>
              ) : (
                'Simpan Produk'
              )}
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}