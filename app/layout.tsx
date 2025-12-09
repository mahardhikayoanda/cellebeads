// File: app/layout.tsx
import type { Metadata } from "next";
import { Lato, Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper"; // Import Wrapper Baru
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
          {/* Gunakan LayoutWrapper untuk menangani struktur halaman */}
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
        <Toaster richColors position="top-center" closeButton theme="light" />
      </body>
    </html>
  );
}