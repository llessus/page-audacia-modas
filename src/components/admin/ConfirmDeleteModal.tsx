'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

interface ConfirmDeleteModalProps {
  open: boolean;
  nome: string;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDeleteModal({ open, nome, isLoading, onConfirm, onCancel }: ConfirmDeleteModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onCancel();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, isLoading, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="alertdialog"
          aria-modal="true"
          aria-label={`Excluir ${nome}`}
          onClick={() => !isLoading && onCancel()}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <motion.div
            className="relative z-10 w-full max-w-sm rounded-[2rem] bg-audacia-rose-dark/95 backdrop-blur-2xl border border-red-400/30 p-6 text-center shadow-[0_0_60px_rgba(239,68,68,0.15)]"
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 border border-red-400/30">
              <AlertTriangle className="h-6 w-6 text-red-400" />
            </div>
            <h3 className="font-serif text-xl text-white mb-2">Excluir peça?</h3>
            <p className="text-sm text-white/60 mb-6">
              <span className="text-audacia-gold font-medium">{nome}</span> e todas as suas fotos serão
              removidas definitivamente. Esta ação não pode ser desfeita.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onCancel}
                disabled={isLoading}
                autoFocus
                className="min-h-[44px] rounded-xl border border-white/10 bg-white/5 text-sm text-white/70 hover:bg-white/10 transition-all disabled:opacity-40"
              >
                Cancelar
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className="min-h-[44px] rounded-xl bg-red-500/80 hover:bg-red-500 text-sm font-bold text-white transition-all disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Excluir
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

