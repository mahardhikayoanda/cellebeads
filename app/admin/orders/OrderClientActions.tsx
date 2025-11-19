// File: app/admin/orders/OrderClientActions.tsx
'use client';
import { useState } from 'react';
import { confirmOrder, deliverOrder } from './actions'; // Import deliverOrder
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
import { CheckCircle, Truck } from 'lucide-react'; // Import ikon Truck

// Tambahkan prop 'status'
interface Props { 
  orderId: string; 
  status: string; 
}

export default function OrderClientActions({ orderId, status }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  // 1. Fungsi Konfirmasi (Pending -> Processed)
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await confirmOrder(orderId);
      if (result.success) {
        alert('Pesanan berhasil dikonfirmasi!');
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false); 
    }
  };

  // 2. Fungsi Selesai (Processed -> Delivered)
  const handleDeliver = async () => {
    setIsLoading(true);
    try {
      const result = await deliverOrder(orderId);
      if (result.success) {
        alert('Pesanan berhasil diselesaikan!');
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false); 
    }
  };

  // --- TAMPILAN TOMBOL BERDASARKAN STATUS ---

  // KASUS 1: Status Pending (Tombol Hijau)
  if (status === 'pending') {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
           <Button variant="default" size="sm" disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
           >
             <CheckCircle className="h-4 w-4 mr-1" /> 
             {isLoading ? '...' : 'Konfirmasi'}
           </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Pesanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Stok produk akan dikurangi dan status menjadi "Diproses".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirm}
              disabled={isLoading}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {isLoading ? 'Memproses...' : 'Ya, Konfirmasi'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // KASUS 2: Status Processed (Tombol Biru)
  if (status === 'processed') {
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
           <Button variant="default" size="sm" disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
           >
             <Truck className="h-4 w-4 mr-1" /> 
             {isLoading ? '...' : 'Pesanan Selesai'}
           </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Selesaikan Pesanan?</AlertDialogTitle>
            <AlertDialogDescription>
              Status pesanan akan diubah menjadi "Selesai" (Delivered).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeliver}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Memproses...' : 'Ya, Selesaikan'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // KASUS 3: Status Lain (Tidak ada tombol)
  return <span className="text-muted-foreground">-</span>;
}