// File: app/admin/page.tsx
import { getAdminStats } from './dashboard/actions';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { DollarSign, ShoppingBag, Package, Users, ArrowRight, Box, BarChart, Star } from 'lucide-react';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const adminFeatures = [
    { title: "Produk", desc: "Kelola stok & katalog", icon: Box, href: "/admin/products", color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Pesanan", desc: "Cek pesanan masuk", icon: ShoppingBag, href: "/admin/orders", color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Laporan", desc: "Analisa penjualan", icon: BarChart, href: "/admin/sales-history", color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Ulasan", desc: "Feedback pembeli", icon: Star, href: "/admin/reviews", color: "text-yellow-600", bg: "bg-yellow-50" }
  ];

  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-lora font-medium text-stone-800 mb-2">Selamat Datang, Admin.</h1>
        <p className="text-stone-500">Berikut adalah ringkasan performa butik Anda hari ini.</p>
      </div>
      
      {/* Statistik Utama - Gaya Minimalis Mewah */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Card 1: Pendapatan */}
        <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow bg-white rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="w-24 h-24 text-emerald-600" />
          </div>
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center mb-4 text-emerald-600">
              <DollarSign size={20} />
            </div>
            <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">Pendapatan</p>
            <div className="text-3xl font-lora font-bold text-stone-800 mt-1">
              Rp {stats.totalRevenue.toLocaleString('id-ID')}
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Pesanan Baru */}
        <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow bg-white rounded-2xl overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <ShoppingBag className="w-24 h-24 text-rose-500" />
          </div>
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mb-4 text-rose-500">
              <ShoppingBag size={20} />
            </div>
            <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">Pesanan Baru</p>
            <div className="text-3xl font-lora font-bold text-stone-800 mt-1">
              {stats.pendingOrdersCount}
            </div>
            {stats.pendingOrdersCount > 0 && (
              <p className="text-xs text-rose-500 font-medium mt-2 flex items-center">
                <span className="w-2 h-2 bg-rose-500 rounded-full mr-2 animate-pulse"></span> 
                Perlu diproses
              </p>
            )}
          </CardContent>
        </Card>

        {/* Card 3: Total Produk */}
        <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow bg-white rounded-2xl overflow-hidden relative group">
          {/* --- Tambahan Bayangan Icon Package --- */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Package className="w-24 h-24 text-blue-600" />
          </div>
          {/* -------------------------------------- */}
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-4 text-blue-600">
              <Package size={20} />
            </div>
            <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">Katalog Produk</p>
            <div className="text-3xl font-lora font-bold text-stone-800 mt-1">
              {stats.totalProducts}
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Pelanggan */}
        <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.06)] transition-shadow bg-white rounded-2xl overflow-hidden relative group">
          {/* --- Tambahan Bayangan Icon Users --- */}
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="w-24 h-24 text-orange-600" />
          </div>
          {/* ------------------------------------ */}
          <CardContent className="p-6">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center mb-4 text-orange-600">
              <Users size={20} />
            </div>
            <p className="text-sm font-medium text-stone-500 uppercase tracking-wider">Pelanggan</p>
            <div className="text-3xl font-lora font-bold text-stone-800 mt-1">
              {stats.totalCustomers}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Menu Akses Cepat */}
      <div>
        <h2 className="text-xl font-lora font-medium text-stone-800 mb-6">Akses Cepat</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {adminFeatures.map((feature) => (
            <Link key={feature.title} href={feature.href} className="group">
              <div className="bg-white p-6 rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg} transition-transform group-hover:scale-110 duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold text-stone-800 mb-1 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-sm text-stone-500 mb-4 line-clamp-1">{feature.desc}</p>
                <div className="flex items-center text-xs font-bold text-stone-400 uppercase tracking-wider group-hover:text-primary transition-colors">
                  Buka <ArrowRight className="ml-2 w-3 h-3" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}