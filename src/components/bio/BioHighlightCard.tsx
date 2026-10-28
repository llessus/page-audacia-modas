'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowUpRight } from 'lucide-react';
import { BIO_CONFIG, getStoreOpenStatus } from './bioConfig';

interface BioHighlightCardProps {
  whatsappHref?: string;
}

export function BioHighlightCard({ whatsappHref }: BioHighlightCardProps) {
  const [status, setStatus] = useState<{ isOpen: boolean; label: string }>({
    isOpen: true,
    label: 'Atendimento Online',
  });

  useEffect(() => {
    setStatus(getStoreOpenStatus());
  }, []);

  const { campanha, catalogoEmBreve } = BIO_CONFIG;

  return (
    <div className="w-full glassmorphism-gold rounded-3xl p-5 sm:p-6 relative overflow-hidden border border-audacia-gold/30">
      {/* Linha superior: Badge de campanha + Status Aberto/Fechado */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-audacia-gold/20 border border-audacia-gold/40 text-audacia-gold-light text-[11px] font-bold uppercase tracking-wider">
          <Sparkles className="w-3 h-3" />
          {campanha.badge}
        </span>

        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border ${
            status.isOpen
              ? 'bg-emerald-500/15 border-emerald-400/35 text-emerald-300'
              : 'bg-white/5 border-white/15 text-white/70'
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              status.isOpen ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
          />
          {status.label}
        </span>
      </div>

      {/* Título e subtítulo da novidade */}
      <h2 className="font-serif text-xl sm:text-2xl text-white leading-snug mb-1.5">
        {campanha.titulo}
      </h2>
      <p className="text-xs sm:text-sm text-white/80 font-light leading-relaxed mb-4">
        {campanha.subtitulo}
      </p>

      {catalogoEmBreve && whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-audacia-gold-light hover:text-white transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-audacia-gold rounded-lg"
        >
          <span>Pedir fotos pelo WhatsApp</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      ) : (
        <Link
          href={campanha.ctaHref}
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-audacia-gold-light hover:text-white transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-audacia-gold rounded-lg"
        >
          <span>{campanha.ctaTexto}</span>
          <ArrowUpRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
