import './globals.css';
import AppSessionProvider from './SessionProvider';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: 'Toko Aksesoris',
  description: 'Penjualan aksesoris wanita',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AppSessionProvider>
          <CartProvider>
            {/* Navbar atau Header bisa ditaruh di sini */}
            <main>{children}</main>
            {/* Footer bisa ditaruh di sini */}
          </CartProvider>
        </AppSessionProvider>
      </body>
    </html>
  );
}