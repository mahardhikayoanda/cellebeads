// File: app/checkout/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';

// --- PERUBAHAN DI SINI ---
// 1. Hapus import 'authOptions' dan 'getServerSession'
// 2. Impor 'auth' dari file @/auth.ts baru Anda
import { auth } from '@/auth';
// -------------------------

// Tipe data untuk item di keranjang (tetap sama)
interface ICartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
}

export async function createOrder(formData: FormData, cartItems: ICartItem[]) {
  // --- PERUBAHAN DI SINI ---
  // 3. Gunakan 'auth()' untuk mendapatkan sesi
  const session = await auth();
  // -------------------------

  // 4. Akses user.id dari sesi (sudah benar)
  if (!session || session.user.role !== 'customer') {
    return { success: false, message: 'Akses ditolak' };
  }
  
  await dbConnect();

  try {
    const { name, address, phone, paymentMethod } = Object.fromEntries(formData);
    
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    const orderItems = cartItems.map(item => ({
      product: item._id,
      name: item.name,
      quantity: item.qty,
      price: item.price,
    }));
    
    const order = new Order({
      user: session.user.id, // Ambil id dari sesi
      items: orderItems,
      totalPrice,
      shippingDetails: {
        name,
        address,
        phone,
        paymentMethod,
      },
      status: 'pending', 
    });

    await order.save();

    // ... (Logika WhatsApp tetap sama) ...
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

    const adminNumber = process.env.ADMIN_WA_NUMBER;
    const waUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(waMessage)}`;

    revalidatePath('/dashboard/my-orders');
    revalidatePath('/admin/orders'); 

    return { success: true, waUrl: waUrl, message: 'Pesanan berhasil dibuat.' };

  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal membuat pesanan' };
  }
}