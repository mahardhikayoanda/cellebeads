// File: app/checkout/CheckoutContent.tsx
'use client'; 
import CheckoutForm from "./CheckoutForm";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion'; // <-- Import motion

export default function CheckoutContent() {
  const { selectedItems } = useCart(); // <-- Cek 'selectedItems'

  return (
    // 1. Ubah max-w-xl menjadi max-w-4xl agar muat 2 kolom
    // 2. Tambahkan motion.div untuk animasi fade-in
    <motion.div 
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, duration: 0.5 }}
    >
      {selectedItems.length === 0 ? (
        <Card className="text-center shadow-xl border-stone-200">
          <CardHeader>
             <CardTitle className="text-2xl font-lora">Keranjang Anda Kosong</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-stone-600 mb-6">Silakan pilih barang di keranjang Anda.</p>
            <Button asChild>
              <Link href="/cart">Kembali ke Keranjang</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <CheckoutForm /> // Form sekarang akan dirender dalam container 4xl
      )}
    </motion.div>
  );
}