// File: app/admin/page.tsx
import { getAdminStats } from './dashboard/actions';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { DollarSign, ShoppingBag, Package, Users, Box, BarChart, Star, Sparkles } from 'lucide-react';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  // Menu Akses Cepat dengan Warna-Warni
  const adminFeatures = [
    { title: "Kelola Produk", desc: "Stok & Katalog", icon: Box, href: "/admin/products", color: "text-pink-700", bg: "bg-pink-100" },
    { title: "Pesanan Masuk", desc: "Cek Status", icon: ShoppingBag, href: "/admin/orders", color: "text-purple-700", bg: "bg-purple-100" },
    { title: "Analisa Penjualan", desc: "Laporan Data", icon: BarChart, href: "/admin/sales-history", color: "text-blue-700", bg: "bg-blue-100" },
    { title: "Ulasan Pembeli", desc: "Feedback", icon: Star, href: "/admin/reviews", color: "text-orange-700", bg: "bg-orange-100" }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Admin - Colorful Gradient */}
      <div className="relative bg-gradient-to-r from-pink-500 via-rose-500 to-orange-400 rounded-3xl p-8 md:p-12 text-white shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 opacity-20 transform translate-x-10 -translate-y-10 text-white">
           <Sparkles size={250} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-bold mb-3 border border-white/30 text-white shadow-sm">
               ✨ Admin Panel
            </div>
            <h1 className="text-3xl md:text-5xl font-lora font-bold mb-2">Halo, Owner!</h1>
            <p className="text-pink-100 max-w-md text-lg font-medium">
              Semoga penjualan hari ini manis dan lancar!
            </p>
          </div>
          
          <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl border border-white/50 min-w-[240px] shadow-lg text-stone-800 transform rotate-2 hover:rotate-0 transition-transform duration-300">
             <div className="flex items-center gap-3 mb-2 text-stone-500">
                <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600"><DollarSign size={20}/></div>
                <span className="text-xs font-bold uppercase tracking-wider">Total Pendapatan</span>
             </div>
             <p className="text-4xl font-bold font-mono text-stone-900">
               Rp {stats.totalRevenue.toLocaleString('id-ID', { notation: "compact", maximumFractionDigits: 1 })}
             </p>
          </div>
        </div>
      </div>
      
      {/* Statistik Utama Grid - Kartu Warna Warni */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Card Pesanan (Pink) */}
        <Card className="border-none shadow-md bg-gradient-to-br from-white to-pink-50 rounded-3xl hover:shadow-lg transition-all duration-300 group border-b-4 border-pink-400">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-pink-100 flex items-center justify-center text-pink-600 shadow-sm group-hover:scale-110 transition-transform">
                    <ShoppingBag size={28} />
                </div>
                {stats.pendingOrdersCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse">
                    ACTION NEEDED
                  </span>
                )}
            </div>
            <div className="text-5xl font-bold text-stone-800 mb-1">
              {stats.pendingOrdersCount}
            </div>
            <p className="text-sm text-stone-500 font-bold uppercase tracking-wide">Pesanan Baru</p>
          </CardContent>
        </Card>

        {/* Card Produk (Blue) */}
        <Card className="border-none shadow-md bg-gradient-to-br from-white to-blue-50 rounded-3xl hover:shadow-lg transition-all duration-300 group border-b-4 border-blue-400">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Package size={28} />
                </div>
            </div>
            <div className="text-5xl font-bold text-stone-800 mb-1">
              {stats.totalProducts}
            </div>
            <p className="text-sm text-stone-500 font-bold uppercase tracking-wide">Total Produk</p>
          </CardContent>
        </Card>

        {/* Card Pelanggan (Purple) */}
        <Card className="border-none shadow-md bg-gradient-to-br from-white to-purple-50 rounded-3xl hover:shadow-lg transition-all duration-300 group border-b-4 border-purple-400">
          <CardContent className="p-8">
            <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shadow-sm group-hover:scale-110 transition-transform">
                    <Users size={28} />
                </div>
            </div>
            <div className="text-5xl font-bold text-stone-800 mb-1">
              {stats.totalCustomers}
            </div>
            <p className="text-sm text-stone-500 font-bold uppercase tracking-wide">Pelanggan</p>
          </CardContent>
        </Card>
      </div>

      {/* Menu Akses Cepat */}
      <div>
        <h2 className="text-xl font-lora font-bold text-stone-800 mb-6 pl-3 border-l-4 border-primary">Akses Cepat</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {adminFeatures.map((feature) => (
            <Link key={feature.title} href={feature.href} className="group block h-full">
              <div className="flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-white border border-stone-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full relative overflow-hidden">
                {/* Dekorasi lingakaran background saat hover */}
                <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full ${feature.bg} opacity-50 transition-all duration-500 group-hover:scale-[5]`}></div>
                
                <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center mb-4 ${feature.bg} ${feature.color} group-hover:scale-110 transition-transform shadow-sm`}>
                  <feature.icon size={30} strokeWidth={2} />
                </div>
                <h3 className="relative z-10 text-lg font-bold text-stone-800 mb-1">{feature.title}</h3>
                <p className="relative z-10 text-xs text-stone-500 font-medium">{feature.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}