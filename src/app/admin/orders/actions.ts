// File: src/app/admin/orders/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Tipe data untuk Order - Digunakan oleh page.tsx
 * Kita buat tipe kustom agar komponen tidak error jika user-nya null
 */
export type OrderWithUserAndItems = Awaited<
  ReturnType<typeof getOrders>
>[number];

// Fungsi untuk mengambil semua order (untuk halaman Admin)
export async function getOrders() {
  await prisma.$connect();
  const orders = await prisma.order.findMany({
    include: {
      user: { select: { name: true, email: true } }, // Ambil data user
      items: true, // Ambil item-item di dalam order
    },
    orderBy: { createdAt: 'desc' },
  });
  await prisma.$disconnect();

  // Memastikan user tidak null untuk tipe di page.tsx
  return orders.map((order) => ({
    ...order,
    user: order.user ?? { name: 'N/A', email: 'N/A' },
  }));
}

// Fungsi untuk konfirmasi order (menggunakan Transaksi Prisma)
export async function confirmOrder(orderId: string) {
  await prisma.$connect();
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: true }, // Kita perlu `items` untuk update stok
  });

  if (!order) return { success: false, message: 'Pesanan tidak ditemukan' };
  if (order.status !== 'pending') {
    return { success: false, message: 'Pesanan sudah diproses' };
  }

  try {
    // Mulai transaksi database
    await prisma.$transaction(async (tx) => {
      // 1. Update Stok Produk (kurangi stok)
      for (const item of order.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // 2. Update Status Pesanan
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'processed' },
      });
    });

    // 3. Refresh data di halaman admin dan pelanggan
    revalidatePath('/admin/orders');
    revalidatePath('/dashboard/my-orders');

    return { success: true, message: 'Pesanan dikonfirmasi & stok diperbarui' };
  } catch (error: any) {
    await prisma.$disconnect();
    return { success: false, message: error.message || 'Gagal konfirmasi pesanan' };
  } finally {
    await prisma.$disconnect();
  }
}