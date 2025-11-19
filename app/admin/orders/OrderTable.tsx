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
  visible: { opacity: 1, transition: { staggerChildren: 0.03 } }
};
const itemVariant = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export default function OrderTable({ orders }: { orders: IOrder[] }) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="w-[100px] text-slate-600 font-semibold">ID</TableHead>
            <TableHead className="text-slate-600 font-semibold">Tanggal</TableHead>
            <TableHead className="text-slate-600 font-semibold">Pelanggan</TableHead>
            <TableHead className="text-slate-600 font-semibold">Item</TableHead>
            <TableHead className="text-right text-slate-600 font-semibold">Total</TableHead>
            <TableHead className="text-center text-slate-600 font-semibold">Status</TableHead>
            <TableHead className="text-center text-slate-600 font-semibold">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <motion.tbody variants={listVariant} initial="hidden" animate="visible">
          {orders.map((order) => (
            <motion.tr 
              variants={itemVariant} 
              key={order._id} 
              className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors"
            >
              <TableCell className="font-mono text-xs text-slate-500">
                #{order._id.substring(order._id.length - 6).toUpperCase()}
              </TableCell>
              <TableCell className="text-sm text-slate-600">
                {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </TableCell>
              <TableCell className="font-medium text-slate-800">
                <div className="flex flex-col">
                  <span>{order.user?.name || 'Guest'}</span>
                  <span className="text-xs text-slate-400 font-normal">{order.user?.email}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-slate-600">
                 <span className="truncate max-w-[200px] block" title={order.items.map(i => i.name).join(', ')}>
                    {order.items.length} Barang 
                    <span className="text-xs text-slate-400 ml-1">
                      ({order.items[0].name}{order.items.length > 1 ? '...' : ''})
                    </span>
                 </span>
              </TableCell>
              <TableCell className="text-right font-semibold text-slate-800">
                Rp {order.totalPrice.toLocaleString('id-ID')}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={
                    order.status === 'pending' ? 'destructive' : 
                    order.status === 'processed' ? 'secondary' : 
                    order.status === 'delivered' ? 'default' :   
                    'outline'
                } className={`
                    ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100' : ''}
                    ${order.status === 'processed' ? 'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100' : ''}
                    ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100' : ''}
                    capitalize shadow-none border px-2 py-0.5 h-6
                `}>
                    {order.status === 'delivered' ? 'Selesai' : order.status}
                </Badge>
              </TableCell>
              <TableCell className="text-center">
                {/* PERUBAHAN: Hapus class opacity agar tombol selalu terlihat */}
                <div className="flex justify-center">
                   <OrderClientActions orderId={order._id} status={order.status} />
                </div>
              </TableCell>
            </motion.tr>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-slate-400 py-12">
                Belum ada pesanan masuk.
              </TableCell>
            </TableRow>
          )}
        </motion.tbody>
      </Table>
    </div>
  );
}