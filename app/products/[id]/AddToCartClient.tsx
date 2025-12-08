// File: app/products/[id]/AddToCartClient.tsx
'use client';

import { useState } from 'react';
import { useCart, ICartItem } from '@/context/CartContext';
import { IProduct } from '@/app/admin/products/actions'; 
import { Button } from '@/components/ui/button';
import { ShoppingCart, Zap, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import { toast } from 'sonner'; // Gunakan Toast pengganti alert

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

  const handleIncrement = () => {
    if (quantity < product.stock) setQuantity(q => q + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleAddToCart = () => {
    addToCart(createItem());
    toast.success(`${quantity}x ${product.name} masuk keranjang!`, {
        description: "Siap untuk dicheckout kapan saja."
    });
  };

  const handleBuyNow = () => {
    addToCart(createItem());
    router.push('/checkout');
  };

  if (product.stock === 0) {
    return (
      <div className="w-full p-4 bg-stone-100 rounded-xl text-center border border-stone-200">
         <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">Stok Habis</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* --- SELECTOR KUANTITAS (Desain Baru) --- */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-stone-500 uppercase tracking-wider min-w-[60px]">Jumlah</span>
        
        <div className="flex items-center bg-white border border-stone-200 rounded-full p-1 shadow-sm">
           <Button 
             variant="ghost" 
             size="icon" 
             onClick={handleDecrement}
             disabled={quantity <= 1}
             className="h-8 w-8 rounded-full hover:bg-pink-50 hover:text-pink-600 disabled:opacity-30"
           >
             <Minus size={16} />
           </Button>
           
           <div className="w-12 text-center font-bold text-stone-800 text-lg">
             {quantity}
           </div>

           <Button 
             variant="ghost" 
             size="icon" 
             onClick={handleIncrement}
             disabled={quantity >= product.stock}
             className="h-8 w-8 rounded-full hover:bg-pink-50 hover:text-pink-600 disabled:opacity-30"
           >
             <Plus size={16} />
           </Button>
        </div>
        
        <span className="text-xs font-medium text-stone-400">
           Tersedia: {product.stock}
        </span>
      </div>

      {/* --- TOMBOL AKSI --- */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Tombol Keranjang (Outline Mewah) */}
        <Button
          size="lg"
          variant="outline"
          onClick={handleAddToCart}
          className="flex-1 h-14 border-2 border-pink-200 text-pink-700 hover:bg-pink-50 hover:border-pink-300 font-bold rounded-2xl transition-all"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Masuk Keranjang
        </Button>

        {/* Tombol Beli Langsung (Gradient Mewah) */}
        <Button
          size="lg"
          onClick={handleBuyNow}
          className="flex-1 h-14 bg-gradient-to-r from-stone-800 to-stone-900 hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-2xl shadow-xl shadow-stone-900/10 hover:shadow-pink-500/20 transition-all hover:-translate-y-0.5"
        >
          <Zap className="h-5 w-5 mr-2 fill-current" />
          Beli Sekarang
        </Button>
      </div>
    </div>
  );
}