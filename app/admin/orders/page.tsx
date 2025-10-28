// File: app/admin/orders/page.tsx
import { getOrders, IOrder } from './actions';
import OrderClientActions from './OrderClientActions'; 

export default async function AdminOrdersPage() {
  const orders: IOrder[] = await getOrders();

  return (
    // Hapus style padding, karena sudah ada di layout
    <div>
      <h1 className="text-3xl font-semibold text-white mb-8">Kelola Pesanan</h1>
      {/* Tabel gelap */}
      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow border border-gray-700">
        <table className="w-full border-collapse">
          {/* Header gelap */}
          <thead className="bg-gray-700">
            <tr>
              <th className="border-b border-gray-600 p-3 text-left text-sm font-semibold text-gray-400">ID Pesanan</th>
              <th className="border-b border-gray-600 p-3 text-left text-sm font-semibold text-gray-400">Pelanggan</th>
              <th className="border-b border-gray-600 p-3 text-right text-sm font-semibold text-gray-400">Total</th>
              <th className="border-b border-gray-600 p-3 text-center text-sm font-semibold text-gray-400">Status</th>
              <th className="border-b border-gray-600 p-3 text-center text-sm font-semibold text-gray-400">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-700">
                <td className="border-b border-gray-700 p-3 text-sm text-gray-300">{order._id.substring(0, 6)}...</td>
                <td className="border-b border-gray-700 p-3 text-sm text-gray-300">{order.user?.name || 'N/A'}</td>
                <td className="border-b border-gray-700 p-3 text-sm text-gray-300 text-right">Rp {order.totalPrice.toLocaleString('id-ID')}</td>
                <td className="border-b border-gray-700 p-3 text-sm text-center">
                   {/* Badge status (contoh) */}
                   <span className={`px-2 py-1 text-xs rounded-full ${
                       order.status === 'pending' ? 'bg-yellow-600 text-yellow-100' :
                       order.status === 'processed' ? 'bg-blue-600 text-blue-100' :
                       order.status === 'delivered' ? 'bg-green-600 text-green-100' :
                       'bg-gray-600 text-gray-100' // Default
                   }`}>
                       {order.status}
                   </span>
                </td>
                <td className="border-b border-gray-700 p-3 text-center">
                  {order.status === 'pending' && (
                    <OrderClientActions orderId={order._id} />
                  )}
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center p-6 text-gray-500">
                  Belum ada pesanan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}