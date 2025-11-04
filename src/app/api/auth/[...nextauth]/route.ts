// File: src/app/api/auth/[...nextauth]/route.ts
// (Ini adalah nama file yang benar untuk Next-Auth v4)

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // <-- Impor dari authOptions v4 kita

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };