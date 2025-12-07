// File: tailwind.config.ts
import type { Config } from "tailwindcss";

const config = {
  darkMode: "class",
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: "",
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" }, },
    extend: {
      fontFamily: {
        lora: ["var(--font-lora)", "serif"],
        sans: ["var(--font-lato)", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Warna Baru yang Lebih Kontras & Mewah
        primary: { DEFAULT: "#be185d", foreground: "#ffffff" }, // Pink Tua (Pink-700)
        secondary: { DEFAULT: "#fbcfe8", foreground: "#831843" }, // Pink Muda (Pink-200)
        accent: { DEFAULT: "#0f766e", foreground: "#ffffff" }, // Teal Tua (Teal-700) - Kontras Cantik
        muted: { DEFAULT: "#fdf2f8", foreground: "#831843" },
        card: { DEFAULT: "rgba(255, 255, 255, 0.8)", foreground: "#1c1917" }, // Glass effect base
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
      // --- ANIMASI TAMBAHAN ---
      animation: {
        "blob": "blob 7s infinite",
        "fade-up": "fadeUp 0.5s ease-out forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        }
      },
    },
  },
  plugins: [ require('@tailwindcss/forms'), require("tailwindcss-animate") ],
} satisfies Config;

export default config;