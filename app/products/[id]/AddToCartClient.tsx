// File: app/products/[id]/AddToCartClient.tsx
'use client';

import { useState } from 'react';
import { useCart, ICartItem } from '@/context/CartContext';
import { IProduct, IModel } from '@/app/admin/products/actions'; // Import IModel
import { Button } from '@/components/ui/button';
import { ShoppingCart, Zap, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import { toast } from 'sonner';

interface AddToCartProps {
  product: IProduct;
}

export default function AddToCartClient({ product }: AddToCartProps) {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedModel, setSelectedModel] = useState<IModel | null>(null); // State simpan object model penuh
  const router = useRouter();

  // Helper Models
  // Sekarang product.models adalah array of objects {name, price}
  const models = product.models as unknown as IModel[]; 
  const hasModels = models && models.length > 0;

  const createItem = (): ICartItem => {
    const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder-banner.jpg';
    
    // LOGIKA PENTING: Gunakan harga model jika ada model dipilih, jika tidak gunakan harga produk
    const finalPrice = selectedModel ? selectedModel.price : product.price;

    return {
      _id: product._id,
      name: product.name,
      price: finalPrice, // <--- HARGA SESUAI VARIAN
      image: mainImage,
      quantity: Number(quantity), 
      selected: true, 
      selectedModel: selectedModel ? selectedModel.name : undefined,
    };
  };

  const handleIncrement = () => {
    if (quantity < product.stock) setQuantity(q => q + 1);
    else toast.warning("Stok maksimal tercapai.");
  };

  const handleDecrement = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const handleAddToCart = () => {
    if (hasModels && !selectedModel) {
        toast.error("Harap pilih varian model terlebih dahulu!");
        return;
    }
    addToCart(createItem());
    toast.success("Berhasil masuk keranjang!", {
        description: selectedModel ? `${quantity}x ${product.name} (${selectedModel.name})` : `${quantity}x ${product.name}`
    });
  };

  const handleBuyNow = () => {
    if (hasModels && !selectedModel) {
        toast.error("Harap pilih varian model terlebih dahulu!");
        return;
    }
    addToCart(createItem());
    router.push('/checkout');
  };

  if (product.stock === 0) {
    return (
      <div className="w-full p-4 bg-stone-100 rounded-2xl text-center border border-stone-200">
         <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">Stok Habis</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* --- PILIHAN MODEL & HARGA --- */}
      {hasModels && (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-stone-500 uppercase tracking-wider">Pilih Varian:</span>
                {/* Tampilkan harga dinamis varian yang dipilih */}
                {selectedModel && (
                    <span className="text-lg font-bold text-pink-600 animate-in fade-in">
                        Rp {selectedModel.price.toLocaleString('id-ID')}
                    </span>
                )}
            </div>
            
            <div className="flex flex-wrap gap-2">
                {models.map((model) => (
                    <button
                        key={model.name}
                        onClick={() => setSelectedModel(model)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                            selectedModel?.name === model.name
                                ? "bg-stone-800 text-white border-stone-800 shadow-md scale-105"
                                : "bg-white text-stone-600 border-stone-200 hover:border-pink-300 hover:bg-pink-50"
                        }`}
                    >
                        {model.name}
                    </button>
                ))}
            </div>
            {!selectedModel && <p className="text-xs text-rose-500">*Wajib dipilih untuk melihat harga pas</p>}
        </div>
      )}

      {/* Selector Kuantitas & Tombol (SAMA SEPERTI SEBELUMNYA) */}
      <div className="flex items-center gap-4">
         <span className="text-sm font-bold text-stone-500 uppercase tracking-wider min-w-[60px]">Jumlah</span>
         <div className="flex items-center bg-white border border-stone-200 rounded-full p-1 shadow-sm">
            <Button variant="ghost" size="icon" onClick={handleDecrement} disabled={quantity <= 1} className="h-9 w-9 rounded-full hover:bg-pink-50 hover:text-pink-600 disabled:opacity-30 text-stone-500"><Minus size={16} /></Button>
            <div className="w-12 text-center font-bold text-stone-800 text-lg">{quantity}</div>
            <Button variant="ghost" size="icon" onClick={handleIncrement} disabled={quantity >= product.stock} className="h-9 w-9 rounded-full hover:bg-pink-50 hover:text-pink-600 disabled:opacity-30 text-stone-500"><Plus size={16} /></Button>
         </div>
         <span className="text-xs font-medium text-stone-400 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">Stok: {product.stock}</span>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button size="lg" variant="outline" onClick={handleAddToCart} className="flex-1 h-14 border-2 border-pink-200 text-pink-700 font-bold rounded-2xl hover:-translate-y-0.5 transition-all">
          <ShoppingCart className="h-5 w-5 mr-2" /> Masuk Keranjang
        </Button>
        <Button size="lg" onClick={handleBuyNow} className="flex-1 h-14 bg-gradient-to-r from-stone-800 to-stone-900 text-white font-bold rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all group">
          <Zap className="h-5 w-5 mr-2 fill-current group-hover:text-yellow-300 transition-colors" /> Beli Sekarang
        </Button>
      </div>
    </div>
  );
}