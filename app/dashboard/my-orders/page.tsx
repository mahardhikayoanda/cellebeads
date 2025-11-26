// File: app/dashboard/my-orders/page.tsx
import { getMyOrders, IOrderWithReview } from './actions'; // Pastikan import IOrderWithReview
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; 
import MyOrdersTable from './MyOrdersTable'; 

export default async function MyOrdersPage() {
  // Panggil getMyOrders yang mengembalikan IOrderWithReview[]
  const orders: IOrderWithReview[] = await getMyOrders();

  return (
    <Card className="border-none shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-lora font-bold text-stone-800">Pesanan Saya</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Kirim data orders yang sudah bertipe IOrderWithReview[] */}
        <MyOrdersTable orders={orders} />
      </CardContent>
    </Card>
  );
}