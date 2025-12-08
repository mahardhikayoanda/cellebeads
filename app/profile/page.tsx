// File: app/profile/page.tsx
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from 'framer-motion';
import { updateUserProfile, getUserProfile, IUserProfile } from './actions';
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';
import { User, Save, Loader2, Sparkles } from 'lucide-react';

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
        alert(result.message); 
        await updateSession({ name: formData.get('name') }); 
    } else {
        alert(result.message); 
    }
    setIsSaving(false);
  };

  const getInitials = (name: string = '') => name.charAt(0).toUpperCase();

  if (isLoading) return <div className="flex h-[50vh] items-center justify-center"><Loader2 className="animate-spin text-pink-500"/></div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       {/* Header */}
       <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-xl text-white shadow-lg shadow-pink-200">
             <User size={24} />
          </div>
          <div>
             <h1 className="text-3xl font-lora font-bold text-stone-800">Profil Saya</h1>
             <p className="text-stone-500">Atur informasi pribadimu di sini.</p>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kartu Avatar (Kiri) */}
          <motion.div 
             initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
             className="md:col-span-1"
          >
             <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-pink-50/50 border border-pink-100 text-center relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-pink-50 to-transparent"></div>
                
                <div className="relative mb-4 inline-block">
                   <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-pink-400 to-purple-400 p-1 shadow-lg mx-auto">
                      <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                         <span className="text-4xl font-lora font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                            {getInitials(profile?.name)}
                         </span>
                      </div>
                   </div>
                   <div className="absolute bottom-0 right-0 bg-stone-800 text-white p-2 rounded-full shadow-md">
                      <Sparkles size={14} />
                   </div>
                </div>
                
                <h3 className="text-xl font-bold text-stone-800">{profile?.name}</h3>
                <p className="text-xs text-stone-400 uppercase tracking-widest mt-1">Pelanggan</p>
             </div>
          </motion.div>

          {/* Form Edit (Kanan) */}
          <motion.div 
             initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
             className="md:col-span-2"
          >
             <Card className="border-none shadow-xl glass-super rounded-[2rem] overflow-hidden">
                <CardHeader className="bg-pink-50/50 border-b border-pink-100/50 px-8 py-6">
                   <CardTitle className="text-lg font-lora font-bold text-stone-800">Edit Detail</CardTitle>
                   <CardDescription>Pastikan data WhatsApp benar untuk kelancaran pesanan.</CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                   <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid gap-2">
                         <Label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Email</Label>
                         <Input value={profile?.email} disabled className="bg-stone-50 border-none text-stone-500 h-12 rounded-xl" />
                      </div>
                      
                      <div className="grid gap-2">
                         <Label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Nama Panggilan</Label>
                         <Input name="name" defaultValue={profile?.name} required className="h-12 rounded-xl border-stone-200 focus:border-pink-300 focus:ring-pink-100" />
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                         <div className="grid gap-2">
                            <Label className="text-xs font-bold text-stone-500 uppercase tracking-wide">WhatsApp</Label>
                            <Input name="phone" defaultValue={profile?.phone || ''} required className="h-12 rounded-xl border-stone-200 focus:border-pink-300 focus:ring-pink-100" />
                         </div>
                         <div className="grid gap-2">
                            <Label className="text-xs font-bold text-stone-500 uppercase tracking-wide">Gender</Label>
                            <Select name="gender" defaultValue={profile?.gender} required>
                              <SelectTrigger className="h-12 rounded-xl border-stone-200 focus:ring-pink-100">
                                <SelectValue placeholder="Pilih..." />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Wanita">Wanita</SelectItem>
                                <SelectItem value="Pria">Pria</SelectItem>
                              </SelectContent>
                            </Select>
                         </div>
                      </div>

                      <div className="pt-4 flex justify-end">
                         <Button type="submit" disabled={isSaving} className="bg-stone-900 hover:bg-pink-600 text-white rounded-xl px-8 h-12 shadow-lg transition-all hover:-translate-y-1">
                            {isSaving ? <Loader2 className="animate-spin mr-2"/> : <Save className="mr-2 h-4 w-4"/>}
                            Simpan Perubahan
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