// File: app/admin/page.tsx
import { getAdminStats } from './dashboard/actions';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { 
  DollarSign, 
  ShoppingBag, 
  Package, 
  Users, 
  ArrowRight, 
  Box, 
  BarChart, 
  Star,
  ExternalLink 
} from 'lucide-react';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  // Daftar Fitur Admin untuk Akses Cepat
  const adminFeatures = [
    {
      title: "Kelola Produk",
      description: "Tambah stok, edit harga, atau upload produk baru.",
      icon: Box,
      href: "/admin/products",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      btnText: "Atur Produk"
    },
    {
      title: "Kelola Pesanan",
      description: "Cek pesanan masuk dan konfirmasi pembayaran.",
      icon: ShoppingBag,
      href: "/admin/orders",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      btnText: "Proses Pesanan"
    },
    {
      title: "Riwayat Penjualan",
      description: "Laporan lengkap barang yang telah laku terjual.",
      icon: BarChart,
      href: "/admin/sales-history",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      btnText: "Lihat Laporan"
    },
    {
      title: "Ulasan Pelanggan",
      description: "Baca feedback dan rating dari pembeli.",
      icon: Star,
      href: "/admin/reviews",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      btnText: "Cek Ulasan"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard Admin</h1>
          <p className="text-slate-500">Ringkasan kinerja toko dan pusat kontrol.</p>
        </div>
        <Button asChild variant="outline" className="border-slate-300">
          <Link href="/" target="_blank">
            <ExternalLink className="mr-2 h-4 w-4" />
            Lihat Tampilan Pelanggan
          </Link>
        </Button>
      </div>
      
      {/* Bagian 1: Statistik Utama (Key Metrics) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        <Card className="shadow-sm border-l-4 border-l-emerald-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Pendapatan</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">Rp {stats.totalRevenue.toLocaleString('id-ID')}</div>
            <p className="text-xs text-muted-foreground mt-1">Dari pesanan selesai</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-rose-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pesanan Baru</CardTitle>
            <ShoppingBag className="h-4 w-4 text-rose-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats.pendingOrdersCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Menunggu konfirmasi</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Produk</CardTitle>
            <Package className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground mt-1">Item aktif di katalog</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pelanggan</CardTitle>
            <Users className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{stats.totalCustomers}</div>
            <p className="text-xs text-muted-foreground mt-1">Akun terdaftar</p>
          </CardContent>
        </Card>

      </div>

      {/* Bagian 2: Menu Akses Cepat (Fitur Admin) */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4">Menu Pengelolaan</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {adminFeatures.map((feature) => (
            <Card key={feature.title} className="hover:shadow-md transition-all duration-200 border-slate-200 flex flex-col group">
              <CardHeader className="pb-2">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.bgColor} transition-transform group-hover:scale-110`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg font-semibold text-slate-800">{feature.title}</CardTitle>
                <CardDescription className="text-sm text-slate-500 min-h-[40px]">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardFooter className="mt-auto pt-4">
                <Button asChild variant="outline" className="w-full border-slate-300 hover:bg-slate-50 text-slate-700">
                  <Link href={feature.href}>
                    {feature.btnText} 
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}