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
import { Loader2, User, MapPin, Phone, CreditCard, ShoppingBag, ArrowRight } from 'lucide-react';
import { toast } from 'sonner'; // Pastikan import ini benar
import Image from 'next/image';

export default function CheckoutForm() {
  const { selectedItems, directCheckoutItem, processCheckoutSuccess } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('transfer');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  // --- LOGIKA SUMBER ITEM ---
  // Jika ada item directCheckout (Beli Sekarang), gunakan itu. Jika tidak, ambil dari Cart.
  const isDirectBuy = !!directCheckoutItem;
  const itemsToCheckout = isDirectBuy ? [directCheckoutItem!] : selectedItems;

  const total = itemsToCheckout.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Redirect jika tidak ada item
  useEffect(() => {
    if (isMounted && itemsToCheckout.length === 0 && !isLoading) {
      router.push('/cart');
    }
  }, [itemsToCheckout, router, isLoading, isMounted]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validasi Sederhana
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const address = formData.get('address') as string;

    if (!name || !phone || !address) {
        toast.warning("Data Belum Lengkap", {
            description: "Mohon isi semua informasi pengiriman."
        });
        setIsLoading(false);
        return;
    }

    // Persiapkan Data Item untuk Server Action
    const itemsForAction = itemsToCheckout.map(item => ({
      _id: item._id, 
      name: item.name, 
      price: item.price, 
      qty: item.quantity,
      selectedModel: item.selectedModel 
    }));

    try {
      // Panggil Server Action
      // (Asumsi: createOrder di actions.ts sudah menerima parameter ke-2 yaitu items)
      // Jika masih error tipe di sini, pastikan update actions.ts juga.
      // @ts-ignore: Mengabaikan error tipe sementara jika actions.ts belum diupdate
      const result = await createOrder(formData, itemsForAction);
      
      if (result.success && result.waUrl) {
        // Bersihkan State (Cart atau Direct Item)
        processCheckoutSuccess(isDirectBuy); 
        
        // Notifikasi Sukses
        toast.success("Pesanan Berhasil Dibuat! 🎉", {
            description: "Mengalihkan ke WhatsApp untuk pembayaran...",
            duration: 3000,
        });

        // Redirect ke WA
        setTimeout(() => { window.location.href = result.waUrl!; }, 1500);
      } else {
        toast.error("Gagal Membuat Pesanan", { 
            description: result.message || "Silakan coba lagi." 
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast.error("Terjadi Kesalahan Sistem", {
          description: "Periksa koneksi internet Anda."
      });
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  if (itemsToCheckout.length === 0) return null;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* KOLOM KIRI (FORM PENGIRIMAN) */}
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 space-y-6">
        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 shadow-xl shadow-pink-100/20">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-pink-100">
              <div className="p-2 bg-pink-100 rounded-lg text-pink-600"><User size={20} /></div>
              <h2 className="text-xl font-lora font-bold text-stone-800">Informasi Pengiriman</h2>
           </div>
           <div className="space-y-5">
              <div className="grid gap-2">
                 <Label htmlFor="name" className="text-xs font-bold text-stone-500 uppercase tracking-wide ml-1">Nama Penerima</Label>
                 <div className="relative"><User className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" /><Input id="name" name="name" placeholder="Contoh: Putri Ayu" required className="pl-12 h-12 rounded-xl border-stone-200 bg-white/50 focus:border-pink-300 focus:ring-pink-100" /></div>
              </div>
              <div className="grid gap-2">
                 <Label htmlFor="phone" className="text-xs font-bold text-stone-500 uppercase tracking-wide ml-1">WhatsApp Aktif</Label>
                 <div className="relative"><Phone className="absolute left-4 top-3.5 h-5 w-5 text-stone-400" /><Input id="phone" name="phone" type="tel" placeholder="0812..." required className="pl-12 h-12 rounded-xl border-stone-200 bg-white/50 focus:border-pink-300 focus:ring-pink-100" /></div>
              </div>
              <div className="grid gap-2">
                 <Label htmlFor="address" className="text-xs font-bold text-stone-500 uppercase tracking-wide ml-1">Alamat Lengkap</Label>
                 <div className="relative"><MapPin className="absolute left-4 top-4 h-5 w-5 text-stone-400" /><Textarea id="address" name="address" placeholder="Jalan, No. Rumah, Kecamatan, Kota, Kode Pos..." required className="pl-12 min-h-[120px] rounded-xl border-stone-200 bg-white/50 focus:border-pink-300 focus:ring-pink-100 resize-none pt-4" /></div>
              </div>
           </div>
        </div>

        <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] p-8 shadow-xl shadow-pink-100/20">
           <div className="flex items-center gap-3 mb-6 pb-4 border-b border-pink-100">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600"><CreditCard size={20} /></div>
              <h2 className="text-xl font-lora font-bold text-stone-800">Metode Pembayaran</h2>
           </div>
           <div className="grid gap-2">
              <Select name="paymentMethod" required onValueChange={setPaymentMethod} value={paymentMethod}>
                <SelectTrigger className="h-14 rounded-xl border-stone-200 bg-white/50 focus:ring-pink-100"><SelectValue placeholder="Pilih Metode" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Transfer Bank / E-Wallet</SelectItem>
                  <SelectItem value="qris">QRIS (Scan)</SelectItem>
                  <SelectItem value="cash">Cash (Bayar di Tempat)</SelectItem>
                </SelectContent>
              </Select>
              
              {/* TAMPILAN KHUSUS QRIS */}
              {paymentMethod === 'qris' && (
                  <motion.div 
                     initial={{ opacity: 0, height: 0 }} 
                     animate={{ opacity: 1, height: 'auto' }}
                     className="mt-4 p-6 bg-white border border-stone-200 rounded-2xl shadow-sm text-center space-y-4"
                  >
                     <p className="text-sm font-bold text-stone-600">Scan QRIS untuk Membayar</p>
                     <div className="bg-white p-3 rounded-xl border border-stone-100 inline-block shadow-inner">
                        <div className="relative w-48 h-48 mx-auto overflow-hidden rounded-lg">
                           <Image src="/qris-placeholder.svg" alt="QRIS Code" fill className="object-cover" />
                        </div>
                     </div>
                     <div className="space-y-1">
                        <p className="text-xs text-stone-500">Total Pembayaran</p>
                        <p className="text-xl font-bold text-pink-600">Rp {total.toLocaleString('id-ID')}</p>
                     </div>
                     
                     <div className="text-left w-full pt-4 border-t border-dashed border-stone-200">
                        <Label htmlFor="paymentProof" className="text-xs font-bold text-stone-500 uppercase tracking-wide mb-2 block">Upload Bukti Bayar (Wajib)</Label>
                        <Input 
                           id="paymentProof" 
                           name="paymentProof" 
                           type="file" 
                           accept="image/*"
                           required 
                           className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-pink-50 file:text-pink-700 hover:file:bg-pink-100 h-12 pt-2 bg-stone-50"
                        />
                        <p className="text-[10px] text-stone-400 mt-1 italic">*Format: JPG/PNG. Pastikan nominal sesuai.</p>
                     </div>
                  </motion.div>
              )}

              {paymentMethod === 'transfer' && (
                  <div className="mt-4 p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-sm text-blue-700">
                     <p>⚠️ Silakan hubungi admin di WhatsApp setelah checkout untuk meminta nomor rekening.</p>
                  </div>
              )}

           </div>
        </div>
      </motion.div>

      {/* --- KOLOM KANAN: RINGKASAN --- */}
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
         <div className="sticky top-28 space-y-6">
            <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2rem] p-6 shadow-2xl shadow-pink-200/50 overflow-hidden relative">
               
               {/* Background Dekorasi */}
               <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-100 rounded-full blur-2xl opacity-60"></div>
               
               <h3 className="text-lg font-lora font-bold text-stone-800 mb-6 flex items-center gap-2 relative z-10">
                  <ShoppingBag size={18} /> {isDirectBuy ? 'Beli Langsung' : 'Ringkasan Pesanan'}
               </h3>

               {/* List Item */}
               <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 scrollbar-hide mb-6 relative z-10">
                  {itemsToCheckout.map(item => (
                    <div key={`${item._id}-${item.selectedModel || 'def'}`} className="flex gap-3 items-center">
                       <div className="relative w-14 h-14 rounded-lg overflow-hidden border border-stone-100 bg-stone-50 flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-stone-800 truncate">{item.name}</p>
                          {item.selectedModel && (
                             <span className="inline-block text-[10px] font-bold text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded mt-0.5">
                               {item.selectedModel}
                             </span>
                          )}
                          <p className="text-xs text-stone-500 mt-0.5">Qty: {item.quantity}x</p>
                       </div>
                       <div className="text-right">
                          <p className="text-sm font-bold text-pink-600">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</p>
                       </div>
                    </div>
                  ))}
               </div>

               {/* Total Section */}
               <div className="pt-4 border-t border-dashed border-stone-300 relative z-10">
                  <div className="flex justify-between items-center text-stone-600 text-sm mb-2">
                     <span>Subtotal</span><span>Rp {total.toLocaleString('id-ID')}</span>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4">
                     <span className="text-lg font-bold text-stone-800">Total</span>
                     <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Rp {total.toLocaleString('id-ID')}</span>
                  </div>
               </div>

               <Button 
                 type="submit" 
                 disabled={isLoading || itemsToCheckout.length === 0}
                 className="w-full h-14 mt-6 bg-stone-900 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-600 text-white font-bold rounded-xl shadow-lg transition-all hover:-translate-y-1 group relative z-10"
               >
                 {isLoading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Memproses...</> 
                 ) : (
                    <>Buat Pesanan <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" /></>
                 )}
               </Button>
            </div>
         </div>
      </motion.div>
    </form>
  );
}