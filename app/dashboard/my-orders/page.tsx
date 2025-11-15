// File: app/dashboard/my-orders/page.tsx
import { getMyOrders } from './actions';
import { IOrder } from '@/app/admin/orders/actions'; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import MyOrdersTable from './MyOrdersTable'; // <-- 1. Import tabel Client Component

export default async function MyOrdersPage() {
  const orders: IOrder[] = await getMyOrders();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-lora">Pesanan Saya</CardTitle>
      </CardHeader>
      <CardContent>
        {/* 2. Gunakan komponen tabel baru */}
        <MyOrdersTable orders={orders} />
      </CardContent>
    </Card>
  );
}