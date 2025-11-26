import { getAdminStats } from './dashboard/actions';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import Link from 'next/link';
import { 
  DollarSign, ShoppingBag, Package, Users, 
  ChevronRight, ArrowUpRight
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();

  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(val);

  // Komponen Kartu Statistik Kecil
  const StatCard = ({ title, value, icon: Icon, color, gradient, link }: any) => (
    <Card className="glass-panel hover-card border-none overflow-hidden relative group">
        {/* Background Gradient Circle Decoration */}
        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700 ${gradient}`} />
        
        <CardContent className="p-6 relative z-10">
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${color} text-white shadow-md`}>
                    <Icon size={22} />
                </div>
                {link && (
                    <Link href={link} className="text-stone-300 hover:text-primary transition-colors">
                        <ArrowUpRight size={18} />
                    </Link>
                )}
            </div>
            <div>
                <p className="text-sm font-medium text-stone-500 mb-1">{title}</p>
                <h3 className="text-3xl font-lora font-bold text-stone-800">{value}</h3>
            </div>
        </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      
      {/* Header: Salam & Jam */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-lora font-bold text-stone-800">
            Halo, Admin! <span className="text-2xl">👋</span>
          </h1>
          <p className="text-stone-500 mt-1">Berikut ringkasan toko cantikmu hari ini.</p>
        </div>
        {/* Bagian Live Update dihapus dari sini */}
      </div>
      
      {/* Baris 1: Statistik Utama */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
            title="Total Pendapatan" 
            value={formatCurrency(stats.totalRevenue)} 
            icon={DollarSign} 
            color="bg-gradient-to-br from-emerald-400 to-emerald-600"
            gradient="bg-emerald-400"
        />
        <StatCard 
            title="Perlu Diproses" 
            value={stats.pendingOrdersCount} 
            icon={ShoppingBag} 
            color={stats.pendingOrdersCount > 0 ? "bg-gradient-to-br from-rose-400 to-rose-600 animate-pulse" : "bg-gradient-to-br from-stone-400 to-stone-500"}
            gradient="bg-rose-400"
            link="/admin/orders"
        />
        <StatCard 
            title="Total Produk" 
            value={stats.totalProducts} 
            icon={Package} 
            color="bg-gradient-to-br from-blue-400 to-blue-600"
            gradient="bg-blue-400"
            link="/admin/products"
        />
        <StatCard 
            title="Pelanggan Setia" 
            value={stats.totalCustomers} 
            icon={Users} 
            color="bg-gradient-to-br from-purple-400 to-purple-600"
            gradient="bg-purple-400"
        />
      </div>

      {/* Baris 2: Aksi Cepat (Tanpa Grafik) */}
      <div className="grid md:grid-cols-2 gap-8">
         
         {/* Kolom Kiri: Aksi Cepat */}
         <div className="glass-panel rounded-2xl p-6 h-full">
            <h3 className="font-bold text-stone-800 mb-4 flex items-center gap-2">
                <ShoppingBag size={18} className="text-primary"/>
                Aksi Cepat
            </h3>
            <div className="space-y-3">
                <Link href="/admin/orders" className="flex items-center justify-between p-4 bg-white border border-stone-100 rounded-xl hover:border-rose-200 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-rose-500" />
                        <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900">Cek Pesanan Masuk</span>
                    </div>
                    <ChevronRight size={16} className="text-stone-300 group-hover:text-primary" />
                </Link>
                <Link href="/admin/products" className="flex items-center justify-between p-4 bg-white border border-stone-100 rounded-xl hover:border-blue-200 hover:shadow-md transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-sm font-medium text-stone-600 group-hover:text-stone-900">Tambah Produk Baru</span>
                    </div>
                    <ChevronRight size={16} className="text-stone-300 group-hover:text-primary" />
                </Link>
            </div>
         </div>

         {/* Kolom Kanan: Banner Tips */}
         <div className="relative overflow-hidden rounded-2xl p-6 text-white shadow-lg flex flex-col justify-center min-h-[200px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-purple-600" />
            <div className="absolute -bottom-10 -right-10 text-white/10">
                <ShoppingBag size={120} />
            </div>
            <div className="relative z-10">
                <p className="text-xs font-bold text-white/80 uppercase tracking-widest mb-1">Tips Admin</p>
                <h4 className="text-lg font-bold mb-3 leading-tight">Jangan lupa update stok secara berkala!</h4>
                <Button size="sm" variant="secondary" className="text-primary bg-white hover:bg-stone-50 border-none w-fit" asChild>
                    <Link href="/admin/products">Kelola Sekarang</Link>
                </Button>
            </div>
         </div>
      </div>
    </div>
  );
}