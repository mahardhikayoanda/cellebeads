// File: app/admin/profile/actions.ts
'use server';

import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';

export interface IAdminProfile {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  gender?: string;
  dateOfBirth?: string; // Dikirim sebagai ISO string untuk memudahkan serialisasi
  bio?: string;
  address?: string;
}

// 1. Ambil Data Profil Admin
export async function getAdminProfile(): Promise<IAdminProfile | null> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'admin') return null;

  await dbConnect();
  try {
    const user = await User.findById(session.user.id).select('-password'); // Kecualikan password
    if (!user) return null;
    
    // Konversi ke object plain & format tanggal
    const userObj = JSON.parse(JSON.stringify(user));
    return {
        ...userObj,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '', // Format YYYY-MM-DD
    };
  } catch (error) {
    console.error("Gagal ambil profil admin:", error);
    return null;
  }
}

// 2. Update Data Profil Admin
export async function updateAdminProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'admin') {
    return { success: false, message: 'Akses ditolak.' };
  }

  const name = formData.get('name') as string;
  const phone = formData.get('phone') as string;
  const gender = formData.get('gender') as string;
  const dateOfBirth = formData.get('dateOfBirth') as string;
  const bio = formData.get('bio') as string;
  const address = formData.get('address') as string;

  if (!name) {
    return { success: false, message: 'Nama wajib diisi.' };
  }

  await dbConnect();
  try {
    await User.findByIdAndUpdate(session.user.id, {
      name,
      phone,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      bio,
      address
    });
    
    revalidatePath('/admin/profile');
    return { success: true, message: 'Profil berhasil diperbarui!' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Gagal menyimpan profil.' };
  }
}