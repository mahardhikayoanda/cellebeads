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
import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // CardContent removed if not used or add it back
import { motion } from 'framer-motion'; 
import { Loader2, MessageCircle } from 'lucide-react'; 
import { toast } from 'sonner'; // <--- IMPORT BARU

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
        toast.success("Pesanan berhasil dibuat! Mengalihkan ke WhatsApp..."); // <--- Toast Sukses
        // Beri sedikit jeda agar toast terbaca sebelum redirect
        setTimeout(() => {
            window.location.href = result.waUrl!; 
        }, 1500);
      } else {
        toast.error(result.message || "Terjadi kesalahan."); // <--- Toast Error
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Gagal terhubung ke server."); // <--- Toast Error
      setIsLoading(false);
    }
  };

  const containerVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariant = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <Card className="w-full shadow-2xl border-none rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-pink-50 to-white border-b border-pink-100 px-8 py-6">
        <CardTitle className="text-2xl font-lora font-bold text-stone-800">Form Pemesanan</CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit} id="checkout-form">
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-8 p-8"
          variants={containerVariant}
          initial="hidden"
          animate="visible"
        >
          {/* Kolom Kiri: Input Form */}
          <div className="space-y-5">
            <motion.div variants={itemVariant} className="space-y-2">
              <Label htmlFor="name" className="text-stone-600 font-semibold">Nama Lengkap</Label>
              <Input id="name" name="name" placeholder="Nama Penerima" required className="bg-stone-50 border-stone-200 focus:border-primary h-11" />
            </motion.div>
            <motion.div variants={itemVariant} className="space-y-2">
              <Label htmlFor="address" className="text-stone-600 font-semibold">Alamat Lengkap</Label>
              <Textarea id="address" name="address" placeholder="Jalan, Nomor Rumah, Kecamatan, Kota, Kode Pos" required className="bg-stone-50 border-stone-200 focus:border-primary min-h-[100px] resize-none" />
            </motion.div>
            <motion.div variants={itemVariant} className="space-y-2">
              <Label htmlFor="phone" className="text-stone-600 font-semibold">No. HP (WhatsApp)</Label>
              <Input id="phone" name="phone" type="tel" placeholder="0812..." required className="bg-stone-50 border-stone-200 focus:border-primary h-11" />
            </motion.div>
            <motion.div variants={itemVariant} className="space-y-2">
              <Label htmlFor="paymentMethod" className="text-stone-600 font-semibold">Metode Pembayaran</Label>
              <Select name="paymentMethod" required onValueChange={setPaymentMethod} value={paymentMethod}>
                <SelectTrigger className="bg-stone-50 border-stone-200 h-11">
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
            <div className="bg-stone-50 p-6 rounded-2xl border border-stone-200">
              <h3 className="text-lg font-bold font-lora mb-4 text-stone-800">Ringkasan Pesanan</h3>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide">
                {selectedItems.map(item => (
                  <div key={item._id} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-3">
                        <span className="bg-white px-2 py-1 rounded text-xs font-bold text-stone-500 border">x{item.quantity}</span>
                        <span className="font-medium text-stone-700 line-clamp-1">{item.name}</span>
                    </div>
                    <span className="text-stone-900 font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-xl font-extrabold mt-6 pt-6 border-t border-stone-300 text-primary">
                <span>Total Bayar:</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Tombol Footer */}
        <CardFooter className="px-8 pb-8">
          <Button 
            type="submit" form="checkout-form"
            disabled={isLoading || selectedItems.length === 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold h-14 rounded-2xl shadow-lg shadow-emerald-200 transition-all hover:-translate-y-1" 
            size="lg"
          >
            {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses Pesanan...</>
            ) : (
                <><MessageCircle className="mr-2 h-5 w-5" /> Pesan Sekarang (via WhatsApp)</>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}