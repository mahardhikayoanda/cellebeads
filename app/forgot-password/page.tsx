'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, Mail } from 'lucide-react';
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resetLink, setResetLink] = useState(''); // [NEW] Store link

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });

      const data = await res.json(); // Ambil response body

      setIsSuccess(true);
      if (data.resetLink) setResetLink(data.resetLink); // [NEW] Simpan link

      toast.success("Permintaan Terkirim", {
        description: "Silakan cek layar atau terminal.",
      });
      
    } catch (error) {
      toast.error("Gagal", { description: "Terjadi kesalahan saat mengirim permintaan." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#fff0f5]/30">
        
        {/* Background Dekorasi */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>

        <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-sm relative z-10 mx-4">
            
            <Link href="/login" className="absolute top-6 left-6 text-stone-400 hover:text-stone-800 transition-colors p-2 hover:bg-stone-100 rounded-full">
                <ArrowLeft size={20} />
            </Link>

            <div className="flex flex-col items-center text-center mb-8 mt-4">
                <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mb-4 shadow-sm">
                    <Mail size={32} />
                </div>
                <h1 className="text-2xl font-lora font-bold text-stone-800">Lupa Password?</h1>
                <p className="text-stone-500 text-sm mt-2">
                   {isSuccess 
                     ? "Silakan cek email Anda (atau console server) untuk link reset password." 
                     : "Masukkan email Anda untuk menerima link reset password."}
                </p>
            </div>

            {!isSuccess ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                        type="email" 
                        placeholder="Email Terdaftar" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="rounded-xl border-stone-200 focus:border-pink-300 focus:ring-pink-100 bg-white/50 h-11"
                    />
                    <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-11 rounded-xl bg-stone-900 hover:bg-pink-600 text-white font-bold shadow-md transition-all"
                    >
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Kirim Link Reset"}
                    </Button>
                </form>
            ) : (
                <div className="flex flex-col gap-3">
                   <div className="bg-green-50 text-green-700 p-4 rounded-xl text-sm border border-green-200">
                      Link reset berhasil dibuat!
                   </div>

                   {/* [NEW] Tampilkan Link Langsung */}
                   {resetLink && (
                       <div className="p-3 bg-stone-100 rounded-lg border border-stone-200 break-all text-center">
                           <p className="text-xs text-stone-500 mb-2">Klik link di bawah ini (Mode Dev):</p>
                           <a href={resetLink} className="text-pink-600 font-bold underline text-sm">
                               Reset Password Sekarang
                           </a>
                       </div>
                   )}

                   <Button asChild variant="outline" className="w-full h-11 rounded-xl border-stone-200 hover:bg-stone-50">
                      <Link href="/login">Kembali ke Login</Link>
                   </Button>
                </div>
            )}
            
        </div>
    </div>
  );
}
