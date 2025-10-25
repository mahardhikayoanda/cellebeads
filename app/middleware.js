import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // Jika belum login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Role-based protection
  if (pathname.startsWith("/admin") && token.role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  if (pathname.startsWith("/dashboard") && token.role !== "customer") {
    return NextResponse.redirect(new URL("/unauthorized", req.url));
  }

  // Jika lolos semua validasi, lanjutkan request
  return NextResponse.next();
}

// Tentukan rute yang dilindungi
export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
