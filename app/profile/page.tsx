// File: app/profile/page.tsx
'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { getUserProfile, updateUserProfile, IUserProfile } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion } from "framer-motion";
import { User, Save, Loader2, Sparkles, Mail, Phone, MapPin } from "lucide-react";
import { toast } from "sonner"; // Gunakan Toast untuk notifikasi

// --- BACKGROUND ANIMASI (Opsional, agar konsisten) ---
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden bg-[#fff0f5] pointer-events-none">
    <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
    <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
    <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
  </div>
);

export default function ProfilePage() {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { update: updateSession } = useSession(); 

  useEffect(() => {
    getUserProfile().then(data => {
      setProfile(data);
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.currentTarget);
    const result = await updateUserProfile(formData);
    
    if (result.success) {
        toast.success("Profil berhasil diperbarui!", {
            description: "Informasi akunmu sudah tersimpan."
        });
        // Update session agar nama di navbar berubah realtime
        await updateSession({ name: formData.get('name') }); 
    } else {
        toast.error("Gagal memperbarui profil.", {
            description: result.message
        });
    }
    setIsSaving(false);
  };

  const getInitials = (name: string = '') => name.charAt(0).toUpperCase();

  if (isLoading) {
    return (
        <div className="flex h-screen items-center justify-center bg-pink-50/50">
            <Loader2 className="h-10 w-10 animate-spin text-pink-500" />
        </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative font-sans text-stone-800">
       <AnimatedBackground />

       <div className="container mx-auto px-4 pt-8 max-w-5xl">
          
          {/* --- HEADER PAGE --- */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-8"
          >
              <div className="p-3 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-2xl text-white shadow-lg shadow-pink-200">
                <User size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-lora font-bold text-stone-800">Profil Saya</h1>
                <p className="text-stone-500">Atur informasi pribadimu di sini.</p>
              </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* --- KARTU KIRI: AVATAR & INFO SINGKAT --- */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="lg:col-span-1"
              >
                <div className="bg-white/70 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 text-center shadow-xl shadow-pink-100/50 relative overflow-hidden group">
                    {/* Dekorasi Background Card */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-pink-100/50 to-transparent"></div>
                    
                    <div className="relative mb-4 inline-block">
                      <div className="w-32 h-32 rounded-full p-[4px] bg-gradient-to-tr from-pink-300 to-purple-300 mx-auto shadow-lg">
                          <div className="w-full h-full bg-white rounded-full flex items-center justify-center overflow-hidden relative">
                            {/* Avatar Inisial Besar */}
                            <span className="text-5xl font-lora font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                                {getInitials(profile?.name)}
                            </span>
                          </div>
                      </div>
                      <div className="absolute bottom-1 right-1 bg-stone-900 text-white p-2 rounded-full shadow-md border-2 border-white">
                          <Sparkles size={16} />
                      </div>
                    </div>
                    
                    <h2 className="text-2xl font-lora font-bold text-stone-800 mb-1">{profile?.name}</h2>
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">Pelanggan Setia</p>

                    <div className="space-y-3 text-left bg-white/50 p-4 rounded-2xl border border-white">
                        <div className="flex items-center gap-3 text-sm text-stone-600">
                            <Mail size={16} className="text-pink-400" />
                            <span className="truncate">{profile?.email}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-stone-600">
                            <Phone size={16} className="text-teal-400" />
                            <span>{profile?.phone || '-'}</span>
                        </div>
                    </div>
                </div>
              </motion.div>

              {/* --- KARTU KANAN: FORM EDIT --- */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="lg:col-span-2"
              >
                <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="bg-pink-50/30 border-b border-pink-100/50 px-8 py-6">
                      <CardTitle className="text-xl font-lora font-bold text-stone-800">Edit Detail</CardTitle>
                      <CardDescription className="text-stone-500">Pastikan data WhatsApp benar untuk kelancaran pesanan.</CardDescription>
                    </CardHeader>
                    
                    <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-6">
                          
                          {/* Email (Read Only) */}
                          <div className="space-y-2">
                            <Label className="text-xs font-bold text-stone-400 uppercase tracking-wide">Email</Label>
                            <Input 
                                value={profile?.email} 
                                disabled 
                                className="bg-stone-100/50 border-none text-stone-500 h-12 rounded-xl cursor-not-allowed" 
                            />
                          </div>
                          
                          {/* Nama */}
                          <div className="space-y-2">
                            <Label htmlFor="name" className="text-xs font-bold text-stone-600 uppercase tracking-wide">Nama Panggilan</Label>
                            <Input 
                                id="name" 
                                name="name" 
                                defaultValue={profile?.name} 
                                required 
                                className="bg-white border-stone-200 focus:border-pink-300 focus:ring-pink-100 h-12 rounded-xl transition-all" 
                            />
                          </div>

                          <div className="grid md:grid-cols-2 gap-6">
                            {/* WhatsApp */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-xs font-bold text-stone-600 uppercase tracking-wide">WhatsApp</Label>
                                <div className="relative">
                                    <Input 
                                        id="phone" 
                                        name="phone" 
                                        defaultValue={profile?.phone || ''} 
                                        required 
                                        className="bg-white border-stone-200 focus:border-pink-300 focus:ring-pink-100 h-12 rounded-xl pl-10" 
                                    />
                                    <Phone className="absolute left-3 top-3.5 h-5 w-5 text-stone-400" />
                                </div>
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <Label htmlFor="gender" className="text-xs font-bold text-stone-600 uppercase tracking-wide">Gender</Label>
                                <Select name="gender" defaultValue={profile?.gender} required>
                                  <SelectTrigger className="bg-white border-stone-200 h-12 rounded-xl focus:ring-pink-100">
                                    <SelectValue placeholder="Pilih..." />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Wanita">Wanita</SelectItem>
                                    <SelectItem value="Pria">Pria</SelectItem>
                                  </SelectContent>
                                </Select>
                            </div>
                          </div>

                          {/* Tombol Simpan */}
                          <div className="pt-4 flex justify-end">
                            <Button 
                                type="submit" 
                                disabled={isSaving} 
                                className="bg-stone-900 hover:bg-pink-600 text-white rounded-xl px-8 h-12 shadow-lg shadow-stone-900/10 transition-all hover:-translate-y-1 group"
                            >
                                {isSaving ? (
                                    <><Loader2 className="animate-spin mr-2 h-4 w-4"/> Menyimpan...</>
                                ) : (
                                    <><Save className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform"/> Simpan Perubahan</>
                                )}
                            </Button>
                          </div>
                      </form>
                    </CardContent>
                </Card>
              </motion.div>
          </div>
       </div>
    </div>
  );
}