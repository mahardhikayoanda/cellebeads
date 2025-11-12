// File: auth.config.ts (PASTIKAN ISINYA SEPERTI INI)

import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect'; // <-- GANTI dari lib/mongodb menjadi lib/dbConnect
import User from '@/models/User';

export const authConfig = {
  pages: {
    signIn: '/login', 
    error: '/login', 
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null; 
        }
        const { email, password } = credentials as { email: string; password: string };

        await dbConnect(); // <-- GANTI dari connectDB() menjadi dbConnect()
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
          return { 
              id: user._id.toString(), 
              name: user.name, 
              email: user.email, 
              role: user.role 
          };
        }
        
        console.log("Invalid credentials");
        return null; 
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
         session.user.id = token.id as string;
         (session.user as any).role = token.role; 
      }
      return session;
    },
  },
} satisfies NextAuthConfig;