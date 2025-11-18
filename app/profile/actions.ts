// File: app/profile/actions.ts
'use server';

import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';

export interface IUserProfile {
    _id: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
}

// 1. Ambil Profil
export async function getUserProfile(): Promise<IUserProfile | null> {
    const session = await auth();
    if (!session?.user?.id) return null;

    await dbConnect();
    try {
        const user = await User.findById(session.user.id).select('name email phone gender');
        if (!user) return null;
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        return null;
    }
}

// 2. Update Profil
export async function updateUserProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: 'Anda harus login' };
  }

  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const gender = formData.get('gender') as string;

  if (!name || !phone || !gender) {
    return { success: false, message: 'Semua field wajib diisi.' };
  }

  await dbConnect();
  try {
    await User.findByIdAndUpdate(session.user.id, { name, phone, gender });
    revalidatePath('/profile'); 
    return { success: true, message: 'Profil berhasil diperbarui!' };
  } catch (error: any) {
    return { success: false, message: error.message };
  }
}