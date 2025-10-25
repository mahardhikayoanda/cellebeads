// File: app/checkout/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { authOptions } from '@/lib/authOptions';
import { getServerSession } from 'next-auth/next';
import { revalidatePath } from 'next/cache';

// Tipe data untuk item di keranjang
interface ICartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
}

export async function createOrder(formData: FormData, cartItems: ICartItem[]) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'customer') {
    return { success: false, message: 'Akses ditolak' };
  }
  
  await dbConnect();

  try {
    const { name, address, phone, paymentMethod } = Object.fromEntries(formData);
    
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    // 1. Simpan Pesanan ke Database
    const orderItems = cartItems.map(item => ({
      product: item._id,
      name: item.name,
      quantity: item.qty,
      price: item.price,
    }));
    
    const order = new Order({
      user: session.user.id,
      items: orderItems,
      totalPrice,
      shippingDetails: {
        name,
        address,
        phone,
        paymentMethod,
      },
      status: 'pending', // Status awal
    });

    await order.save();

    // 2. Buat Pesan WhatsApp
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
    const adminNumber = process.env.ADMIN_WA_NUMBER;
    const waUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(waMessage)}`;

    // 4. Beri tahu Next.js untuk refresh data pesanan
    revalidatePath('/dashboard/my-orders');
    revalidatePath('/admin/orders'); // Agar admin dapat notifikasi

    // Kembalikan URL untuk di-redirect oleh client
    return { success: true, waUrl: waUrl, message: 'Pesanan berhasil dibuat.' };

  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal membuat pesanan' };
  }
}