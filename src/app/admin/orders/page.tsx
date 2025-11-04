// File: app/admin/orders/page.tsx
import { getOrders, IOrder } from './actions';
import OrderClientActions from './OrderClientActions'; 
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge"; // Import Badge

export default async function AdminOrdersPage() {
  const orders: IOrder[] = await getOrders();

  return (
     <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-white">Kelola Pesanan</h1>
      
      <Card className="bg-gray-800 border-gray-700 text-gray-300">
        <CardHeader>
          <CardTitle className="text-white">Daftar Pesanan Masuk</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-gray-700 border-gray-700">
                <TableHead className="text-gray-400">ID Pesanan</TableHead>
                <TableHead className="text-gray-400">Pelanggan</TableHead>
                <TableHead className="text-gray-400 text-right">Total</TableHead>
                <TableHead className="text-gray-400 text-center">Status</TableHead>
                <TableHead className="text-gray-400 text-center">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id} className="hover:bg-gray-750 border-gray-700">
                  <TableCell className="font-medium">{order._id.substring(0, 8)}...</TableCell>
                  <TableCell>{order.user?.name || 'N/A'}</TableCell>
                  <TableCell className="text-right">Rp {order.totalPrice.toLocaleString('id-ID')}</TableCell>
                  <TableCell className="text-center">
                    {/* Gunakan Badge shadcn */}
                    <Badge variant={
                        order.status === 'pending' ? 'default' : // default gelap
                        order.status === 'processed' ? 'secondary' : // secondary gelap
                        order.status === 'delivered' ? 'outline' : // outline
                        'destructive' // destructive (merah)
                    } className="text-xs"> {/* Kecilkan font badge */}
                        {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {order.status === 'pending' && (
                      <OrderClientActions orderId={order._id} />
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {orders.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500 py-10">
                    Belum ada pesanan.
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