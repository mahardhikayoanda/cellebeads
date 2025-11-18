// File: auth.config.ts
import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google'; // <-- 1. Import Google
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';

export const authConfig = {
  pages: {
    signIn: '/login', 
    error: '/login', 
  },
  providers: [
    // --- 2. TAMBAHKAN GOOGLE PROVIDER ---
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // ------------------------------------

    // Provider Credentials (tetap ada)
    Credentials({
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        await dbConnect();
        const user = await User.findOne({ email: credentials.email });

        // Hanya izinkan login jika provider-nya 'credentials'
        if (user && user.authProvider === 'credentials' && (await user.matchPassword(credentials.password))) {
          return { 
              id: user._id.toString(), 
              name: user.name, 
              email: user.email, 
              role: user.role,
              profileComplete: user.profileComplete // <-- Kirim status profil
          };
        }
        return null; 
      },
    }),
  ],
  callbacks: {
    // --- 3. CALLBACK PENTING (DIJALANKAN SAAT LOGIN GOOGLE/MANUAL) ---
    async signIn({ user, account, profile }) {
      await dbConnect();
      try {
        const existingUser = await User.findOne({ email: user.email });

        if (account?.provider === 'google') {
          if (existingUser) {
            // Jika user sudah ada (mungkin daftar manual dulu), update provider-nya
            existingUser.authProvider = 'google';
            existingUser.password = undefined; // Hapus password lama jika ada
            await existingUser.save();
            return true; // Izinkan login
          }

          // Jika user Google baru, buat akun baru
          const isAdmin = user.email === process.env.ADMIN_EMAIL;
          await User.create({
            name: user.name, // Nama dari Google (akan ditimpa di hal. profil)
            email: user.email,
            authProvider: 'google',
            role: isAdmin ? 'admin' : 'customer',
            profileComplete: isAdmin ? true : false, // WAJIB ISI PROFIL
          });
          
          return true; // Izinkan login
        }
        
        // Untuk login manual (credentials)
        if (account?.provider === 'credentials') {
            if (existingUser && existingUser.authProvider !== 'credentials') {
               // Jika user mencoba login manual tapi akunnya dibuat via Google
               return false; // Tolak login manual
            }
            return true; // Izinkan login manual
        }
        
        return true;

      } catch (error) {
        console.error("Error saat sign-in:", error);
        return false; // Gagal login
      }
    },

    // --- 4. TAMBAHKAN DATA KE TOKEN (SESSION) ---
    async jwt({ token, user, trigger, session }) {
      await dbConnect();
      
      // Ambil data terbaru dari DB saat JWT dibuat atau diupdate
      const dbUser = await User.findOne({ email: token.email });

      if (dbUser) {
        token.id = dbUser._id.toString();
        token.role = dbUser.role;
        token.profileComplete = dbUser.profileComplete; // <-- Tambahkan status profil
        token.name = dbUser.name; // <-- Ambil nama terbaru dari DB
      }
      
      return token;
    },
    
    // --- 5. TAMBAHKAN DATA KE SESSION ---
    async session({ session, token }) {
      if (token && session.user) {
         session.user.id = token.id as string;
         session.user.name = token.name; // <-- Gunakan nama dari DB (bukan Google)
         (session.user as any).role = token.role;
         (session.user as any).profileComplete = token.profileComplete;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;