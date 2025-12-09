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
  const isLandingPage = pathname === '/' && status === 'unauthenticated';

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar otomatis hidden di Landing Page (logika ada di dalam Navbar.tsx), 
          jadi tetap kita render di sini */}
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

      {/* --- MODIFIKASI FOOTER DI SINI --- */}
      {/* Footer HANYA muncul jika: BUKAN Admin DAN BUKAN Landing Page */}
      {(!isAdmin && !isLandingPage) && (
        <footer className="bg-white/50 backdrop-blur-md border-t border-white py-8 mt-auto">
          <div className="container mx-auto px-4 text-center">
             <p className="font-lora font-bold text-lg text-stone-800 mb-2">Cellebeads.</p>
             <p className="text-sm text-stone-500">
               © {new Date().getFullYear()} Handmade with Love.
             </p>
          </div>
        </footer>
      )}
    </div>
  );
}