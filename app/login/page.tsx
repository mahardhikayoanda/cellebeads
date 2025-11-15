// File: app/login/page.tsx
'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation'; // <-- Import useSearchParams
import Link from 'next/link';
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";   
import { Label } from "@/components/ui/label";   
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; 
import { motion } from 'framer-motion'; // <-- 1. Import motion

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error'); // <-- Dapatkan error dari URL

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
        setError("Email atau password salah. Silakan coba lagi."); // Pesan error ramah
      } else { 
        router.push('/'); // Redirect ke halaman utama
      }
    } catch (err: any) { 
      setError('Terjadi kesalahan koneksi.'); 
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)] p-4"> 
      {/* 2. Bungkus Card dengan motion.div */}
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
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Tampilkan error dari URL atau dari percobaan login */}
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
                {loading ? 'Loading...' : 'Login'}
              </Button>
            </form>
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