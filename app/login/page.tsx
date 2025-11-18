// File: app/login/page.tsx
'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";   
import { Label } from "@/components/ui/label";   
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; 
import { motion } from 'framer-motion';

// --- 1. Buat Aksi Server Sederhana ---
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
      } else { 
        router.push('/'); 
      }
    } catch (err: any) { 
      setError('Terjadi kesalahan koneksi.'); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4"> 
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 100, duration: 0.5 }}
      >
        <Card className="w-full max-w-md shadow-xl border-stone-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-lora font-medium">Login</CardTitle>
            <CardDescription>Masuk ke akun Cellebeads Anda</CardDescription>
          </CardHeader>
          <CardContent>
            {/* 2. Tombol Google */}
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={handleGoogleSignIn}
              >
                {/* Anda bisa tambahkan ikon Google di sini jika mau */}
                Masuk dengan Google
              </Button>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Atau lanjutkan dengan
                  </span>
                </div>
              </div>

              {/* 3. Form Manual */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {(error || urlError) && (
                  <p className="text-destructive text-sm text-center font-medium">
                    {error || "Anda harus login untuk mengakses halaman ini."}
                  </p>
                )}
                
                <div className="space-y-1.5"> 
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@contoh.com" required
                  />
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password Anda" required
                  />
                </div>
                
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? 'Loading...' : 'Login dengan Email'}
                </Button>
              </form>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center text-sm">
            <p className="text-stone-600">
              Belum punya akun?{' '}
              <Link href="/register" className="font-medium text-primary hover:text-primary/80 underline">
                Daftar di sini
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}