// File: app/checkout/CheckoutForm.tsx (GANTI ISINYA DENGAN INI)
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

// Tipe data item yang diharapkan oleh Server Action 'createOrder'
interface IActionCartItem {
  _id: string;
  name: string;
  price: number;
  qty: number; // <-- Server Action mengharapkan 'qty'
}

export default function CheckoutForm() {
  // Ambil item yang DIPILIH dan total harganya
  const { selectedItems, getTotalPrice, clearCart } = useCart();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  
  const total = getTotalPrice(); 

  // Redirect jika tidak ada item terpilih
  useEffect(() => {
    if (selectedItems.length === 0) {
      alert("Keranjang Anda kosong atau tidak ada barang dipilih.");
      router.push('/cart');
    }
  }, [selectedItems, router]);
  
  // --- INI ADALAH LOGIKA YANG DITAMBAHKAN ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    
    // 1. Konversi 'selectedItems' (dari context) ke format yang diharapkan server action
    // Context menggunakan 'quantity', server action menggunakan 'qty'
    const itemsForAction: IActionCartItem[] = selectedItems.map(item => ({
      _id: item._id,
      name: item.name,
      price: item.price,
      qty: item.quantity, // Konversi 'quantity' -> 'qty'
    }));

    try {
      // 2. Panggil Server Action 'createOrder'
      const result = await createOrder(formData, itemsForAction); 

      if (result.success && result.waUrl) {
        // 3. Jika berhasil, kosongkan keranjang dan redirect ke WhatsApp
        clearCart(); 
        window.location.href = result.waUrl; // Redirect ke WhatsApp
      } else {
        // 4. Jika gagal, tampilkan pesan error
        alert(result.message || "Terjadi kesalahan saat membuat pesanan.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Gagal terhubung ke server.");
      setIsLoading(false);
    }
  };
  // ---------------------------------------------

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-lora font-medium">Form Pemesanan</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Pastikan form memanggil handleSubmit */}
        <form onSubmit={handleSubmit} id="checkout-form" className="space-y-4">
          
          <div className="space-y-1">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" name="name" placeholder="Nama Anda" required />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="address">Alamat Lengkap</Label>
            <Textarea id="address" name="address" placeholder="Jalan, Nomor Rumah, Kota, Kode Pos" required />
          </div>
          
          <div className="space-y-1">
            <Label htmlFor="phone">No. HP (WhatsApp)</Label>
            <Input id="phone" name="phone" type="tel" placeholder="0812..." required />
          </div>
          
          <div className="space-y-1">
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
          </div>

          <div className="mt-6 pt-4 border-t border-stone-200 space-y-2">
            <h3 className="text-lg font-medium text-stone-700">Ringkasan Pesanan</h3>
            {selectedItems.map(item => (
              <div key={item._id} className="flex justify-between items-center text-sm text-stone-600">
                <span>{item.name} (x{item.quantity})</span>
                <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
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
        <Button 
          type="submit" form="checkout-form"
          disabled={isLoading || selectedItems.length === 0}
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-lg" 
          size="lg"
        >
          {isLoading ? 'Memproses...' : 'Pesan Sekarang (via WhatsApp)'}
        </Button>
      </CardFooter>
    </Card>
  );
}