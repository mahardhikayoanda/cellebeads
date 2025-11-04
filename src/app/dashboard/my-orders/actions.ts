// File: src/app/dashboard/my-orders/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth/next';
import { revalidatePath } from 'next/cache';

// Tipe data untuk halaman 'Pesanan Saya'
export type MyOrder = Awaited<ReturnType<typeof getMyOrders>>[number];

// FUNGSI 1: MENGAMBIL PESANAN (untuk pelanggan ybs)
export async function getMyOrders() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return [];
  }
  await prisma.$connect();
  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      user: { select: { name: true, email: true } },
      items: true, // Ambil items untuk form review
    },
    orderBy: { createdAt: 'desc' },
  });
  await prisma.$disconnect();
  
  // Map user untuk keamanan tipe
  return orders.map(o => ({...o, user: o.user ?? { name: 'N/A', email: 'N/A' }}));
}

// FUNGSI 2: PESANAN DITERIMA
export async function markOrderAsDelivered(orderId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, message: 'Akses ditolak' };

  await prisma.$connect();
  try {
    // Gunakan updateMany untuk memastikan user hanya bisa update order miliknya
    const result = await prisma.order.updateMany({
      where: {
        id: orderId,
        userId: session.user.id, // Keamanan: hanya bisa update milik sendiri
        status: 'processed', // Hanya bisa diterima jika sudah 'processed'
      },
      data: {
        status: 'delivered',
        deliveredAt: new Date(),
      },
    });

    if (result.count === 0) {
      // Ini terjadi jika order tidak ditemukan, bukan milik user, atau statusnya salah
      return { success: false, message: 'Gagal update: Pesanan tidak ditemukan atau status tidak valid.' };
    }

    revalidatePath('/dashboard/my-orders');
    return { success: true, message: 'Pesanan ditandai sebagai telah diterima' };
  } catch (error: any) {
    return { success: false, message: error.message };
  } finally {
    await prisma.$disconnect();
  }
}

// FUNGSI 3: KIRIM ULASAN
export async function submitReview(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, message: 'Akses ditolak' };

  try {
    const productId = formData.get('productId') as string;
    const orderId = formData.get('orderId') as string;
    const rating = Number(formData.get('rating'));
    const comment = formData.get('comment') as string;

    if (!productId || !orderId || !rating || !comment) {
      return { success: false, message: 'Semua data wajib diisi' };
    }

    await prisma.$connect();

    // TODO: Cek apakah user sudah pernah mereview produk ini
    // (Bisa ditambahkan logic-nya di sini jika diperlukan)

    await prisma.review.create({
      data: {
        productId: productId,
        userId: session.user.id,
        rating: rating,
        comment: comment,
      },
    });

    // TODO: Tandai di OrderItem bahwa item ini sudah di-review
    // (Ini butuh update schema.prisma dan logic di sini)

    revalidatePath('/dashboard/my-orders');
    revalidatePath(`/products/${productId}`); // Refresh halaman produk
    return { success: true, message: 'Ulasan Anda berhasil dikirim' };
  } catch (error: any) {
    return { success: false, message: error.message };
  } finally {
    await prisma.$disconnect();
  }
}