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

export async function getCompletedOrdersWithItems(filter: string = 'all'): Promise<IOrderItem[]> {
  await dbConnect();
  try {
    let dateQuery: any = {};
    const now = new Date();

    if (filter === 'daily') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      dateQuery = { $gte: startOfDay };
    } else if (filter === 'weekly') {
      const lastWeek = new Date();
      lastWeek.setDate(now.getDate() - 7);
      dateQuery = { $gte: lastWeek };
    } else if (filter === 'monthly') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      dateQuery = { $gte: startOfMonth };
    } else if (filter === 'yearly') {
      // Tambahan Filter Tahunan
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      dateQuery = { $gte: startOfYear };
    }

    const query: any = {
      status: { $in: ['processed', 'delivered'] } 
    };

    if (filter !== 'all') {
      query.createdAt = dateQuery;
    }

    const completedOrders = await Order.find(query)
      .populate('user', 'name')
      .sort({ createdAt: -1 });

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