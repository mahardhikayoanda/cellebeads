// File: app/admin/orders/page.tsx
import { getOrders, IOrder } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderTable from './OrderTable'; 
import { ShoppingBag, Clock, CheckCircle, Users, Layers, Calendar, CalendarRange, CalendarDays, CalendarCheck } from 'lucide-react'; 
import { Button } from '@/components/ui/button';
import Link from 'next/link';

// Kita TIDAK LAGI mengimport AdminDateFilter

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const filter = resolvedParams.filter || 'all';

  // Panggil getOrders hanya dengan filter sederhana
  const orders: IOrder[] = await getOrders(filter);

  // Hitung Statistik
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => ['processed', 'delivered'].includes(o.status)).length;
  
  // LOGIKA: Hitung Pelanggan Unik (berdasarkan email)
  const uniqueCustomers = new Set(orders.map(o => o.user?.email).filter(Boolean)).size;

  // Helper Komponen Tombol Filter Sederhana
  const FilterButton = ({ value, label, icon: Icon }: { value: string, label: string, icon: any }) => {
     const isActive = filter === value;
     return (
        <Button 
          asChild 
          variant={isActive ? 'default' : 'outline'} 
          size="sm" 
          className={`gap-2 rounded-full px-4 transition-all ${isActive ? 'bg-stone-800 text-white hover:bg-stone-700 shadow-md' : 'text-stone-500 hover:bg-stone-50 border-stone-200'}`}
        >
          <Link href={`/admin/orders?filter=${value}`}>
            <Icon size={14} /> {label}
          </Link>
        </Button>
     );
  };

  // Helper Komponen Kartu Statistik
  const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
    <Card className="border-none shadow-[0_4px_20px_rgba(0,0,0,0.03)] bg-white rounded-2xl relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
      <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
        <Icon className="w-20 h-20" />
      </div>
      <CardContent className="p-6">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${bg} ${color}`}>
          <Icon size={20} />
        </div>
        <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">{title}</p>
        <div className="text-2xl font-lora font-bold text-stone-800 mt-1">{value}</div>
      </CardContent>
    </Card>
  );

  // Label Judul Tabel Dinamis
  const filterLabels: Record<string, string> = {
    all: 'Semua Data',
    daily: 'Hari Ini',
    weekly: 'Minggu Ini',
    monthly: 'Bulan Ini',
    yearly: 'Tahun Ini'
  };

  const displayTitle = filterLabels[filter] || 'Semua Data';

  return (
     <div className="space-y-8">
      {/* Header & Filter Sederhana */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h1 className="text-3xl font-lora font-semibold text-stone-800">Kelola Pesanan</h1>
          <p className="text-stone-500 mb-4">Pantau status transaksi pelanggan Anda.</p>
        </div>

        {/* Tombol Filter Manual (Tanpa Dropdown Kompleks) */}
        <div className="flex flex-wrap gap-2">
            <FilterButton value="all" label="Semua" icon={Layers} />
            <FilterButton value="daily" label="Hari Ini" icon={Calendar} />
            <FilterButton value="weekly" label="Minggu Ini" icon={CalendarRange} />
            <FilterButton value="monthly" label="Bulan Ini" icon={CalendarDays} />
            <FilterButton value="yearly" label="Tahun Ini" icon={CalendarCheck} />
        </div>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Total Pesanan" value={totalOrders} icon={ShoppingBag} color="text-blue-600" bg="bg-blue-50" />
        <StatCard title="Menunggu" value={pendingOrders} icon={Clock} color="text-rose-500" bg="bg-rose-50" />
        <StatCard title="Selesai" value={completedOrders} icon={CheckCircle} color="text-emerald-600" bg="bg-emerald-50" />
        
        {/* KARTU BARU: PELANGGAN YANG MEMBELI */}
        <StatCard 
          title="Pelanggan Membeli" 
          value={uniqueCustomers} 
          icon={Users} 
          color="text-orange-600" 
          bg="bg-orange-50" 
        />
      </div>

      {/* Tabel Pesanan */}
      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
        <CardHeader className="px-6 py-5 border-b border-stone-50 bg-white flex flex-row items-center gap-2">
          <Layers size={18} className="text-stone-400"/>
          <CardTitle className="text-lg font-medium text-stone-800">
             Daftar Pesanan: <span className="text-primary">{displayTitle}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <OrderTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}