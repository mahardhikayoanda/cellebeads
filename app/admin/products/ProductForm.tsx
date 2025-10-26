'use client'; 

import { useState } from 'react'; // <-- 1. IMPORT useState
import { createProduct } from './actions'; 

export default function ProductForm() {
  // 2. Tambahkan state untuk loading
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Mencegah refresh halaman
    setIsLoading(true); // Mulai loading

    // 3. Buat FormData langsung dari form event
    const formData = new FormData(e.currentTarget); 
    
    const result = await createProduct(formData); // Kirim form ke Server Action

    setIsLoading(false); // Selesai loading

    if (result.success) {
      alert(result.message);
      e.currentTarget.reset(); // Reset form jika berhasil
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  // Style input
  const inputStyle: React.CSSProperties = {
    width: '100%',
    color: 'white',
    backgroundColor: '#333',
    padding: '8px',
    border: '1px solid #555',
    borderRadius: '4px',
    boxSizing: 'border-box'
  };

  return (
    // 4. Hapus 'action', ganti dengan 'onSubmit'
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '20px', border: '1px solid #555' }}>
      <h2>Tambah Produk Baru</h2>
      <div style={{ marginBottom: '10px' }}>
        <label>Nama Produk: </label>
        <input name="name" placeholder="Nama Produk" required style={inputStyle} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Deskripsi: </label>
        <textarea name="description" placeholder="Deskripsi" required style={{...inputStyle, minHeight: '80px'}} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Harga: </label>
        <input name="price" type="number" placeholder="Harga (cth: 50000)" required style={inputStyle} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label>Stok: </label>
        <input name="stock" type="number" placeholder="Stok (cth: 10)" required style={inputStyle} />
      </div>
      
      {/* --- INI YANG BERUBAH --- */}
      <div style={{ marginBottom: '10px' }}>
        <label>Gambar Produk: </label>
        <input 
          name="image" 
          type="file" // <-- 5. UBAH MENJADI 'file'
          accept="image/*" // Hanya izinkan file gambar
          required 
          style={inputStyle} 
        />
      </div>
      {/* ------------------------ */}

      <button 
        type="submit" 
        disabled={isLoading} // Tombol disable saat loading
        style={{ padding: '10px', backgroundColor: 'blue', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        {isLoading ? 'Mengupload...' : 'Tambah Produk'} 
      </button>
    </form>
  );
}