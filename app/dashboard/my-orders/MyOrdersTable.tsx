// File: app/dashboard/my-orders/MyOrdersTable.tsx
'use client';

import { motion } from 'framer-motion';
import { IOrderWithReview } from './actions'; 
import OrderActionsClient from './OrderActionsClient'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const listVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function MyOrdersTable({ orders }: { orders: IOrderWithReview[] }) {
  return (
    <div className="overflow-x-auto pb-2">
      <Table className="min-w-[500px]">
        <TableHeader>
          <TableRow>
            <TableHead className="whitespace-nowrap">ID Pesanan</TableHead>
            <TableHead className="text-right whitespace-nowrap">Total</TableHead>
            <TableHead className="text-center whitespace-nowrap">Status</TableHead>
            <TableHead className="text-center whitespace-nowrap">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <motion.tbody variants={listVariant} initial="hidden" animate="visible">
          {orders.map((order) => (
            <motion.tr variants={itemVariant} key={order._id}>
              <TableCell className="font-medium whitespace-nowrap">
                 #{order._id.substring(order._id.length - 6).toUpperCase()}
              </TableCell>
              <TableCell className="text-right whitespace-nowrap">Rp {order.totalPrice.toLocaleString('id-ID')}</TableCell>
              <TableCell className="text-center">
                 <Badge variant={
                     order.status === 'pending' ? 'destructive' :
                     order.status === 'processed' ? 'secondary' :
                     order.status === 'delivered' ? 'default' :
                     'outline'
                 }>
                     {order.status === 'delivered' ? 'Selesai' : (order.status === 'pending' ? 'Menunggu' : 'Diproses')}
                 </Badge>
              </TableCell>
              <TableCell className="text-center">
                <OrderActionsClient order={order} /> 
              </TableCell>
            </motion.tr>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-muted-foreground py-10">
                Anda belum memiliki pesanan.
              </TableCell>
            </TableRow>
          )}
        </motion.tbody>
      </Table>
    </div>
  );
}