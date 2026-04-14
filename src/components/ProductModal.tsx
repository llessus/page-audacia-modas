'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ShoppingBag } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import type { Produto } from '@/types/produto';

interface ProductModalProps {
  produto: Produto | null;
  onClose: () => void;
}

export function ProductModal({ produto, onClose }: ProductModalProps) {
  // Fechar com ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (produto) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [produto, handleKeyDown]);

  if (!produto) return null;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(produto.preco);

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappDDIeDDD}?text=${encodeURIComponent(
    `Olá! Vi o catálogo e tenho interesse no *${produto.nome}* (${formattedPrice})`
  )}`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Detalhes de ${produto.nome}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Modal Card */}
      <div
        className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-[2rem] bg-audacia-rose-dark/80 backdrop-blur-2xl border border-audacia-gold/25 shadow-[0_0_60px_rgba(212,175,55,0.15)] animate-in zoom-in-95 fade-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/80 hover:text-white hover:bg-black/60 transition-all duration-200"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[2rem]">
          <Image
            src={produto.imagem_url}
            alt={produto.nome}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover"
            priority
          />
          {/* Gradient fade at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-audacia-rose-dark/90 to-transparent pointer-events-none" />
        </div>

        {/* Content */}
        <div className="px-6 pb-6 -mt-8 relative z-10">
          {/* Categoria badge */}
          {produto.categoria && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider bg-audacia-gold/15 border border-audacia-gold/30 text-audacia-gold mb-3">
              {produto.categoria}
            </span>
          )}

          <h3 className="font-serif text-2xl md:text-3xl text-white leading-tight mb-2">
            {produto.nome}
          </h3>

          <p className="text-audacia-gold font-semibold text-xl mb-4">
            {formattedPrice}
          </p>

          {/* Descrição */}
          {produto.descricao && (
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                {produto.descricao}
              </p>
            </div>
          )}

          {/* CTA WhatsApp */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl bg-gold-gradient text-audacia-rose-dark font-bold text-sm tracking-wider transition-all duration-300 shadow-gold-glow hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] btn-shimmer"
          >
            <ShoppingBag className="w-4 h-4" />
            Pedir via WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
