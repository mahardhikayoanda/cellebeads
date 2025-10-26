// File: app/admin/products/ProductActions.tsx
'use client'; // Ini adalah Client Component

import { useState } from 'react';
import Link from 'next/link';
import { deleteProduct, IProduct } from './actions'; // Import fungsi delete & tipe data

interface ProductActionsProps {
  product: IProduct;
}

export default function ProductActions({ product }: ProductActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    // Minta konfirmasi
    if (confirm(`Anda yakin ingin menghapus produk: ${product.name}?`)) {
      setIsDeleting(true);
      const result = await deleteProduct(product._id);
      setIsDeleting(false);

      if (result.success) {
        alert(result.message);
      } else {
        alert(`Error: ${result.message}`);
      }
    }
  };

  return (
    <td style={{ border: '1px solid #555', padding: '8px' }}>
      {/* Tombol Edit (kita siapkan untuk nanti) */}
      <Link href={`/admin/products/edit/${product._id}`}>
        <button style={{ marginRight: '5px', backgroundColor: 'orange', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Edit
        </button>
      </Link>
      
      {/* Tombol Hapus */}
      <button 
        onClick={handleDelete} 
        disabled={isDeleting}
        style={{ backgroundColor: 'red', color: 'white', padding: '5px 10px', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        {isDeleting ? 'Menghapus...' : 'Hapus'}
      </button>
    </td>
  );
}