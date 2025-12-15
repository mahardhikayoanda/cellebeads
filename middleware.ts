// File: middleware.ts
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
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
  
  // [PENTING] Cek apakah ada error di URL (misal: ?error=AccessDenied)
  const hasAuthError = nextUrl.searchParams.get('error'); 
  const isPreviewMode = nextUrl.searchParams.get('view') === 'preview';

  if (isOnHome && isLoggedIn && userRole === 'admin' && !isPreviewMode) {
    return NextResponse.redirect(new URL('/admin', nextUrl));
  }
  if (isOnAdmin) {
    if (isLoggedIn && userRole === 'admin') return NextResponse.next(); 
    return NextResponse.redirect(new URL('/unauthorized', nextUrl));
  }
  if (isOnCheckout || isOnMyOrders || isOnProfile) {
    if (!isLoggedIn) return NextResponse.redirect(new URL('/login', nextUrl));
    if (isLoggedIn && userRole !== 'customer') return NextResponse.redirect(new URL('/admin', nextUrl)); 
  }
  if (isOnCart && isLoggedIn && userRole === 'admin') {
     return NextResponse.redirect(new URL('/admin', nextUrl));
  }
  if (isLoggedIn && userRole === 'customer' && !isProfileComplete) {
    if (isOnFinishProfile) return NextResponse.next(); 
    return NextResponse.redirect(new URL('/finish-profile', nextUrl));
  }
  if (isLoggedIn && isProfileComplete && isOnFinishProfile) {
    if (userRole === 'admin') return NextResponse.redirect(new URL('/admin', nextUrl));
    return NextResponse.redirect(new URL('/', nextUrl));
  }

  // [PERBAIKAN UTAMA] Izinkan akses ke /login jika ada error, meskipun isLoggedIn true (sesi hantu)
  if (isLoggedIn && isOnLogin && !hasAuthError) {
    if (userRole === 'admin') return NextResponse.redirect(new URL('/admin', nextUrl));
    return NextResponse.redirect(new URL('/', nextUrl));
  }
  
  return NextResponse.next();
});

export const config = {
  matcher: [
      '/admin/:path*', '/dashboard/:path*', '/profile', '/checkout',
      '/cart', '/products/:path*', '/finish-profile', '/login', '/', 
      '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};