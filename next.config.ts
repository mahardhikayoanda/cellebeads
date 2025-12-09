// File: next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  // Tambahkan ini agar Mongoose tidak error saat build
  serverExternalPackages: ["mongoose"],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'w302ieewdugquuzl.public.blob.vercel-storage.com', // Domain Vercel Blob Anda
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'public.blob.vercel-storage.com', // Tambahkan domain umum Vercel Blob untuk jaga-jaga
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com', // Avatar default
        port: '',
        pathname: '/**', 
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Avatar Google Login
        port: '',
        pathname: '/**', 
      },
    ],
  },
};

export default config;