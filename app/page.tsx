// File: app/page.tsx
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getProducts } from '@/app/admin/products/actions'; 
import ProductGrid from '@/app/products/ProductGrid'; 
import { Search, ShieldCheck, Truck, Gem, Watch, Smartphone, Key, CircleDashed, Sparkles, Heart } from 'lucide-react';
import { auth } from '@/auth'; // <-- Import Auth
import LandingView from '@/components/LandingView'; // <-- Import Landing View Baru

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // 1. Cek Sesi Pengguna
  const session = await auth();

  // 2. Jika BELUM LOGIN -> Tampilkan Landing Page Khusus
  if (!session) {
    return <LandingView />;
  }

  // 3. Jika SUDAH LOGIN -> Tampilkan Halaman Toko (Kode Lama Anda)
  const latestProducts = await getProducts();
  const productsToShow = latestProducts.slice(0, 8); 

  const categories = [
    { name: 'Gelang', icon: CircleDashed, href: '/products?category=Gelang', color: 'text-pink-600', bg: 'bg-pink-100' },
    { name: 'Kalung', icon: Gem, href: '/products?category=Kalung', color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Cincin', icon: Sparkles, href: '/products?category=Cincin', color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Keychain', icon: Key, href: '/products?category=Keychain', color: 'text-teal-600', bg: 'bg-teal-100' },
    { name: 'Strap HP', icon: Smartphone, href: '/products?category=Strap Handphone', color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Jam Manik', icon: Watch, href: '/products?category=Jam Manik', color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  return (
    <div className="space-y-16 pb-20">
      
      {/* --- HERO SECTION (Toko) --- */}
      <section className="relative bg-gradient-to-br from-pink-200 via-purple-100 to-white pt-16 pb-24 px-4 md:px-0 overflow-hidden rounded-3xl shadow-sm border border-white">
        
        <div className="absolute top-10 left-10 text-white/60 animate-pulse"><Sparkles size={80} /></div>
        <div className="absolute bottom-20 right-10 text-purple-300/50 animate-bounce delay-700"><Heart size={60} /></div>

        <div className="container mx-auto text-center space-y-8 relative z-10">
          
          <div className="space-y-4 max-w-3xl mx-auto">
            <span className="inline-block py-1.5 px-5 rounded-full bg-white/90 text-primary text-xs font-bold tracking-widest uppercase shadow-sm mb-2 border border-pink-100">
              ✨ Selamat Datang Kembali, {session.user?.name?.split(' ')[0]}!
            </span>
            <h1 className="text-4xl md:text-7xl font-lora font-extrabold text-stone-800 leading-tight drop-shadow-sm">
              Kilau Cantik, <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Gaya Unikmu.</span>
            </h1>
            <p className="text-stone-600 text-lg max-w-xl mx-auto font-medium">
              Aksesoris manik *handmade* dengan kombinasi warna yang bikin harimu lebih ceria.
            </p>
          </div>

          <div className="max-w-2xl mx-auto relative transform hover:scale-[1.02] transition-transform duration-300">
            <form action="/products" className="relative flex items-center shadow-2xl shadow-pink-900/5 rounded-full bg-white p-2 pl-6 border-4 border-pink-50/50">
              <Search className="w-6 h-6 text-stone-400 absolute" />
              <Input 
                name="search"
                className="border-none shadow-none focus-visible:ring-0 pl-10 h-14 text-lg bg-transparent w-full placeholder:text-stone-400 text-stone-800"
                placeholder="Cari 'Cincin Mutiara'..."
              />
              <Button type="submit" className="rounded-full h-14 px-10 bg-primary hover:bg-pink-600 text-white font-bold text-lg shadow-lg shadow-pink-200">
                Cari
              </Button>
            </form>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-6 pt-8">
            <div className="flex items-center gap-2 text-stone-700 text-sm font-bold bg-white/70 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white shadow-sm">
               <div className="p-1.5 bg-emerald-100 rounded-full"><ShieldCheck className="w-4 h-4 text-emerald-600" /></div> 
               Aman & Terpercaya
            </div>
            <div className="flex items-center gap-2 text-stone-700 text-sm font-bold bg-white/70 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white shadow-sm">
               <div className="p-1.5 bg-blue-100 rounded-full"><Truck className="w-4 h-4 text-blue-600" /></div>
               Pengiriman Cepat
            </div>
            <div className="flex items-center gap-2 text-stone-700 text-sm font-bold bg-white/70 backdrop-blur-sm px-5 py-2.5 rounded-full border border-white shadow-sm">
               <div className="p-1.5 bg-pink-100 rounded-full"><Gem className="w-4 h-4 text-pink-600" /></div>
               Original Handmade
            </div>
          </div>

        </div>
      </section>

      {/* --- KATEGORI --- */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-3xl font-lora font-bold text-stone-800">Jelajahi Kategori</h2>
           <Link href="/products" className="text-sm font-bold text-primary hover:underline underline-offset-4">Lihat Semua</Link>
        </div>

        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
           {categories.map((cat) => (
             <Link key={cat.name} href={cat.href} className="group">
               <div className="flex flex-col items-center justify-center gap-4 p-6 rounded-3xl bg-white border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
                  <div className={`w-16 h-16 ${cat.bg} rounded-full flex items-center justify-center ${cat.color} group-hover:scale-110 transition-transform duration-300 shadow-inner`}>
                    <cat.icon size={28} strokeWidth={2} />
                  </div>
                  <span className="font-bold text-stone-700 text-sm group-hover:text-primary">{cat.name}</span>
               </div>
             </Link>
           ))}
        </div>
      </section>

      {/* --- PRODUK TERBARU --- */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-white font-extrabold tracking-wider uppercase text-xs bg-primary px-3 py-1 rounded-md shadow-sm">New Arrivals</span>
            <h2 className="text-3xl font-lora font-bold text-stone-900 mt-3">Produk Terbaru</h2>
          </div>
        </div>
        
        <div className="bg-white p-2 md:p-6 rounded-3xl border border-stone-200 shadow-sm">
           <ProductGrid products={productsToShow} />
        </div>
        
        <div className="text-center mt-12">
            <Button asChild size="lg" variant="outline" className="rounded-full px-10 border-2 border-primary text-primary hover:bg-primary hover:text-white font-bold">
              <Link href="/products">Lihat Koleksi Lengkap</Link>
            </Button>
        </div>
      </section>

    </div>
  );
}