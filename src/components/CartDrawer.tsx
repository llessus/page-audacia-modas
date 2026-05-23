'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Trash2, ShoppingBag, Send, Minus, Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { siteConfig } from '@/config/siteConfig';

export function CartDrawer() {
  const { items, removeItem, clearCart, getTotal, getTotalItems, isOpen, closeCart } = useCart();

  const formattedTotal = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(getTotal());

  function buildWhatsAppMessage() {
    let msg = `Olá! \u{1F6CD}\u{FE0F} Quero fazer um pedido da *${siteConfig.nomeLoja}*:\n\n`;

    items.forEach((item, i) => {
      const price = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(item.produto.preco);
      msg += `${i + 1}. *${item.produto.nome}* — ${price}`;
      if (item.quantity > 1) msg += ` (x${item.quantity})`;
      msg += `\n`;
    });

    msg += `\n\u{1F4B0} *Total: ${formattedTotal}*`;
    msg += `\n\nAguardo confirmação! \u{1F60A}`;
    return msg;
  }

  function handleSendOrder() {
    const text = encodeURIComponent(buildWhatsAppMessage());
    window.open(`https://wa.me/${siteConfig.whatsappDDIeDDD}?text=${text}`, '_blank');
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 z-[120] w-full max-w-md bg-audacia-rose-dark/95 backdrop-blur-2xl border-l border-audacia-gold/20 shadow-[0_0_60px_rgba(212,175,55,0.1)] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-audacia-gold/15">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-audacia-gold/15 border border-audacia-gold/25">
                  <ShoppingBag className="w-5 h-5 text-audacia-gold" />
                </div>
                <div>
                  <h3 className="font-serif text-lg text-white">Sua Sacola</h3>
                  <p className="text-white/40 text-xs">{getTotalItems()} {getTotalItems() === 1 ? 'item' : 'itens'}</p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Fechar sacola"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              <AnimatePresence mode="popLayout">
                {items.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full text-center py-16"
                  >
                    <div className="p-4 rounded-full bg-white/5 border border-white/10 mb-4">
                      <ShoppingBag className="w-8 h-8 text-audacia-gold/30" />
                    </div>
                    <p className="text-white/40 font-serif text-lg mb-1">Sacola vazia</p>
                    <p className="text-white/25 text-sm">Explore o catálogo e adicione peças!</p>
                  </motion.div>
                ) : (
                  items.map((item) => {
                    const price = new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(item.produto.preco * item.quantity);

                    return (
                      <motion.div
                        key={item.produto.id}
                        layout
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 hover:border-audacia-gold/20 transition-colors group"
                      >
                        {/* Thumbnail */}
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden flex-shrink-0">
                          <Image
                            src={item.produto.imagem_url}
                            alt={item.produto.nome}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-serif text-sm text-white truncate">{item.produto.nome}</h4>
                          {item.produto.categoria && (
                            <span className="text-audacia-gold/50 text-[10px] tracking-wider uppercase">{item.produto.categoria}</span>
                          )}
                          <p className="text-audacia-gold font-semibold text-sm mt-0.5">{price}</p>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.produto.id)}
                          className="p-2 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          aria-label={`Remover ${item.produto.nome}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Footer — Total + CTA */}
            {items.length > 0 && (
              <div className="border-t border-audacia-gold/15 px-6 py-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-white/60 text-sm">Total do Pedido</span>
                  <span className="text-audacia-gold font-serif text-xl font-bold">{formattedTotal}</span>
                </div>

                <button
                  onClick={handleSendOrder}
                  className="w-full flex items-center justify-center gap-2.5 py-4 rounded-xl bg-gold-gradient text-audacia-rose-dark font-bold text-sm tracking-wider transition-all duration-300 shadow-gold-glow hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] btn-shimmer"
                >
                  <Send className="w-4 h-4" />
                  Enviar Pedido via WhatsApp
                </button>

                <button
                  onClick={clearCart}
                  className="w-full text-center text-white/30 text-xs hover:text-red-400 transition-colors py-1"
                >
                  Limpar Sacola
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
