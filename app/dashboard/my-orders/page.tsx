// File: app/dashboard/my-orders/page.tsx
import { getMyOrders } from './actions';
import { IOrder } from '@/app/admin/orders/actions'; 
import OrderActionsClient from './OrderActionsClient'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"; // Import Table
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card
import { Badge } from "@/components/ui/badge"; // Import Badge

export default async function MyOrdersPage() {
  const orders: IOrder[] = await getMyOrders();

  return (
    // Bungkus dengan Card
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-lora">Pesanan Saya</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Gunakan Table shadcn */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Pesanan</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">{order._id.substring(0, 8)}...</TableCell>
                <TableCell className="text-right">Rp {order.totalPrice.toLocaleString('id-ID')}</TableCell>
                <TableCell className="text-center">
                   {/* Gunakan Badge shadcn */}
                   <Badge variant={
                       order.status === 'pending' ? 'default' : // Default (primary/hitam)
                       order.status === 'processed' ? 'secondary' : // Secondary (abu-abu)
                       order.status === 'delivered' ? 'outline' : // Outline
                       'destructive' // Cancelled (merah)
                   }>
                       {order.status}
                   </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <OrderActionsClient order={order} />
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-stone-500 py-10">
                  Anda belum memiliki pesanan.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}