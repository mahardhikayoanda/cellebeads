'use client'; 
// Hapus 'useState' dan 'useEffect'
import { SessionProvider } from 'next-auth/react';
import React from 'react'; 

interface AppSessionProviderProps {
  children: React.ReactNode;
}

export default function AppSessionProvider({ children }: AppSessionProviderProps) {
  // HAPUS SEMUA LOGIKA 'isMounted'.
  // Langsung render provider-nya. Ini sudah aman.
  return <SessionProvider>{children}</SessionProvider>;
}