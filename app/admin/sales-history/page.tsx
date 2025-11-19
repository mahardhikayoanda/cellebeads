// File: app/admin/sales-history/page.tsx
import { getCompletedOrdersWithItems, IOrderItem } from './actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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

  // 2. Ambil data sesuai filter dari server action
  const soldItems: IOrderItem[] = await getCompletedOrdersWithItems(filter);

  // 3. Hitung TOTAL PENDAPATAN (Realtime sesuai filter)
  const totalRevenue = soldItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Helper untuk style tombol aktif (memberi warna jika dipilih)
  const getVariant = (btnFilter: string) => filter === btnFilter ? "default" : "outline";

  return (
    <div className="space-y-8">
      {/* Header & Total Pendapatan */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-lora font-semibold text-slate-900">Riwayat Penjualan</h1>
          <p className="text-slate-500">Laporan keuangan berdasarkan periode waktu.</p>
        </div>
        
        {/* KARTU TOTAL PENDAPATAN DINAMIS */}
        <div className="bg-white border border-emerald-100 px-6 py-3 rounded-xl shadow-sm flex flex-col items-end">
          <span className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">
            Total Pendapatan ({filter === 'daily' ? 'Hari Ini' : filter === 'weekly' ? 'Minggu Ini' : filter === 'monthly' ? 'Bulan Ini' : 'Semua'})
          </span>
          <div className="text-2xl font-bold text-emerald-600">
            Rp {totalRevenue.toLocaleString('id-ID')}
          </div>
        </div>
      </div>
      
      {/* MENU FILTER WAKTU */}
      <div className="flex flex-wrap gap-2 bg-slate-50 p-1 rounded-lg w-fit border border-slate-200">
        <Button asChild variant={getVariant('all')} size="sm" className="gap-2 rounded-md transition-all">
          <Link href="/admin/sales-history?filter=all">
            <Layers size={14} /> Semua
          </Link>
        </Button>
        <Button asChild variant={getVariant('daily')} size="sm" className="gap-2 rounded-md transition-all">
          <Link href="/admin/sales-history?filter=daily">
            <Calendar size={14} /> Hari Ini
          </Link>
        </Button>
        <Button asChild variant={getVariant('weekly')} size="sm" className="gap-2 rounded-md transition-all">
          <Link href="/admin/sales-history?filter=weekly">
            <CalendarRange size={14} /> 7 Hari Terakhir
          </Link>
        </Button>
        <Button asChild variant={getVariant('monthly')} size="sm" className="gap-2 rounded-md transition-all">
          <Link href="/admin/sales-history?filter=monthly">
            <CalendarDays size={14} /> Bulan Ini
          </Link>
        </Button>
      </div>

      {/* Tabel Data */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
         <CardHeader className="bg-slate-50/50 border-b border-slate-100">
           <CardTitle className="text-lg text-slate-800">
             {filter === 'daily' ? 'Rincian Penjualan Hari Ini' : 
              filter === 'weekly' ? 'Rincian Penjualan 7 Hari Terakhir' : 
              filter === 'monthly' ? 'Rincian Penjualan Bulan Ini' : 
              'Semua Transaksi Penjualan'}
           </CardTitle>
         </CardHeader>
         <CardContent className="p-0">
           <Table>
             <TableHeader>
               <TableRow className="hover:bg-transparent">
                 <TableHead className="pl-6">Tanggal</TableHead>
                 <TableHead>Nama Barang</TableHead>
                 <TableHead className="text-center">Qty</TableHead>
                 <TableHead className="text-right">Harga Satuan</TableHead>
                 <TableHead className="text-right">Subtotal</TableHead>
                 <TableHead className="pr-6">Pelanggan</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {soldItems.map((item, index) => (
                 <TableRow key={index} className="hover:bg-slate-50">
                   <TableCell className="pl-6 text-sm text-slate-500 font-mono">
                     {new Date(item.orderDate).toLocaleDateString('id-ID', { 
                       day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
                     })}
                   </TableCell>
                   <TableCell className="font-medium text-slate-800">{item.name}</TableCell>
                   <TableCell className="text-center text-slate-600">{item.quantity}</TableCell>
                   <TableCell className="text-right text-slate-600">Rp {item.price.toLocaleString('id-ID')}</TableCell>
                   <TableCell className="text-right font-bold text-slate-800">
                      Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                   </TableCell>
                   <TableCell className="pr-6 text-slate-600">{item.customerName}</TableCell>
                 </TableRow>
               ))}
               {soldItems.length === 0 && (
                 <TableRow>
                   <TableCell colSpan={6} className="text-center text-slate-400 py-16 italic">
                     Tidak ada data penjualan untuk periode yang dipilih.
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