// File: app/products/ProductCard.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
// 1. IMPORT KOMPONEN BUTTON BARU ANDA
import { Button } from "@/components/ui/button"; 

// ... (interface IProduct, interface ProductCardProps) ...

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product);
    alert(`${product.name} telah ditambahkan ke keranjang!`);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-md overflow-hidden flex flex-col group transition-shadow hover:shadow-xl">
      <div className="relative w-full h-64 overflow-hidden">
        <Image 
          src={product.image} alt={product.name} layout="fill" objectFit="cover"
          className="transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
      
      <div className="p-4 flex flex-col grow">
        <h3 className="text-lg font-lora font-medium text-stone-800 mb-2">{product.name}</h3>
        <p className="text-gray-500 text-sm mb-4 grow">
          {product.description.substring(0, 100)}...
        </p>
        <p className="text-lg font-bold text-stone-900 mb-2">
          Rp {product.price.toLocaleString('id-ID')}
        </p>
        <p className="text-sm text-gray-400 mb-4">
          Stok: {product.stock}
        </p>
        
        {/* --- GANTI TOMBOL LAMA DENGAN KOMPONEN BARU --- */}
        <Button 
          onClick={handleAddToCart} 
          disabled={product.stock === 0}
          // Anda bisa menambahkan variant (misal: "secondary", "destructive") atau size
          className="w-full mt-auto" // ClassName tambahan jika perlu
          variant={product.stock === 0 ? "secondary" : "default"} // Contoh ganti variant
        >
          {product.stock === 0 ? 'Stok Habis' : '+ Keranjang'}
        </Button>
        {/* ------------------------------------------- */}

      </div>
    </div>
  );
}