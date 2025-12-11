// File: app/layout.tsx
import type { Metadata } from "next";
import { Lato, Lora } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import LayoutWrapper from "@/components/LayoutWrapper"; // <--- Import ini
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
    <html lang="id" className={`${lato.variable} ${lora.variable}`} suppressHydrationWarning>
      <body className={`font-sans min-h-screen bg-background text-foreground`}>
        <Providers>
          {/* Gunakan LayoutWrapper untuk membungkus konten */}
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}