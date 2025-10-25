'use client';

import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  // Load keranjang dari localStorage (jika ada) saat komponen dimuat
  useEffect(() => {
    const items = localStorage.getItem('cartItems');
    if (items) {
      setCartItems(JSON.parse(items));
    }
  }, []);

  // Simpan ke localStorage setiap kali keranjang berubah
  useEffect(() => {
    if(cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cartItems'); // Hapus jika keranjang kosong
    }
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const exist = prevItems.find(item => item._id === product._id);
      if (exist) {
        // Update quantity jika sudah ada
        return prevItems.map(item =>
          item._id === product._id ? { ...item, qty: item.qty + quantity } : item
        );
      } else {
        // Tambah item baru
        return [...prevItems, { ...product, qty: quantity }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== id));
  };
  
  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      return removeFromCart(id);
    }
    setCartItems(prevItems => 
      prevItems.map(item => item._id === id ? { ...item, qty: newQty } : item)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
};