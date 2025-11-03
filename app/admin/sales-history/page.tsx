// File: app/admin/sales-history/page.tsx
import { getCompletedOrdersWithItems, IOrderItem } from './actions';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SalesHistoryPage() {
  const soldItems: IOrderItem[] = await getCompletedOrdersWithItems();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-white">Riwayat Penjualan Barang</h1>
      
      <Card className="bg-gray-800 border-gray-700 text-gray-300">
         <CardHeader>
           <CardTitle className="text-white">Semua Barang Terjual</CardTitle>
         </CardHeader>
         <CardContent>
           <Table>
             <TableHeader>
               <TableRow className="hover:bg-gray-700 border-gray-700">
                 <TableHead className="text-gray-400">Tanggal</TableHead>
                 <TableHead className="text-gray-400">Nama Barang</TableHead>
                 <TableHead className="text-gray-400 text-center">Jumlah</TableHead>
                 <TableHead className="text-gray-400 text-right">Harga Satuan</TableHead>
                 <TableHead className="text-gray-400 text-right">Total Harga</TableHead>
                 <TableHead className="text-gray-400">Pelanggan</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {soldItems.map((item, index) => (
                 <TableRow key={index} className="hover:bg-gray-750 border-gray-700">
                   <TableCell className="text-sm">
                     {new Date(item.orderDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric'})}
                   </TableCell>
                   <TableCell className="font-medium">{item.name}</TableCell>
                   <TableCell className="text-center">{item.quantity}</TableCell>
                   <TableCell className="text-right">Rp {item.price.toLocaleString('id-ID')}</TableCell>
                   <TableCell className="text-right">Rp {(item.price * item.quantity).toLocaleString('id-ID')}</TableCell>
                   <TableCell>{item.customerName}</TableCell>
                 </TableRow>
               ))}
               {soldItems.length === 0 && (
                 <TableRow>
                   <TableCell colSpan={6} className="text-center text-gray-500 py-10">
                     Belum ada barang yang terjual.
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