// File: app/admin/products/ProductActions.tsx
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from './actions';
import { toast } from 'sonner'; // [BARU] Import Toast
import Link from 'next/link';

// [BARU] Import Komponen Alert Dialog (Pop Up Tengah)
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ProductActions({ product }: { product: any }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const performDelete = async () => {
    setIsDeleting(true);
    const toastId = toast.loading("Menghapus produk..."); // [BARU] Loading Toast

    try {
        const res = await deleteProduct(product._id);
        if (res.success) {
            toast.success("Produk Terhapus", { id: toastId });
        } else {
            toast.error("Gagal Menghapus", { description: res.message, id: toastId });
        }
    } catch (err) {
        toast.error("Terjadi kesalahan sistem", { id: toastId });
    } finally {
        setIsDeleting(false);
    }
  };

  return (
    <div className="flex gap-2">
      {/* Tombol Edit */}
      <Button asChild variant="outline" size="sm" className="h-8 w-8 p-0 rounded-lg hover:bg-pink-50 hover:text-pink-600 border-stone-200">
        <Link href={`/admin/products/edit/${product._id}`}>
           <Edit size={14} />
        </Link>
      </Button>
      
      {/* [UBAH] Tombol Hapus dengan Pop Up Confirmation (Alert Dialog) */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0 rounded-lg hover:bg-rose-50 hover:text-rose-600 border-stone-200"
            disabled={isDeleting}
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          </Button>
        </AlertDialogTrigger>
        
        <AlertDialogContent className="bg-white/95 backdrop-blur-xl rounded-[2rem] border-pink-100 shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-lora text-xl text-stone-800">
              Hapus Produk "{product.name}"?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-stone-500">
              Tindakan ini tidak dapat dibatalkan. Produk ini akan hilang dari katalog pelanggan secara permanen.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl border-stone-200 hover:bg-stone-50">Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={performDelete}
              className="rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              Ya, Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}