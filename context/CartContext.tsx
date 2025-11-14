// File: context/CartContext.tsx (GANTI SEMUA ISINYA DENGAN INI)
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ICartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selected: boolean; 
}

interface CartContextType {
  cartItems: ICartItem[];
  selectedItems: ICartItem[]; 
  addToCart: (item: ICartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleCartItemSelection: (id: string) => void; 
  clearCart: () => void; // <-- Ini yang error
  getTotalPrice: () => number; 
  getTotalItems: () => number; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]); 
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
        localStorage.removeItem('cart');
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (item: ICartItem) => {
    setCartItems(prevCart => {
      const existingItem = prevCart.find(i => i._id === item._id);
      
      if (existingItem) {
        return prevCart.map(i =>
          i._id === item._id
            ? { ...i, quantity: i.quantity + item.quantity, selected: true } 
            : i
        );
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevCart => prevCart.filter(item => item._id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCartItems(prevCart =>
      prevCart.map(item =>
        item._id === id ? { ...item, quantity } : item
      )
    );
  };

  const toggleCartItemSelection = (id: string) => {
    setCartItems(prevCart =>
      prevCart.map(item =>
        item._id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  // --- INI FUNGSI YANG HILANG DARI FILE LOKAL ANDA ---
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cartItems'); // Hapus juga dari localStorage
  };
  // -----------------------------------------------------

  const getTotalPrice = () => {
    return cartItems
      .filter(item => item.selected) 
      .reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  const selectedItems = cartItems.filter(item => item.selected);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        selectedItems, 
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleCartItemSelection, 
        clearCart, // <-- Sekarang 'clearCart' sudah terdefinisi
        getTotalPrice,
        getTotalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart harus digunakan di dalam CartProvider');
  }
  return context;
};