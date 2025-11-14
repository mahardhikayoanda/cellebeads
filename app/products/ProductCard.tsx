// File: app/products/ProductCard.tsx
'use client';
import { useCart, ICartItem } from '@/context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Update Interface: images string[]
interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[]; // <-- Diganti jadi Array
}

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  // Ambil gambar pertama untuk ditampilkan
  const mainImage = product.images && product.images.length > 0 ? product.images[0] : '/placeholder-banner.jpg';

  const handleAddToCart = () => {
    const itemToAdd: ICartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      image: mainImage, // Simpan hanya 1 gambar utama ke keranjang
      quantity: 1, 
      selected: true
    };
    addToCart(itemToAdd);
  };

  return (
    <Card className="overflow-hidden flex flex-col group transition-shadow hover:shadow-xl">
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
          <CardTitle className="text-lg font-lora font-medium mb-2 hover:text-primary cursor-pointer">
            {product.name}
          </CardTitle>
        </Link>
        <p className="text-gray-500 text-sm mb-4 flex-grow">{product.description.substring(0, 80)}...</p>
        <p className="text-lg font-bold text-stone-900 mb-2">Rp {product.price.toLocaleString('id-ID')}</p>
        <p className="text-sm text-gray-400 mb-4">Stok: {product.stock}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button 
          onClick={handleAddToCart} 
          disabled={product.stock === 0}
          className="w-full mt-auto"
          variant={product.stock === 0 ? "secondary" : "default"}
        >
          {product.stock === 0 ? 'Stok Habis' : '+ Keranjang'}
        </Button>
      </CardFooter>
    </Card>
  );
}