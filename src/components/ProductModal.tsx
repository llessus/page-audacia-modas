'use client';

import { useEffect, useCallback, useState } from 'react';
import Image from 'next/image';
import { X, ShoppingBag, ChevronLeft, ChevronRight, MessageCircle, Flame, Check } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { useCart } from '@/context/CartContext';
import type { Produto } from '@/types/produto';
import { CORES_DISPONIVEIS } from '@/types/produto';

interface ProductModalProps {
  produto: Produto | null;
  onClose: () => void;
}

export function ProductModal({ produto, onClose }: ProductModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { addItem, justAdded } = useCart();

  // Todas as imagens: principal + extras
  const allImages = produto
    ? [produto.imagem_url, ...(produto.imagens_extras || [])]
    : [];

  // Reset image index quando muda o produto
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [produto?.id]);

  // Fechar com ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && currentImageIndex > 0) {
        setCurrentImageIndex(prev => prev - 1);
      }
      if (e.key === 'ArrowRight' && currentImageIndex < allImages.length - 1) {
        setCurrentImageIndex(prev => prev + 1);
      }
    },
    [onClose, currentImageIndex, allImages.length]
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

  const isEsgotado = produto.status === 'esgotado';
  const isUltimasPecas = !isEsgotado && produto.quantidade > 0 && produto.quantidade <= 2;
  const isAdded = justAdded === produto.id;

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

        {/* Image Carousel */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-[2rem]">
          <Image
            src={allImages[currentImageIndex] || produto.imagem_url}
            alt={produto.nome}
            fill
            sizes="(max-width: 768px) 100vw, 500px"
            className="object-cover transition-opacity duration-300"
            priority
          />

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev - 1); }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              {currentImageIndex < allImages.length - 1 && (
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(prev => prev + 1); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </>
          )}

          {/* Image dots indicator */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === currentImageIndex
                      ? 'w-6 bg-audacia-gold'
                      : 'w-2 bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Gradient fade at bottom */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-audacia-rose-dark/90 to-transparent pointer-events-none" />

          {/* Thumbnails row */}
          {allImages.length > 1 && (
            <div className="absolute bottom-12 left-4 right-4 flex items-center gap-2 justify-center">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                  className={`relative w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                    i === currentImageIndex
                      ? 'border-audacia-gold shadow-gold-glow'
                      : 'border-white/20 hover:border-white/40 opacity-70'
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Foto ${i + 1}`}
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-6 pb-6 -mt-8 relative z-10">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            {produto.categoria && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wider bg-audacia-gold/15 border border-audacia-gold/30 text-audacia-gold">
                {produto.categoria}
              </span>
            )}
            {isUltimasPecas && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold tracking-wider bg-orange-500/15 border border-orange-500/30 text-orange-400">
                <Flame className="w-3 h-3" />
                {produto.quantidade === 1 ? 'Última unidade!' : `Restam ${produto.quantidade}`}
              </span>
            )}
          </div>

          <h3 className="font-serif text-2xl md:text-3xl text-white leading-tight mb-2">
            {produto.nome}
          </h3>

          <p className="text-audacia-gold font-semibold text-xl mb-4">
            {formattedPrice}
          </p>

          {/* Tamanhos disponíveis */}
          {produto.tamanhos && produto.tamanhos.length > 0 && (
            <div className="mb-4">
              <p className="text-white/40 text-xs tracking-wider uppercase mb-2">Tamanhos disponíveis</p>
              <div className="flex flex-wrap gap-2">
                {produto.tamanhos.map(t => (
                  <span key={t} className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wider bg-white/5 border border-white/10 text-white/70">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Cores disponíveis */}
          {produto.cores && produto.cores.length > 0 && (
            <div className="mb-4">
              <p className="text-white/40 text-xs tracking-wider uppercase mb-2">Cores disponíveis</p>
              <div className="flex flex-wrap gap-2">
                {produto.cores.map(c => {
                  const corInfo = CORES_DISPONIVEIS.find(cd => cd.nome === c);
                  return (
                    <div key={c} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10">
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                        style={{ backgroundColor: corInfo?.hex || '#888' }}
                      />
                      <span className="text-white/60 text-xs">{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Descrição */}
          {produto.descricao && (
            <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                {produto.descricao}
              </p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="space-y-3">
            {/* Adicionar à Sacola (principal) */}
            <button
              onClick={() => !isEsgotado && addItem(produto)}
              disabled={isEsgotado}
              className={`w-full flex items-center justify-center gap-2.5 py-3.5 rounded-xl font-bold text-sm tracking-wider transition-all duration-300 btn-shimmer ${
                isEsgotado
                  ? 'bg-white/10 text-white/30 cursor-not-allowed'
                  : isAdded
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-gold-gradient text-audacia-rose-dark shadow-gold-glow hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]'
              }`}
            >
              {isEsgotado ? (
                'Produto Esgotado'
              ) : isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  Adicionado à Sacola!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  Adicionar à Sacola
                </>
              )}
            </button>

            {/* Comprar direto via WhatsApp (secundário) */}
            {!isEsgotado && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-audacia-gold/30 transition-all text-xs tracking-wider font-medium"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Ou pedir direto via WhatsApp
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
