'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error("Validasi Gagal", { description: "Password tidak cocok." });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mendaftar');
      }

      toast.success("Registrasi Berhasil", {
        description: "Silakan masuk dengan akun baru Anda.",
      });
      
      router.push('/login');

    } catch (error: any) {
      toast.error("Gagal Mendaftar", {
        description: error.message || "Terjadi kesalahan sistem.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#fff0f5]/30 py-10">
        
        {/* Background Dekorasi */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>

        {/* Card Register */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-sm relative z-10 mx-4">
            
            <Link href="/" className="absolute top-6 left-6 text-stone-400 hover:text-stone-800 transition-colors p-2 hover:bg-stone-100 rounded-full">
                <ArrowLeft size={20} />
            </Link>

            <div className="flex flex-col items-center text-center mb-6 mt-4">
                <div className="w-16 h-16 relative mb-4 rounded-full overflow-hidden shadow-lg border-4 border-white">
                    <Image src="/logo_celle.jpg" alt="Logo" fill className="object-cover" />
                </div>
                <h1 className="text-2xl font-lora font-bold text-stone-800">Buat Akun</h1>
                <p className="text-stone-500 text-sm mt-1">Gabung dan nikmati keuntungannya.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-2">
                    <Input 
                        name="name"
                        type="text" 
                        placeholder="Nama Lengkap" 
                        value={formData.name} 
                        onChange={handleChange}
                        required
                        className="rounded-xl border-stone-200 focus:border-pink-300 focus:ring-pink-100 bg-white/50 h-11"
                    />
                    <Input 
                        name="email"
                        type="email" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={handleChange}
                        required
                        className="rounded-xl border-stone-200 focus:border-pink-300 focus:ring-pink-100 bg-white/50 h-11"
                    />
                    <Input 
                        name="password"
                        type="password" 
                        placeholder="Password" 
                        value={formData.password} 
                        onChange={handleChange}
                        required
                        className="rounded-xl border-stone-200 focus:border-pink-300 focus:ring-pink-100 bg-white/50 h-11"
                    />
                    <Input 
                        name="confirmPassword"
                        type="password" 
                        placeholder="Konfirmasi Password" 
                        value={formData.confirmPassword} 
                        onChange={handleChange}
                        required
                        className="rounded-xl border-stone-200 focus:border-pink-300 focus:ring-pink-100 bg-white/50 h-11"
                    />
                </div>

                <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full h-11 rounded-xl bg-stone-900 hover:bg-pink-600 text-white font-bold shadow-md transition-all mt-2"
                >
                    {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Daftar Sekarang"}
                </Button>
            </form>

            <div className="mt-6 text-center text-sm text-stone-500">
                Sudah punya akun? <Link href="/login" className="text-pink-600 font-bold hover:underline">Masuk</Link>
            </div>
            
        </div>
    </div>
  );
}
