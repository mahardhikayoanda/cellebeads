// File: app/api/auth/[...nextauth]/route.ts

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/authOptions'; // <-- IMPORT dari file baru

// File ini sekarang hanya mengekspor GET dan POST
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };