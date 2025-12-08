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
    
    // Hitung total harga di server
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    const orderItems = cartItems.map(item => ({
      product: item._id,
      name: item.name,
      quantity: item.qty,
      price: item.price,
    }));
    
    // 2. Simpan Order
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

    // 3. Format Pesan WhatsApp (VERSI RAPI & LURUS)
    const paymentLabelMap: Record<string, string> = {
        'transfer': '🏦 Transfer Bank / E-Wallet',
        'qris': '📱 QRIS',
        'cash': '💵 Cash'
    };
    const paymentDisplay = paymentLabelMap[paymentMethod as string] || paymentMethod;

    const shortOrderId = order._id.toString().slice(-6).toUpperCase();
    const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

    const line = `━━━━━━━━━━━━━━━━`;
    
    // --- PENYUSUNAN PESAN ---
    let waMessage = `🌸 *PESANAN BARU* 🌸\n`;
    waMessage += `${line}\n`;
    waMessage += `🆔 ID: *#${shortOrderId}*\n`;
    waMessage += `📅 Tgl: ${date}\n`;
    waMessage += `${line}\n\n`;

    waMessage += `👤 *DATA PEMBELI*\n`;
    waMessage += `• Nama: ${name}\n`;
    waMessage += `• WA: ${phone}\n`;
    waMessage += `• Alamat: ${address}\n\n`; // Menambahkan spasi agar alamat agak masuk sedikit

    waMessage += `🛒 *DAFTAR ITEM*\n`;
    cartItems.forEach((item) => {
      const subtotal = item.price * item.qty;
      // UBAH DISINI: Gunakan bullet '•' yang sama dengan data pembeli
      // Format lurus ke bawah:
      // • Nama Barang
      //   Qty x Harga = Total
      waMessage += `• ${item.name}\n`;
      waMessage += `  ${item.qty} x Rp ${item.price.toLocaleString('id-ID')} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    waMessage += `\n${line}\n`;
    waMessage += `💰 *TOTAL: Rp ${totalPrice.toLocaleString('id-ID')}*\n`;
    waMessage += `${line}\n\n`;
    
    waMessage += `💳 *PEMBAYARAN:*\n${paymentDisplay}\n\n`;

    waMessage += `Mohon diproses ya kak. Terima kasih! ✨`;
    // -------------------------

    const adminNumber = process.env.ADMIN_WA_NUMBER;
    const waUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(waMessage)}`;

    // 4. Refresh halaman
    revalidatePath('/dashboard/my-orders');
    revalidatePath('/admin/orders'); 

    return { success: true, waUrl: waUrl, message: 'Pesanan berhasil dibuat.' };

  } catch (error: any) {
    console.error("Checkout Error:", error);
    return { success: false, message: error.message || 'Gagal membuat pesanan' };
  }
}