// File: auth.config.ts
import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  // [WAJIB] Definisi pages di sini agar dikenali Middleware & Server
  pages: {
    signIn: '/login', 
    error: '/login', // Redirect semua error (termasuk Cancel Google) ke /login
  },
  session: { strategy: "jwt" },
  providers: [], 
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
         session.user.id = token.id as string;
         session.user.name = token.name; 
         session.user.role = token.role as string; 
         session.user.profileComplete = token.profileComplete as boolean; 
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
        if (user) {
            token.id = user.id;
            token.role = (user as any).role;
            token.profileComplete = (user as any).profileComplete;
        }
        if (trigger === "update" && session) {
            return { ...token, ...session };
        }
        return token;
    }
  },
} satisfies NextAuthConfig;