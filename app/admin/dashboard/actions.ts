// File: app/admin/dashboard/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import Product from '@/models/Product';
import User from '@/models/User';

export interface AdminStats {
  totalRevenue: number;
  pendingOrdersCount: number;
  totalProducts: number;
  totalCustomers: number;
}

export async function getAdminStats(): Promise<AdminStats> {
  await dbConnect();

  try {
    // 1. Hitung Total Pendapatan (Hanya dari order yang sukses)
    const completedOrders = await Order.find({ 
      status: { $in: ['processed', 'delivered'] } 
    });
    
    const totalRevenue = completedOrders.reduce((acc, order) => acc + (order.totalPrice || 0), 0);

    // 2. Hitung Pesanan Pending (Perlu tindakan)
    const pendingOrdersCount = await Order.countDocuments({ status: 'pending' });

    // 3. Hitung Total Produk
    const totalProducts = await Product.countDocuments();

    // 4. Hitung Total Pelanggan
    const totalCustomers = await User.countDocuments({ role: 'customer' });

    return {
      totalRevenue,
      pendingOrdersCount,
      totalProducts,
      totalCustomers
    };
  } catch (error) {
    console.error("Gagal mengambil statistik admin:", error);
    return {
      totalRevenue: 0,
      pendingOrdersCount: 0,
      totalProducts: 0,
      totalCustomers: 0
    };
  }
}