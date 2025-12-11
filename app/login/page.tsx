// File: app/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast } from "sonner"; 

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  // Menangani error dari URL (misal: OAuthCallbackError)
  useEffect(() => {
    if (error) {
      toast.error("Gagal Masuk", {
        description: "Terjadi kesalahan saat otentikasi. Coba lagi.",
      });
    }
  }, [error]);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      // Langsung arahkan ke Google
      await signIn('google', { callbackUrl: '/' }); 
    } catch (error) {
      toast.error("Terjadi Kesalahan", {
        description: "Gagal menghubungkan ke Google.",
      });
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

            <div className="flex flex-col items-center text-center mb-10">
                <div className="w-16 h-16 relative mb-4 rounded-full overflow-hidden shadow-md border-2 border-white">
                    <Image src="/logo_celle.jpg" alt="Logo" fill className="object-cover" />
                </div>
                <h1 className="text-2xl font-lora font-bold text-stone-800">Selamat Datang!</h1>
                <p className="text-stone-500 text-sm">Masuk untuk melanjutkan belanja.</p>
            </div>

            {/* HANYA TOMBOL GOOGLE LOGIN */}
            <div className="space-y-4">
                <Button 
                    onClick={handleGoogleLogin} 
                    disabled={isLoading}
                    variant="outline"
                    className="w-full h-14 rounded-xl border-stone-300 hover:bg-stone-50 hover:border-stone-400 text-stone-700 font-bold shadow-sm transition-all flex items-center justify-center gap-3"
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                           {/* Icon Google Sederhana */}
                           <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                           Lanjutkan dengan Google
                        </>
                    )}
                </Button>
            </div>

            <div className="mt-8 text-center text-xs text-stone-400">
                Dengan masuk, Anda menyetujui <span className="underline">Syarat & Ketentuan</span> kami.
            </div>
        </div>
    </div>
  );
}