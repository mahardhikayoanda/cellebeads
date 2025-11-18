// File: app/finish-profile/actions.ts
'use server';

import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function updateProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Anda harus login' };
  }

  // Ambil data dari form
  const name = formData.get('name') as string; // Ambil NAMA BARU
  const phone = formData.get('phone') as string;
  const gender = formData.get('gender') as string;

  if (!name || !phone || !gender) {
    return { success: false, message: 'Semua field wajib diisi.' };
  }

  await dbConnect();
  try {
    // Update data di database
    await User.findByIdAndUpdate(session.user.id, {
      name, // Simpan NAMA BARU
      phone,
      gender,
      profileComplete: true, // <-- SET PROFIL JADI LENGKAP
    });

  } catch (error: any) {
    return { success: false, message: error.message };
  }
  
  revalidatePath('/'); // Refresh cache
  redirect('/'); // Arahkan ke Halaman Utama
}