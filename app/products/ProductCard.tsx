// File: app/products/ProductCard.tsx
'use client';
import { useCart, ICartItem } from '@/context/CartContext'; 
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion'; 
import { Plus, ShoppingBag } from 'lucide-react'; // Ikon baru

// ... (Interface tetap sama)
interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[]; 
  category: string;
}
interface ProductCardProps { product: IProduct; }

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder-banner.jpg';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Mencegah link diklik
    const itemToAdd: ICartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: mainImage, 
      quantity: 1, 
      selected: true
    };
    addToCart(itemToAdd);
  };

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
      whileHover={{ y: -5 }} // Efek melayang saat hover
      className="group relative"
    >
      {/* Container Kartu Tanpa Border Kasar */}
      <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-stone-100">
        
        <Link href={`/products/${product._id}`} className="block relative">
          {/* Area Gambar */}
          <div className="relative h-72 w-full overflow-hidden bg-stone-50">
            <Image 
              src={mainImage} 
              alt={product.name} 
              layout="fill" 
              objectFit="cover"
              className="transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
            
            {/* Overlay Gradient Halus */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Badge Stok Habis */}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                <span className="bg-stone-900 text-white text-xs font-bold px-3 py-1 rounded-full tracking-widest uppercase">
                  Habis
                </span>
              </div>
            )}

            {/* Tombol Add to Cart yang Muncul saat Hover */}
            {product.stock > 0 && (
               <button
                 onClick={handleAddToCart}
                 className="absolute bottom-4 right-4 w-10 h-10 bg-white/90 hover:bg-primary hover:text-white text-stone-800 rounded-full flex items-center justify-center shadow-lg translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out"
                 title="Tambah ke Keranjang"
               >
                 <ShoppingBag className="w-4 h-4" />
               </button>
            )}
          </div>

          {/* Informasi Produk */}
          <div className="p-5 text-center">
            <p className="text-xs text-primary font-bold tracking-widest uppercase mb-1">
              {product.category || 'Aksesoris'}
            </p>
            <h3 className="text-lg font-lora text-stone-800 font-medium mb-2 group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            <p className="text-stone-600 font-semibold">
              Rp {product.price.toLocaleString('id-ID')}
            </p>
          </div>
        </Link>
      </div>
    </motion.div>
  );
}