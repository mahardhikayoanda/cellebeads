// File: app/finish-profile/page.tsx
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from 'framer-motion';
import { updateProfile } from './actions';
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function FinishProfilePage() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession(); // Ambil nama Google

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);
    
    if (result?.message) { // Jika ada error dari server action
       alert("Gagal: " + result.message);
       setIsLoading(false);
    }
    // Jika sukses, server action akan me-redirect otomatis
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <Card className="w-full max-w-md shadow-xl border-stone-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-lora font-medium">
              {/* Sapa dengan nama Google-nya */}
              Selamat Datang, {session?.user?.name?.split(' ')[0]}!
            </CardTitle>
            <CardDescription>Satu langkah lagi. Harap lengkapi profil Anda.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Form Input Nama (Sesuai permintaan Anda) */}
              <div className="space-y-1.5">
                <Label htmlFor="name">Nama Panggilan (untuk Profil)</Label>
                <Input id="name" name="name" 
                  // Isi otomatis dengan nama Google, tapi bisa diedit
                  defaultValue={session?.user?.name || ''} 
                  required 
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone">Nomor Telepon (WhatsApp)</Label>
                <Input id="phone" name="phone" placeholder="0812..." required />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="gender">Jenis Kelamin</Label>
                <Select name="gender" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Jenis Kelamin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Wanita">Wanita</SelectItem>
                    <SelectItem value="Pria">Pria</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? 'Menyimpan...' : 'Simpan & Mulai Belanja'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}