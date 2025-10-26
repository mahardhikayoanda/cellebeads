// File: app/admin/products/edit/[id]/EditProductForm.tsx
'use client';

import { useState } from 'react';
import { IProduct, updateProduct } from '@/app/admin/products/actions';
import Image from 'next/image';
import { useRouter } from 'next/navigation'; // Import useRouter

interface EditProductFormProps {
  product: IProduct; // Menerima data produk yang akan diedit
}

export default function EditProductForm({ product }: EditProductFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter(); // Inisialisasi router

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    // Kita tambahkan ID dan URL gambar lama ke formData
    formData.append('id', product._id);
    formData.append('oldImageUrl', product.image);

    const result = await updateProduct(formData); // Panggil server action

    setIsLoading(false);

    if (result.success) {
      alert(result.message);
      // Arahkan admin kembali ke halaman daftar produk
      router.push('/admin/products');
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  // Style
  const inputStyle: React.CSSProperties = {
    width: '100%', color: 'white', backgroundColor: '#333',
    padding: '8px', border: '1px solid #555', borderRadius: '4px', boxSizing: 'border-box'
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '10px' }}>
        <label>Nama Produk: </label>
        <input name="name" required style={inputStyle} 
          defaultValue={product.name} // Isi data yang sudah ada
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Deskripsi: </label>
        <textarea name="description" required style={{...inputStyle, minHeight: '80px'}}
          defaultValue={product.description} // Isi data yang sudah ada
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Harga: </label>
        <input name="price" type="number" required style={inputStyle} 
          defaultValue={product.price} // Isi data yang sudah ada
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Stok: </label>
        <input name="stock" type="number" required style={inputStyle} 
          defaultValue={product.stock} // Isi data yang sudah ada
        />
      </div>
      
      <div style={{ marginBottom: '10px' }}>
        <label>Gambar Saat Ini: </label>
        <Image src={product.image} alt={product.name} width={100} height={100} style={{ objectFit: 'cover', borderRadius: '4px' }} />
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label>Ganti Gambar (Opsional): </label>
        <input 
          name="newImage" // Nama harus beda
          type="file" 
          accept="image/*" 
          style={inputStyle} 
        />
      </div>

      <button 
        type="submit" 
        disabled={isLoading} 
        style={{ padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </form>
  );
}