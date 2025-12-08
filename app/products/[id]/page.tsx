// File: app/products/[id]/page.tsx
import { getProductById } from '@/app/admin/products/actions';
import { notFound } from 'next/navigation';
import ProductDetailClientWrapper from './ProductDetailClientWrapper';
import dbConnect from '@/lib/dbConnect';
import Review from '@/models/Review';
import type { Metadata, ResolvingMetadata } from 'next';

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

async function getProductReviews(productId: string) {
  await dbConnect();
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    .sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(reviews));
}

// SEO Metadata Generator
export async function generateMetadata(
  { params }: ProductPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    return { title: 'Produk Tidak Ditemukan | Cellebeads' };
  }

  const mainImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : '/placeholder-banner.jpg';

  return {
    title: `${product.name} | Koleksi Cellebeads`,
    description: product.description?.substring(0, 160),
    openGraph: {
      title: product.name,
      images: [{ url: mainImage }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const resolvedParams = await params;
  const product = await getProductById(resolvedParams.id);

  if (!product) {
    notFound();
  }

  const reviews = await getProductReviews(resolvedParams.id);

  // Kirim product DAN reviews ke Client Wrapper agar layout menyatu
  return <ProductDetailClientWrapper product={product} reviews={reviews} />;
}