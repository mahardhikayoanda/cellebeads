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
  ...authConfig, // Warisi config dasar
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

        if (user && user.authProvider === 'credentials' && (await user.matchPassword(credentials.password as string))) {
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
    ...authConfig.callbacks, // Warisi callback dasar
    
    // --- LOGIKA DATABASE (Hanya jalan di Server Node.js) ---
    async signIn({ user, account }) {
      await dbConnect();
      try {
        const existingUser = await User.findOne({ email: user.email });

        if (account?.provider === 'google') {
          const isAdminEmail = user.email === process.env.ADMIN_EMAIL;

          if (existingUser) {
            existingUser.authProvider = 'google';
            
            // CEK ADMIN: Pastikan role diupdate jika email sesuai .env
            if (isAdminEmail) {
                existingUser.role = 'admin';
                existingUser.profileComplete = true; 
            }
            await existingUser.save();
            return true; 
          }

          // User Baru
          await User.create({
            name: user.name, 
            email: user.email,
            authProvider: 'google',
            role: isAdminEmail ? 'admin' : 'customer',
            profileComplete: isAdminEmail ? true : false, 
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

    // Override JWT untuk mengambil data terbaru dari DB setiap request
    async jwt({ token, user, trigger, session }) {
      // Jalankan logika dasar dulu (untuk menangkap user object saat login awal)
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.profileComplete = (user as any).profileComplete;
      }
      
      if (trigger === "update" && session) {
         token = { ...token, ...session };
      }

      // Refresh data dari DB (Pastikan role Admin selalu terupdate)
      if (token.email) {
          try {
            await dbConnect();
            const dbUser = await User.findOne({ email: token.email });
            if (dbUser) {
                token.id = dbUser._id.toString();
                token.role = dbUser.role; // <-- Ini kunci agar role Admin terbaca
                token.profileComplete = dbUser.profileComplete;
                token.name = dbUser.name;
            }
          } catch(e) {
              // Fallback ke data token lama jika DB error
          }
      }
      
      return token;
    },
  },
});