// File: app/products/[id]/AddToCartClient.tsx
'use client';

import { useState } from 'react';
import { useCart, ICartItem } from '@/context/CartContext';
import { IProduct } from '@/app/admin/products/actions'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, Zap } from 'lucide-react'; // Ganti CreditCard dengan Zap
import { useRouter } from 'next/navigation'; 

interface AddToCartProps {
  product: IProduct;
}

export default function AddToCartClient({ product }: AddToCartProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

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
    addToCart(createItem());
    router.push('/checkout');
  };

  if (product.stock === 0) {
    return (
      <Button disabled className="w-full h-12 bg-stone-200 text-stone-500 cursor-not-allowed rounded-xl font-bold">
        Stok Habis
      </Button>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Input Jumlah dengan Style Baru */}
      <div className="flex items-center gap-4 bg-stone-50 p-3 rounded-xl w-fit border border-stone-100">
        <span className="text-sm font-bold text-stone-600 uppercase tracking-wide">Jumlah</span>
        <div className="h-8 w-[1px] bg-stone-200"></div>
        <Input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          max={product.stock} 
          className="w-16 text-center h-8 font-bold text-lg border-none bg-transparent focus-visible:ring-0 p-0" 
        />
        <span className="text-xs font-medium text-stone-400">/ {product.stock}</span>
      </div>

      {/* Grup Tombol Aksi */}
      <div className="flex gap-3">
        {/* Tombol Keranjang (Pink Outline) */}
        <Button
          size="lg"
          variant="outline"
          onClick={handleAddToCart}
          className="flex-1 h-12 border-2 border-primary text-primary hover:bg-pink-50 font-bold rounded-xl"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Keranjang
        </Button>

        {/* Tombol Beli Sekarang (Teal Solid) */}
        <Button
          size="lg"
          onClick={handleBuyNow}
          className="flex-1 h-12 bg-accent hover:bg-teal-600 text-white font-bold rounded-xl shadow-lg shadow-teal-200 transition-transform hover:-translate-y-0.5"
        >
          <Zap className="h-5 w-5 mr-2" />
          Beli Langsung
        </Button>
      </div>
    </div>
  );
}