// File: lib/authOptions.ts

import { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      // --- INI PERBAIKANNYA ---
      // Kita harus mendefinisikan field apa saja yang kita harapkan
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      // ------------------------

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan Password wajib diisi');
        }

        await dbConnect();

        const user = await User.findOne({ email: credentials.email });

        if (user && (await user.matchPassword(credentials.password))) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } else {
          throw new Error('Email atau Password salah');
        }
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
        session.user.id = token.id; // Duplikat, perbaiki
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};