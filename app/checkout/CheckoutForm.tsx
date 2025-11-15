// File: app/checkout/CheckoutForm.tsx
'use client';
import { useCart } from '@/context/CartContext';
import { createOrder } from './actions';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; 
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from 'framer-motion'; // <-- Import motion

interface IActionCartItem {
  _id: string; name: string; price: number; qty: number;
}

export default function CheckoutForm() {
  const { selectedItems, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const total = getTotalPrice(); 

  useEffect(() => {
    if (selectedItems.length === 0 && !isLoading) {
      router.push('/cart');
    }
  }, [selectedItems, router, isLoading]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    
    const itemsForAction: IActionCartItem[] = selectedItems.map(item => ({
      _id: item._id, name: item.name, price: item.price, qty: item.quantity,
    }));

    try {
      const result = await createOrder(formData, itemsForAction); 
      if (result.success && result.waUrl) {
        clearCart(); 
        window.location.href = result.waUrl; 
      } else {
        alert(result.message || "Terjadi kesalahan.");
        setIsLoading(false);
      }
    } catch (error) {
      alert("Gagal terhubung ke server.");
      setIsLoading(false);
    }
  };

  // Varian animasi
  const containerVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariant = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Card className="w-full shadow-xl border-stone-200">
      <CardHeader>
        <CardTitle className="text-2xl font-lora font-medium">Form Pemesanan</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit} id="checkout-form">
        {/* Konten diubah jadi Grid 2 Kolom */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6 p-6"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
          {/* Kolom Kiri: Input Form */}
          <div className="space-y-4">
            <motion.div variants={itemVariant} className="space-y-1">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input id="name" name="name" placeholder="Nama Anda" required />
            </motion.div>
            <motion.div variants={itemVariant} className="space-y-1">
              <Label htmlFor="address">Alamat Lengkap</Label>
              <Textarea id="address" name="address" placeholder="Jalan, Nomor Rumah, Kota, Kode Pos" required />
            </motion.div>
            <motion.div variants={itemVariant} className="space-y-1">
              <Label htmlFor="phone">No. HP (WhatsApp)</Label>
              <Input id="phone" name="phone" type="tel" placeholder="0812..." required />
            </motion.div>
            <motion.div variants={itemVariant} className="space-y-1">
              <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
              <Select name="paymentMethod" required onValueChange={setPaymentMethod} value={paymentMethod}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Metode Pembayaran" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash (COD)</SelectItem>
                  <SelectItem value="transfer">Transfer Bank</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>
          </div>

          {/* Kolom Kanan: Ringkasan Pesanan */}
          <motion.div variants={itemVariant} className="space-y-4">
            <Card className="bg-stone-50 border-stone-200 sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg font-lora">Ringkasan Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedItems.map(item => (
                  <div key={item._id} className="flex justify-between items-center text-sm text-stone-700">
                    <span className="font-medium line-clamp-1">{item.name} (x{item.quantity})</span>
                    <span className="text-stone-900">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center text-lg font-bold mt-4 pt-4 border-t border-stone-300">
                  <span>Total:</span>
                  <span>Rp {total.toLocaleString('id-ID')}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
        
        {/* Tombol Footer */}
        <CardFooter>
          <Button 
            type="submit" form="checkout-form"
            disabled={isLoading || selectedItems.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-lg" 
            size="lg"
          >
            {isLoading ? 'Memproses...' : 'Pesan Sekarang (via WhatsApp)'}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}