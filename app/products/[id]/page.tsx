// File: app/products/[id]/page.tsx
import { getProductById } from '@/app/admin/products/actions';
import { notFound } from 'next/navigation';
import AddToCartClient from './AddToCartClient';
import { Badge } from '@/components/ui/badge'; 
import ProductGallery from '@/components/ProductGallery'; // <-- Import Gallery Baru

interface ProductPageProps {
  params: Promise<{ id: string }>; 
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params; 
  const product = await getProductById(resolvedParams.id); 

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        
        {/* KIRI: Galeri Foto */}
        <div>
           <ProductGallery images={product.images} productName={product.name} />
        </div>

        {/* KANAN: Detail Produk (Sama seperti sebelumnya) */}
        <div className="flex flex-col justify-start space-y-6">
          <div>
            <h1 className="text-4xl font-lora font-semibold text-stone-900 mb-2">
              {product.name}
            </h1>
            <p className="text-3xl font-light text-primary">
              Rp {product.price.toLocaleString('id-ID')}
            </p>
          </div>

          <div>
            {product.stock > 0 ? (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800 border-emerald-200">
                Stok Tersedia: {product.stock}
              </Badge>
            ) : (
              <Badge variant="destructive">Stok Habis</Badge>
            )}
          </div>

          <div className="text-stone-600 space-y-2">
            <h3 className="text-lg font-medium text-stone-800 border-b pb-1">Deskripsi</h3>
            <p style={{ whiteSpace: 'pre-wrap' }} className="leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="pt-4">
            <AddToCartClient product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}