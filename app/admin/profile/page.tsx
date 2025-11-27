// File: app/admin/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { getAdminProfile, updateAdminProfile, IAdminProfile } from './actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { UserCog, Save, Loader2, CalendarIcon, MapPin, Phone, Crown, Mail } from 'lucide-react';
import { useSession } from 'next-auth/react';

export default function AdminProfilePage() {
  const { update } = useSession(); // Untuk update nama di navbar real-time
  const [profile, setProfile] = useState<IAdminProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getAdminProfile().then((data) => {
      setProfile(data);
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    const formData = new FormData(e.currentTarget);
    
    const res = await updateAdminProfile(formData);
    
    if (res.success) {
      alert(res.message);
      // Update session client-side agar nama di Navbar berubah tanpa refresh
      await update({ name: formData.get('name') });
    } else {
      alert(res.message);
    }
    setIsSaving(false);
  };

  if (isLoading) {
    return (
        <div className="flex h-[50vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
       <motion.div
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.5 }}
         className="space-y-6"
       >
          {/* Header Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
             <div>
                <h1 className="text-3xl font-lora font-bold text-stone-800 flex items-center gap-2">
                   <UserCog className="text-primary" /> Profil Admin
                </h1>
                <p className="text-stone-500 mt-1">Kelola informasi pribadi dan identitas admin.</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             
             {/* KARTU KIRI: ID Card Style */}
             <Card className="lg:col-span-1 border-none shadow-xl bg-gradient-to-b from-stone-800 to-stone-900 text-white overflow-hidden relative">
                {/* Dekorasi Background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-xl"></div>
                
                <CardContent className="p-8 flex flex-col items-center text-center relative z-10 h-full">
                   <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 p-[2px] mb-4 shadow-lg shadow-pink-500/20">
                      <div className="w-full h-full rounded-full bg-stone-800 flex items-center justify-center">
                         <span className="text-3xl font-bold text-white font-lora">
                           {profile?.name?.charAt(0).toUpperCase()}{profile?.name?.split(' ')[1]?.charAt(0).toUpperCase()}
                         </span>
                      </div>
                   </div>
                   
                   <h2 className="text-xl font-bold mb-1">{profile?.name}</h2>
                   <p className="text-stone-400 text-xs uppercase tracking-widest mb-6 flex items-center gap-1 justify-center">
                      <Crown size={12} className="text-yellow-500" /> Admin
                   </p>

                   <div className="w-full space-y-4 text-left mt-auto">
                      <div className="flex items-center gap-3 text-sm text-stone-300 bg-white/5 p-3 rounded-xl border border-white/5">
                         <Mail size={16} className="text-pink-400" />
                         <span className="truncate">{profile?.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-stone-300 bg-white/5 p-3 rounded-xl border border-white/5">
                         <Phone size={16} className="text-teal-400" />
                         <span>{profile?.phone || '-'}</span>
                      </div>
                   </div>
                </CardContent>
             </Card>

             {/* KARTU KANAN: Form Edit (Glassmorphism) */}
             <Card className="lg:col-span-2 border-none shadow-lg bg-white/80 backdrop-blur-md">
                <CardHeader>
                   <CardTitle>Edit Informasi</CardTitle>
                   <CardDescription>Perbarui detail profil Anda di sini.</CardDescription>
                </CardHeader>
                <CardContent>
                   <form onSubmit={handleSubmit} className="space-y-6">
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" name="name" defaultValue={profile?.name} required className="bg-stone-50/50" />
                         </div>
                         
                         <div className="space-y-2">
                            <Label>Email</Label>
                            <Input value={profile?.email} disabled className="bg-stone-100 text-stone-500 cursor-not-allowed" />
                         </div>

                         <div className="space-y-2">
                            <Label htmlFor="phone">No. Telepon / WhatsApp</Label>
                            <Input id="phone" name="phone" defaultValue={profile?.phone} placeholder="08..." className="bg-stone-50/50" />
                         </div>

                         <div className="space-y-2">
                            <Label htmlFor="gender">Jenis Kelamin</Label>
                            <Select name="gender" defaultValue={profile?.gender || "Wanita"}>
                              <SelectTrigger className="bg-stone-50/50">
                                <SelectValue placeholder="Pilih Gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Wanita">Wanita</SelectItem>
                                <SelectItem value="Pria">Pria</SelectItem>
                              </SelectContent>
                            </Select>
                         </div>

                         <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
                            <div className="relative">
                               <Input 
                                  id="dateOfBirth" 
                                  name="dateOfBirth" 
                                  type="date" 
                                  defaultValue={profile?.dateOfBirth} 
                                  className="bg-stone-50/50 pl-10" 
                               />
                               <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                            </div>
                         </div>
                         
                         <div className="space-y-2">
                            <Label htmlFor="address">Alamat / Lokasi</Label>
                            <div className="relative">
                               <Input 
                                  id="address" 
                                  name="address" 
                                  defaultValue={profile?.address} 
                                  placeholder="Kota, Negara"
                                  className="bg-stone-50/50 pl-10" 
                               />
                               <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
                            </div>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <Label htmlFor="bio">Bio Singkat</Label>
                         <Textarea 
                            id="bio" 
                            name="bio" 
                            defaultValue={profile?.bio} 
                            placeholder="Tulis sedikit tentang diri Anda atau motto toko..." 
                            className="min-h-[100px] bg-stone-50/50 resize-none"
                         />
                      </div>

                      <div className="flex justify-end pt-4">
                         <Button type="submit" disabled={isSaving} className="bg-stone-900 hover:bg-primary text-white px-8 rounded-xl h-12 shadow-lg shadow-stone-900/10 transition-all hover:-translate-y-1">
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
          </div>
       </motion.div>
    </div>
  );
}