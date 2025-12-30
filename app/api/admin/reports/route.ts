import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Ambil data yang sudah diterima user atau sudah selesai oleh admin
    let query: any = { status: { $in: ['delivered', 'completed'] } };

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);

      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      query.createdAt = {
        $gte: start,
        $lte: end,
      };
    }

    // Ambil data order, urutkan dari yang terbaru
    const orders = await Order.find(query).sort({ createdAt: -1 });

    return NextResponse.json({ success: true, data: orders });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal mengambil data laporan' },
      { status: 500 }
    );
  }
}
