// File: app/admin/orders/OrderClientActions.tsx
'use client';
import { useState } from 'react';
import { confirmOrder } from './actions';
import { Button } from '@/components/ui/button'; 
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"; 
import { CheckCircle } from 'lucide-react'; 

interface Props { orderId: string; }

export default function OrderClientActions({ orderId }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const handleConfirm = async () => { /* ... (logika sama) ... */ };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
         <Button variant="default" size="sm" disabled={isLoading}
            className="bg-green-600 hover:bg-green-700" // Warna hijau
         >
           <CheckCircle className="h-4 w-4 mr-1" /> 
           {isLoading ? '...' : 'Konfirmasi'}
         </Button>
      </AlertDialogTrigger>
      {/* Dialog Konfirmasi Gelap */}
      <AlertDialogContent className="bg-gray-800 border-gray-700 text-gray-300">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">Konfirmasi Pesanan?</AlertDialogTitle>
          <AlertDialogDescription>
            Stok akan dikurangi dan status diubah menjadi "processed".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-200">Batal</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirm} disabled={isLoading}
            className="bg-green-600 hover:bg-green-700" // Warna hijau
          >
            {isLoading ? 'Memproses...' : 'Ya, Konfirmasi'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}