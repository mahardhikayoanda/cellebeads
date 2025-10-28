// File: app/admin/sales-history/page.tsx
import { getCompletedOrdersWithItems, IOrderItem } from './actions';

export default async function SalesHistoryPage() {
  const soldItems: IOrderItem[] = await getCompletedOrdersWithItems();

  return (
    // Hapus style padding
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">Riwayat Penjualan Barang</h1>
      
      {/* Tabel gelap */}
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow border border-gray-700">
        <table className="w-full border-collapse">
          {/* Header gelap */}
          <thead className="bg-gray-700">
            <tr>
              <th className="border-b border-gray-600 p-3 text-left text-sm font-semibold text-gray-400">Tanggal</th>
              <th className="border-b border-gray-600 p-3 text-left text-sm font-semibold text-gray-400">Nama Barang</th>
              <th className="border-b border-gray-600 p-3 text-center text-sm font-semibold text-gray-400">Jumlah</th>
              <th className="border-b border-gray-600 p-3 text-right text-sm font-semibold text-gray-400">Harga Satuan</th>
              <th className="border-b border-gray-600 p-3 text-right text-sm font-semibold text-gray-400">Total Harga</th>
              <th className="border-b border-gray-600 p-3 text-left text-sm font-semibold text-gray-400">Pelanggan</th>
            </tr>
          </thead>
          <tbody>
            {soldItems.map((item, index) => (
              <tr key={index} className="hover:bg-gray-700">
                <td className="border-b border-gray-700 p-3 text-sm text-gray-300">
                  {new Date(item.orderDate).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric'})}
                </td>
                <td className="border-b border-gray-700 p-3 text-sm text-gray-300">{item.name}</td>
                <td className="border-b border-gray-700 p-3 text-sm text-gray-300 text-center">{item.quantity}</td>
                <td className="border-b border-gray-700 p-3 text-sm text-gray-300 text-right">
                  Rp {item.price.toLocaleString('id-ID')}
                </td>
                 <td className="border-b border-gray-700 p-3 text-sm text-gray-300 text-right">
                  Rp {(item.price * item.quantity).toLocaleString('id-ID')}
                </td>
                <td className="border-b border-gray-700 p-3 text-sm text-gray-300">{item.customerName}</td>
              </tr>
            ))}
            {soldItems.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center p-6 text-gray-500">
                  Belum ada barang yang terjual.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}