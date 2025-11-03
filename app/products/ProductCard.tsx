'use client';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card

interface IProduct { _id: string; name: string; description: string; price: number; stock: number; image: string; }
interface ProductCardProps { product: IProduct; }

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const handleAddToCart = () => { /* ... (sama) ... */ };

  return (
    // Gunakan komponen Card
    <Card className="overflow-hidden flex flex-col group transition-shadow hover:shadow-xl">
      <CardHeader className="p-0 relative h-64 overflow-hidden">
        <Image src={product.image} alt={product.name} layout="fill" objectFit="cover"
               className="transition-transform duration-300 ease-in-out group-hover:scale-105"/>
      </CardHeader>
      <CardContent className="p-4 flex flex-col flex-grow">
        <CardTitle className="text-lg font-lora font-medium mb-2">{product.name}</CardTitle>
        <p className="text-gray-500 text-sm mb-4 flex-grow">{product.description.substring(0, 80)}...</p>
        <p className="text-lg font-bold text-stone-900 mb-2">Rp {product.price.toLocaleString('id-ID')}</p>
        <p className="text-sm text-gray-400 mb-4">Stok: {product.stock}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0"> {/* Hapus padding atas */}
        <Button onClick={handleAddToCart} disabled={product.stock === 0}
                className="w-full mt-auto" // mt-auto pindah ke sini
                variant={product.stock === 0 ? "secondary" : "default"} // Gunakan warna default (primary/pink)
        >
          {product.stock === 0 ? 'Stok Habis' : '+ Keranjang'}
        </Button>
      </CardFooter>
    </Card>
  );
}