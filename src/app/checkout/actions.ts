// File: src/app/checkout/actions.ts
'use server';

import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/authOptions'; // Pastikan ini import authOptions baru
import { getServerSession } from 'next-auth/next';
import { revalidatePath } from 'next/cache';

// Tipe data untuk item di keranjang (dari CartContext)
interface ICartItem {
  _id: string; // Ini adalah ID Produk
  name: string;
  price: number;
  qty: number;
}

export async function createOrder(formData: FormData, cartItems: ICartItem[]) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'customer') {
    return { success: false, message: 'Akses ditolak' };
  }

  await prisma.$connect();

  try {
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const phone = formData.get('phone') as string;
    const paymentMethod = formData.get('paymentMethod') as string;

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    // 1. Simpan Pesanan ke Database (Prisma)
    await prisma.order.create({
      data: {
        userId: session.user.id,
        totalPrice,
        status: 'pending',
        
        // Detail pengiriman (langsung di model Order)
        shippingName: name,
        shippingAddress: address,
        shippingPhone: phone,
        paymentMethod: paymentMethod,

        // Buat OrderItem terkait secara bersamaan
        items: {
          create: cartItems.map(item => ({
            productId: item._id, // Relasi ke Produk
            name: item.name,
            quantity: item.qty,
            price: item.price,
          })),
        },
      },
    });

    // 2. Buat Pesan WhatsApp (Logika ini tetap sama)
    let waMessage = `Halo Admin, saya mau pesan:\n\n`;
    cartItems.forEach(item => {
      waMessage += `* ${item.name} (x${item.qty}) - Rp ${item.price.toLocaleString('id-ID')}\n`;
    });
    waMessage += `\n*Total Harga: Rp ${totalPrice.toLocaleString('id-ID')}*\n`;
    waMessage += `\n*Data Pemesan:*\n`;
    waMessage += `Nama: ${name}\n`;
    waMessage += `Alamat: ${address}\n`;
    waMessage += `No. HP: ${phone}\n`;
    waMessage += `Pembayaran: ${paymentMethod}\n`;
    waMessage += `\nTerima kasih.`;

    // 3. Buat URL WhatsApp
    const adminNumber = process.env.ADMIN_WA_NUMBER; // PASTIKAN INI ADA DI .env
    if (!adminNumber) {
      throw new Error("Nomor WhatsApp Admin belum di-setup");
    }
    const waUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(waMessage)}`;

    // 4. Revalidate path
    revalidatePath('/dashboard/my-orders');
    revalidatePath('/admin/orders');

    return { success: true, waUrl: waUrl, message: 'Pesanan berhasil dibuat.' };

  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal membuat pesanan' };
  } finally {
    await prisma.$disconnect();
  }
}