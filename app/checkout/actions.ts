// File: app/checkout/actions.ts
'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';

// Tipe data untuk item di keranjang
interface ICartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
}

export async function createOrder(formData: FormData, cartItems: ICartItem[]) {
  // 1. Cek sesi login
  const session = await auth();
  
  if (!session || session.user.role !== 'customer') {
    return { success: false, message: 'Akses ditolak. Silakan login sebagai pelanggan.' };
  }
  
  await dbConnect();

  try {
    const { name, address, phone, paymentMethod } = Object.fromEntries(formData);
    
    // Hitung total harga di server untuk keamanan
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    const orderItems = cartItems.map(item => ({
      product: item._id,
      name: item.name,
      quantity: item.qty,
      price: item.price,
    }));
    
    // 2. Simpan Order ke Database
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
      status: 'pending', 
    });

    await order.save();

    // 3. Format Pesan WhatsApp (UPGRADE: Lebih Rapi & Profesional)
    const separator = "--------------------------------";
    let waMessage = `Halo Admin Cellebeads! 👋\nSaya ingin memesan produk berikut:\n\n`;
    
    cartItems.forEach((item, index) => {
      waMessage += `${index + 1}. *${item.name}*\n`;
      waMessage += `   Qty: ${item.qty} x Rp ${item.price.toLocaleString('id-ID')}\n`;
      waMessage += `   Subtotal: Rp ${(item.price * item.qty).toLocaleString('id-ID')}\n\n`;
    });

    waMessage += `${separator}\n`;
    waMessage += `*TOTAL BELANJA: Rp ${totalPrice.toLocaleString('id-ID')}*\n`;
    waMessage += `${separator}\n\n`;
    
    waMessage += `📋 *DATA PENGIRIMAN*\n`;
    waMessage += `👤 Nama: ${name}\n`;
    waMessage += `🏠 Alamat: ${address}\n`;
    waMessage += `📞 No. HP: ${phone}\n`;
    waMessage += `💳 Pembayaran: ${paymentMethod === 'transfer' ? 'Transfer Bank' : 'COD (Bayar di Tempat)'}\n\n`;
    
    waMessage += `Mohon segera diproses ya, Terima kasih! ✨`;

    const adminNumber = process.env.ADMIN_WA_NUMBER;
    const waUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(waMessage)}`;

    // 4. Refresh halaman terkait
    revalidatePath('/dashboard/my-orders');
    revalidatePath('/admin/orders'); 

    return { success: true, waUrl: waUrl, message: 'Pesanan berhasil dibuat.' };

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return { success: false, message: error.message || 'Gagal membuat pesanan' };
  }
}