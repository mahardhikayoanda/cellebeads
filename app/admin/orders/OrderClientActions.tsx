// File: app/admin/orders/OrderClientActions.tsx
'use client';
import { useState } from 'react';
import { confirmOrder } from './actions';
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
import { CheckCircle } from 'lucide-react'; 

interface Props { orderId: string; }

export default function OrderClientActions({ orderId }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  // --- INI LOGIKA YANG HILANG ---
  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      const result = await confirmOrder(orderId);
      
      if (result.success) {
        alert('Pesanan berhasil dikonfirmasi!');
        // Halaman akan di-refresh oleh revalidatePath di server action
      } else {
        alert('Gagal: ' + result.message);
      }
    } catch (error) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setIsLoading(false); 
      // Dialog akan tertutup otomatis
    }
  };
  // ------------------------------

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
         <Button variant="default" size="sm" disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700" // Warna hijau
         >
           <CheckCircle className="h-4 w-4 mr-1" /> 
           {isLoading ? '...' : 'Konfirmasi'}
         </Button>
      </AlertDialogTrigger>
      
      {/* Dialog Konfirmasi (Tema Terang) */}
      <AlertDialogContent> {/* Hapus class tema gelap */}
        <AlertDialogHeader>
          <AlertDialogTitle>Konfirmasi Pesanan?</AlertDialogTitle>
          <AlertDialogDescription>
            Tindakan ini akan mengurangi stok produk dan mengubah status pesanan menjadi "processed".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleConfirm} // Panggil fungsi yang sudah diisi
            disabled={isLoading}
            className="bg-emerald-600 hover:bg-emerald-700" // Warna hijau
          >
            {isLoading ? 'Memproses...' : 'Ya, Konfirmasi'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}