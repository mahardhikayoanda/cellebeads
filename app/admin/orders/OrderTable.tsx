// File: app/admin/orders/OrderTable.tsx
'use client';
import { motion } from 'framer-motion';
import { IOrder } from './actions';
import OrderClientActions from './OrderClientActions'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function OrderTable({ orders }: { orders: IOrder[] }) {
  return (
    <div className="overflow-x-auto pb-4">
      {/* HAPUS KOMENTAR DI DALAM TABLE UNTUK MENGHINDARI ERROR HYDRATION */}
      <Table className="min-w-[800px]">
        <TableHeader className="bg-stone-50/50">
          <TableRow className="hover:bg-transparent border-stone-100">
            <TableHead className="pl-6 font-semibold text-stone-600">ID Order</TableHead>
            <TableHead className="font-semibold text-stone-600">Tanggal</TableHead>
            <TableHead className="font-semibold text-stone-600">Pelanggan</TableHead>
            <TableHead className="font-semibold text-stone-600">Item</TableHead>
            <TableHead className="text-right font-semibold text-stone-600">Total</TableHead>
            <TableHead className="text-center font-semibold text-stone-600">Status</TableHead>
            <TableHead className="text-center pr-6 font-semibold text-stone-600">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <motion.tbody 
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {orders.map((order) => (
            <motion.tr 
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              key={order._id} 
              className="border-b border-stone-50 hover:bg-stone-50/30 transition-colors"
            >
              <TableCell className="pl-6 font-mono text-xs text-stone-400">
                #{order._id.substring(order._id.length - 6).toUpperCase()}
              </TableCell>
              <TableCell className="text-sm text-stone-600">
                {new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium text-stone-800">{order.user?.name || 'Guest'}</span>
                  <span className="text-[10px] text-stone-400">{order.user?.email}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-stone-600">
                 <span className="truncate max-w-[150px] block" title={order.items.map(i => i.name).join(', ')}>
                    {order.items.length} Barang 
                    <span className="text-xs text-stone-400 ml-1 italic">
                      ({order.items[0].name}{order.items.length > 1 ? '...' : ''})
                    </span>
                 </span>
              </TableCell>
              <TableCell className="text-right font-bold text-stone-700">
                Rp {order.totalPrice.toLocaleString('id-ID')}
              </TableCell>
              <TableCell className="text-center">
                <Badge variant="outline" className={`
                    ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                    ${order.status === 'processed' ? 'bg-blue-50 text-blue-700 border-blue-200' : ''}
                    ${order.status === 'delivered' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : ''}
                    capitalize font-normal shadow-none px-2.5 py-0.5 whitespace-nowrap
                `}>
                    {order.status === 'delivered' ? 'Selesai' : (order.status === 'pending' ? 'Menunggu' : 'Diproses')}
                </Badge>
              </TableCell>
              <TableCell className="text-center pr-6">
                <div className="flex justify-center">
                   <OrderClientActions orderId={order._id} status={order.status} />
                </div>
              </TableCell>
            </motion.tr>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-stone-400 py-16 italic bg-stone-50/20">
                Belum ada pesanan masuk saat ini.
              </TableCell>
            </TableRow>
          )}
        </motion.tbody>
      </Table>
    </div>
  );
}