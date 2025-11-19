// File: app/admin/sales-history/page.tsx
import { getCompletedOrdersWithItems, IOrderItem } from './actions';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalendarDays, CalendarRange, Calendar, Layers } from 'lucide-react';

interface PageProps {
  searchParams: Promise<{ filter?: string }>;
}

export default async function SalesHistoryPage({ searchParams }: PageProps) {
  // 1. Ambil filter dari URL, default 'all'
  const resolvedParams = await searchParams;
  const filter = resolvedParams.filter || 'all';

  // 2. Ambil data sesuai filter
  const soldItems: IOrderItem[] = await getCompletedOrdersWithItems(filter);

  // Hitung total pendapatan untuk periode ini
  const totalRevenue = soldItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Helper untuk style tombol aktif
  const getVariant = (btnFilter: string) => filter === btnFilter ? "default" : "outline";

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-lora font-semibold">Riwayat Penjualan</h1>
          <p className="text-stone-500">Laporan penjualan barang yang sudah selesai.</p>
        </div>
        
        {/* TOTAL PENDAPATAN (Ringkasan Cepat) */}
        <div className="bg-white border border-stone-200 px-4 py-2 rounded-lg shadow-sm">
          <span className="text-xs text-stone-500 uppercase font-bold tracking-wider">Total Pendapatan ({filter === 'all' ? 'Semua' : filter})</span>
          <div className="text-xl font-bold text-emerald-600">Rp {totalRevenue.toLocaleString('id-ID')}</div>
        </div>
      </div>
      
      {/* FILTER BAR */}
      <div className="flex flex-wrap gap-2">
        <Button asChild variant={getVariant('all')} size="sm" className="gap-2">
          <Link href="/admin/sales-history?filter=all">
            <Layers size={16} /> Semua
          </Link>
        </Button>
        <Button asChild variant={getVariant('daily')} size="sm" className="gap-2">
          <Link href="/admin/sales-history?filter=daily">
            <Calendar size={16} /> Hari Ini
          </Link>
        </Button>
        <Button asChild variant={getVariant('weekly')} size="sm" className="gap-2">
          <Link href="/admin/sales-history?filter=weekly">
            <CalendarRange size={16} /> 7 Hari Terakhir
          </Link>
        </Button>
        <Button asChild variant={getVariant('monthly')} size="sm" className="gap-2">
          <Link href="/admin/sales-history?filter=monthly">
            <CalendarDays size={16} /> Bulan Ini
          </Link>
        </Button>
      </div>

      <Card>
         <CardHeader>
           <CardTitle>
             {filter === 'daily' ? 'Penjualan Hari Ini' : 
              filter === 'weekly' ? 'Penjualan 7 Hari Terakhir' : 
              filter === 'monthly' ? 'Penjualan Bulan Ini' : 
              'Semua Penjualan'}
           </CardTitle>
         </CardHeader>
         <CardContent>
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Tanggal</TableHead>
                 <TableHead>Nama Barang</TableHead>
                 <TableHead className="text-center">Jumlah</TableHead>
                 <TableHead className="text-right">Harga Satuan</TableHead>
                 <TableHead className="text-right">Total Harga</TableHead>
                 <TableHead>Pelanggan</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {soldItems.map((item, index) => (
                 <TableRow key={index}>
                   <TableCell className="text-sm text-muted-foreground">
                     {new Date(item.orderDate).toLocaleDateString('id-ID', { 
                       day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                     })}
                   </TableCell>
                   <TableCell className="font-medium">{item.name}</TableCell>
                   <TableCell className="text-center">{item.quantity}</TableCell>
                   <TableCell className="text-right">Rp {item.price.toLocaleString('id-ID')}</TableCell>
                   <TableCell className="text-right font-semibold">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</TableCell>
                   <TableCell>{item.customerName}</TableCell>
                 </TableRow>
               ))}
               {soldItems.length === 0 && (
                 <TableRow>
                   <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
                     Tidak ada data penjualan untuk periode ini.
                   </TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
         </CardContent>
       </Card>
    </div>
  );
}