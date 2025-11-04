// File: app/checkout/CheckoutContent.tsx
'use client'; 
import CheckoutForm from "./CheckoutForm";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card
import { Button } from "@/components/ui/button";

export default function CheckoutContent() {
  const { cartItems } = useCart();

  return (
    <div className="max-w-xl mx-auto"> {/* Batasi lebar */}
      {cartItems.length === 0 ? (
        // Gunakan Card untuk pesan keranjang kosong
        <Card className="text-center">
          <CardHeader>
             <CardTitle className="text-2xl font-lora">Keranjang Anda Kosong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-stone-600 mb-6">Silakan kembali ke katalog untuk berbelanja.</p>
            <Button asChild className="bg-rose-500 hover:bg-rose-600">
              <Link href="/products">Kembali ke Katalog</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <CheckoutForm /> // Form sudah dibungkus Card
      )}
    </div>
  );
}