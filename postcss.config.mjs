// File: postcss.config.mjs
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    // Gunakan nama paket eksplisit
    '@tailwindcss/postcss': {}, 
    autoprefixer: {},
    // Tambahkan plugin lain jika perlu di masa depan
  },
};

export default config;