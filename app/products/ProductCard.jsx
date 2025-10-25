'use client';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div>
      {/* <Image src={product.image} alt={product.name} width={200} height={200} /> */}
      <h3>{product.name}</h3>
      <p>Rp {product.price.toLocaleString('id-ID')}</p>
      <p>Stok: {product.stock}</p>
      <button onClick={() => addToCart(product)}>+ Keranjang</button>
      {/* TODO: Tambah tombol Favorit */}
    </div>
  );
}