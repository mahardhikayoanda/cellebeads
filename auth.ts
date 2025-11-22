// File: auth.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { 
    handlers: { GET, POST }, 
    auth,                   
    signIn,                 
    signOut,                
} = NextAuth({
  ...authConfig,
  session: {
    strategy: "jwt", 
  },
  // Opsi ini WAJIB ada untuk login via VS Code / Proxy
  trustHost: true, 
});