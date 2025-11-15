// File: app/products/ProductCard.tsx
'use client';
import { useCart, ICartItem } from '@/context/CartContext'; 
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion'; // <-- 1. IMPORT motion

// Update Interface (pastikan sudah benar)
interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[]; 
  category: string;
}

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder-banner.jpg';

  const handleAddToCart = () => {
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

  // 2. Definisikan varian animasi untuk kartu
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    // 3. GANTI <Card> MENJADI <motion.div> dan tambahkan animasi
    <motion.div
      variants={cardVariants} // (Ini akan digunakan oleh halaman katalog di Langkah 3)
      whileHover={{ scale: 1.03, transition: { type: 'spring', stiffness: 300 } }} // EFEK HOVER
    >
      <Card className="overflow-hidden flex flex-col group transition-shadow hover:shadow-xl h-full">
        <Link href={`/products/${product._id}`}>
          <CardHeader className="p-0 relative h-64 overflow-hidden">
            <Image 
              src={mainImage} 
              alt={product.name} 
              layout="fill" 
              objectFit="cover"
              className="transition-transform duration-300 ease-in-out group-hover:scale-105"
            />
          </CardHeader>
        </Link>
        
        <CardContent className="p-4 flex flex-col flex-grow">
          <Link href={`/products/${product._id}`}>
            <CardTitle className="text-lg font-lora font-medium mb-2 hover:text-primary cursor-pointer line-clamp-2">
              {product.name}
            </CardTitle>
          </Link>
          <p className="text-gray-500 text-sm mb-4 flex-grow line-clamp-2">{product.description}</p>
          <p className="text-lg font-bold text-stone-900 mb-2">Rp {product.price.toLocaleString('id-ID')}</p>
          <p className="text-sm text-gray-400 mb-4">Stok: {product.stock}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 mt-auto">
          <Button 
            onClick={handleAddToCart} 
            disabled={product.stock === 0}
            className="w-full"
            variant={product.stock === 0 ? "secondary" : "default"}
          >
            {product.stock === 0 ? 'Stok Habis' : '+ Keranjang'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}