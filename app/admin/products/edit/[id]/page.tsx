// File: app/admin/products/edit/[id]/page.tsx
import { getProductById } from '@/app/admin/products/actions';
import EditProductForm from './EditProductForm';

interface EditPageProps {
  // 1. Ubah tipe params menjadi Promise
  params: Promise<{
    id: string; 
  }>
}

export default async function EditProductPage({ params }: EditPageProps) {
  // 2. Tambahkan 'await' sebelum mengakses params
  const { id } = await params;
  
  // 3. Gunakan id yang sudah di-resolve
  const product = await getProductById(id);

  if (!product) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Produk Tidak Ditemukan</h1>
        <p>Produk dengan ID {id} tidak dapat ditemukan.</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', border: '1px solid #555' }}>
      <h1>Edit Produk: {product.name}</h1>
      <EditProductForm product={product} />
    </div>
  );
}