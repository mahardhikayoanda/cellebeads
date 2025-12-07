// File: eslint.config.mjs
import next from 'eslint-config-next/core-web-vitals';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  next,
  {
    rules: {
      // HAPUS atau comment aturan ini agar TypeScript kembali ketat dan aman
      // "@typescript-eslint/no-explicit-any": "off",
      
      "@typescript-eslint/no-unused-vars": "warn"
    }
  }
];