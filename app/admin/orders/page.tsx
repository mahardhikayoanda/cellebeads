// File: app/admin/orders/page.tsx
import { getOrders, IOrder } from './actions';
import OrderClientActions from './OrderClientActions'; // Komponen baru

export default async function AdminOrdersPage() {
  const orders: IOrder[] = await getOrders();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard Admin - Kelola Pesanan</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#333' }}>
            <th style={{ border: '1px solid #555', padding: '8px' }}>ID Pesanan</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Pelanggan</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Total</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td style={{ border: '1px solid #555', padding: '8px' }}>{order._id.substring(0, 6)}...</td>
              <td style={{ border: '1px solid #555', padding: '8px' }}>{order.user?.name || 'N/A'}</td>
              <td style={{ border: '1px solid #555', padding: '8px' }}>Rp {order.totalPrice.toLocaleString('id-ID')}</td>
              <td style={{ border: '1px solid #555', padding: '8px' }}>{order.status}</td>
              <td style={{ border: '1px solid #555', padding: '8px' }}>
                {/* Hanya tampilkan tombol jika status masih 'pending' */}
                {order.status === 'pending' && (
                  <OrderClientActions orderId={order._id} />
                )}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={5} style={{ textAlign: 'center', padding: '20px' }}>
                Belum ada pesanan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}