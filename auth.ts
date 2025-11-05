// File: auth.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// Inisialisasi NextAuth dengan config Anda
export const { 
    handlers: { GET, POST }, // Ekspor handler API
    auth,                   // Ekspor fungsi helper 'auth'
    signIn,                 // Ekspor 'signIn'
    signOut,                // Ekspor 'signOut'
} = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt", // Pastikan kita menggunakan JWT
  },
});