// File: app/admin/sales-history/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

// Tipe data baru untuk item yang terjual
export interface IOrderItem {
  orderDate: string; // Tanggal pesanan dibuat
  name: string;      // Nama produk
  quantity: number;  // Jumlah terjual
  price: number;     // Harga satuan saat itu
  customerName: string; // Nama pelanggan
}

export async function getCompletedOrdersWithItems(): Promise<IOrderItem[]> {
  await dbConnect();
  try {
    // 1. Ambil semua pesanan yang sudah 'processed' atau 'delivered'
    const completedOrders = await Order.find({ 
      status: { $in: ['processed', 'delivered'] } 
    })
    .populate('user', 'name') // Ambil nama user
    .sort({ createdAt: -1 }); // Urutkan dari terbaru

    // 2. Olah data menjadi daftar item
    const soldItems: IOrderItem[] = [];
    completedOrders.forEach(order => {
      order.items.forEach(item => {
        soldItems.push({
          orderDate: order.createdAt.toISOString(), // Simpan sebagai string ISO
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          customerName: order.user?.name || 'N/A', // Ambil nama pelanggan
        });
      });
    });

    return soldItems;

  } catch (error) {
    console.error('Error fetching sales history:', error);
    return []; // Kembalikan array kosong jika gagal
  }
}