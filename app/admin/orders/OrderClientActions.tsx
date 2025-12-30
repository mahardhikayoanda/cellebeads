'use client';
import { useState } from 'react';
import { confirmOrder, shipOrder, completeOrder } from './actions'; 
import { Button } from '@/components/ui/button'; 
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog"; 
import { CheckCircle, Truck, PackageCheck, Clock } from 'lucide-react'; 
import { toast } from 'sonner';

interface Props { 
  orderId: string; 
  status: string; 
}

export default function OrderClientActions({ orderId, status }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fungsi Konfirmasi (Pending -> Processed)
  const handleConfirm = async () => {
    setIsLoading(true);
    const result = await confirmOrder(orderId);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
    setIsLoading(false); 
  };

  // 2. Fungsi Kirim (Processed -> Shipped)
  const handleShip = async () => {
    setIsLoading(true);
    const result = await shipOrder(orderId);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
    setIsLoading(false); 
  };

  // 3. Fungsi Selesai (Delivered -> Completed)
  const handleComplete = async () => {
    setIsLoading(true);
    const result = await completeOrder(orderId);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
    setIsLoading(false); 
  };

  // --- TAMPILAN TOMBOL BERDASARKAN STATUS ---

  // KASUS 1: Pending -> Show KONFIRMASI (Hijau)
  if (status === 'pending') {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
           <Button variant="default" size="sm" disabled={isLoading} className="bg-emerald-600 hover:bg-emerald-700">
             <CheckCircle className="h-4 w-4 mr-1" /> {isLoading ? '...' : 'Konfirmasi'}
           </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white border-stone-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-stone-900">Konfirmasi Pesanan?</AlertDialogTitle>
            <AlertDialogDescription className="text-stone-500">
              Stok produk akan dikurangi dan status menjadi "Diproses".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} className="bg-emerald-600 hover:bg-emerald-700">
              {isLoading ? 'Memproses...' : 'Ya, Konfirmasi'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // KASUS 2: Processed -> Show KIRIM (Biru)
  if (status === 'processed') {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
           <Button variant="default" size="sm" disabled={isLoading} className="bg-blue-600 hover:bg-blue-700">
             <Truck className="h-4 w-4 mr-1" /> {isLoading ? '...' : 'Kirim Pesanan'}
           </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white border-stone-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-stone-900">Kirim Pesanan?</AlertDialogTitle>
            <AlertDialogDescription className="text-stone-500">
              Status akan berubah menjadi "Dikirim" (Shipped). Pastikan resi (jika ada) sudah siap.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleShip} className="bg-blue-600 hover:bg-blue-700">
              {isLoading ? 'Memproses...' : 'Ya, Kirim'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // KASUS 3: Shipped -> Show MENUNGGU... (Disabled / Kuning)
  if (status === 'shipped') {
      return (
          <Button variant="outline" size="sm" disabled className="border-amber-200 text-amber-600 bg-amber-50 opacity-100">
              <Clock className="w-4 h-4 mr-1 animate-pulse" /> Menunggu Diterima
          </Button>
      );
  }

  // KASUS 4: Delivered -> Show SELESAIKAN (Ungu/Final)
  if (status === 'delivered') {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
           <Button variant="default" size="sm" disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
             <PackageCheck className="h-4 w-4 mr-1" /> {isLoading ? '...' : 'Selesaikan'}
           </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="bg-white border-stone-200">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-stone-900">Selesaikan Pesanan?</AlertDialogTitle>
            <AlertDialogDescription className="text-stone-500">
              Pelanggan sudah menerima barang. Klik ini untuk menutup transaksi secara penuh (Completed).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleComplete} className="bg-purple-600 hover:bg-purple-700">
              {isLoading ? 'Memproses...' : 'Ya, Selesaikan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // KASUS 5: Completed (Final)
  if (status === 'completed') {
      return <span className="text-xs font-bold text-stone-400 bg-stone-100 px-2 py-1 rounded">Selesai</span>;
  }

  return <span className="text-muted-foreground">-</span>;
}