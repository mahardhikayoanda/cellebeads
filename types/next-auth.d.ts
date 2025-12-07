// File: types/next-auth.d.ts
import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  /**
   * Menambahkan properti kustom ke User object
   */
  interface User {
    role?: string;
    profileComplete?: boolean;
    id?: string;
  }
  
  /**
   * Menambahkan properti kustom ke Session object (yang dipakai di useSession)
   */
  interface Session {
    user: {
      id: string;
      role: string;
      profileComplete: boolean;
    } & DefaultSession['user']
  }
}

declare module 'next-auth/jwt' {
  /**
   * Menambahkan properti kustom ke JWT token
   */
  interface JWT {
    role?: string;
    profileComplete?: boolean;
    id?: string;
  }
}