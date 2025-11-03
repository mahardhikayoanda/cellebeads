// File: app/SessionProvider.tsx
'use client'; 

import { SessionProvider } from 'next-auth/react';
import React, { useState, useEffect } from 'react'; // <-- Import useState, useEffect

interface AppSessionProviderProps {
  children: React.ReactNode;
}

export default function AppSessionProvider({ children }: AppSessionProviderProps) {
  // 1. Tambahkan state isMounted
  const [isMounted, setIsMounted] = useState(false);

  // 2. Gunakan useEffect untuk menandai saat sudah di browser
  useEffect(() => {
    setIsMounted(true);
  }, []); // Hanya berjalan sekali saat mount

  // 3. JANGAN render SessionProvider (atau children) jika belum mounted
  // Ini mencegah error React.Children.only saat server-side rendering
  if (!isMounted) {
    // Anda bisa menampilkan null atau loading state sederhana
    return null; 
    // return <div>Loading session...</div>; // Atau tampilkan loading
  }

  // 4. HANYA render SessionProvider jika sudah di browser
  return <SessionProvider>{children}</SessionProvider>;
}