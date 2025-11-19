// File: app/admin/orders/page.tsx
import { getOrders, IOrder } from './actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import OrderTable from './OrderTable'; 
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, Clock, CheckCircle, XCircle } from 'lucide-react';

export default async function AdminOrdersPage() {
  const orders: IOrder[] = await getOrders();

  // Hitung ringkasan sederhana
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const completedOrders = orders.filter(o => ['processed', 'delivered'].includes(o.status)).length;
  const totalRevenue = orders
    .filter(o => ['processed', 'delivered'].includes(o.status))
    .reduce((sum, o) => sum + o.totalPrice, 0);

  return (
     <div className="space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kelola Pesanan</h1>
          <p className="text-slate-500">Pantau dan proses pesanan pelanggan.</p>
        </div>
      </div>

      {/* Ringkasan Cepat (Mini Dashboard) */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total Pesanan</CardTitle>
            <ShoppingBag className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{totalOrders}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-yellow-500 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{pendingOrders}</div>
            <p className="text-xs text-muted-foreground">Perlu tindakan</p>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Selesai</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">{completedOrders}</div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-slate-200 bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Pendapatan Realisasi</CardTitle>
            <span className="font-bold text-emerald-600 text-xs">IDR</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-slate-800">
              {totalRevenue.toLocaleString('id-ID', { notation: "compact", maximumFractionDigits: 1 })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabel Utama */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="px-6 py-4 border-b border-slate-100">
          <CardTitle className="text-lg font-semibold text-slate-800">Daftar Pesanan</CardTitle>
          <CardDescription>Semua transaksi pesanan terbaru.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {/* Gunakan Client Component untuk tabel animasi */}
          <OrderTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}