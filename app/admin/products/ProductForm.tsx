// File: app/admin/products/ProductForm.tsx
'use client'; 

import { useState } from 'react';
import { createProduct } from './actions'; 

export default function ProductForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setIsLoading(true); 
    const formData = new FormData(e.currentTarget); 
    const result = await createProduct(formData); 
    setIsLoading(false); 
    if (result.success) { alert(result.message); e.currentTarget.reset(); } 
    else { alert(`Error: ${result.message}`); }
  };

  // Style input gelap
  const inputClassName = "w-full bg-gray-700 border border-gray-600 text-white rounded-md p-2 focus:ring-blue-500 focus:border-blue-500";

  return (
    // Form dengan background gelap dan border
    <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md border border-gray-700">
      <h2 className="text-2xl font-semibold text-white mb-6">Tambah Produk Baru</h2>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">Nama Produk</label>
        <input name="name" placeholder="Nama Produk" required className={inputClassName} />
      </div>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-300 mb-1">Deskripsi</label>
        <textarea name="description" placeholder="Deskripsi produk" required className={`${inputClassName} min-h-[80px]`} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Harga</label>
          <input name="price" type="number" placeholder="50000" required className={inputClassName} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Stok</label>
          <input name="stock" type="number" placeholder="10" required className={inputClassName} />
        </div>
      </div>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-1">Gambar Produk</label>
        <input name="image" type="file" accept="image/*" required 
          // Style input file gelap
          className={`${inputClassName} file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500`} 
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading} 
        // Tombol biru
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-md transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Mengupload...' : 'Tambah Produk'} 
      </button>
    </form>
  );
}