// File: next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  
  // --- TAMBAHKAN BLOK INI ---
  // Ini memberi tahu Next.js bahwa gambar dari Vercel Blob aman
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'w302ieewdugquuzl.public.blob.vercel-storage.com', // <-- Diambil dari log error Anda
        port: '',
        pathname: '/**', // Izinkan semua gambar dari host ini
      },
    ],
  },
  // -------------------------
};

export default config;