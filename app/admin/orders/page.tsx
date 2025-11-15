// File: app/admin/orders/page.tsx
import { getOrders, IOrder } from './actions';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import OrderTable from './OrderTable'; // <-- Import tabel baru

export default async function AdminOrdersPage() {
  const orders: IOrder[] = await getOrders();

  return (
     <div className="space-y-8">
      <h1 className="text-3xl font-lora font-semibold">Kelola Pesanan</h1>
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pesanan Masuk</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Gunakan Client Component untuk tabel animasi */}
          <OrderTable orders={orders} />
        </CardContent>
      </Card>
    </div>
  );
}