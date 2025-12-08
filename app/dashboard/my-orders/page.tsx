// File: app/dashboard/my-orders/page.tsx
import { getMyOrders, IOrderWithReview } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import MyOrdersTable from './MyOrdersTable'; 
import { ShoppingBag } from 'lucide-react';

export default async function MyOrdersPage() {
  const orders: IOrderWithReview[] = await getMyOrders();

  return (
    <div className="space-y-6">
       {/* Header Sederhana */}
       <div className="flex items-center justify-between">
          <div>
             <h1 className="text-2xl font-lora font-bold text-stone-800">Riwayat Pesanan</h1>
             <p className="text-stone-500 text-sm">Daftar semua transaksi yang pernah kamu lakukan.</p>
          </div>
          <div className="p-3 bg-white rounded-xl shadow-sm border border-stone-100 hidden md:block">
             <ShoppingBag className="text-pink-500" />
          </div>
       </div>

       <Card className="border-none shadow-lg shadow-pink-50/50 bg-white/80 backdrop-blur-md rounded-2xl overflow-hidden">
         <CardContent className="p-0">
           <MyOrdersTable orders={orders} />
         </CardContent>
       </Card>
    </div>
  );
}