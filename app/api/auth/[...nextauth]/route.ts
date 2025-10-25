import NextAuth, { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User'; // Ini akan berfungsi karena "allowJs": true

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email dan Password wajib diisi');
        }

        await dbConnect();
        
        // Mongoose model dari file .js akan tetap berfungsi
        const user = await User.findOne({ email: credentials.email });

        if (user && (await user.matchPassword(credentials.password))) {
          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role, // Tipe User kita sudah mencakup 'role'
          };
        } else {
          throw new Error('Email atau Password salah');
        }
      },
    }),
  ],
  callbacks: {
    // Tipe 'user' di sini berasal dari return 'authorize'
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Tipe User kustom kita punya 'role'
      }
      return token;
    },
    // Tipe 'token' di sini berasal dari return 'jwt'
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };