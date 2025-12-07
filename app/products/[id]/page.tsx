// File: app/products/[id]/page.tsx
import { getProductById } from '@/app/admin/products/actions';
import { notFound } from 'next/navigation';
import ProductDetailClientWrapper from './ProductDetailClientWrapper';
import ReviewList from '@/components/ReviewList';
import dbConnect from '@/lib/dbConnect';
import Review from '@/models/Review';
import type { Metadata, ResolvingMetadata } from 'next'; // 1. Import tipe Metadata

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Fungsi helper untuk mengambil ulasan (Tetap sama)
async function getProductReviews(productId: string) {
  await dbConnect();
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(reviews));
}

// 2. FUNGSI BARU: generateMetadata (Untuk SEO Dinamis)
export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // Tunggu params (Next.js 15+)
  const { id } = await params;

  // Ambil data produk
  const product = await getProductById(id);

  // Jika produk tidak ada
  if (!product) {
    return {
      title: 'Produk Tidak Ditemukan | Cellebeads',
    };
  }

  // Tentukan gambar utama atau fallback
  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder-banner.jpg'; // Pastikan ada gambar placeholder di folder public

  return {
    title: `${product.name} | Koleksi Cellebeads`,
    description: product.description?.substring(0, 160) || 'Aksesoris manik cantik handmade.', // Batasi deskripsi untuk SEO
    openGraph: {
      title: product.name,
      description: product.description?.substring(0, 200),
      url: `/products/${id}`,
      siteName: 'Cellebeads',
      images: [
        {
          url: mainImage,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      locale: 'id_ID',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description?.substring(0, 160),
      images: [mainImage],
    },
  };
}

// 3. Komponen Utama Halaman
export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

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