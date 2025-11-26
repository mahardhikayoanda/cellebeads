// File: app/admin/page.tsx
import { getAdminStats } from './dashboard/actions';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { 
  DollarSign, ShoppingBag, Package, Users, 
  ChevronRight, TrendingUp, BarChart // <-- SAYA SUDAH TAMBAHKAN INI
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  // Helper untuk format mata uang
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="space-y-8">
      
      {/* 1. Header Selamat Datang */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-lora font-bold text-stone-900">Dashboard Admin</h1>
          <p className="text-stone-500 mt-1 text-sm">Ringkasan performa toko hari ini.</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-stone-400 bg-white px-4 py-2 rounded-full border border-stone-100 shadow-sm">
           <span>Update Terakhir: {new Date().toLocaleTimeString('id-ID')}</span>
        </div>
      </div>
      
      {/* 2. Statistik Utama (Gaya Profesional / Executive) */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Total Revenue */}
        <Card className="border border-stone-100 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Pendapatan</p>
                <h3 className="text-2xl font-bold text-stone-900 mt-2">{formatCurrency(stats.totalRevenue)}</h3>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-emerald-600 font-medium">
               <TrendingUp size={14} className="mr-1" /> Total Akumulasi
            </div>
          </CardContent>
        </Card>

        {/* Pesanan Pending */}
        <Card className={`border shadow-sm bg-white ${stats.pendingOrdersCount > 0 ? 'border-l-4 border-l-rose-500' : 'border-stone-100'}`}>
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Perlu Diproses</p>
                <h3 className="text-2xl font-bold text-stone-900 mt-2">{stats.pendingOrdersCount} <span className="text-sm font-normal text-stone-400">Pesanan</span></h3>
              </div>
              <div className={`p-2 rounded-lg ${stats.pendingOrdersCount > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-stone-50 text-stone-400'}`}>
                <ShoppingBag size={20} />
              </div>
            </div>
            {stats.pendingOrdersCount > 0 ? (
               <Link href="/admin/orders" className="mt-4 inline-flex items-center text-xs text-rose-600 font-bold hover:underline">
                 Proses Sekarang <ChevronRight size={14} />
               </Link>
            ) : (
               <div className="mt-4 text-xs text-stone-400">Semua pesanan aman.</div>
            )}
          </CardContent>
        </Card>

        {/* Total Produk */}
        <Card className="border border-stone-100 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Katalog</p>
                <h3 className="text-2xl font-bold text-stone-900 mt-2">{stats.totalProducts} <span className="text-sm font-normal text-stone-400">Produk</span></h3>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Package size={20} />
              </div>
            </div>
            <Link href="/admin/products" className="mt-4 inline-flex items-center text-xs text-stone-500 hover:text-primary transition-colors">
               Kelola Inventaris <ChevronRight size={14} />
            </Link>
          </CardContent>
        </Card>

        {/* Total Customer */}
        <Card className="border border-stone-100 shadow-sm bg-white">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">Pelanggan</p>
                <h3 className="text-2xl font-bold text-stone-900 mt-2">{stats.totalCustomers} <span className="text-sm font-normal text-stone-400">Akun</span></h3>
              </div>
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Users size={20} />
              </div>
            </div>
            <div className="mt-4 text-xs text-stone-400">Terdaftar di sistem.</div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Quick Actions Panel */}
      <div className="grid md:grid-cols-2 gap-6">
         {/* Action: Kelola Pesanan */}
         <Link href="/admin/orders" className="group">
            <div className="bg-stone-900 rounded-2xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full justify-between relative overflow-hidden">
               <div className="relative z-10">
                  <h3 className="text-xl font-bold mb-2">Kelola Pesanan Masuk</h3>
                  <p className="text-stone-400 text-sm max-w-xs">Pantau status pembayaran, konfirmasi pesanan, dan atur pengiriman barang ke pelanggan.</p>
               </div>
               <div className="relative z-10 mt-6 flex items-center font-bold text-sm text-rose-300 group-hover:text-rose-200">
                  Buka Halaman Pesanan <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform"/>
               </div>
               {/* Dekorasi background */}
               <ShoppingBag className="absolute -bottom-6 -right-6 text-white/5 w-40 h-40 group-hover:scale-110 transition-transform duration-500" />
            </div>
         </Link>

         {/* Action: Laporan & Produk */}
         <div className="flex flex-col gap-6">
            <Link href="/admin/sales-history" className="flex-1 bg-white border border-stone-200 rounded-2xl p-6 hover:border-rose-200 hover:shadow-md transition-all group flex items-center justify-between">
               <div>
                  <h4 className="font-bold text-stone-800">Laporan Penjualan</h4>
                  <p className="text-xs text-stone-500 mt-1">Analisa item terlaris dan revenue.</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-rose-50 group-hover:text-rose-500 transition-colors">
                  <BarChart size={20} />
               </div>
            </Link>

            <Link href="/admin/products" className="flex-1 bg-white border border-stone-200 rounded-2xl p-6 hover:border-blue-200 hover:shadow-md transition-all group flex items-center justify-between">
               <div>
                  <h4 className="font-bold text-stone-800">Tambah / Edit Produk</h4>
                  <p className="text-xs text-stone-500 mt-1">Update stok dan harga barang.</p>
               </div>
               <div className="w-10 h-10 rounded-full bg-stone-50 flex items-center justify-center text-stone-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                  <Package size={20} />
               </div>
            </Link>
         </div>
      </div>
    </div>
  );
}