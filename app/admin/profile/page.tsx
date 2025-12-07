// File: app/admin/profile/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getAdminProfile, updateAdminProfile, IAdminProfile } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { 
  UserCog, Save, Loader2, CalendarIcon, MapPin, 
  Phone, Crown, Mail, Sparkles, Camera, Upload 
} from 'lucide-react';
import { useSession } from 'next-auth/react';
// --- IMPORT BARU ---
import ImageCropperDialog from '@/components/admin/ImageCropperDialog';

export default function AdminProfilePage() {
  const { update } = useSession(); 
  const [profile, setProfile] = useState<IAdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // State untuk preview akhir yang ditampilkan di avatar
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  // Ref untuk input file tersembunyi
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- STATE BARU UNTUK CROPPER ---
  const [isCropperOpen, setIsCropperOpen] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState<string | null>(null); // Gambar mentah untuk dikirim ke cropper
  const [croppedFileForSubmission, setCroppedFileForSubmission] = useState<Blob | null>(null); // File hasil crop untuk dikirim ke server

  useEffect(() => {
    getAdminProfile().then((data) => {
      setProfile(data);
      if (data?.image) {
          setImagePreview(data.image);
      }
      setIsLoading(false);
    });
  }, []);

  const handleImageIconClick = () => {
    fileInputRef.current?.click();
  };

  // 1. Handler saat file mentah dipilih dari komputer
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
          alert('Mohon pilih file gambar.');
          return;
      }
      // Buat URL sementara dari file mentah dan buka dialog cropper
      const rawImageUrl = URL.createObjectURL(file);
      setTempImageSrc(rawImageUrl);
      setIsCropperOpen(true); 
      // Reset value input agar bisa memilih file yang sama lagi jika dibatalkan
      e.target.value = ''; 
    }
  };

  // 2. Handler saat user selesai melakukan cropping di dialog
  const handleCropFinished = (croppedBlob: Blob) => {
    // Simpan file blob hasil crop untuk dikirim nanti saat submit
    setCroppedFileForSubmission(croppedBlob);

    // Buat URL preview dari blob hasil crop untuk ditampilkan di UI
    const croppedPreviewUrl = URL.createObjectURL(croppedBlob);
    setImagePreview(croppedPreviewUrl);
    
    // Tutup dialog (sudah ditangani oleh ImageCropperDialog, tapi untuk memastikan)
    setIsCropperOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);

    // --- LOGIKA PENTING: Ganti file mentah dengan file hasil crop ---
    // Input file asli (e.currentTarget) berisi file mentah yang belum dicrop.
    // Jika user melakukan cropping, kita harus menimpa 'image' di formData
    // dengan file blob yang sudah dicrop.
    if (croppedFileForSubmission) {
        // Kita perlu nama file, pakai timestamp agar unik
        const fileName = `profile-cropped-${Date.now()}.jpg`; 
        formData.set('image', croppedFileForSubmission, fileName);
    }
    // ---------------------------------------------------------------
    
    const res = await updateAdminProfile(formData);
    
    if (res.success) {
      alert(res.message);
      await update({ name: formData.get('name'), image: res.newImageUrl }); 
      
      // Reset state cropper setelah berhasil simpan
      setCroppedFileForSubmission(null);
      if (tempImageSrc) URL.revokeObjectURL(tempImageSrc); // Bersihkan memori URL sementara

      const updatedData = await getAdminProfile();
      setProfile(updatedData);
      if(updatedData?.image) setImagePreview(updatedData.image);

    } else {
      alert(res.message);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
        <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
        </div>
    );
  }

  const getInitials = (name: string | undefined) => {
      if (!name) return 'AD';
      const parts = name.split(' ');
      if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
      return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return (
    <div className="max-w-5xl mx-auto pb-20 space-y-8">
       
       {/* --- KOMPONEN DIALOG CROPPER --- */}
       <ImageCropperDialog 
          isOpen={isCropperOpen}
          onClose={() => setIsCropperOpen(false)}
          imageSrc={tempImageSrc}
          onCropComplete={handleCropFinished}
       />
       {/* ------------------------------- */}

       {/* Header */}
       <motion.div
         initial={{ opacity: 0, y: -20 }}
         animate={{ opacity: 1, y: 0 }}
         className="flex items-center gap-3"
       >
          <div className="p-3 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-xl text-white shadow-lg shadow-pink-200">
             <UserCog size={24} />
          </div>
          <div>
             <h1 className="text-3xl font-lora font-bold text-stone-800">Profil Admin</h1>
             <p className="text-stone-500">Kelola identitas dan personalisasi akun Anda.</p>
          </div>
       </motion.div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* KARTU KIRI: Luxury ID Card Style */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
             <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-stone-800 via-stone-900 to-black text-white shadow-2xl hover:shadow-stone-900/40 transition-all duration-500 group h-full min-h-[400px]">
                
                {/* Dekorasi Background Card */}
                <div className="absolute top-[-50px] right-[-50px] w-40 h-40 bg-pink-500/20 rounded-full blur-3xl group-hover:bg-pink-500/30 transition-colors"></div>
                <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                
                <CardContent className="p-8 flex flex-col items-center text-center relative z-10 h-full">
                   
                   {/* --- BAGIAN AVATAR --- */}
                   <div className="relative mb-6 group/avatar">
                      <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-tr from-pink-400 via-rose-300 to-purple-400 shadow-xl shadow-pink-500/20">
                         <div className="w-full h-full rounded-full bg-stone-900 flex items-center justify-center overflow-hidden relative relative">
                            
                            {imagePreview ? (
                                <Image 
                                  src={imagePreview} 
                                  alt="Preview" 
                                  fill 
                                  className="object-cover" 
                                />
                            ) : (
                                <span className="text-4xl font-lora font-bold text-white tracking-wider">
                                  {getInitials(profile?.name)}
                                </span>
                            )}

                            <div 
                                onClick={handleImageIconClick}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            >
                                <Upload className="text-white w-8 h-8 mb-1" />
                            </div>
                         </div>
                      </div>
                      
                      <div 
                        onClick={handleImageIconClick}
                        className="absolute bottom-0 right-0 bg-white text-stone-900 p-2.5 rounded-full shadow-lg cursor-pointer hover:bg-pink-100 hover:text-pink-600 transition-all hover:scale-110 z-20"
                        title="Ganti Foto Profil"
                      >
                         <Camera size={16} />
                      </div>
                   </div>
                   {/* --------------------- */}
                   
                   <h2 className="text-2xl font-lora font-bold mb-1 tracking-wide break-words max-w-full">{profile?.name}</h2>
                   
                   <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur-sm text-xs font-bold text-pink-200 tracking-widest uppercase mb-8">
                      <Crown size={12} className="text-yellow-400 fill-yellow-400" /> Administrator
                   </div>

                   <div className="w-full space-y-4 text-left mt-auto bg-white/5 p-5 rounded-2xl border border-white/5 backdrop-blur-sm">
                      <div className="flex items-center gap-4">
                         <div className="p-2 rounded-lg bg-pink-500/20 text-pink-300">
                            <Mail size={16} />
                         </div>
                         <div className="overflow-hidden">
                            <p className="text-[10px] text-stone-400 uppercase tracking-wider">Email</p>
                            <p className="text-sm font-medium truncate text-stone-200" title={profile?.email}>{profile?.email}</p>
                         </div>
                      </div>
                      <div className="h-px bg-white/10 w-full" />
                      <div className="flex items-center gap-4">
                         <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300">
                            <Phone size={16} />
                         </div>
                         <div>
                            <p className="text-[10px] text-stone-400 uppercase tracking-wider">WhatsApp</p>
                            <p className="text-sm font-medium text-stone-200">{profile?.phone || '-'}</p>
                         </div>
                      </div>
                   </div>
                </CardContent>
             </div>
          </motion.div>

          {/* KARTU KANAN: Form Edit Glassmorphism */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
             <Card className="border-none shadow-xl glass-super rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-pink-50/50 border-b border-pink-100/50 px-8 py-6">
                   <div className="flex items-center gap-2">
                      <Sparkles className="text-pink-400 w-5 h-5" />
                      <CardTitle className="text-xl font-lora font-bold text-stone-800">Edit Informasi</CardTitle>
                   </div>
                   <CardDescription>Perbarui detail pribadi Anda agar tetap profesional.</CardDescription>
                </CardHeader>
                
                <CardContent className="p-8">
                   <form onSubmit={handleSubmit} className="space-y-8">
                      
                      {/* Input File Tersembunyi (Hanya menerima gambar) */}
                      <input 
                         type="file" 
                         id="image" 
                         name="image" // Nama ini penting, tapi akan ditimpa jika ada crop
                         ref={fileInputRef}
                         onChange={handleImageChange}
                         accept="image/*" 
                         className="hidden" 
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="name" className="text-stone-600 font-bold text-xs uppercase tracking-wide">Nama Lengkap</Label>
                            <Input 
                               id="name" name="name" defaultValue={profile?.name} required 
                               className="bg-white/60 border-stone-200 focus:border-pink-400 focus:ring-pink-200 h-12 rounded-xl" 
                            />
                         </div>
                         
                         <div className="space-y-2">
                            <Label className="text-stone-400 font-bold text-xs uppercase tracking-wide">Email (Terkunci)</Label>
                            <Input value={profile?.email} disabled className="bg-stone-100/50 text-stone-500 cursor-not-allowed border-none h-12 rounded-xl" />
                         </div>

                         <div className="space-y-2">
                            <Label htmlFor="phone" className="text-stone-600 font-bold text-xs uppercase tracking-wide">No. Telepon / WhatsApp</Label>
                            <div className="relative">
                               <Input 
                                  id="phone" name="phone" defaultValue={profile?.phone} placeholder="08..." 
                                  className="bg-white/60 border-stone-200 focus:border-pink-400 focus:ring-pink-200 h-12 rounded-xl pl-10" 
                               />
                               <Phone className="absolute left-3 top-3.5 h-5 w-5 text-stone-400" />
                            </div>
                         </div>

                         <div className="space-y-2">
                            <Label htmlFor="gender" className="text-stone-600 font-bold text-xs uppercase tracking-wide">Jenis Kelamin</Label>
                            <Select name="gender" defaultValue={profile?.gender || "Wanita"}>
                              <SelectTrigger className="bg-white/60 border-stone-200 h-12 rounded-xl focus:ring-pink-200">
                                <SelectValue placeholder="Pilih Gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Wanita">Wanita</SelectItem>
                                <SelectItem value="Pria">Pria</SelectItem>
                              </SelectContent>
                            </Select>
                         </div>

                         <div className="space-y-2">
                            <Label htmlFor="dateOfBirth" className="text-stone-600 font-bold text-xs uppercase tracking-wide">Tanggal Lahir</Label>
                            <div className="relative">
                               <Input 
                                  id="dateOfBirth" 
                                  name="dateOfBirth" 
                                  type="date" 
                                  defaultValue={profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : ''} 
                                  className="bg-white/60 border-stone-200 focus:border-pink-400 focus:ring-pink-200 h-12 rounded-xl pl-10" 
                               />
                               <CalendarIcon className="absolute left-3 top-3.5 h-5 w-5 text-stone-400" />
                            </div>
                         </div>
                         
                         <div className="space-y-2">
                            <Label htmlFor="address" className="text-stone-600 font-bold text-xs uppercase tracking-wide">Alamat / Lokasi</Label>
                            <div className="relative">
                               <Input 
                                  id="address" 
                                  name="address" 
                                  defaultValue={profile?.address} 
                                  placeholder="Kota, Negara"
                                  className="bg-white/60 border-stone-200 focus:border-pink-400 focus:ring-pink-200 h-12 rounded-xl pl-10" 
                               />
                               <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-stone-400" />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <Label htmlFor="bio" className="text-stone-600 font-bold text-xs uppercase tracking-wide">Bio Singkat</Label>
                         <Textarea 
                            id="bio" 
                            name="bio" 
                            defaultValue={profile?.bio} 
                            placeholder="Tulis sedikit tentang diri Anda atau motto toko..." 
                            className="min-h-[100px] bg-white/60 border-stone-200 focus:border-pink-400 focus:ring-pink-200 resize-none rounded-xl"
                         />
                      </div>

                      <div className="flex justify-end pt-4 border-t border-stone-100">
                         <Button 
                            type="submit" 
                            disabled={isSaving} 
                            className="bg-gradient-to-r from-stone-800 to-stone-900 hover:from-pink-600 hover:to-rose-500 text-white px-8 rounded-xl h-12 shadow-lg shadow-stone-900/10 transition-all hover:scale-[1.02] hover:shadow-pink-500/20"
                         >
                            {isSaving ? (
                               <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</>
                            ) : (
                               <><Save className="mr-2 h-4 w-4" /> Simpan Perubahan</>
                            )}
                         </Button>
                      </div>

                   </form>
                </CardContent>
             </Card>
          </motion.div>
       </div>
    </div>
  );
}