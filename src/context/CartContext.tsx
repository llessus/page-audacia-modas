'use client';

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Produto } from '@/types/produto';

export interface CartItem {
  produto: Produto;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (produto: Produto) => void;
  removeItem: (produtoId: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  getTotalItems: () => number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  justAdded: string | null; // ID do produto recém-adicionado (para animação)
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'audacia_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Carregar do localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.warn('Erro ao carregar sacola:', e);
    }
    setIsInitialized(true);
  }, []);

  // Persistir no localStorage
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.warn('Erro ao salvar sacola:', e);
      }
    }
  }, [items, isInitialized]);

  const addItem = useCallback((produto: Produto) => {
    setItems(prev => {
      const existing = prev.find(item => item.produto.id === produto.id);
      if (existing) {
        // Já está na sacola, incrementa
        return prev.map(item =>
          item.produto.id === produto.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { produto, quantity: 1 }];
    });
    setJustAdded(produto.id);
    setTimeout(() => setJustAdded(null), 1500);
  }, []);

  const removeItem = useCallback((produtoId: string) => {
    setItems(prev => prev.filter(item => item.produto.id !== produtoId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotal = useCallback(() => {
    return items.reduce((acc, item) => acc + item.produto.preco * item.quantity, 0);
  }, [items]);

  const getTotalItems = useCallback(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, clearCart,
      getTotal, getTotalItems,
      isOpen, openCart, closeCart, toggleCart,
      justAdded,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
