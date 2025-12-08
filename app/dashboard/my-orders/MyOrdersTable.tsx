// File: app/dashboard/my-orders/MyOrdersTable.tsx
'use client';

import { motion } from 'framer-motion';
import { IOrderWithReview } from './actions'; 
import OrderActionsClient from './OrderActionsClient'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PackageOpen } from 'lucide-react';

const listVariant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};
const itemVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 }
};

export default function MyOrdersTable({ orders }: { orders: IOrderWithReview[] }) {
  
  // Helper Warna Badge
  const getStatusColor = (status: string) => {
     switch(status) {
        case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
        case 'processed': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
        default: return 'bg-stone-100 text-stone-700';
     }
  }

  return (
    <div className="overflow-x-auto">
      <Table className="min-w-[600px]">
        <TableHeader className="bg-pink-50/50">
          <TableRow className="hover:bg-transparent border-pink-100">
            <TableHead className="pl-6 py-4 font-lora font-bold text-stone-700">ID Pesanan</TableHead>
            <TableHead className="font-lora font-bold text-stone-700">Tanggal</TableHead>
            <TableHead className="font-lora font-bold text-stone-700">Barang</TableHead>
            <TableHead className="text-right font-lora font-bold text-stone-700">Total</TableHead>
            <TableHead className="text-center font-lora font-bold text-stone-700">Status</TableHead>
            <TableHead className="text-center pr-6 font-lora font-bold text-stone-700">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <motion.tbody variants={listVariant} initial="hidden" animate="visible">
          {orders.map((order) => (
            <motion.tr 
               variants={itemVariant} 
               key={order._id}
               className="hover:bg-pink-50/30 transition-colors border-b border-stone-50"
            >
              <TableCell className="pl-6 py-4 font-mono text-xs font-bold text-stone-500">
                 #{order._id.substring(order._id.length - 6).toUpperCase()}
              </TableCell>
              
              <TableCell className="text-stone-600 text-sm">
                 {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
              </TableCell>

              <TableCell>
                 <div className="flex flex-col">
                    <span className="font-medium text-stone-800 text-sm">{order.items[0]?.name}</span>
                    {order.items.length > 1 && (
                       <span className="text-[10px] text-stone-400 font-bold bg-stone-100 px-2 py-0.5 rounded-full w-fit mt-1">
                          +{order.items.length - 1} lainnya
                       </span>
                    )}
                 </div>
              </TableCell>

              <TableCell className="text-right font-bold text-primary font-sans">
                 Rp {order.totalPrice.toLocaleString('id-ID')}
              </TableCell>
              
              <TableCell className="text-center">
                 <Badge variant="outline" className={`px-3 py-1 shadow-sm border ${getStatusColor(order.status)}`}>
                     {order.status === 'delivered' ? 'Selesai' : (order.status === 'pending' ? 'Menunggu' : 'Diproses')}
                 </Badge>
              </TableCell>
              
              <TableCell className="text-center pr-6">
                <OrderActionsClient order={order} /> 
              </TableCell>
            </motion.tr>
          ))}
          
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-20">
                <div className="flex flex-col items-center justify-center text-stone-400">
                   <div className="p-4 bg-stone-50 rounded-full mb-3"><PackageOpen size={32}/></div>
                   <p className="font-medium">Belum ada riwayat pesanan.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </motion.tbody>
      </Table>
    </div>
  );
}