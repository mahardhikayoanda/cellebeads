// File: auth.config.ts
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const authConfig = {
  pages: {
    signIn: '/login', // Halaman login kustom
    error: '/login', // Redirect ke login jika ada error
  },
  providers: [
    Credentials({
      // Anda tidak perlu 'credentials' object di v5 jika form Anda kustom
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; 
        }
        const { email, password } = credentials as { email: string; password: string };

        await dbConnect();
        const user = await User.findOne({ email });

        // Gunakan method matchPassword dari model User.js Anda
        if (user && (await user.matchPassword(password))) {
          // Kembalikan data user yang akan disimpan di token
          return { 
              id: user._id.toString(), 
              name: user.name, 
              email: user.email, 
              role: user.role 
          };
        }
        
        console.log("Invalid credentials");
        return null; // Login gagal
      },
    }),
  ],
  callbacks: {
    // Callback 'jwt' dipanggil saat token dibuat/diupdate
    async jwt({ token, user }) {
      if (user) {
        // Saat login, tambahkan properti dari 'user' (hasil authorize) ke token
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    // Callback 'session' dipanggil saat sesi diakses
    async session({ session, token }) {
      // Tambahkan properti dari 'token' ke 'session.user'
      if (session.user && token.sub) {
         session.user.id = token.id as string;
         (session.user as any).role = token.role; 
      }
      return session;
    },
  },
} satisfies NextAuthConfig;