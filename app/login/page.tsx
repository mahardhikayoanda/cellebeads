// File: app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const result = await signIn('credentials', { redirect: false, email, password });
      if (result?.error) { setError(result.error); } 
      else { alert('Login berhasil!'); router.push('/'); }
    } catch (err) { setError('Terjadi kesalahan koneksi'); } 
    finally { setLoading(false); }
  };

  return (
    // Form putih di tengah
    <div className="max-w-md mx-auto mt-10 p-8 bg-white rounded-lg shadow-md border border-stone-200">
      <h1 className="text-3xl font-lora font-medium text-stone-800 mb-6 text-center">Login</h1>
      <form onSubmit={handleSubmit}>
        {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-stone-600 mb-1">Email</label>
          <input
            id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            // Style Input
            className="w-full bg-white border-stone-300 text-stone-800 rounded-md p-2 shadow-sm focus:ring-rose-500 focus:border-rose-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-stone-600 mb-1">Password</label>
          <input
            id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            // Style Input
            className="w-full bg-white border-stone-300 text-stone-800 rounded-md p-2 shadow-sm focus:ring-rose-500 focus:border-rose-500"
            required
          />
        </div>
        
        <button type="submit" disabled={loading} 
          // Style Tombol
          className="w-full py-2 px-4 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded-md shadow-md transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Login'}
        </button>
      </form>
      
      <p className="mt-6 text-center text-sm text-stone-600">
        Belum punya akun?{' '}
        <Link href="/register" className="font-medium text-rose-500 hover:text-rose-400">
          Daftar di sini
        </Link>
      </p>
    </div>
  );
}