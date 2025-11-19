// File: app/admin/sales-history/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export interface IOrderItem {
  orderDate: string;
  name: string;
  quantity: number;
  price: number;
  customerName: string;
}

// Fungsi menerima parameter filter (default: 'all')
export async function getCompletedOrdersWithItems(filter: string = 'all'): Promise<IOrderItem[]> {
  await dbConnect();
  try {
    // 1. Tentukan Rentang Waktu (Date Query)
    let dateQuery: any = {};
    const now = new Date();

    if (filter === 'daily') {
      // Harian: Dari jam 00:00 hari ini sampai sekarang
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateQuery = { $gte: startOfDay };
    } else if (filter === 'weekly') {
      // Mingguan: 7 hari terakhir
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      dateQuery = { $gte: lastWeek };
    } else if (filter === 'monthly') {
      // Bulanan: Dari tanggal 1 bulan ini
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateQuery = { $gte: startOfMonth };
    }
    // Jika 'all', query tanggal kosong (ambil semua)

    // 2. Buat Query Database
    const query: any = {
      status: { $in: ['processed', 'delivered'] } // Hanya yang sudah lunas/selesai
    };

    // Jika ada filter waktu (bukan 'all'), tambahkan ke query
    if (filter !== 'all') {
      query.createdAt = dateQuery;
    }

    // 3. Eksekusi Query
    const completedOrders = await Order.find(query)
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    // 4. Olah data untuk tabel
    const soldItems: IOrderItem[] = [];
    completedOrders.forEach(order => {
      order.items.forEach((item: any) => { 
        soldItems.push({
          orderDate: order.createdAt.toISOString(),
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          customerName: order.user?.name || 'Guest',
        });
      });
    });

    return soldItems;

  } catch (error) {
    console.error('Error fetching sales history:', error);
    return [];
  }
}