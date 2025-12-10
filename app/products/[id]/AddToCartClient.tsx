// File: app/products/[id]/AddToCartClient.tsx
'use client';

import { useState } from 'react';
import { useCart, ICartItem } from '@/context/CartContext';
import { IProduct } from '@/app/admin/products/actions'; 
import { Button } from '@/components/ui/button';
import { ShoppingCart, Zap, Plus, Minus } from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import { toast } from 'sonner';

// Definisi Lokal untuk keamanan tipe data
type ModelType = string | { name: string; price?: number };

interface AddToCartProps {
  product: IProduct;
}

export default function AddToCartClient({ product }: AddToCartProps) {
  const { addToCart, setDirectCheckoutItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedModel, setSelectedModel] = useState<string | null>(null); 
  const router = useRouter();

  // Aman mengambil models, default ke array kosong jika null
  const rawModels = (product.models || []) as ModelType[];
  const hasModels = rawModels.length > 0;

  // Helper untuk mendapatkan nama & harga model dengan aman
  const getModelName = (m: ModelType) => (typeof m === 'string' ? m : m.name);
  const getModelPrice = (m: ModelType) => (typeof m === 'object' && m.price ? m.price : product.price);

  const createItem = (): ICartItem => {
    const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder-banner.jpg';
    
    // Cari object model terpilih untuk cek harga (jika ada variasi harga)
    const selectedModelObj = rawModels.find(m => getModelName(m) === selectedModel);
    const finalPrice = selectedModelObj ? getModelPrice(selectedModelObj) : product.price;

    return {
      _id: product._id,
      name: product.name,
      price: finalPrice, 
      image: mainImage,
      quantity: Number(quantity), 
      selected: true, 
      selectedModel: selectedModel || undefined,
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
        toast.warning("Pilih Varian Dulu", {
            description: "Silakan pilih model yang kamu inginkan."
        });
        return;
    }

    addToCart(createItem());
    
    // Notifikasi Sukses dengan Aksi
    toast.success("Masuk Keranjang! 🛍️", {
        description: selectedModel ? `${quantity}x ${product.name} (${selectedModel})` : `${quantity}x ${product.name}`,
        action: {
            label: "Lihat Cart",
            onClick: () => router.push('/cart')
        },
        duration: 3000
    });
  };

  const handleBuyNow = () => {
    if (hasModels && !selectedModel) {
        toast.warning("Pilih Varian Dulu");
        return;
    }
    
    // Simpan ke state khusus Direct Checkout
    setDirectCheckoutItem(createItem());
    router.push('/checkout');
  };

  if (product.stock === 0) {
    return (
      <div className="w-full p-4 bg-stone-100 rounded-2xl text-center border border-stone-200 mt-4">
         <p className="text-stone-500 font-bold uppercase tracking-widest text-sm">Stok Habis</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      
      {/* Pilihan Model / Varian */}
      {hasModels && (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-stone-500 uppercase tracking-wider">Pilih Varian:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
                {rawModels.map((model, idx) => {
                    const name = getModelName(model);
                    const isSelected = selectedModel === name;
                    
                    return (
                        <button
                            key={idx}
                            onClick={() => setSelectedModel(name)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                                isSelected
                                    ? "bg-stone-800 text-white border-stone-800 shadow-md transform scale-105"
                                    : "bg-white text-stone-600 border-stone-200 hover:border-pink-300 hover:bg-pink-50"
                            }`}
                        >
                            {name}
                        </button>
                    );
                })}
            </div>
            {!selectedModel && <p className="text-xs text-rose-500 font-medium">*Wajib dipilih</p>}
        </div>
      )}

      {/* Kontrol Jumlah & Stok */}
      <div className="flex items-center gap-4">
         <span className="text-sm font-bold text-stone-500 uppercase tracking-wider min-w-[60px]">Jumlah</span>
         <div className="flex items-center bg-white border border-stone-200 rounded-full p-1 shadow-sm hover:shadow-md transition-shadow">
            <Button variant="ghost" size="icon" onClick={handleDecrement} disabled={quantity <= 1} className="h-9 w-9 rounded-full hover:bg-pink-50 hover:text-pink-600 disabled:opacity-30 text-stone-500"><Minus size={16} /></Button>
            <div className="w-12 text-center font-bold text-stone-800 text-lg">{quantity}</div>
            <Button variant="ghost" size="icon" onClick={handleIncrement} disabled={quantity >= product.stock} className="h-9 w-9 rounded-full hover:bg-pink-50 hover:text-pink-600 disabled:opacity-30 text-stone-500"><Plus size={16} /></Button>
         </div>
         <span className="text-xs font-medium text-stone-400 bg-stone-50 px-2 py-1 rounded-md border border-stone-100">Stok: {product.stock}</span>
      </div>

      {/* Tombol Aksi */}
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