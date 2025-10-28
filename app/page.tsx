// File: app/page.tsx
import Link from 'next/link';
import Image from 'next/image';
// Anda mungkin ingin menampilkan beberapa produk unggulan di sini
// import { getProducts, IProduct } from '@/app/admin/products/actions'; 

export default async function HomePage() {
  // Ambil beberapa produk unggulan jika perlu
  // const featuredProducts: IProduct[] = (await getProducts()).slice(0, 4); // Ambil 4 produk pertama

  return (
    <div>
      {/* --- Hero Section --- */}
      <section className="relative bg-linear-to-r from-rose-50 to-stone-50 rounded-lg shadow-md overflow-hidden mb-12 py-20 px-8 text-center md:text-left md:flex md:items-center">
        <div className="md:w-1/2 relative z-10">
          <h1 className="text-4xl md:text-5xl font-lora font-medium text-stone-800 mb-4 leading-tight">
            Temukan Kilau Sempurna Anda
          </h1>
          <p className="text-lg text-stone-600 mb-8">
            Koleksi aksesoris wanita pilihan untuk setiap momen istimewa.
          </p>
          <Link 
            href="/products" 
            className="inline-block py-3 px-8 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-md shadow-md transition-colors"
          >
            Lihat Koleksi
          </Link>
        </div>
        {/* Gambar di sisi kanan (opsional) */}
        <div className="hidden md:block md:w-1/2 mt-8 md:mt-0 relative h-64 md:h-auto">
           {/* Ganti dengan URL gambar banner Anda */}
           <Image 
             src="/placeholder-banner.jpg" // Simpan gambar di folder /public
             alt="Aksesoris Wanita Cantik" 
             layout="fill" 
             objectFit="cover" 
             className="rounded-md"
           /> 
        </div>
      </section>

      {/* --- Bagian Produk Unggulan (Contoh) --- */}
      <section className="mb-12">
        <h2 className="text-2xl font-lora font-medium text-stone-800 mb-6 text-center">
          Produk Terbaru
        </h2>
        {/* Di sini Anda bisa menampilkan grid produk menggunakan ProductCard */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div> */}
        <p className="text-center mt-4 text-stone-500">(Tampilkan beberapa ProductCard di sini)</p>
         <div className="text-center mt-6">
             <Link href="/products" className="text-rose-500 hover:text-rose-600 font-medium">
                 Lihat Semua Produk &rarr;
             </Link>
         </div>
      </section>

      {/* Anda bisa tambahkan bagian lain di sini (Tentang Kami, Kategori, dll.) */}

    </div>
  );
}