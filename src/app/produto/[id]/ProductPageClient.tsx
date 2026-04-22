'use client';

import Image from 'next/image';
import { ShoppingBag, MessageCircle, ArrowLeft, Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { siteConfig } from '@/config/siteConfig';
import type { Produto } from '@/types/produto';
import { CORES_DISPONIVEIS } from '@/types/produto';

interface ProductPageClientProps {
  produto: Produto;
}

export function ProductPageClient({ produto }: ProductPageClientProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const allImages = [produto.imagem_url, ...(produto.imagens_extras || [])];
  const isEsgotado = produto.status === 'esgotado';
  const isUltimasPecas = !isEsgotado && produto.quantidade > 0 && produto.quantidade <= 2;

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(produto.preco);

  const whatsappUrl = `https://wa.me/${siteConfig.whatsappDDIeDDD}?text=${encodeURIComponent(
    `Olá! Vi o catálogo e tenho interesse no *${produto.nome}* (${formattedPrice})`
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3a2433] via-audacia-rose-dark to-audacia-rose flex flex-col">
      {/* Top bar */}
      <header className="px-4 md:px-8 py-4 flex items-center gap-4">
        <a
          href="/"
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao Catálogo
        </a>
      </header>

      {/* Product content */}
      <div className="flex-1 container mx-auto px-4 md:px-8 py-8">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-start">
          {/* Image */}
          <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-audacia-gold/20 shadow-gold-glow">
            <Image
              src={allImages[currentImageIndex]}
              alt={produto.nome}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />

            {/* Navigation */}
            {allImages.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev - 1)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-md text-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                )}
                {currentImageIndex < allImages.length - 1 && (
                  <button
                    onClick={() => setCurrentImageIndex(prev => prev + 1)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 backdrop-blur-md text-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}
                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {allImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`h-2 rounded-full transition-all ${
                        i === currentImageIndex ? 'w-6 bg-audacia-gold' : 'w-2 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}

            {isEsgotado && (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <span className="px-6 py-2 rounded-full bg-red-500/80 text-white font-black tracking-[0.2em] uppercase">
                  Esgotado
                </span>
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-audacia-rose-dark/60 to-transparent pointer-events-none" />
          </div>

          {/* Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {produto.categoria && (
                <span className="px-3 py-1 rounded-full text-xs font-semibold tracking-wider bg-audacia-gold/15 border border-audacia-gold/30 text-audacia-gold">
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

            <h1 className="font-serif text-3xl md:text-4xl text-white leading-tight">
              {produto.nome}
            </h1>

            <p className="text-audacia-gold font-serif text-2xl font-bold">
              {formattedPrice}
            </p>

            {/* Tamanhos */}
            {produto.tamanhos && produto.tamanhos.length > 0 && (
              <div>
                <p className="text-white/40 text-xs tracking-wider uppercase mb-2">Tamanhos</p>
                <div className="flex flex-wrap gap-2">
                  {produto.tamanhos.map(t => (
                    <span key={t} className="px-4 py-2 rounded-xl text-sm font-bold bg-white/5 border border-white/10 text-white/70">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cores */}
            {produto.cores && produto.cores.length > 0 && (
              <div>
                <p className="text-white/40 text-xs tracking-wider uppercase mb-2">Cores</p>
                <div className="flex flex-wrap gap-2">
                  {produto.cores.map(c => {
                    const corInfo = CORES_DISPONIVEIS.find(cd => cd.nome === c);
                    return (
                      <div key={c} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10">
                        <span
                          className="w-4 h-4 rounded-full border border-white/20"
                          style={{ backgroundColor: corInfo?.hex || '#888' }}
                        />
                        <span className="text-white/60 text-sm">{c}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Descrição */}
            {produto.descricao && (
              <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-white/70 text-sm leading-relaxed whitespace-pre-line">
                  {produto.descricao}
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-3 pt-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`w-full flex items-center justify-center gap-2.5 py-4 rounded-xl font-bold tracking-wider transition-all duration-300 btn-shimmer ${
                  isEsgotado
                    ? 'bg-white/10 text-white/30 pointer-events-none'
                    : 'bg-gold-gradient text-audacia-rose-dark shadow-gold-glow hover:shadow-[0_0_30px_rgba(212,175,55,0.5)]'
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                {isEsgotado ? 'Produto Esgotado' : 'Pedir via WhatsApp'}
              </a>

              <a
                href="/#catalogo"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-audacia-gold/30 transition-all text-sm tracking-wider font-medium"
              >
                <ShoppingBag className="w-4 h-4" />
                Ver todo o catálogo
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mini footer */}
      <footer className="text-center py-6 text-white/20 text-xs tracking-wider">
        © {new Date().getFullYear()} {siteConfig.nomeLoja}
      </footer>
    </div>
  );
}
