// File: app/login/page.tsx
'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button"; 
import { Input } from "@/components/ui/input";   
import { Label } from "@/components/ui/label";   
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; 

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // --- LOGIKA HANDLE SUBMIT DIMASUKKAN KEMBALI ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    console.log("--- Handle Submit Start ---"); // LOG 1
    setError(''); 
    setLoading(true);

    try {
      console.log("Email:", email); // LOG 2
      console.log("Password:", password ? '***' : ''); // LOG 3 
      console.log("Calling signIn..."); // LOG 4
      
      const result = await signIn('credentials', { 
        redirect: false, 
        email: email, 
        password: password 
      });

      console.log("signIn Result:", result); // LOG 5

      if (result?.error) { 
        console.error("signIn Error:", result.error); // LOG 6
        setError(result.error); 
        // setLoading(false); // Dihapus karena sudah ada di finally
      } else { 
        console.log("Login Success!"); // LOG 7
        alert('Login berhasil!'); 
        router.push('/'); 
      }
    } catch (err: any) { 
      console.error("Catch Block Error:", err); // LOG 8
      setError('Terjadi kesalahan koneksi: ' + err.message); 
    } finally {
      console.log("--- Handle Submit Finally ---"); // LOG 9
      setLoading(false); 
    }
  };
  // ---------------------------------------------

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]"> 
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-lora font-medium">Login</CardTitle>
          <CardDescription>Masuk ke akun Cellebeads Anda</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pastikan form memanggil handleSubmit */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            
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
                placeholder="Password Anda" required
              />
            </div>
            
            {/* Pastikan button type="submit" */}
            <Button type="submit" disabled={loading} className="w-full bg-rose-500 hover:bg-rose-600">
              {loading ? 'Loading...' : 'Login'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-sm">
          <p className="text-stone-600">
            Belum punya akun?{' '}
            <Link href="/register" className="font-medium text-rose-500 hover:text-rose-400 underline">
              Daftar di sini
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}