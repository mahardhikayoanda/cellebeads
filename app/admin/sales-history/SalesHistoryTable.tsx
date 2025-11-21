// File: app/admin/sales-history/SalesHistoryTable.tsx
'use client';

import { motion } from 'framer-motion';
import { IOrderItem } from './actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CalendarDays } from 'lucide-react';

export default function SalesHistoryTable({ items }: { items: IOrderItem[] }) {
  return (
    <Table>
      <TableHeader className="bg-stone-50/50">
        <TableRow className="hover:bg-transparent border-stone-100">
          <TableHead className="pl-6 font-semibold text-stone-600">Waktu</TableHead>
          <TableHead className="font-semibold text-stone-600">Barang Terjual</TableHead>
          <TableHead className="text-center font-semibold text-stone-600">Qty</TableHead>
          <TableHead className="text-right font-semibold text-stone-600">Harga Satuan</TableHead>
          <TableHead className="text-right pr-6 font-semibold text-stone-600">Subtotal</TableHead>
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
            variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
            className="hover:bg-stone-50/30 border-stone-50 transition-colors"
          >
            <TableCell className="pl-6 text-sm text-stone-500">
              <div className="flex items-center gap-2">
                <CalendarDays size={14} className="text-stone-300"/>
                {new Date(item.orderDate).toLocaleDateString('id-ID', { 
                  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}
              </div>
            </TableCell>
            <TableCell>
              <span className="font-medium text-stone-800">{item.name}</span>
              <span className="block text-xs text-stone-400">Pembeli: {item.customerName}</span>
            </TableCell>
            <TableCell className="text-center">
              <span className="inline-block bg-stone-100 text-stone-600 text-xs px-2 py-1 rounded-md font-medium">
                {item.quantity}
              </span>
            </TableCell>
            <TableCell className="text-right text-stone-600">Rp {item.price.toLocaleString('id-ID')}</TableCell>
            <TableCell className="text-right pr-6 font-bold text-emerald-600">
              Rp {(item.price * item.quantity).toLocaleString('id-ID')}
            </TableCell>
          </motion.tr>
        ))}
        {items.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-stone-400 py-16 italic">
              Tidak ada data penjualan pada periode ini.
            </TableCell>
          </TableRow>
        )}
      </motion.tbody>
    </Table>
  );
}