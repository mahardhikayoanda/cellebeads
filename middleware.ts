// File: middleware.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  // Perbaikan tipe data: tidak perlu casting 'any' karena sudah didefinisikan
  const userRole = req.auth?.user?.role;
  const isProfileComplete = req.auth?.user?.profileComplete;

  const isOnAdmin = nextUrl.pathname.startsWith('/admin');
  const isOnCheckout = nextUrl.pathname.startsWith('/checkout');
  const isOnFinishProfile = nextUrl.pathname.startsWith('/finish-profile');
  const isOnLogin = nextUrl.pathname.startsWith('/login');
  const isOnCart = nextUrl.pathname.startsWith('/cart');
  const isOnMyOrders = nextUrl.pathname.startsWith('/dashboard/my-orders');
  const isOnProfile = nextUrl.pathname.startsWith('/profile');
  const isOnHome = nextUrl.pathname === '/';

  // --- LOGIKA: Cek "Kunci Pas" (Mode Preview) ---
  const isPreviewMode = nextUrl.searchParams.get('view') === 'preview';

  // --- REDIRECT ADMIN DARI HOME KE DASHBOARD (KECUALI PREVIEW) ---
  if (isOnHome && isLoggedIn && userRole === 'admin' && !isPreviewMode) {
    return NextResponse.redirect(new URL('/admin', nextUrl));
  }

  // 1. Proteksi Halaman Admin
  if (isOnAdmin) {
    if (isLoggedIn && userRole === 'admin') return NextResponse.next(); 
    return NextResponse.redirect(new URL('/unauthorized', nextUrl));
  }
  
  // 2. Proteksi Halaman Customer
  if (isOnCheckout || isOnMyOrders || isOnProfile) {
    if (!isLoggedIn) {
        return NextResponse.redirect(new URL('/login', nextUrl));
    }
    if (isLoggedIn && userRole !== 'customer') {
       return NextResponse.redirect(new URL('/admin', nextUrl)); 
    }
  }

  // 3. Blokir Admin dari Cart
  if (isOnCart && isLoggedIn && userRole === 'admin') {
     return NextResponse.redirect(new URL('/admin', nextUrl));
  }

  // 4. Alur Wajib Onboarding (Khusus Customer)
  if (isLoggedIn && userRole === 'customer' && !isProfileComplete) {
    if (isOnFinishProfile) return NextResponse.next(); 
    return NextResponse.redirect(new URL('/finish-profile', nextUrl));
  }
  
  // 5. Jangan Bolehkan User Lengkap Akses /finish-profile
  if (isLoggedIn && isProfileComplete && isOnFinishProfile) {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', nextUrl));
    }
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  // 6. Jangan Bolehkan User Login Akses /login
  if (isLoggedIn && isOnLogin) {
    if (userRole === 'admin') {
      return NextResponse.redirect(new URL('/admin', nextUrl));
    }
    return NextResponse.redirect(new URL('/', nextUrl));
  }
  
  return NextResponse.next();
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
      '/', 
  ],
};