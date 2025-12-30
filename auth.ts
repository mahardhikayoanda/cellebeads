// File: auth.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google'; 
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const { 
    handlers: { GET, POST }, 
    auth,                   
    signIn,                 
    signOut,                
} = NextAuth({
  ...authConfig, 
  
  // [WAJIB] Kita tulis ulang config pages di sini untuk memastikan terbaca oleh API
  pages: {
    signIn: '/login',
    error: '/', // Redirect semua error (termasuk Cancel Google) ke /
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Opsi authorization ini penting agar Google tidak memaksa prompt jika tidak perlu
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await dbConnect();
        const user = await User.findOne({ email: credentials.email as string });

        // [MODIFIED] Hapus cek 'authProvider === credentials' agar user Google yang sudah set password bisa login
        if (user && (await user.matchPassword(credentials.password as string))) {
          return { 
              id: user._id.toString(), 
              name: user.name, 
              email: user.email, 
              role: user.role, 
              profileComplete: user.profileComplete 
          };
        }
        return null; 
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account }) {
      if (account?.provider === 'credentials') return true;
      await dbConnect();
      try {
        const existingUser = await User.findOne({ email: user.email });

        if (account?.provider === 'google') {
          const isAdminEmail = user.email === process.env.ADMIN_EMAIL;
          if (existingUser) {
            if (existingUser.authProvider !== 'google') existingUser.authProvider = 'google';
            if (isAdminEmail) { existingUser.role = 'admin'; existingUser.profileComplete = true; }
            await existingUser.save();
            return true; 
          }
          // User Baru
          await User.create({
            name: user.name, email: user.email, authProvider: 'google',
            role: isAdminEmail ? 'admin' : 'customer', profileComplete: isAdminEmail ? true : false, 
          });
          return true; 
        }
        return true;
      } catch (error) {
        console.error("Error saat sign-in:", error);
        return false; 
      }
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.profileComplete = (user as any).profileComplete;
      }
      if (trigger === "update" && session) return { ...token, ...session };
      
      if (token.email) {
          try {
            await dbConnect();
            const dbUser = await User.findOne({ email: token.email });
            if (dbUser) {
                token.id = dbUser._id.toString(); token.role = dbUser.role; 
                token.profileComplete = dbUser.profileComplete; token.name = dbUser.name;
            }
          } catch(e) {}
      }
      return token;
    },
  },
});
