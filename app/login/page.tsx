// File: app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react'; // Import getSession
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";   
import { Label } from "@/components/ui/label";   
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; 
import { motion } from 'framer-motion';
import { Loader2, LogIn } from 'lucide-react';

const handleGoogleSignIn = () => {
  signIn('google', { callbackUrl: '/' }); 
};

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    setError(''); 
    setLoading(true);
    
    try {
      const result = await signIn('credentials', { 
        redirect: false, 
        email: email, 
        password: password 
      });

      if (result?.error) { 
        setError("Email atau password salah."); 
        setLoading(false);
      } else { 
        // --- INI LOGIKA PENTINGNYA ---
        // Kita cek siapa yang login. Kalau Admin -> Lempar ke Dashboard.
        const session = await getSession();
        
        if (session?.user?.role === 'admin') {
            router.push('/admin'); // <--- Admin masuk sini
        } else {
            router.push('/'); // <--- Pelanggan masuk sini
        }
        router.refresh();
      }
    } catch (err: any) { 
      setError('Terjadi kesalahan koneksi.'); 
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4"> 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-none rounded-3xl overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-pink-500 to-purple-600"></div>
          <CardHeader className="text-center pt-8">
            <CardTitle className="text-3xl font-lora font-bold text-stone-800">Selamat Datang</CardTitle>
            <CardDescription className="text-stone-500">Masuk untuk mengakses akun Cellebeads Anda</CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            
            <div className="space-y-6">
              <Button 
                variant="outline" 
                className="w-full h-12 font-medium text-stone-600 border-stone-200 hover:bg-stone-50 rounded-xl transition-all" 
                onClick={handleGoogleSignIn}
              >
                Lanjutkan dengan Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-xs uppercase tracking-wider">
                  <span className="bg-white px-2 text-stone-400 font-medium">
                    Atau via Email
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {(error || urlError) && (
                  <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium text-center border border-red-100">
                    {error || "Akses ditolak. Silakan login."}
                  </div>
                )}
                
                <div className="space-y-2"> 
                  <Label htmlFor="email" className="text-stone-600 font-semibold">Email Address</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com" required className="h-11 rounded-xl bg-stone-50 border-stone-200 focus:border-primary focus:ring-primary/20 transition-all"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-stone-600 font-semibold">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••" required className="h-11 rounded-xl bg-stone-50 border-stone-200 focus:border-primary focus:ring-primary/20 transition-all"
                  />
                </div>
                
                <Button type="submit" disabled={loading} className="w-full h-12 rounded-xl text-base font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all hover:-translate-y-0.5">
                  {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</> : <><LogIn className="mr-2 h-4 w-4"/> Masuk Sekarang</>}
                </Button>
              </form>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center text-sm pb-8">
            <p className="text-stone-500">
              Belum punya akun?{' '}
              <Link href="/register" className="font-bold text-primary hover:underline underline-offset-4">
                Daftar Gratis
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}