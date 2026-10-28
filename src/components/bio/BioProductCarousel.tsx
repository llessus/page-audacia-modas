'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Flame } from 'lucide-react';
import type { Produto } from '@/types/produto';
import { formatBRL } from '@/lib/format';

// Placeholder blur em tom rosé/dourado suave (base64 SVG leve)
const BLUR_DATA_URL =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iIzVhNDI1MCIvPjwvc3ZnPg==';

interface BioProductCarouselProps {
  produtos: Produto[];
}

export function BioProductCarousel({ produtos }: BioProductCarouselProps) {
  if (!produtos || produtos.length === 0) return null;

  // Prioriza peças marcadas como destaque e pega até 6 para o carrossel
  const vitrine = [...produtos]
    .sort((a, b) => Number(b.destaque) - Number(a.destaque))
    .slice(0, 6);

  return (
    <section aria-label="Peças em destaque" className="w-full">
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="font-serif text-lg text-white leading-tight">
            Destaques da Vitrine
          </h2>
          <p className="text-[11px] text-white/60">
            Toque na peça para ver detalhes e tamanhos
          </p>
        </div>
        <Link
          href="/catalogo#catalogo"
          className="inline-flex items-center gap-1 text-xs font-semibold text-audacia-gold-light hover:underline min-h-[44px] px-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-audacia-gold rounded-lg"
        >
          <span>Ver tudo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Carrossel horizontal com scroll-snap */}
      <div className="flex gap-3.5 overflow-x-auto snap-x snap-mandatory pb-2 -mx-1 px-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {vitrine.map((produto) => {
          const ultimasPecas = produto.quantidade > 0 && produto.quantidade <= 2;

          return (
            <motion.div
              key={produto.id}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="snap-start shrink-0 w-[156px] sm:w-[172px]"
            >
              <Link
                href={`/produto/${produto.id}`}
                className="group block rounded-2xl glassmorphism hover:glassmorphism-gold p-2 border border-white/15 hover:border-audacia-gold/40 transition-all h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-audacia-gold"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-2.5 bg-audacia-rose-dark">
                  <Image
                    src={produto.imagem_url}
                    alt={produto.nome}
                    fill
                    sizes="172px"
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {ultimasPecas ? (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/90 text-white text-[9px] font-bold uppercase tracking-wider">
                      <Flame className="w-2.5 h-2.5" />
                      Últimas
                    </span>
                  ) : produto.destaque ? (
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-audacia-gold text-[#24151e] text-[9px] font-bold uppercase tracking-wider">
                      <Star className="w-2.5 h-2.5 fill-current" />
                      Destaque
                    </span>
                  ) : null}
                </div>

                <div className="px-1">
                  <h3 className="font-serif text-xs sm:text-sm text-white truncate group-hover:text-audacia-gold-light transition-colors">
                    {produto.nome}
                  </h3>
                  <p className="text-audacia-gold-light font-bold text-xs sm:text-sm mt-0.5">
                    {formatBRL(produto.preco)}
                  </p>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

