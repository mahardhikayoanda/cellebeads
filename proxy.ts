// File: proxy.ts (atau middleware.ts)
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user as any; 

  const isOnAdmin = nextUrl.pathname.startsWith('/admin');
  const isOnCheckout = nextUrl.pathname.startsWith('/checkout');
  const isOnFinishProfile = nextUrl.pathname.startsWith('/finish-profile');
  const isOnLogin = nextUrl.pathname.startsWith('/login');
  
  // Rute Customer Baru
  const isOnMyOrders = nextUrl.pathname.startsWith('/dashboard/my-orders');
  const isOnProfile = nextUrl.pathname.startsWith('/profile');

  // 1. Proteksi Halaman Admin
  if (isOnAdmin) {
    if (isLoggedIn && user?.role === 'admin') return; 
    return Response.redirect(new URL('/unauthorized', nextUrl));
  }
  
  // 2. Proteksi Halaman Customer
  if (isOnCheckout || isOnMyOrders || isOnProfile) {
    if (!isLoggedIn) {
        return Response.redirect(new URL('/login', nextUrl));
    }
    if (isLoggedIn && user?.role !== 'customer') {
       return Response.redirect(new URL('/admin/products', nextUrl));
    }
  }

  // 3. ALUR WAJIB ONBOARDING
  if (isLoggedIn && user?.role === 'customer' && !user?.profileComplete) {
    if (isOnFinishProfile) return; 
    return Response.redirect(new URL('/finish-profile', nextUrl));
  }
  
  // 4. JANGAN BOLEHKAN USER LENGKAP MENGAKSES /finish-profile
  if (isLoggedIn && user?.profileComplete && isOnFinishProfile) {
    return Response.redirect(new URL('/', nextUrl));
  }

  // 5. JANGAN BOLEHKAN USER LOGIN MENGAKSES /login
  if (isLoggedIn && isOnLogin) {
     return Response.redirect(new URL('/', nextUrl));
  }
});

// Perbarui matcher
export const config = {
  matcher: [
      '/admin/:path*', 
      '/dashboard/:path*', // Tetap lindungi semua /dashboard
      '/profile',         // <-- Tambahkan Halaman Profil
      '/checkout',
      '/cart', 
      '/products/:path*', 
      '/finish-profile',
      '/login', 
      '/', 
  ],
};