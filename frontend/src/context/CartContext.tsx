import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { CartItem } from '../types';

interface CartContextType {
  cartItems: CartItem[];
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    try {
      const response = await api.get<CartItem[]>('/carts/items/');
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    await api.post('/carts/items/', { product: productId, quantity });
    await fetchCart();
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    await api.patch(`/carts/items/${itemId}/`, { quantity });
    await fetchCart();
  };

  const removeFromCart = async (itemId: number) => {
    await api.delete(`/carts/items/${itemId}/`);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/carts/');
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider value={{ cartItems, fetchCart, addToCart, updateCartItem, removeFromCart, clearCart, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
