// File: app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

// 1. Import kedua Provider kita
import AppSessionProvider from "./SessionProvider";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

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
    <html lang="id">
      <body className={inter.className}>
        {/* 2. Bungkus aplikasi dengan KEDUA provider */}
        <AppSessionProvider>
          <CartProvider>
            {/* Kita bisa tambahkan Navbar/Header di sini nanti */}
            
            <main>
              {children}
            </main>
            
            {/* Kita bisa tambahkan Footer di sini nanti */}
          </CartProvider>
        </AppSessionProvider>
      </body>
    </html>
  );
}