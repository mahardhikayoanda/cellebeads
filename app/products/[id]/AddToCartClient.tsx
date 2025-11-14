// File: app/products/[id]/AddToCartClient.tsx
'use client';

import { useState } from 'react';
import { useCart, ICartItem } from '@/context/CartContext';
import { IProduct } from '@/app/admin/products/actions'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, CreditCard } from 'lucide-react'; // Import ikon CreditCard
import { useRouter } from 'next/navigation'; // Import router untuk redirect

interface AddToCartProps {
  product: IProduct;
}

export default function AddToCartClient({ product }: AddToCartProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  // Helper untuk membuat objek item
  const createItem = (): ICartItem => {
    const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder-banner.jpg';
    return {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: mainImage,
      quantity: Number(quantity), 
      selected: true, 
    };
  };

  const handleAddToCart = () => {
    addToCart(createItem());
    alert(`${quantity}x ${product.name} berhasil masuk keranjang!`);
  };

  const handleBuyNow = () => {
    // 1. Masukkan ke keranjang
    addToCart(createItem());
    // 2. Langsung arahkan ke halaman checkout
    router.push('/checkout');
  };

  if (product.stock === 0) {
    return (
      <Button disabled className="w-full bg-gray-300 text-gray-500 cursor-not-allowed">
        Stok Habis
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Input Jumlah */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-stone-700">Jumlah:</span>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          max={product.stock} 
          className="w-20 text-center h-10" 
        />
        <span className="text-xs text-stone-500">Tersedia: {product.stock}</span>
      </div>

      {/* Grup Tombol Aksi */}
      <div className="flex gap-3">
        {/* Tombol Keranjang (Outline) */}
        <Button
          size="lg"
          variant="outline"
          onClick={handleAddToCart}
          className="flex-1 border-rose-500 text-rose-500 hover:bg-rose-50"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          + Keranjang
        </Button>

        {/* Tombol Beli Sekarang (Solid) */}
        <Button
          size="lg"
          onClick={handleBuyNow}
          className="flex-1 bg-rose-600 hover:bg-rose-700 text-white"
        >
          <CreditCard className="h-5 w-5 mr-2" />
          Beli Sekarang
        </Button>
      </div>
    </div>
  );
}