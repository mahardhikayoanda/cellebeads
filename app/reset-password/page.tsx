'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, KeyRound } from 'lucide-react';
import { toast } from "sonner";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
        <div className="text-center">
            <p className="text-red-500 font-medium mb-4">Token tidak valid atau hilang.</p>
            <Button asChild><Link href="/forgot-password">Kirim Ulang Link</Link></Button>
        </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
        toast.error("Validasi Gagal", { description: "Password tidak cocok." });
        return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: password })
      });
      
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mereset password');
      }

      toast.success("Berhasil", { description: "Password Anda telah diperbarui." });
      router.push('/login');
      
    } catch (error: any) {
      toast.error("Gagal", { description: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <Input 
            type="password" 
            placeholder="Password Baru" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl border-stone-200 focus:border-pink-300 focus:ring-pink-100 bg-white/50 h-11"
        />
        <Input 
            type="password" 
            placeholder="Konfirmasi Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="rounded-xl border-stone-200 focus:border-pink-300 focus:ring-pink-100 bg-white/50 h-11"
        />
        <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-stone-900 hover:bg-pink-600 text-white font-bold shadow-md transition-all"
        >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
        </Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#fff0f5]/30">
        
        {/* Background Dekorasi */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-sm relative z-10 mx-4">
            
            <div className="flex flex-col items-center text-center mb-8 mt-4">
                <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <KeyRound size={32} />
                </div>
                <h1 className="text-2xl font-lora font-bold text-stone-800">Reset Password</h1>
                <p className="text-stone-500 text-sm mt-2">Buat password baru untuk akun Anda.</p>
            </div>

            <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin text-pink-500"/></div>}>
                <ResetPasswordForm />
            </Suspense>
            
        </div>
    </div>
  );
}
