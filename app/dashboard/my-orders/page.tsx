// File: app/dashboard/my-orders/page.tsx
import { getMyOrders } from './actions';
import { IOrder } from '@/app/admin/orders/actions'; // Pakai ulang tipe IOrder

export default async function MyOrdersPage() {
  const orders: IOrder[] = await getMyOrders();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Pesanan Saya</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr style={{ backgroundColor: '#333' }}>
            <th style={{ border: '1px solid #555', padding: '8px' }}>ID Pesanan</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Total</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid #555', padding: '8px' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td style={{ border: '1px solid #555', padding: '8px' }}>{order._id.substring(0, 6)}...</td>
              <td style={{ border: '1px solid #555', padding: '8px' }}>Rp {order.totalPrice.toLocaleString('id-ID')}</td>
              <td style={{ border: '1px solid #555', padding: '8px' }}>{order.status}</td>
              <td style={{ border: '1px solid #555', padding: '8px' }}>
                {/* TODO: Tambah tombol 'Pesanan Diterima' & 'Beri Rating' */}
                {order.status === 'processed' && (
                  <button style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>
                    Pesanan Diterima
                  </button>
                )}
              </td>
            </tr>
          ))}
          {orders.length === 0 && (
            <tr>
              <td colSpan={4} style={{ textAlign: 'center', padding: '20px' }}>
                Anda belum memiliki pesanan.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}