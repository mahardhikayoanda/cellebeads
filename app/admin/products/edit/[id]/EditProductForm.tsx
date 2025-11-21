// File: app/admin/products/edit/[id]/EditProductForm.tsx
'use client';

import { useState, useEffect } from 'react';
import { IProduct, updateProduct } from '@/app/admin/products/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { 
  Pencil, Save, ArrowLeft, Package, DollarSign, 
  AlignLeft, ImageIcon, UploadCloud, Loader2 
} from 'lucide-react';

interface EditProductFormProps {
  product: IProduct;
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // State untuk harga terformat
  const [displayPrice, setDisplayPrice] = useState("");
  // State untuk nama file baru (opsional)
  const [fileName, setFileName] = useState<string>("");

  // Format harga saat komponen pertama kali dimuat
  useEffect(() => {
    if (product.price) {
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(product.price));
      setDisplayPrice(formatted);
    }
  }, [product.price]);

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
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Data Wajib untuk Update
      formData.append('id', product._id);
      // Pastikan mengambil gambar pertama jika array, atau string jika tunggal
      const oldImage = Array.isArray(product.images) ? product.images[0] : product.images;
      formData.append('oldImageUrl', oldImage || '');

      // Bersihkan format Rupiah menjadi angka
      const rawPrice = displayPrice.replace(/[^0-9]/g, '');
      formData.set('price', rawPrice);

      const result = await updateProduct(formData);

      if (result.success) {
        alert('Produk berhasil diperbarui!');
        router.push('/admin/products'); 
        router.refresh(); 
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

  // Ambil URL gambar utama untuk preview
  const currentImage = Array.isArray(product.images) && product.images.length > 0 
    ? product.images[0] 
    : (typeof product.images === 'string' ? product.images : '/placeholder-banner.jpg');

  return (
    <Card className="border-none shadow-md bg-white rounded-2xl overflow-hidden max-w-4xl">
      {/* Header Card */}
      <CardHeader className="bg-stone-50/50 border-b border-stone-100 px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600 border border-yellow-100">
               <Pencil size={20} />
             </div>
             <div>
               <CardTitle className="text-xl font-lora font-medium text-stone-800">Edit Produk</CardTitle>
               <CardDescription className="text-stone-500 text-sm mt-1">
                 Perbarui informasi produk <span className="font-semibold text-stone-700">"{product.name}"</span>
               </CardDescription>
             </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="text-stone-400 hover:text-stone-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* 1. Nama Produk */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-stone-600 font-medium flex items-center gap-2">
              <Package size={14} /> Nama Produk
            </Label>
            <Input 
              id="name" 
              name="name" 
              required 
              defaultValue={product.name}
              className="h-11 bg-stone-50 border-stone-200 focus:border-yellow-500/50 focus:ring-yellow-500/20 text-stone-800" 
            />
          </div>

          {/* 2. Deskripsi */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-stone-600 font-medium flex items-center gap-2">
              <AlignLeft size={14} /> Deskripsi
            </Label>
            <Textarea 
              id="description" 
              name="description" 
              required 
              defaultValue={product.description}
              className="min-h-[120px] bg-stone-50 border-stone-200 focus:border-yellow-500/50 focus:ring-yellow-500/20 resize-none text-stone-800" 
            />
          </div>

          {/* 3. Harga & Stok */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-stone-600 font-medium flex items-center gap-2">
                <DollarSign size={14} /> Harga
              </Label>
              <Input 
                id="price" 
                name="price" 
                type="text" 
                required 
                value={displayPrice}
                onChange={handlePriceChange}
                className="h-11 bg-stone-50 border-stone-200 focus:border-yellow-500/50 focus:ring-yellow-500/20 font-medium text-stone-800" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock" className="text-stone-600 font-medium flex items-center gap-2">
                <Package size={14} /> Stok
              </Label>
              <Input 
                id="stock" 
                name="stock" 
                type="number" 
                required 
                defaultValue={product.stock}
                className="h-11 bg-stone-50 border-stone-200 focus:border-yellow-500/50 focus:ring-yellow-500/20 text-stone-800" 
              />
            </div>
          </div>
          
          {/* 4. Area Gambar (Split View: Lama vs Baru) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-stone-100 pt-6">
            
            {/* Gambar Lama */}
            <div className="space-y-3">
              <Label className="text-stone-600 font-medium flex items-center gap-2">
                 <ImageIcon size={14} /> Gambar Saat Ini
              </Label>
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
                <Image 
                  src={currentImage} 
                  alt={product.name} 
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500" 
                />
              </div>
            </div>

            {/* Upload Gambar Baru */}
            <div className="space-y-3">
              <Label htmlFor="newImage" className="text-stone-600 font-medium flex items-center gap-2">
                 <UploadCloud size={14} /> Ganti Gambar (Opsional)
              </Label>
              <div className="relative group h-48">
                <div className="absolute inset-0 border-2 border-dashed border-stone-300 rounded-xl bg-stone-50 group-hover:bg-white group-hover:border-primary/50 transition-all flex flex-col items-center justify-center text-center p-4 cursor-pointer">
                   <div className="p-3 bg-white rounded-full shadow-sm mb-2 group-hover:scale-110 transition-transform text-primary">
                      <UploadCloud size={20} />
                   </div>
                   {fileName ? (
                      <p className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full break-all max-w-[90%]">
                        {fileName}
                      </p>
                   ) : (
                      <>
                        <p className="text-sm font-medium text-stone-600">Klik untuk ganti gambar</p>
                        <p className="text-xs text-stone-400 mt-1">Kosongkan jika tidak ingin mengubah</p>
                      </>
                   )}
                </div>
                <Input 
                  id="newImage" 
                  name="newImage" 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex gap-4 justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => router.back()}
              className="h-12 px-6 border-stone-300 text-stone-600 hover:bg-stone-100"
            >
              Batal
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading} 
              className="h-12 px-8 bg-stone-900 hover:bg-primary text-white shadow-lg transition-all hover:-translate-y-0.5"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-5 w-5" /> Simpan Perubahan
                </>
              )}
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
}