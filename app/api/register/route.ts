import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'Semua field harus diisi.' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Cek apakah email sudah terdaftar
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: 'Email sudah terdaftar.' },
        { status: 400 }
      );
    }

    // Cek apakah email adalah email admin
    const isAdmin = process.env.ADMIN_EMAIL && email === process.env.ADMIN_EMAIL;

    // Buat user baru
    // Password akan di-hash oleh middleware 'pre save' di model User
    await User.create({
      name,
      email,
      password,
      authProvider: 'credentials',
      role: isAdmin ? 'admin' : 'customer', 
      profileComplete: isAdmin ? true : false
    });

    return NextResponse.json(
      { message: 'Registrasi berhasil.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration Error:', error);
    return NextResponse.json(
      { message: 'Terjadi kesalahan saat registrasi.' },
      { status: 500 }
    );
  }
}
