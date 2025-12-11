// File: components/LayoutWrapper.tsx
'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { cn } from '@/lib/utils';
import Navbar from "@/components/Navbar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { status } = useSession();

  const isAdmin = pathname?.startsWith('/admin');
  
  // Deteksi kondisi Landing Page (Halaman Depan & Belum Login)
  // Di halaman ini, Footer & Navbar akan disembunyikan
  const isLandingPage = pathname === '/' && status === 'unauthenticated';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar sudah otomatis hidden di Landing Page via logikanya sendiri */}
      <Navbar />
      
      {/* Main Content */}
      <main className={cn(
        "flex-grow w-full mx-auto",
        (isAdmin || isLandingPage) 
          ? "p-0" // Full screen tanpa padding untuk Admin & Landing Page
          : "pt-28 pb-12 px-4 md:px-8 max-w-[1920px]"
      )}>
        {children}
      </main>

      {/* --- FOOTER --- */}
      {/* Footer HANYA muncul jika: BUKAN Admin DAN BUKAN Landing Page */}
      {(!isAdmin && !isLandingPage) && (
        <footer className="bg-white border-t border-stone-200 py-6 mt-auto">
          <div className="container mx-auto px-4 text-center">
             <p className="text-sm text-stone-500">
               © {new Date().getFullYear()} Cellebeads. Hak Cipta Dilindungi.
             </p>
          </div>
        </footer>
      )}
    </div>
  );
}