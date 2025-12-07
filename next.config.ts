// File: next.config.ts
import type { NextConfig } from "next";

const config: NextConfig = {
  // Tambahkan ini untuk mencegah error bundling Mongoose
  serverExternalPackages: ["mongoose"],
  
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'w302ieewdugquuzl.public.blob.vercel-storage.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**', 
      },
      // Tambahkan domain google user content untuk foto profil gmail
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**', 
      },
    ],
  },
};

export default config;