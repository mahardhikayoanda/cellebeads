// File: next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'w302ieewdugquuzl.public.blob.vercel-storage.com', // Izin Vercel Blob
        port: '',
        pathname: '/**',
      },
      // --- TAMBAHKAN INI ---
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // Izin DiceBear Avatar
        port: '',
        pathname: '/**', 
      },
      // --------------------
    ],
  },
};

export default config;