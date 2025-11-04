// File: app/layout.tsx
// HAPUS 'use client';

import type { Metadata } from "next"; 
import { Lato, Lora } from "next/font/google";
import "./globals.css";

// 1. IMPORT SessionProvider LANGSUNG dari 'next-auth/react'
import { SessionProvider } from "next-auth/react"; 
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar";
import React from "react"; 

// ... (Konfigurasi font dan metadata tetap sama) ...
const lato = Lato({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-lato", display: 'swap' });
const lora = Lora({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-lora", display: 'swap' });
export const metadata: Metadata = { title: "Cellebeads", description: "Toko Aksesoris Wanita" };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${lato.variable} ${lora.variable}`}>
      <body className={`font-sans min-h-screen flex flex-col`}>
        {/* 2. Gunakan SessionProvider (dari next-auth/react) */}
        <SessionProvider> 
          <CartProvider>
            <div className="flex flex-col min-h-screen"> 
              <Navbar />
              <main className="container mx-auto px-4 py-8 flex-grow">
                {children}
              </main>
              <footer className="bg-white border-t border-stone-200 mt-auto py-6">
                  {/* ... (footer) ... */}
              </footer>
            </div>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}