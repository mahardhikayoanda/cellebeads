// File: app/layout.tsx
import type { Metadata } from "next";
import { Lato, Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import React from "react";
import { Toaster } from "sonner"; 

const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato", display: 'swap' });
const lora = Lora({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-lora", display: 'swap' });

export const metadata: Metadata = {
  title: "Cellebeads",
  description: "Toko Aksesoris Wanita by Celle",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${lato.variable} ${lora.variable}`} suppressHydrationWarning>
      <body className={`font-sans min-h-screen flex flex-col bg-[#fff0f5]/30 text-stone-800`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            
            <Navbar />
            
            {/* --- PERBAIKAN DI SINI --- */}
            {/* Tambahkan 'pt-28' (Padding Top) agar konten tidak nabrak Navbar */}
            {/* Tambahkan 'pb-12' agar footer tidak terlalu mepet */}
            <main className="flex-grow pt-28 pb-12 px-4 md:px-8 max-w-[1920px] mx-auto w-full">
              {children}
            </main>

            <footer className="bg-white/50 backdrop-blur-md border-t border-white py-8 mt-auto">
              <div className="container mx-auto px-4 text-center">
                 <p className="font-lora font-bold text-lg text-stone-800 mb-2">Cellebeads.</p>
                 <p className="text-sm text-stone-500">
                   © {new Date().getFullYear()} Handmade with Love.
                 </p>
              </div>
            </footer>

          </div>
        </Providers>
        <Toaster richColors position="top-center" closeButton theme="light" />
      </body>
    </html>
  );
}