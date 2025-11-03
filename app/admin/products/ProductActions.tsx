// File: app/admin/products/ProductActions.tsx
'use client'; 
import { useState } from 'react';
import Link from 'next/link';
import { deleteProduct, IProduct } from './actions'; 
import { Button } from '@/components/ui/button'; 
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"; 
import { Edit, Trash2 } from 'lucide-react'; 

interface ProductActionsProps { product: IProduct; }

export default function ProductActions({ product }: ProductActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => { /* ... (logika sama) ... */ };

  return (
    <div className="flex justify-center items-center space-x-2"> 
      {/* Tombol Edit (Outline Kuning) */}
      <Button asChild variant="outline" size="icon" className="border-yellow-500 text-yellow-500 hover:bg-yellow-900 hover:text-yellow-300 h-8 w-8">
        <Link href={`/admin/products/edit/${product._id}`}>
           <Edit className="h-4 w-4" />
        </Link>
      </Button>
      
      {/* Tombol Hapus (Destructive Merah) */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" size="icon" disabled={isDeleting} className="h-8 w-8">
             <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        {/* Dialog Konfirmasi Gelap */}
        <AlertDialogContent className="bg-gray-800 border-gray-700 text-gray-300">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Anda Yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini akan menghapus produk "{product.name}" secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-gray-600 hover:bg-gray-500 border-gray-500 text-gray-200">Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white" 
            >
              {isDeleting ? 'Menghapus...' : 'Ya, Hapus'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}