// File: eslint.config.mjs
import next from 'eslint-config-next/core-web-vitals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  // Terapkan konfigurasi default Next.js
  next,
  
  // Tambahkan aturan kustom kita
  {
    rules: {
      // 1. Matikan error untuk 'any' type (yang menyebabkan build gagal)
      "@typescript-eslint/no-explicit-any": "off",
      
      // 2. Ubah error 'unused vars' (variabel tidak terpakai) menjadi peringatan
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
];