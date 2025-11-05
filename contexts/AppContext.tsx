import React, { createContext, useState, ReactNode } from 'react';
import type { UserInfo, BaziReport, Crystal, CartItem } from '../types';

interface AppContextType {
  userInfo: UserInfo | null;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo | null>>;
  baziReport: BaziReport | null;
  setBaziReport: React.Dispatch<React.SetStateAction<BaziReport | null>>;
  isPaid: boolean;
  setIsPaid: React.Dispatch<React.SetStateAction<boolean>>;
  cart: CartItem[];
  addToCart: (crystal: Crystal) => void;
  removeFromCart: (crystalName: string) => void;
  updateQuantity: (crystalName: string, quantity: number) => void;
  clearCart: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [baziReport, setBaziReport] = useState<BaziReport | null>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (crystal: Crystal) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.crystal.name === crystal.name);
      if (existingItem) {
        // Increase quantity if item already exists
        return prevCart.map(item =>
          item.crystal.name === crystal.name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      // Add new item to cart
      return [...prevCart, { crystal, quantity: 1 }];
    });
    // In a real app, you might show a toast notification here.
    console.log(`Added ${crystal.name} to cart.`);
  };

  const removeFromCart = (crystalName: string) => {
    setCart(prevCart => prevCart.filter(item => item.crystal.name !== crystalName));
  };

  const updateQuantity = (crystalName: string, quantity: number) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.crystal.name === crystalName
            ? { ...item, quantity }
            : item
        )
        .filter(item => item.quantity > 0) // Remove if quantity is 0 or less
    );
  };

  const clearCart = () => {
    setCart([]);
  };


  return (
    <AppContext.Provider value={{ userInfo, setUserInfo, baziReport, setBaziReport, isPaid, setIsPaid, cart, addToCart, removeFromCart, updateQuantity, clearCart }}>
      {children}
    </AppContext.Provider>
  );
};