// File: app/dashboard/my-orders/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth/next';
import { IOrder } from '@/app/admin/orders/actions'; // Kita pakai ulang tipe data dari admin

export async function getMyOrders(): Promise<IOrder[]> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return []; // Kembalikan array kosong jika tidak login
  }

  await dbConnect();
  
  const orders = await Order.find({ user: session.user.id })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });
  
  return JSON.parse(JSON.stringify(orders));
}

// TODO: Tambahkan action untuk 'Pesanan Diterima' dan 'Beri Rating'