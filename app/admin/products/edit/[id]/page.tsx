// File: app/admin/products/edit/[id]/page.tsx
import { getProductById } from '@/app/admin/products/actions';
import EditProductForm from './EditProductForm';

interface EditPageProps {
  params: Promise<{
    id: string; 
  }>
}

export default async function EditProductPage({ params }: EditPageProps) {
  // 1. Resolve params (Next.js 16)
  const { id } = await params;
  
  // 2. Ambil data produk
  const product = await getProductById(id);

  if (!product) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-bold text-red-500">Produk Tidak Ditemukan</h1>
        <p className="text-stone-500">Produk dengan ID {id} tidak dapat ditemukan.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-lora font-semibold text-slate-800">Edit Produk</h1>
      
      {/* 3. Render Form Edit */}
      <EditProductForm product={product} />
    </div>
  );
}