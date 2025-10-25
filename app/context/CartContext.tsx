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

// Tipe data untuk nilai yang disediakan oleh Context
interface ICartContext {
  cartItems: ICartItem[];
  addToCart: (item: any) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, newQty: number) => void;
  clearCart: () => void;
  total: number;
}

// Buat Context-nya
const CartContext = createContext<ICartContext | undefined>(undefined);

// Hook kustom untuk mempermudah penggunaan context
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
};

// Tipe untuk props Provider
interface CartProviderProps {
  children: ReactNode;
}

// Buat Provider-nya
export const CartProvider = ({ children }: CartProviderProps) => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]);

  // Load keranjang dari localStorage
  useEffect(() => {
    try {
      const items = localStorage.getItem('cartItems');
      if (items) {
        setCartItems(JSON.parse(items));
      }
    } catch (error) {
      console.error("Gagal memuat keranjang dari localStorage", error);
    }
  }, []);

  // Simpan keranjang ke localStorage setiap kali ada perubahan
  useEffect(() => {
    try {
      // Hanya simpan jika ada item, jika tidak, hapus
      if (cartItems.length > 0) {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
      } else {
        localStorage.removeItem('cartItems');
      }
    } catch (error) {
      console.error("Gagal menyimpan keranjang ke localStorage", error);
    }
  }, [cartItems]);

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
    localStorage.removeItem('cartItems'); // Pastikan hapus dari local storage juga
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};