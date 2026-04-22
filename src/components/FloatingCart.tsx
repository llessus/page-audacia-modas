'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function FloatingCart() {
  const { getTotalItems, toggleCart, justAdded } = useCart();
  const totalItems = getTotalItems();

  if (totalItems === 0) return null;

  return (
    <motion.button
      onClick={toggleCart}
      className="fixed bottom-24 right-6 z-[90] p-4 bg-audacia-gold text-audacia-rose-dark rounded-full shadow-[0_10px_30px_rgba(212,175,55,0.4)] hover:shadow-[0_15px_40px_rgba(212,175,55,0.6)] transition-all duration-300 group"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label="Abrir sacola de pedidos"
    >
      <ShoppingBag className="w-6 h-6 md:w-7 md:h-7" />

      {/* Badge com quantidade */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.span
            key={totalItems}
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[22px] h-[22px] flex items-center justify-center px-1 rounded-full bg-red-500 text-white text-xs font-bold shadow-lg border-2 border-audacia-rose-dark"
          >
            {totalItems}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Tooltip */}
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-white text-black text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
        Sacola de Pedidos
      </span>

      {/* Pulse animation quando adiciona item */}
      <AnimatePresence>
        {justAdded && (
          <motion.div
            key="pulse"
            className="absolute inset-0 rounded-full bg-audacia-gold"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
