// File: app/admin/sales-history/SalesHistoryTable.tsx
'use client';

import { motion } from 'framer-motion';
import { IOrderItem } from './actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays, ShoppingBag } from 'lucide-react';

export default function SalesHistoryTable({ items }: { items: IOrderItem[] }) {
  return (
    <div className="glass-super rounded-3xl overflow-hidden pb-6">
      <Table className="min-w-[700px]">
        <TableHeader className="bg-gradient-to-r from-emerald-50/50 to-teal-50/50">
          <TableRow className="hover:bg-transparent border-emerald-100/50">
            <TableHead className="pl-8 py-5 font-lora font-bold text-stone-700">Waktu</TableHead>
            <TableHead className="font-lora font-bold text-stone-700">Produk Terjual</TableHead>
            <TableHead className="text-center font-lora font-bold text-stone-700">Qty</TableHead>
            <TableHead className="text-right font-lora font-bold text-stone-700">Harga Satuan</TableHead>
            <TableHead className="text-right pr-8 font-lora font-bold text-stone-700">Subtotal</TableHead>
          </TableRow>
        </TableHeader>
        <motion.tbody 
          initial="hidden" 
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
        >
          {items.map((item, index) => (
            <motion.tr 
              key={index} 
              variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0 } }}
              className="hover:bg-teal-50/30 border-b border-stone-50 transition-colors last:border-0"
            >
              <TableCell className="pl-8 py-4 text-sm text-stone-500">
                <div className="flex items-center gap-3 whitespace-nowrap">
                  <div className="p-2 bg-stone-100 rounded-lg text-stone-400">
                     <CalendarDays size={16}/>
                  </div>
                  <div>
                    <p className="font-bold text-stone-700">{new Date(item.orderDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</p>
                    <p className="text-xs">{new Date(item.orderDate).getFullYear()}</p>
                  </div>
                </div>
              </TableCell>
              
              <TableCell>
                <div className="flex items-center gap-3">
                   <ShoppingBag size={14} className="text-stone-300" />
                   <div>
                      <span className="font-bold text-stone-800 text-base block">{item.name}</span>
                      <span className="text-xs text-stone-400">Pembeli: {item.customerName}</span>
                   </div>
                </div>
              </TableCell>

              <TableCell className="text-center">
                <span className="inline-block bg-white border border-stone-200 text-stone-600 text-xs px-3 py-1 rounded-full font-bold shadow-sm">
                  x{item.quantity}
                </span>
              </TableCell>

              <TableCell className="text-right text-stone-500 font-mono text-sm whitespace-nowrap">
                 Rp {item.price.toLocaleString('id-ID')}
              </TableCell>

              <TableCell className="text-right pr-8">
                <span className="font-bold text-lg text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </span>
              </TableCell>
            </motion.tr>
          ))}
          {items.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center text-stone-400 py-24 italic">
                Belum ada transaksi di periode ini.
              </TableCell>
            </TableRow>
          )}
        </motion.tbody>
      </Table>
    </div>
  );
}