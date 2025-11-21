// File: app/admin/sales-history/page.tsx
import { getCompletedOrdersWithItems, IOrderItem } from './actions';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { TrendingUp, Calendar, CalendarRange, CalendarDays, CalendarCheck, Layers } from 'lucide-react';
import SalesHistoryTable from './SalesHistoryTable';

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function SalesHistoryPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const filter = resolvedParams.filter || 'all';
  const soldItems: IOrderItem[] = await getCompletedOrdersWithItems(filter);
  const totalRevenue = soldItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const FilterButton = ({ value, label, icon: Icon }: { value: string, label: string, icon: any }) => {
     const isActive = filter === value;
     return (
        <Button 
          asChild 
          variant={isActive ? 'default' : 'ghost'} 
          size="sm" 
          className={`rounded-full px-4 gap-2 transition-all ${isActive ? 'bg-stone-800 text-white hover:bg-stone-700' : 'text-stone-500 hover:bg-stone-100'}`}
        >
          <Link href={`/admin/sales-history?filter=${value}`}>
            <Icon size={14} /> {label}
          </Link>
        </Button>
     );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-lora font-semibold text-stone-800 mb-2">Laporan Penjualan</h1>
          <div className="flex flex-wrap gap-1 bg-white border border-stone-200 p-1 rounded-full shadow-sm w-fit mt-2">
            <FilterButton value="all" label="Semua" icon={Layers} />
            <FilterButton value="daily" label="Hari Ini" icon={Calendar} />
            <FilterButton value="weekly" label="Minggu Ini" icon={CalendarRange} />
            <FilterButton value="monthly" label="Bulan Ini" icon={CalendarDays} />
            {/* Tombol Filter Tahunan */}
            <FilterButton value="yearly" label="Tahun Ini" icon={CalendarCheck} />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-emerald-50 to-white border border-emerald-100 p-6 rounded-2xl shadow-sm min-w-[250px] hover:-translate-y-1 transition-transform duration-500">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <TrendingUp size={18} />
            <span className="text-xs font-bold uppercase tracking-wider">Total Pendapatan</span>
          </div>
          <div className="text-3xl font-lora font-bold text-stone-800">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
         <CardContent className="p-0">
           <SalesHistoryTable items={soldItems} />
         </CardContent>
       </Card>
    </div>
  );
}