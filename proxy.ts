// File: proxy.ts
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
  const isOnCart = nextUrl.pathname.startsWith('/cart');
  const isOnMyOrders = nextUrl.pathname.startsWith('/dashboard/my-orders');
  const isOnProfile = nextUrl.pathname.startsWith('/profile');
  const isOnHome = nextUrl.pathname === '/';

  // --- LOGIKA BARU: Cek "Kunci Pas" (Mode Preview) ---
  // Jika ada ?view=preview di URL, admin boleh masuk ke halaman home
  const isPreviewMode = nextUrl.searchParams.get('view') === 'preview';

  // --- REDIRECT ADMIN DARI HOME KE DASHBOARD (KECUALI PREVIEW) ---
  if (isOnHome && isLoggedIn && user?.role === 'admin' && !isPreviewMode) {
    return Response.redirect(new URL('/admin', nextUrl));
  }

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
       return Response.redirect(new URL('/admin', nextUrl)); // Admin diarahkan ke dashboard
    }
  }

  // 3. Blokir Admin dari Cart
  if (isOnCart && isLoggedIn && user?.role === 'admin') {
     return Response.redirect(new URL('/admin', nextUrl));
  }

  // 4. Alur Wajib Onboarding (Khusus Customer)
  if (isLoggedIn && user?.role === 'customer' && !user?.profileComplete) {
    if (isOnFinishProfile) return; 
    return Response.redirect(new URL('/finish-profile', nextUrl));
  }
  
  // 5. Jangan Bolehkan User Lengkap Akses /finish-profile
  if (isLoggedIn && user?.profileComplete && isOnFinishProfile) {
    if (user?.role === 'admin') {
      return Response.redirect(new URL('/admin', nextUrl));
    }
    return Response.redirect(new URL('/', nextUrl));
  }

  // 6. Jangan Bolehkan User Login Akses /login
  if (isLoggedIn && isOnLogin) {
    if (user?.role === 'admin') {
      return Response.redirect(new URL('/admin', nextUrl));
    }
    return Response.redirect(new URL('/', nextUrl));
  }
});

export const config = {
  matcher: [
      '/admin/:path*', 
      '/dashboard/:path*', 
      '/profile',         
      '/checkout',
      '/cart', 
      '/products/:path*', 
      '/finish-profile',
      '/login', 
      '/', // Tambahkan home untuk redirect admin
  ],
};