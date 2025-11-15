// File: app/dashboard/my-orders/MyOrdersTable.tsx (BUAT FILE BARU INI)
'use client';

import { motion } from 'framer-motion';
import { IOrder } from '@/app/admin/orders/actions'; 
import OrderActionsClient from './OrderActionsClient'; 
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

export default function MyOrdersTable({ orders }: { orders: IOrder[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID Pesanan</TableHead>
          <TableHead className="text-right">Total</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead className="text-center">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <motion.tbody variants={listVariant} initial="hidden" animate="visible">
        {orders.map((order) => (
          <motion.tr variants={itemVariant} key={order._id}>
            <TableCell className="font-medium">{order._id.substring(0, 8)}...</TableCell>
            <TableCell className="text-right">Rp {order.totalPrice.toLocaleString('id-ID')}</TableCell>
            <TableCell className="text-center">
               <Badge variant={
                   order.status === 'pending' ? 'destructive' : // Merah untuk 'pending'
                   order.status === 'processed' ? 'secondary' : // Abu-abu
                   order.status === 'delivered' ? 'default' : // Pink (Primary)
                   'outline'
               }>
                   {order.status}
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
  );
}