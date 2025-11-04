// File: src/lib/authOptions.ts
import { AuthOptions } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from '@/lib/prisma'; // <-- Gunakan prisma client
import bcrypt from 'bcrypt'; // <-- Gunakan bcrypt, bukan bcryptjs

export const authOptions: AuthOptions = {
  // Gunakan Prisma Adapter
  adapter: PrismaAdapter(prisma), 
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan Password wajib diisi');
        }

        const user = await prisma.user.findUnique({ 
          where: { email: credentials.email } 
        });

        if (!user || !user.password) {
          throw new Error('Email atau Password salah');
        }

        // Gunakan bcrypt.compare
        const isPasswordMatch = await bcrypt.compare(
          credentials.password, 
          user.password
        );

        if (!isPasswordMatch) {
          throw new Error('Email atau Password salah');
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login', // Pastikan halaman ini ada di src/app/login/page.tsx
  },
  secret: process.env.NEXTAUTH_SECRET,
};