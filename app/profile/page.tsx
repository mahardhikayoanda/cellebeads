// File: app/profile/page.tsx
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from 'framer-motion';
import { updateUserProfile, getUserProfile, IUserProfile } from './actions';
import { useState, useEffect } from "react";
import { useSession } from 'next-auth/react';

export default function ProfilePage() {
  const [profile, setProfile] = useState<IUserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const { update: updateSession } = useSession(); 

  useEffect(() => {
    getUserProfile().then(data => {
      setProfile(data);
      setIsLoading(false);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    const formData = new FormData(e.currentTarget);
    const result = await updateUserProfile(formData);
    
    if (result.success) {
        alert(result.message); 
        await updateSession({ name: formData.get('name') }); // Update nama di navbar
    } else {
        setMessage(result.message); 
    }
    setIsLoading(false);
  };

  if (isLoading) return <div className="p-10 text-center">Loading...</div>;
  if (!profile) return <div className="p-10 text-center">Gagal memuat profil.</div>;

  return (
    <div className="container mx-auto p-4 min-h-[80vh] flex items-center justify-center">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <Card className="shadow-xl border-stone-200">
          <CardHeader>
            <CardTitle className="text-3xl font-lora font-medium">Profil Saya</CardTitle>
            <CardDescription>Kelola informasi pribadi Anda di sini.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <Label>Email</Label>
                <Input value={profile.email} disabled className="bg-stone-100" />
              </div>
              <div className="space-y-1.5">
                <Label>Nama Panggilan</Label>
                <Input name="name" defaultValue={profile.name} required />
              </div>
              <div className="space-y-1.5">
                <Label>No. WhatsApp</Label>
                <Input name="phone" defaultValue={profile.phone || ''} required />
              </div>
              <div className="space-y-1.5">
                <Label>Jenis Kelamin</Label>
                <Select name="gender" defaultValue={profile.gender} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wanita">Wanita</SelectItem>
                    <SelectItem value="Pria">Pria</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {message && <p className="text-red-500 text-sm">{message}</p>}

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}