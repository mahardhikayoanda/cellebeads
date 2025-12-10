// File: app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from "sonner"; // [BARU] Import Toast

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        // [UBAH] Ganti alert jadi toast error
        toast.error("Gagal Masuk", {
          description: "Email atau password yang kamu masukkan salah.",
        });
      } else {
        // [UBAH] Ganti alert jadi toast sukses
        toast.success("Selamat Datang!", {
          description: "Senang melihatmu kembali.",
        });
        
        // Cek admin/user via fetch session (opsional) atau biarkan middleware handle
        // Di sini kita redirect default ke home, middleware akan handle jika admin
        const sessionRes = await fetch('/api/auth/session');
        const session = await sessionRes.json();
        
        if (session?.user?.role === 'admin') {
            router.push('/admin');
        } else {
            router.push('/');
        }
      }
    } catch (error) {
      toast.error("Terjadi Kesalahan", {
        description: "Silakan coba lagi nanti.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        {/* Background Dekorasi */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-md relative z-10">
            
            <Link href="/" className="absolute top-6 left-6 text-stone-400 hover:text-stone-800 transition-colors">
                <ArrowLeft size={24} />
            </Link>

            <div className="flex flex-col items-center text-center mb-8">
                <div className="w-16 h-16 relative mb-4 rounded-full overflow-hidden shadow-md border-2 border-white">
                    <Image src="/logo_celle.jpg" alt="Logo" fill className="object-cover" />
                </div>
                <h1 className="text-2xl font-lora font-bold text-stone-800">Selamat Datang!</h1>
                <p className="text-stone-500 text-sm">Masuk untuk mengelola pesananmu.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2 text-left">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                        id="email" 
                        type="email" 
                        placeholder="namamu@email.com" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                        className="rounded-xl border-stone-200 focus:border-pink-300 focus:ring-pink-200 bg-white/50"
                    />
                </div>
                <div className="space-y-2 text-left">
                    <Label htmlFor="password">Password</Label>
                    <Input 
                        id="password" 
                        type="password" 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                        className="rounded-xl border-stone-200 focus:border-pink-300 focus:ring-pink-200 bg-white/50"
                    />
                </div>

                <Button type="submit" className="w-full rounded-xl bg-stone-900 hover:bg-pink-600 text-white font-bold h-12 shadow-lg transition-all" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Masuk Sekarang'}
                </Button>
            </form>

            <div className="mt-8 text-center text-sm text-stone-500">
                Belum punya akun? <Link href="/register" className="font-bold text-pink-600 hover:underline">Daftar di sini</Link>
            </div>
        </div>
    </div>
  );
}