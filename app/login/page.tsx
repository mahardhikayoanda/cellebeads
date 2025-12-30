// File: app/login/page.tsx
'use client';

import { signIn } from 'next-auth/react';
import { useState, useEffect, Suspense } from 'react'; // [FIX] Tambahkan import Suspense
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from "sonner"; 

// 1. Pindahkan logika utama ke komponen terpisah (misalnya LoginForm)
function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const router = useRouter();

  useEffect(() => {
    if (error) {
      toast.error("Gagal Masuk", {
        description: "Terjadi kesalahan saat otentikasi. Mengalihkan...",
      });
      // Fallback: Jika next-auth gagal redirect ke '/', kita paksa client-side redirect
      const timer = setTimeout(() => {
         router.push('/?error=' + error);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [error, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);


  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signIn('google', { callbackUrl: '/' }); 
    } catch (error) {
      toast.error("Terjadi Kesalahan", {
        description: "Gagal menghubungkan ke Google.",
      });
      setIsLoading(false);
    }
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        toast.error("Gagal Masuk", {
          description: "Email atau password salah",
        });
        setIsLoading(false);
      } else {
        router.push('/');
        router.refresh();
      }
    } catch (error) {
      toast.error("Terjadi Kesalahan", {
        description: "Gagal menghubungkan ke server.",
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center text-center mb-6 mt-4">
          <div className="w-20 h-20 relative mb-4 rounded-full overflow-hidden shadow-lg border-4 border-white">
              <Image src="/logo_celle.jpg" alt="Logo" fill className="object-cover" />
          </div>
          <h1 className="text-2xl font-lora font-bold text-stone-800">Selamat Datang</h1>
          <p className="text-stone-500 text-sm mt-1">Masuk untuk mulai belanja.</p>
      </div>

      <div className="space-y-4">
          {/* Manual Login Form */}
          <form onSubmit={handleManualLogin} className="space-y-3">
             <div className="space-y-2">
                <Input 
                  type="email" 
                  placeholder="Email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="rounded-xl border-stone-200 focus:border-pink-300 focus:ring-pink-100 bg-white/50 h-11"
                />
                
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"}
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-xl border-stone-200 focus:border-pink-300 focus:ring-pink-100 bg-white/50 h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 focus:outline-none bg-transparent"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="text-right">
                    <Link href="/forgot-password" className="text-xs font-semibold text-pink-600 hover:text-pink-800 transition-colors">
                        Lupa Password?
                    </Link>
                </div>
             </div>
             <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full h-11 rounded-xl bg-stone-900 hover:bg-pink-600 text-white font-bold shadow-md transition-all"
             >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Masuk"}
             </Button>
          </form>

          <div className="relative">
             <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-stone-200"></span>
             </div>
             <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/50 px-2 text-stone-400 font-medium tracking-wider">Atau</span>
             </div>
          </div>

          <Button 
              onClick={handleGoogleLogin} 
              disabled={isLoading}
              variant="outline"
              className="w-full h-11 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold shadow-sm transition-all flex items-center justify-center gap-3 hover:border-pink-200 hover:text-pink-600 group"
          >
              {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin text-pink-500" />
              ) : (
                  <>
                      {/* Icon Google */}
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                      </svg>
                      Masuk dengan Google
                  </>
              )}
          </Button>

          <p className="text-center text-stone-500 text-sm mt-4">
             Belum punya akun? <Link href="/register" className="text-pink-600 font-bold hover:underline">Daftar</Link>
          </p>
      </div>
    </>
  );
}

// 2. Komponen Utama Halaman sekarang hanya membungkus layout dan Suspense
export default function LoginPage() {
  return (
    <div className="h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#fff0f5]/30">
        
        {/* Background Dekorasi */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob pointer-events-none"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>

        {/* Card Login */}
        <div className="bg-white/70 backdrop-blur-xl border border-white/60 p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-sm relative z-10 mx-4">
            
            <Link href="/" className="absolute top-6 left-6 text-stone-400 hover:text-stone-800 transition-colors p-2 hover:bg-stone-100 rounded-full">
                <ArrowLeft size={20} />
            </Link>

            {/* [FIX] Bungkus komponen yang menggunakan useSearchParams dengan Suspense */}
            <Suspense fallback={
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
              </div>
            }>
              <LoginForm />
            </Suspense>
            
        </div>
    </div>
  );
}