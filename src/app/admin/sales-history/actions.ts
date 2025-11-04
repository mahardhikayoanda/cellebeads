// File: src/app/admin/sales-history/actions.ts
'use server';

import prisma from '@/lib/prisma';

// Tipe data baru untuk item yang terjual
export interface IOrderItem {
  orderDate: Date; // Menggunakan tipe Date
  name: string;
  quantity: number;
  price: number;
  customerName: string;
}

export async function getCompletedOrdersWithItems(): Promise<IOrderItem[]> {
  await prisma.$connect();
  try {
    // 1. Ambil semua OrderItem yang status ordernya 'processed' atau 'delivered'
    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          status: { in: ['processed', 'delivered'] },
        },
      },
      include: {
        order: {
          // Kita hanya perlu info createdAt dan user dari order
          select: {
            createdAt: true,
            user: { select: { name: true } },
          },
        },
      },
      orderBy: {
        order: { createdAt: 'desc' }, // Urutkan berdasarkan tanggal order
      },
    });

    // 2. Olah data menjadi daftar item (struktur flat)
    const soldItems: IOrderItem[] = orderItems.map((item) => ({
      orderDate: item.order.createdAt,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      customerName: item.order.user?.name || 'N/A', // Ambil nama pelanggan
    }));

    return soldItems;
  } catch (error) {
    console.error('Error fetching sales history:', error);
    return []; // Kembalikan array kosong jika gagal
  } finally {
    await prisma.$disconnect();
  }
}