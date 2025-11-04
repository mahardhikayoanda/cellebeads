// File: types/next-auth.d.ts
import 'next-auth';
import 'next-auth/jwt';

// Tambahkan 'role' dan 'id' ke tipe User
declare module 'next-auth' {
  interface User {
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      role?: string;
    } & DefaultSession['user'];
  }
}

// Tambahkan 'role' dan 'id' ke tipe JWT
declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    id: string;
  }
}