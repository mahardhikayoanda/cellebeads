import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
         return NextResponse.json({ message: 'Token dan Password baru diperlukan.' }, { status: 400 });
    }

    await dbConnect();

    // Hash token dari URL untuk dicocokkan dengan di DB
    // [SIMPLIFIED] Token tidak di-hash
    const resetPasswordToken = token;
    
    console.log("Verifying Token (Plain):", resetPasswordToken);

    // [DEBUGGING EXTREME] 
    // Cari user HANYA berdasarkan token dulu untuk melihat apakah tokennya masuk
    const user = await User.findOne({ resetPasswordToken: token });

    if (!user) {
        console.log("!!! FAIL: User not found with token:", token);
        return NextResponse.json({ message: 'Token Salah (User tidak ditemukan)' }, { status: 400 });
    }

    console.log("User Found:", user.email);
    console.log("Expire in DB:", user.resetPasswordExpire);
    console.log("Current Time:", new Date());

    // Cek Expire Manual
    const now = new Date();
    const expire = new Date(user.resetPasswordExpire);
    
    if (expire < now) {
        console.log("!!! FAIL: Token Expired");
        return NextResponse.json({ message: 'Token Kadaluarsa' }, { status: 400 });
    }

    // Set password baru
    user.password = newPassword; 
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Pastikan profileComplete & role tidak hilang (safety)
    if (!user.profileComplete) user.profileComplete = true; // Anggap reset password melengkapi profil
    
    await user.save();

    return NextResponse.json({ message: 'Password berhasil direset. Silakan login.' }, { status: 200 });

  } catch (error) {
    console.error("Reset Password Error:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
