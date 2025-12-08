// File: app/dashboard/page.tsx
import { getMyOrders } from './my-orders/actions';
import { Card, CardContent } from "@/components/ui/card";
import Link from 'next/link';
import { ShoppingBag, Clock, CheckCircle, Heart } from 'lucide-react';
import { auth } from '@/auth';

export default async function CustomerDashboard() {
  const session = await auth();
  const orders = await getMyOrders();

  const totalSpent = orders.reduce((acc, order) => acc + order.totalPrice, 0);
  const activeOrders = orders.filter(o => o.status === 'pending' || o.status === 'processed').length;
  const completedOrders = orders.filter(o => o.status === 'delivered').length;

  const StatCard = ({ title, value, icon: Icon, color, bg }: any) => (
    <Card className="border-none shadow-lg shadow-pink-100/50 bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:-translate-y-1 transition-transform duration-300">
      <CardContent className="p-6 flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color} shadow-inner`}>
          <Icon size={24} />
        </div>
        <div>
          <p className="text-xs font-bold text-stone-400 uppercase tracking-wider">{title}</p>
          <div className="text-2xl font-lora font-bold text-stone-800 mt-1">{value}</div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-400 rounded-3xl p-8 text-white shadow-2xl shadow-pink-200 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-10 opacity-10"><Heart size={150} /></div>
         <div className="relative z-10">
            <h1 className="text-3xl md:text-4xl font-lora font-bold mb-2">Halo, {session?.user?.name}! ✨</h1>
            <p className="text-pink-100 max-w-lg">Terima kasih sudah menjadi bagian dari cerita Cellebeads. Cek status pesananmu di bawah ini.</p>
         </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
         <StatCard 
            title="Total Belanja" 
            value={`Rp ${totalSpent.toLocaleString('id-ID')}`} 
            icon={ShoppingBag} 
            color="text-pink-600" bg="bg-pink-100" 
         />
         <Link href="/dashboard/my-orders">
            <StatCard 
                title="Pesanan Aktif" 
                value={activeOrders} 
                icon={Clock} 
                color="text-amber-600" bg="bg-amber-100" 
            />
         </Link>
         <StatCard 
            title="Pesanan Selesai" 
            value={completedOrders} 
            icon={CheckCircle} 
            color="text-emerald-600" bg="bg-emerald-100" 
         />
      </div>

      {/* Recent Orders Preview */}
      <div className="space-y-4">
         <div className="flex justify-between items-center">
            <h2 className="text-xl font-lora font-bold text-stone-800">Pesanan Terbaru</h2>
            <Link href="/dashboard/my-orders" className="text-sm font-bold text-pink-600 hover:underline">Lihat Semua</Link>
         </div>
         
         {orders.length > 0 ? (
            <div className="grid gap-4">
               {orders.slice(0, 3).map((order) => (
                  <div key={order._id} className="bg-white p-4 rounded-2xl border border-stone-100 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-stone-50 rounded-xl flex items-center justify-center text-stone-400 font-bold text-xs">
                           IMG
                        </div>
                        <div>
                           <p className="font-bold text-stone-800">{order.items[0]?.name} {order.items.length > 1 && `+${order.items.length - 1} lainnya`}</p>
                           <p className="text-xs text-stone-500">{new Date(order.createdAt).toLocaleDateString('id-ID')}</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <p className="font-bold text-primary">Rp {order.totalPrice.toLocaleString('id-ID')}</p>
                        <span className="text-[10px] uppercase font-bold text-stone-400">{order.status}</span>
                     </div>
                  </div>
               ))}
            </div>
         ) : (
            <div className="text-center py-10 bg-white/50 rounded-2xl border border-dashed border-stone-200">
               <p className="text-stone-500">Belum ada pesanan.</p>
               <Link href="/products" className="text-pink-600 font-bold text-sm">Yuk belanja!</Link>
            </div>
         )}
      </div>
    </div>
  );
}