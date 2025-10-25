'use client'; // Karena ada tombol 'onClick'

import { useCart } from '@/context/CartContext';
// import Image from 'next/image'; // Opsional jika Anda ingin menampilkan gambar

// Tipe data untuk props product
interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  image: string;
}

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Ambil fungsi addToCart dari context
  // Ini sekarang akan berhasil karena '@/context/CartContext' sudah benar
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} telah ditambahkan ke keranjang!`);
  };

  return (
    <div style={{ border: '1px solid #555', padding: '15px', borderRadius: '8px', width: '250px' }}>
      {/* <Image 
        src={product.image} 
        alt={product.name} 
        width={250} 
        height={250} 
        style={{ objectFit: 'cover' }} 
      /> 
      */}
      <h3 style={{ fontSize: '1.2rem', margin: '10px 0' }}>{product.name}</h3>
      <p style={{ color: '#aaa', fontSize: '0.9rem', minHeight: '40px' }}>{product.description.substring(0, 50)}...</p>
      <p style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Rp {product.price.toLocaleString('id-ID')}</p>
      <p style={{ fontSize: '0.9rem' }}>Stok: {product.stock}</p>
      <button 
        onClick={handleAddToCart} 
        disabled={product.stock === 0}
        style={{ width: '100%', padding: '10px', backgroundColor: 'green', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
      >
        {product.stock === 0 ? 'Stok Habis' : '+ Keranjang'}
      </button>
    </div>
  );
}