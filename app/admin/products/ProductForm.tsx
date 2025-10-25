'use client'; 

import { useRef } from 'react';
import { createProduct } from './actions'; 

export default function ProductForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (formData: FormData) => {
    const result = await createProduct(formData);
    if (result.success) {
      alert(result.message);
      formRef.current?.reset(); 
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  // --- STYLE DIPERBAIKI DI BAWAH INI ---
  const inputStyle: React.CSSProperties = {
    width: '100%',
    color: 'white', // Teks menjadi putih
    backgroundColor: '#333', // Background menjadi abu-abu gelap
    padding: '8px',
    border: '1px solid #555',
    borderRadius: '4px',
    boxSizing: 'border-box' // Penting agar padding tidak merusak layout
  };
  // ------------------------------------

  return (
    <form ref={formRef} action={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #555' }}>
      <h2>Tambah Produk Baru</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Nama Produk: </label>
        <input 
          name="name" 
          placeholder="Nama Produk" 
          required 
          style={inputStyle} // Terapkan style baru
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Deskripsi: </label>
        <textarea 
          name="description" 
          placeholder="Deskripsi" 
          required 
          style={{...inputStyle, minHeight: '80px'}} // Terapkan style baru
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Harga: </label>
        <input 
          name="price" 
          type="number" 
          placeholder="Harga (cth: 50000)" 
          required 
          style={inputStyle} // Terapkan style baru
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Stok: </label>
        <input 
          name="stock" 
          type="number" 
          placeholder="Stok (cth: 10)" 
          required 
          style={inputStyle} // Terapkan style baru
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>URL Gambar: </label>
        <input 
          name="image" 
          placeholder="httpsData:image/png;base64,..." 
          required 
          style={inputStyle} // Terapkan style baru
        />
      </div>
      <button type="submit" style={{ padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px' }}>
        Tambah Produk
      </button>
    </form>
  );
}