// File: app/admin/sales-history/page.tsx
import { getCompletedOrdersWithItems, IOrderItem } from './actions';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SalesHistoryPage() {
  const soldItems: IOrderItem[] = await getCompletedOrdersWithItems();

  return (
    <div className="space-y-8">
      {/* Hapus class 'text-white' */}
      <h1 className="text-3xl font-lora font-semibold">Riwayat Penjualan Barang</h1>
      
      {/* Hapus class tema gelap */}
      <Card>
         <CardHeader>
           <CardTitle>Semua Barang Terjual</CardTitle>
         </CardHeader>
         <CardContent>
           <Table>
             <TableHeader>
               <TableRow>
                 <TableHead>Tanggal</TableHead>
                 <TableHead>Nama Barang</TableHead>
                 <TableHead className="text-center">Jumlah</TableHead>
                 <TableHead className="text-right">Harga Satuan</TableHead>
                 <TableHead className="text-right">Total Harga</TableHead>
                 <TableHead>Pelanggan</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {soldItems.map((item, index) => (
                 <TableRow key={index}>
                   <TableCell className="text-sm text-muted-foreground">
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
                   <TableCell colSpan={6} className="text-center text-muted-foreground py-10">
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