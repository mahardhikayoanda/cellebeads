// File: app/admin/products/edit/[id]/EditProductForm.tsx
'use client';

import { useState } from 'react';
import { IProduct, updateProduct } from '@/app/admin/products/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface EditProductFormProps { product: IProduct; }

export default function EditProductForm({ product }: EditProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.append('id', product._id);
    formData.append('oldImageUrl', product.image);
    const result = await updateProduct(formData); 
    setIsLoading(false);
    if (result.success) { alert(result.message); router.push('/admin/products'); } 
    else { alert(`Error: ${result.message}`); }
  };

  // Style input gelap
  const inputClassName = "w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    // Form gelap (tidak perlu container terpisah karena halaman edit sudah gelap)
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">Nama Produk</label>
        <input name="name" required className={inputClassName} defaultValue={product.name} />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi</label>
        <textarea name="description" required className={`${inputClassName} min-h-[80px]`} defaultValue={product.description} />
      </div>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Harga</label>
          <input name="price" type="number" required className={inputClassName} defaultValue={product.price} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Stok</label>
          <input name="stock" type="number" required className={inputClassName} defaultValue={product.stock} />
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">Gambar Saat Ini</label>
        <Image src={product.image} alt={product.name} width={100} height={100} className="object-cover rounded-md border border-gray-700" />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-1">Ganti Gambar (Opsional)</label>
        <input name="newImage" type="file" accept="image/*" 
          // Style input file gelap
          className={`${inputClassName} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500`} 
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading} 
        // Tombol Simpan hijau
        className="w-full py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-md shadow-md transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </form>
  );
}