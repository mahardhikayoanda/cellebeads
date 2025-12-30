'use server';

import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';
import { revalidatePath } from 'next/cache';
import { auth } from '@/auth';
import { put } from '@vercel/blob';

interface ICartItem {
  _id: string;
  name: string;
  price: number;
  qty: number;
  selectedModel?: string;
}

export async function createOrder(formData: FormData, cartItems: ICartItem[]) {
  const session = await auth();
  if (!session || session.user.role !== 'customer') {
    return { success: false, message: 'Akses ditolak.' };
  }
  await dbConnect();

  try {
    const { name, address, phone, paymentMethod } = Object.fromEntries(formData);
    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    // --- HANDLE FILE UPLOAD (PAYMENT PROOF) ---
    let paymentProofUrl = undefined;
    const paymentProofFile = formData.get('paymentProof') as File;
    
    if (paymentMethod === 'qris' && paymentProofFile && paymentProofFile.size > 0) {
        try {
            const blob = await put(paymentProofFile.name, paymentProofFile, {
                access: 'public',
                addRandomSuffix: true
            });
            paymentProofUrl = blob.url;
        } catch (uploadError) {
            console.error("Upload Error:", uploadError);
            throw new Error("Gagal mengupload bukti pembayaran.");
        }
    }

    const orderItems = cartItems.map(item => ({
      product: item._id,
      name: item.name + (item.selectedModel ? ` (${item.selectedModel})` : ''), 
      quantity: item.qty,
      price: item.price,
    }));
    
    const order = new Order({
      user: session.user.id, 
      items: orderItems,
      totalPrice,
      shippingDetails: { name, address, phone, paymentMethod },
      status: 'pending', 
      paymentProof: paymentProofUrl, // Simpan URL bukti
    });

    await order.save();

    const paymentLabelMap: Record<string, string> = {
        'transfer': '🏦 Transfer Bank / E-Wallet',
        'qris': '📱 QRIS (Scan)',
        'cash': '💵 Cash (Bayar di Tempat)'
    };
    const paymentDisplay = paymentLabelMap[paymentMethod as string] || paymentMethod;
    const shortOrderId = order._id.toString().slice(-6).toUpperCase();
    const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
    const line = `━━━━━━━━━━━━━━━━`;
    
    let waMessage = `🌸 *PESANAN BARU* 🌸\n`;
    waMessage += `${line}\n`;
    waMessage += `🆔 ID: *#${shortOrderId}*\n`;
    waMessage += `📅 Tgl: ${date}\n`;
    waMessage += `${line}\n\n`;

    waMessage += `👤 *DATA PEMBELI*\n`;
    waMessage += `• Nama: ${name}\n`;
    waMessage += `• WA: ${phone}\n`;
    waMessage += `• Alamat: ${address}\n\n`; 

    waMessage += `🛒 *DAFTAR ITEM*\n`;
    cartItems.forEach((item) => {
      const subtotal = item.price * item.qty;
      const modelText = item.selectedModel ? ` [${item.selectedModel}]` : '';
      
      waMessage += `• ${item.name}${modelText}\n`;
      waMessage += `  ${item.qty} x Rp ${item.price.toLocaleString('id-ID')} = Rp ${subtotal.toLocaleString('id-ID')}\n`;
    });

    waMessage += `\n${line}\n`;
    waMessage += `💰 *TOTAL: Rp ${totalPrice.toLocaleString('id-ID')}*\n`;
    waMessage += `${line}\n\n`;
    waMessage += `💳 *PEMBAYARAN:*\n${paymentDisplay}\n`;
    
    if (paymentProofUrl) {
        waMessage += `📎 *Bukti Bayar:* ${paymentProofUrl}\n`;
    }
    
    waMessage += `\nMohon diproses ya kak. Terima kasih! ✨`;

    const adminNumber = process.env.ADMIN_WA_NUMBER;
    const waUrl = `https://wa.me/${adminNumber}?text=${encodeURIComponent(waMessage)}`;

    revalidatePath('/dashboard/my-orders');
    revalidatePath('/admin/orders'); 
    console.log("Order created successfully", order._id);

    return { success: true, waUrl: waUrl, message: 'Pesanan berhasil dibuat.' };

  } catch (error: any) {
    console.error("Order creation error:", error);
    return { success: false, message: error.message || 'Gagal membuat pesanan' };
  }
}
