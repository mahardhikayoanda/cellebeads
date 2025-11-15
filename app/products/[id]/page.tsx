// File: app/products/[id]/page.tsx
import { getProductById } from '@/app/admin/products/actions';
import { notFound } from 'next/navigation';
// 1. Import komponen wrapper baru
import ProductDetailClientWrapper from './ProductDetailClientWrapper';

interface ProductPageProps {
  params: Promise<{ id: string }>; 
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params; 
  const product = await getProductById(resolvedParams.id); 

  if (!product) {
    notFound();
  }

  // 2. Render HANYA komponen wrapper dan kirim data produk
  return (
    <ProductDetailClientWrapper product={product} />
  );
}