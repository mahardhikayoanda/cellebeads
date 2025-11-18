// File: app/products/[id]/page.tsx
import { getProductById } from '@/app/admin/products/actions';
import { notFound } from 'next/navigation';
import ProductDetailClientWrapper from './ProductDetailClientWrapper';
import ReviewList from '@/components/ReviewList'; // <-- Import komponen baru
import dbConnect from '@/lib/dbConnect'; // Butuh koneksi DB
import Review from '@/models/Review'; // Butuh model Review

interface ProductPageProps {
  params: Promise<{ id: string }>; 
}

// Fungsi helper untuk mengambil ulasan produk ini
async function getProductReviews(productId: string) {
  await dbConnect();
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(reviews));
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params; 
  const product = await getProductById(resolvedParams.id); 

  if (!product) {
    notFound();
  }

  // Ambil ulasan untuk produk ini
  const reviews = await getProductReviews(resolvedParams.id);

  return (
    <div className="container mx-auto max-w-4xl p-4 space-y-12 pb-20">
      {/* Bagian Atas: Detail Produk */}
      <ProductDetailClientWrapper product={product} />

      {/* Bagian Bawah: Daftar Ulasan */}
      <section className="border-t border-stone-200 pt-10">
         <ReviewList reviews={reviews} />
      </section>
    </div>
  );
}