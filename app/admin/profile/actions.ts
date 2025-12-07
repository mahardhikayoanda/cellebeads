// File: app/admin/profile/actions.ts
'use server';

import { auth } from '@/auth';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob'; // Pastikan package @vercel/blob sudah diinstall

export interface IAdminProfile {
  _id: string;
  name: string;
  email: string;
  image?: string; // Tambahkan ini
  phone?: string;
  gender?: string;
  dateOfBirth?: string;
  bio?: string;
  address?: string;
}

// 1. Ambil Data Profil
export async function getAdminProfile(): Promise<IAdminProfile | null> {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== 'admin') return null;

  await dbConnect();
  try {
    const user = await User.findById(session.user.id).select('-password');
    if (!user) return null;
    
    // Konversi ke object plain & format tanggal
    const userObj = JSON.parse(JSON.stringify(user));
    return {
        ...userObj,
        dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    };
  } catch (error) {
    console.error("Gagal ambil profil admin:", error);
    return null;
  }
}

// 2. Update Data Profil (Termasuk Foto)
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
  
  // Ambil file gambar dari form
  const imageFile = formData.get('image') as File;

  if (!name) {
    return { success: false, message: 'Nama wajib diisi.' };
  }

  await dbConnect();
  try {
    let imageUrl = undefined;

    // --- LOGIKA UPLOAD GAMBAR ---
    // Cek jika ada file gambar yang dikirim dan ukurannya > 0
    if (imageFile && imageFile.size > 0) {
        console.log("Mengupload gambar...", imageFile.name);
        
        // Upload ke Vercel Blob
        const blob = await put(`profiles/${session.user.id}-${Date.now()}.jpg`, imageFile, {
            access: 'public',
            addRandomSuffix: false, 
        });
        
        imageUrl = blob.url; // Dapatkan URL publik gambar
    }
    // ---------------------------

    // Siapkan data yang akan diupdate ke Database
    const updateData: any = {
      name,
      phone,
      gender,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
      bio,
      address
    };

    // Jika ada gambar baru, masukkan ke data update. 
    // Jika tidak, biarkan yang lama (jangan ditimpa undefined).
    if (imageUrl) {
        updateData.image = imageUrl;
    }

    // Eksekusi update ke MongoDB
    await User.findByIdAndUpdate(session.user.id, updateData);
    
    // Refresh cache agar tampilan langsung berubah
    revalidatePath('/admin/profile');
    
    return { 
        success: true, 
        message: 'Profil berhasil diperbarui!', 
        newImageUrl: imageUrl // Kembalikan URL baru ke frontend
    };

  } catch (error: any) {
    console.error("Error update profile:", error);
    return { success: false, message: error.message || 'Gagal menyimpan profil.' };
  }
}