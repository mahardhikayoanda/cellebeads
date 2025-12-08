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
import { motion } from 'framer-motion';
import { Loader2, User, MapPin, Phone, CreditCard, ShieldCheck, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';

interface IActionCartItem {
  _id: string; name: string; price: number; qty: number;
}

export default function CheckoutForm() {
  const { selectedItems, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('transfer');
  
  // Pastikan render hanya di client untuk menghindari hydration mismatch
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => setIsMounted(true), []);

  const total = getTotalPrice ? getTotalPrice() : 0;

  // Redirect jika keranjang kosong
  useEffect(() => {
    if (isMounted && selectedItems.length === 0 && !isLoading) {
      router.push('/cart');
    }
  }, [selectedItems, router, isLoading, isMounted]);

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
        toast.success("Pesanan Dibuat!", {
            description: "Mengalihkan ke WhatsApp untuk konfirmasi..."
        });
        
        // Delay sedikit agar toast terbaca
        setTimeout(() => {
            window.location.href = result.waUrl!;
        }, 1500);
      } else {
        toast.error("Gagal membuat pesanan", { description: result.message });
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.");
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* --- KOLOM KIRI: FORM DATA (2/3 Lebar) --- */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="lg:col-span-2 space-y-6"
      >
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 shadow-xl shadow-pink-100/20">
           
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-pink-100">
              <div className="p-2 bg-pink-100 rounded-lg text-pink-600">
                 <User size={20} />
              </div>
              <h2 className="text-xl font-lora font-bold text-stone-800">Informasi Pengiriman</h2>
           </div>

           <div className="space-y-5">
              <div className="grid gap-2">
                 <Label htmlFor="name" className="text-xs font-bold text-stone-500 uppercase tracking-wide ml-1">Nama Penerima</Label>
                 <div className="relative">
                    <User className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
                    <Input id="name" name="name" placeholder="Contoh: Putri Ayu" required className="pl-12 h-12 rounded-xl border-stone-200 bg-white/50 focus:border-pink-300 focus:ring-pink-100" />
                 </div>
              </div>

              <div className="grid gap-2">
                 <Label htmlFor="phone" className="text-xs font-bold text-stone-500 uppercase tracking-wide ml-1">WhatsApp Aktif</Label>
                 <div className="relative">
                    <Phone className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" />
                    <Input id="phone" name="phone" type="tel" placeholder="0812..." required className="pl-12 h-12 rounded-xl border-stone-200 bg-white/50 focus:border-pink-300 focus:ring-pink-100" />
                 </div>
              </div>

              <div className="grid gap-2">
                 <Label htmlFor="address" className="text-xs font-bold text-stone-500 uppercase tracking-wide ml-1">Alamat Lengkap</Label>
                 <div className="relative">
                    <MapPin className="absolute left-4 top-4 h-5 w-5 text-stone-400" />
                    <Textarea id="address" name="address" placeholder="Jalan, No. Rumah, Kecamatan, Kota, Kode Pos..." required className="pl-12 min-h-[120px] rounded-xl border-stone-200 bg-white/50 focus:border-pink-300 focus:ring-pink-100 resize-none pt-4" />
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 shadow-xl shadow-pink-100/20">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-pink-100">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                 <CreditCard size={20} />
              </div>
              <h2 className="text-xl font-lora font-bold text-stone-800">Metode Pembayaran</h2>
           </div>
           
           <div className="grid gap-2">
              <Select name="paymentMethod" required onValueChange={setPaymentMethod} value={paymentMethod}>
                <SelectTrigger className="h-14 rounded-xl border-stone-200 bg-white/50 focus:ring-pink-100">
                  <SelectValue placeholder="Pilih Metode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Transfer Bank / E-Wallet</SelectItem>
                  <SelectItem value="qris">QRIS</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-stone-500 mt-2 ml-1">
                 *Detail pembayaran akan dikirimkan melalui WhatsApp setelah konfirmasi.
              </p>
           </div>
        </div>
      </motion.div>

      {/* --- KOLOM KANAN: RINGKASAN (1/3 Lebar - Sticky) --- */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="lg:col-span-1"
      >
         <div className="sticky top-28 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-2xl shadow-pink-200/50 overflow-hidden relative">
               
               {/* Dekorasi Blob */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100 rounded-full blur-2xl opacity-60"></div>

               <h3 className="text-lg font-lora font-bold text-stone-800 mb-6 flex items-center gap-2 relative z-10">
                  <ShoppingBag size={18} /> Ringkasan Pesanan
               </h3>

               {/* List Item Scrollable */}
               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide mb-6 relative z-10">
                  {selectedItems.map(item => (
                    <div key={item._id} className="flex gap-3 items-center">
                       <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-100 bg-stone-50 flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-stone-800 truncate">{item.name}</p>
                          <p className="text-xs text-stone-500">Qty: {item.quantity}x</p>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-bold text-pink-600">
                             Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                          </p>
                       </div>
                    </div>
                  ))}
               </div>

               {/* Total Section */}
               <div className="pt-4 border-t border-dashed border-stone-300 relative z-10">
                  <div className="flex justify-between items-center text-stone-600 text-sm mb-2">
                     <span>Subtotal</span>
                     <span>Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center text-stone-600 text-sm mb-4">
                     <span>Ongkos Kirim</span>
                     <span className="text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-500">Cek di WA</span>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                     <span className="text-lg font-bold text-stone-800">Total</span>
                     <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">
                        Rp {total.toLocaleString('id-ID')}
                     </span>
                  </div>
               </div>

               {/* Tombol Submit */}
               <Button 
                 type="submit" 
                 disabled={isLoading || selectedItems.length === 0}
                 className="w-full h-14 mt-6 bg-stone-900 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-1 group relative z-10"
               >
                 {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</>
                 ) : (
                    <>Buat Pesanan <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                 )}
               </Button>
            </div>

            {/* Trust Badge */}
            <div className="flex items-center justify-center gap-2 text-stone-400 text-xs bg-white/40 p-3 rounded-xl border border-white">
               <ShieldCheck size={14} className="text-emerald-500" />
               Data Anda diamankan dengan enkripsi SSL.
            </div>
         </div>
      </motion.div>

    </form>
  );
}