'use client'; 
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Tipe data untuk produk di keranjang
interface ICartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  qty: number;
}
interface ICartContext {
  cartItems: ICartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQty: number) => void;
  clearCart: () => void;
  total: number;
}

const CartContext = createContext<ICartContext | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);
  const [isMounted, setIsMounted] = useState(false); // State untuk melacak mounting

  // 1. Efek untuk menandai component sudah mount
  useEffect(() => {
    setIsMounted(true);
  }, []); // Hanya berjalan sekali saat client mount

  // 2. Efek untuk MEMBACA dari localStorage
  useEffect(() => {
    // HANYA baca localStorage JIKA sudah di-mount (client-side)
    if (isMounted) {
      try {
        const items = localStorage.getItem('cartItems');
        if (items) {
          setCartItems(JSON.parse(items));
        }
      } catch (error) {
        console.error("Gagal memuat keranjang...", error);
      }
    }
  }, [isMounted]); // Dependensi [isMounted]

  // 3. Efek untuk MENULIS ke localStorage
  useEffect(() => {
    // HANYA tulis ke localStorage JIKA sudah di-mount
    if (isMounted) {
      try {
        if (cartItems.length > 0) {
          localStorage.setItem('cartItems', JSON.stringify(cartItems));
        } else {
          localStorage.removeItem('cartItems');
        }
      } catch (error) {
        console.error("Gagal menyimpan keranjang...", error);
      }
    }
  }, [cartItems, isMounted]); // Dependensi [cartItems, isMounted]

  // --- Logika keranjang (salin dari file 'main') ---
  const addToCart = (product: any) => {
    setCartItems(prevItems => {
      const exist = prevItems.find(item => item._id === product._id);
      if (exist) {
        return prevItems.map(item =>
          item._id === product._id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, qty: 1 }];
      }
    });
  };
  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id));
  };
  const updateQuantity = (id: string, newQty: number) => {
    if (newQty <= 0) {
      return removeFromCart(id);
    }
    setCartItems(prevItems =>
      prevItems.map(item => item._id === id ? { ...item, qty: newQty } : item)
    );
  };
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems'); 
  };
  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  // --- Akhir logika ---

  // 4. KUNCI PERBAIKAN: Selalu render Provider-nya.
  // Ini memastikan server dan client render hal yang sama pada render pertama.
  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};