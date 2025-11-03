// File: app/checkout/CheckoutForm.tsx
'use client';
import { useCart } from '@/context/CartContext';
import { createOrder } from './actions';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Select
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card

export default function CheckoutForm() {
  const { cartItems, total, clearCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // State untuk Select
  const [paymentMethod, setPaymentMethod] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { /* ... (logika sama) ... */ };

  return (
    // Bungkus form dengan Card
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-lora font-medium">Form Pemesanan</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4"> {/* Beri ID dan spasi */}
          
          {/* Gunakan Label dan Input shadcn */}
          <div className="space-y-1">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" name="name" placeholder="Nama Anda" required />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="address">Alamat Lengkap</Label>
            {/* Gunakan Textarea shadcn */}
            <Textarea id="address" name="address" placeholder="Jalan, Nomor Rumah, Kota, Kode Pos" required />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="phone">No. HP (WhatsApp)</Label>
            <Input id="phone" name="phone" type="tel" placeholder="0812..." required />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="paymentMethod">Metode Pembayaran</Label>
            {/* Gunakan Select shadcn */}
            <Select name="paymentMethod" required onValueChange={setPaymentMethod} value={paymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih Metode Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">Cash (COD)</SelectItem>
                <SelectItem value="transfer">Transfer Bank</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ringkasan Pesanan (Tetap di dalam CardContent) */}
          <div className="mt-6 pt-4 border-t border-stone-200 space-y-2">
            <h3 className="text-lg font-medium text-stone-700">Ringkasan Pesanan</h3>
            {cartItems.map(item => (
              <div key={item._id} className="flex justify-between items-center text-sm text-stone-600">
                <span>{item.name} (x{item.qty})</span>
                <span>Rp {(item.price * item.qty).toLocaleString('id-ID')}</span>
              </div>
            ))}
            <div className="flex justify-between items-center text-lg font-bold mt-2 pt-2 border-t border-stone-200">
              <span>Total:</span>
              <span>Rp {total.toLocaleString('id-ID')}</span>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        {/* Tombol Pesan (Hijau) - Hubungkan dengan form ID */}
        <Button 
          type="submit" form="checkout-form" // Submit form berdasarkan ID
          disabled={isLoading || cartItems.length === 0} // Disable jika kosong
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-lg" // Warna hijau
          size="lg" // Ukuran besar
        >
          {isLoading ? 'Memproses...' : 'Pesan Sekarang (via WhatsApp)'}
        </Button>
      </CardFooter>
    </Card>
  );
}