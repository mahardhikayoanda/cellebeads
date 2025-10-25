// File: app/api/register/route.ts

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User'; // Ini akan berfungsi karena "allowJs": true di tsconfig.json
import { NextResponse, NextRequest } from 'next/server';

// PASTIKAN BARIS INI ADA
export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Harap isi semua field' }, { status: 400 });
    }

    // Cek jika user sudah ada
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 400 });
    }

    // Cek apakah ini admin
    const isAdmin = email === process.env.ADMIN_EMAIL;

    // Buat user baru
    const user = await User.create({
      name,
      email,
      password,
      role: isAdmin ? 'admin' : 'customer',
    });

    return NextResponse.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    }, { status: 201 });

  } catch (error: any) {
    // Tangani error
    return NextResponse.json({ message: error.message || 'Terjadi kesalahan server' }, { status: 500 });
  }
}