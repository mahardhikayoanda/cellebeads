// File: app/admin/orders/OrderTable.tsx
'use client';
import { motion } from 'framer-motion';
import { IOrder } from './actions';
import OrderClientActions from './OrderClientActions'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Varian animasi
const listVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function OrderTable({ orders }: { orders: IOrder[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID Pesanan</TableHead>
          <TableHead>Pelanggan</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <motion.tbody variants={listVariant} initial="hidden" animate="visible">
        {orders.map((order) => (
          <motion.tr variants={itemVariant} key={order._id}>
            <TableCell className="font-medium">{order._id.substring(0, 8)}...</TableCell>
            <TableCell>{order.user?.name || 'N/A'}</TableCell>
            <TableCell className="text-right">Rp {order.totalPrice.toLocaleString('id-ID')}</TableCell>
            <TableCell className="text-center">
              <Badge variant={
                  order.status === 'pending' ? 'destructive' :
                  order.status === 'processed' ? 'secondary' :
                  order.status === 'delivered' ? 'default' : 'outline'
              } className="text-xs">
                  {order.status}
              </Badge>
            </TableCell>
            <TableCell className="text-center">
              {order.status === 'pending' && (
                <OrderClientActions orderId={order._id} />
              )}
            </TableCell>
          </motion.tr>
        ))}
        {orders.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-muted-foreground py-10">
              Belum ada pesanan.
            </TableCell>
          </TableRow>
        )}
      </motion.tbody>
    </Table>
  );
}