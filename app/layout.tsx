// File: app/layout.tsx
import type { Metadata } from "next";
import { Lato, Lora } from "next/font/google"; // Import font
import "./globals.css";

import AppSessionProvider from "./SessionProvider";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/Navbar"; // Pastikan Navbar ada di ROOT/components/Navbar.tsx

// Konfigurasi font
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato", // Variabel CSS untuk Lato
});
const lora = Lora({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-lora", // Variabel CSS untuk Lora
});

export const metadata: Metadata = {
  title: "Cellebeads",
  description: "Toko Aksesoris Wanita by Celle",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      {/* --- PERBAIKAN DI BARIS INI --- */}
      <body 
        className={`${lato.variable} ${lora.variable} font-sans min-h-screen flex flex-col bg-background text-foreground`} 
        // Tambahkan bg-background dan text-foreground di sini
      >
      {/* ----------------------------- */}
        <AppSessionProvider>
          <CartProvider>
            <Navbar /> 
            <main className="container mx-auto px-4 py-8 flex-grow">
              {children}
            </main>
            <footer className="bg-white border-t border-stone-200 mt-12 py-6"> {/* Footer mungkin perlu diupdate warnanya */}
                <p className="text-center text-sm text-stone-500">
                    © {new Date().getFullYear()} Cellebeads. Hak Cipta Dilindungi.
                </p>
            </footer>
          </CartProvider>
        </AppSessionProvider>
      </body>
    </html>
  );
}