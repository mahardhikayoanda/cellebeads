// File: app/layout.tsx
import type { Metadata } from "next";
import { Lato, Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import Navbar from "@/components/Navbar";
import React from "react";

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
    // Tambahkan suppressHydrationWarning untuk mencegah error perbedaan atribut
    <html lang="id" className={`${lato.variable} ${lora.variable}`} suppressHydrationWarning>
      {/* PERBAIKAN:
         1. Ganti 'bg-background' dengan 'bg-[#FDFBF7]' (Warna Cream manual).
         2. Ganti 'text-foreground' dengan 'text-stone-900' (Warna Abu Gelap manual).
         Ini akan "mengunci" tampilan menjadi tema terang/cream, mengabaikan mode gelap HP/Ekstensi.
      */}
      <body className={`font-sans min-h-screen flex flex-col bg-[#FDFBF7] text-stone-900`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-grow">
              {children}
            </main>
            <footer className="bg-white border-t border-stone-200 mt-auto py-6">
              <p className="text-center text-sm text-stone-500">
                © {new Date().getFullYear()} Cellebeads. Hak Cipta Dilindungi.
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}