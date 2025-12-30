// File: context/CartContext.tsx
'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useSession } from 'next-auth/react'; // [NEW] Import Session
import { useRouter } from 'next/navigation'; // [NEW] Import Router
import { toast } from 'sonner'; // [NEW] Import Toast

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
  const { data: session, status } = useSession(); // [NEW] Gunakan Session
  const router = useRouter(); // [NEW] Gunakan Router

  useEffect(() => {
    // [MODIFIED] Load & VALIDATE cart dari localStorage saat user login
    if (status === 'authenticated') {
        const checkCart = async () => {
             const savedCart = localStorage.getItem('cart');
             if (savedCart) {
                 try { 
                     const parsedCart = JSON.parse(savedCart);
                     
                     // Panggil API Validasi
                     const res = await fetch('/api/cart/validate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ items: parsedCart })
                     });
                     
                     const data = await res.json();
                     
                     if (data.success) {
                        setCartItems(data.validItems);
                        // Jika ada barang yang dihapus, beri tahu user
                        if (data.removedCount && data.removedCount > 0) {
                            toast.warning("Beberapa produk dihapus", {
                                description: `${data.removedCount} barang di keranjangmu sudah tidak tersedia/dihapus admin.`
                            });
                        }
                     } else {
                        // Fallback jika API gagal, pakai data lokal
                        setCartItems(parsedCart);
                     }

                 } catch (error) { 
                     // Jika error parsing/fetch, bersihkan atau biarkan kosong
                     console.error("Gagal load cart:", error);
                     localStorage.removeItem('cart'); 
                 }
             }
             setIsLoaded(true); // Set loaded setelah validasi selesai
        };
        checkCart();

    } else if (status === 'unauthenticated') {
        // [NEW] Jika tidak login, pastikan cart kosong visually
        setCartItems([]);
        setIsLoaded(true);
    }
  }, [status]); // Dependency pada status

  useEffect(() => {
    // [MODIFIED] Hanya simpan ke localStorage jika user login
    if (isLoaded && status === 'authenticated') {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded, status]);

  // --- LOGIKA BARU: TERPISAH SEPENUHNYA ---
  const processCheckoutSuccess = (isDirect: boolean) => {
    if (isDirect) {
        setDirectCheckoutItem(null);
    } else {
        setCartItems(prevCart => prevCart.filter(item => !item.selected));
    }
  };

  const addToCart = (item: ICartItem) => {
    // [NEW] Cek Login sebelum add to cart
    if (status === 'unauthenticated') {
        toast.error("Harap Login Dahulu", {
            description: "Anda perlu masuk akun untuk berbelanja.",
            action: {
                label: "Login",
                onClick: () => router.push('/login')
            }
        });
        router.push('/login');
        return;
    }

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
    
    toast.success("Masuk Keranjang");
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