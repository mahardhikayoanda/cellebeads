// File: app/api/register/route.ts
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { name, email, password } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ message: 'Harap isi semua field' }, { status: 400 });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return NextResponse.json({ message: 'Email sudah terdaftar' }, { status: 400 });
    }

    const isAdmin = email === process.env.ADMIN_EMAIL;

    const user = await User.create({
      name,
      email,
      password, // Password akan di-hash oleh model
      role: isAdmin ? 'admin' : 'customer',
      authProvider: 'credentials',
      // PENTING: Set profileComplete
      profileComplete: isAdmin ? true : false, // Admin dianggap lengkap
    });

    return NextResponse.json({ message: 'Registrasi berhasil' }, { status: 201 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}