// File: auth.config.ts
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google'; 
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const authConfig = {
  pages: {
    signIn: '/login', 
    error: '/login', 
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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
        const user = await User.findOne({ email: credentials.email });

        if (user && user.authProvider === 'credentials' && (await user.matchPassword(credentials.password))) {
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
    async signIn({ user, account, profile }) {
      await dbConnect();
      try {
        const existingUser = await User.findOne({ email: user.email });

        if (account?.provider === 'google') {
          if (existingUser) {
            existingUser.authProvider = 'google';
            existingUser.password = undefined; 
            await existingUser.save();
            return true; 
          }

          const isAdmin = user.email === process.env.ADMIN_EMAIL;
          await User.create({
            name: user.name, 
            email: user.email,
            authProvider: 'google',
            role: isAdmin ? 'admin' : 'customer',
            profileComplete: isAdmin ? true : false, 
          });
          
          return true; 
        }
        
        if (account?.provider === 'credentials') {
            if (existingUser && existingUser.authProvider !== 'credentials') {
               return false; 
            }
            return true; 
        }
        
        return true;

      } catch (error) {
        console.error("Error saat sign-in:", error);
        return false; 
      }
    },

    async jwt({ token, user, trigger, session }) {
      await dbConnect();
      
      if (token.email) {
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
          token.profileComplete = dbUser.profileComplete;
          token.name = dbUser.name; 
        }
      }
      
      return token;
    },
    
    async session({ session, token }) {
      if (token && session.user) {
         session.user.id = token.id as string;
         session.user.name = token.name; 
         (session.user as any).role = token.role;
         (session.user as any).profileComplete = token.profileComplete;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;