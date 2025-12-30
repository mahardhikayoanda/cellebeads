// File: app/admin/orders/OrderTable.tsx
'use client';
import { motion } from 'framer-motion';
import { IOrder } from './actions';
import OrderClientActions from './OrderClientActions'; 
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle2, Truck, XCircle } from 'lucide-react';

export default function OrderTable({ orders }: { orders: IOrder[] }) {
  
  // Helper untuk Badge Status Cantik
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200 pl-1 pr-3 py-1 gap-1 shadow-sm"><Clock size={12}/> Menunggu</Badge>;
      case 'processed':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200 pl-1 pr-3 py-1 gap-1 shadow-sm"><Truck size={12}/> Diproses</Badge>;
      case 'shipped':
        return <Badge className="bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200 pl-1 pr-3 py-1 gap-1 shadow-sm"><Truck size={12}/> Dikirim</Badge>;
      case 'delivered':
        return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200 pl-1 pr-3 py-1 gap-1 shadow-sm"><CheckCircle2 size={12}/> Diterima</Badge>;
      case 'completed':
        return <Badge className="bg-stone-800 text-white border-stone-700 hover:bg-stone-700 pl-1 pr-3 py-1 gap-1 shadow-sm"><CheckCircle2 size={12}/> Selesai</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="glass-super rounded-3xl overflow-hidden pb-4">
      <Table className="min-w-[800px]">
        <TableHeader className="bg-pink-50/60 backdrop-blur-sm">
          <TableRow className="hover:bg-transparent border-pink-100/50">
            <TableHead className="pl-8 py-5 font-lora font-bold text-stone-700">ID Pesanan</TableHead>
            <TableHead className="font-lora font-bold text-stone-700">Waktu</TableHead>
            <TableHead className="font-lora font-bold text-stone-700">Pelanggan</TableHead>
            <TableHead className="font-lora font-bold text-stone-700">Detail Item</TableHead>
            <TableHead className="text-right font-lora font-bold text-stone-700">Total</TableHead>
            <TableHead className="text-center font-lora font-bold text-stone-700">Status</TableHead>
            <TableHead className="text-center pr-8 font-lora font-bold text-stone-700">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <motion.tbody 
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {orders.map((order) => (
            <motion.tr 
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
              key={order._id} 
              className="border-b border-pink-50 hover:bg-white/60 transition-colors"
            >
              <TableCell className="pl-8 py-4 font-mono text-xs font-bold text-stone-500 bg-stone-50/30 rounded-r-lg w-fit my-2">
                #{order._id.substring(order._id.length - 6).toUpperCase()}
              </TableCell>
              <TableCell className="text-sm text-stone-600">
                <div className="flex flex-col">
                   <span className="font-bold">{new Date(order.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                   <span className="text-xs text-stone-400">{new Date(order.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute:'2-digit' })}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-bold text-stone-800 text-base">{order.user?.name || 'Guest'}</span>
                  <span className="text-xs text-pink-400">{order.user?.email}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm text-stone-600">
                 <span className="bg-white px-3 py-1.5 rounded-xl border border-stone-100 shadow-sm inline-block max-w-[200px] truncate">
                    {order.items.length} Barang: <span className="italic text-stone-400">{order.items[0].name}...</span>
                 </span>
              </TableCell>
              <TableCell className="text-right font-bold text-lg text-primary font-lora">
                Rp {order.totalPrice.toLocaleString('id-ID')}
              </TableCell>
              <TableCell className="text-center">
                {getStatusBadge(order.status)}
              </TableCell>
              <TableCell className="text-center pr-8">
                <div className="flex justify-center">
                   <OrderClientActions orderId={order._id} status={order.status} />
                </div>
              </TableCell>
            </motion.tr>
          ))}
          {orders.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-stone-400 py-20 italic">
                Belum ada pesanan masuk, semangat promosi! 🌸
              </TableCell>
            </TableRow>
          )}
        </motion.tbody>
      </Table>
    </div>
  );
}