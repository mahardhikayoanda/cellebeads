// File: auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login', 
    error: '/login', 
  },
  session: { strategy: "jwt" },
  // Providers dibiarkan array kosong di sini (akan diisi di auth.ts)
  providers: [], 
  callbacks: {
    // Callback ini aman untuk Middleware (hanya memindahkan data token ke session)
    async session({ session, token }) {
      if (token && session.user) {
         session.user.id = token.id as string;
         session.user.name = token.name; 
         session.user.role = token.role as string; 
         session.user.profileComplete = token.profileComplete as boolean; 
      }
      return session;
    },
    // Callback JWT sederhana untuk menyimpan data saat login pertama kali
    async jwt({ token, user, trigger, session }) {
        if (user) {
            token.id = user.id;
            token.role = (user as any).role;
            token.profileComplete = (user as any).profileComplete;
        }
        // Update session jika ada perubahan dari client side (misal update profil)
        if (trigger === "update" && session) {
            return { ...token, ...session };
        }
        return token;
    }
  },
} satisfies NextAuthConfig;