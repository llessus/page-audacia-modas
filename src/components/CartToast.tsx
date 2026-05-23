'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export function CartToast() {
  const { lastAddedName } = useCart();

  return (
    <AnimatePresence>
      {lastAddedName && (
        <motion.div
          key={lastAddedName}
          initial={{ opacity: 0, y: -60, x: '-50%' }}
          animate={{ opacity: 1, y: 0, x: '-50%' }}
          exit={{ opacity: 0, y: -60, x: '-50%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed top-24 left-1/2 z-[200] flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-audacia-rose-dark/95 backdrop-blur-xl border border-audacia-gold/30 shadow-[0_10px_40px_rgba(212,175,55,0.2)]"
        >
          <div className="p-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30">
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-audacia-gold/60" />
            <p className="text-white text-sm font-medium">
              <span className="text-audacia-gold font-serif">{lastAddedName}</span>
              <span className="text-white/60 ml-1.5">na sacola!</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
