// File: app/register/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function RegisterPage() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { /* ... (logika sama) ... */ };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-lora font-medium">Registrasi Akun</CardTitle>
          <CardDescription>Buat akun baru untuk mulai belanja</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
            <div className="space-y-1.5">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda" required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="email@contoh.com" required
              />
            </div>
            
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Buat Password" required
              />
            </div>
            
            <Button type="submit" disabled={loading} className="w-full bg-rose-500 hover:bg-rose-600">
              {loading ? 'Mendaftar...' : 'Daftar'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
           <p className="text-stone-600">
             Sudah punya akun?{' '}
             <Link href="/login" className="font-medium text-rose-500 hover:text-rose-400 underline">
               Login di sini
             </Link>
           </p>
        </CardFooter>
      </Card>
    </div>
  );
}