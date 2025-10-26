// File: app/SessionProvider.tsx
'use client';
import { SessionProvider } from 'next-auth/react';
import React from 'react'; // Import React

// Definisikan tipe untuk props
interface AppSessionProviderProps {
  children: React.ReactNode;
}

export default function AppSessionProvider({ children }: AppSessionProviderProps) {
  return <SessionProvider>{children}</SessionProvider>;
}