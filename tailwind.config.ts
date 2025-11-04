import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms"; // 1. Import plugin forms

const config: Config = {
  content: [
    // 2. Arahkan 'content' ke dalam folder 'src/'
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Di Tailwind v4, 'theme' utama diatur dalam globals.css
  theme: {
    extend: {
      // (Font dan Warna sudah Anda atur di globals.css)
    },
  },
  plugins: [
    forms, // 3. Aktifkan plugin forms
    // tw-animate-css sudah di-import di globals.css
  ],
};

export default config;
