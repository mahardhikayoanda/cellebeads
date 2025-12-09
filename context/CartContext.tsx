// File: context/CartContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface ICartItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  selected: boolean; 
  selectedModel?: string; 
}

interface CartContextType {
  cartItems: ICartItem[];
  selectedItems: ICartItem[]; 
  
  // State Beli Langsung
  directCheckoutItem: ICartItem | null;
  setDirectCheckoutItem: (item: ICartItem | null) => void;
  
  // Fungsi Proses Sukses (Disederhanakan)
  processCheckoutSuccess: (isDirect: boolean) => void;

  addToCart: (item: ICartItem) => void;
  removeFromCart: (id: string, model?: string) => void;
  updateQuantity: (id: string, quantity: number, model?: string) => void;
  toggleCartItemSelection: (id: string, model?: string) => void; 
  clearCart: () => void; 
  getTotalPrice: () => number; 
  getTotalItems: () => number; 
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<ICartItem[]>([]); 
  const [directCheckoutItem, setDirectCheckoutItem] = useState<ICartItem | null>(null); 
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try { setCartItems(JSON.parse(savedCart)); } catch (error) { localStorage.removeItem('cart'); }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems, isLoaded]);

  // --- LOGIKA BARU: TERPISAH SEPENUHNYA ---
  const processCheckoutSuccess = (isDirect: boolean) => {
    if (isDirect) {
        // Jika Beli Langsung: HANYA bersihkan state beli langsung.
        // Keranjang TIDAK disentuh sama sekali.
        setDirectCheckoutItem(null);
    } else {
        // Jika Checkout dari Keranjang: Hapus item yang dipilih.
        setCartItems(prevCart => prevCart.filter(item => !item.selected));
    }
  };

  const addToCart = (item: ICartItem) => {
    setCartItems(prevCart => {
      const existingItem = prevCart.find(i => i._id === item._id && i.selectedModel === item.selectedModel);
      if (existingItem) {
        return prevCart.map(i =>
          (i._id === item._id && i.selectedModel === item.selectedModel)
            ? { ...i, quantity: i.quantity + item.quantity, selected: true } 
            : i
        );
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (id: string, model?: string) => {
    setCartItems(prevCart => prevCart.filter(item => !(item._id === id && item.selectedModel === model)));
  };

  const updateQuantity = (id: string, quantity: number, model?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, model);
      return;
    }
    setCartItems(prevCart =>
      prevCart.map(item =>
        (item._id === id && item.selectedModel === model) ? { ...item, quantity } : item
      )
    );
  };

  const toggleCartItemSelection = (id: string, model?: string) => {
    setCartItems(prevCart =>
      prevCart.map(item =>
        (item._id === id && item.selectedModel === model) ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
  };

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
        cartItems, selectedItems, 
        directCheckoutItem, setDirectCheckoutItem, processCheckoutSuccess, 
        addToCart, removeFromCart, updateQuantity, toggleCartItemSelection, clearCart, getTotalPrice, getTotalItems 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) throw new Error('useCart must be used within CartProvider');
  return context;
};