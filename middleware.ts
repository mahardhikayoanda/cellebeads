// File: middleware.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config'; // Impor config dasar (tanpa Mongoose)

// Inisialisasi NextAuth hanya dengan config
const { auth } = NextAuth(authConfig);

// Gunakan 'auth' sebagai middleware
// Ini akan otomatis menggunakan 'authorized' callback dari auth.config.ts
// Tapi kita belum menambahkannya, jadi kita tambahkan logika proteksi di sini
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;

  const isOnAdmin = nextUrl.pathname.startsWith('/admin');
  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
  const isOnCheckout = nextUrl.pathname.startsWith('/checkout');

  if (isOnAdmin) {
    if (isLoggedIn && userRole === 'admin') return; // Izinkan
    return Response.redirect(new URL('/unauthorized', nextUrl)); // Tolak
  }
  
  if (isOnDashboard || isOnCheckout) {
    if (isLoggedIn && userRole === 'customer') return; // Izinkan
    // Jika admin mencoba, redirect mereka
    if (isLoggedIn && userRole === 'admin') {
       return Response.redirect(new URL('/admin/products', nextUrl));
    }
    return Response.redirect(new URL('/login', nextUrl)); // Tolak non-login
  }
});

// Terapkan middleware ke rute yang perlu proteksi
export const config = {
  matcher: [
      '/admin/:path*', 
      '/dashboard/:path*', 
      '/checkout'
  ],
};