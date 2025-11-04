// File: app/admin/products/edit/[id]/page.tsx

import { getProductById } from '@/app/admin/products/actions';
import EditProductForm from './EditProductForm';

interface EditPageProps {
  params: {
    id: string; // 'id' ini berasal dari nama folder [id]
  }
}

export default async function EditProductPage({ params }: EditPageProps) {
  const { id } = params;
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