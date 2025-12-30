import { NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) {
      // Keamanan: Jangan beritahu jika email tidak ditemukan
      return NextResponse.json({ message: 'Jika email terdaftar, link reset telah dikirim.' }, { status: 200 });
    }

    // [MODIFIED] Kita izinkan reset password meskipun authProvider='google'
    // Ini memungkinkan user Google untuk menambahkan password manual agar bisa login credential.
    // if (user.authProvider === 'google') { ... }

    // Generate token (Plain hex)
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // [FIX] Gunakan updateOne agar tidak terhalang validasi schema Mongoose yang mungkin tdk update
    // Ini memaksa field baru masuk ke database MongoDB
    await User.updateOne(
        { _id: user._id },
        { 
            $set: { 
                resetPasswordToken: resetToken,
                resetPasswordExpire: Date.now() + 3600000 
            }
        }
    );

    // Verify Save (Debug)
    // const checkUser = await User.findById(user._id);
    // console.log("DEBUG SAVE CHECK:", checkUser.resetPasswordToken === resetToken ? "MATCH" : "MISMATCH");

    // --- SIMULASI KIRIM EMAIL ---
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    console.log("==========================================");
    console.log("RESET PASSWORD REQUEST FOR:", email);
    console.log("LINK:", resetUrl);
    console.log("==========================================");
    console.log("==========================================");
    
    // [DEV MODE] Kembalikan link ke frontend agar user tidak perlu buka terminal
    return NextResponse.json({ 
        message: 'Link reset telah dibuat.', 
        resetLink: resetUrl // <--- Kita kirim balik linknya
    }, { status: 200 });

  } catch (error) {
    console.error("Forgot Password Error:", error);
    return NextResponse.json({ message: 'Terjadi kesalahan server.' }, { status: 500 });
  }
}
