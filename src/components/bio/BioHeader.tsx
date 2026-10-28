'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Share2, Check, MapPin } from 'lucide-react';
import type { SiteConfig } from '@/config/siteConfig';

interface BioHeaderProps {
  config: SiteConfig;
}

export function BioHeader({ config }: BioHeaderProps) {
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: config.nomeLoja,
          text: `${config.nomeLoja} — ${config.hero.tituloParte2} ${config.hero.tituloParte3}`,
          url,
        });
        return;
      } catch {
        // fallback para copiar link
      }
    }
    if (url && navigator.clipboard) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  }

  return (
    <header className="w-full flex flex-col items-center text-center relative pt-2">
      {/* Botão Compartilhar no canto superior direito (min 44x44px) */}
      <div className="w-full flex items-center justify-between mb-4">
        <a
          href={config.linkEndereco}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Localização: ${config.enderecoCompleto}`}
          className="inline-flex items-center gap-1.5 min-h-[44px] px-3.5 py-2 rounded-full glassmorphism text-xs text-white/80 hover:text-audacia-gold hover:border-audacia-gold/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-audacia-gold"
        >
          <MapPin className="w-3.5 h-3.5 text-audacia-gold shrink-0" />
          <span className="truncate max-w-[200px]">{config.enderecoCompleto}</span>
        </a>

        <button
          type="button"
          onClick={handleShare}
          aria-label="Compartilhar página da Audácia Modas"
          className="inline-flex items-center justify-center gap-1.5 min-w-[44px] min-h-[44px] px-3.5 py-2 rounded-full glassmorphism text-xs text-white/80 hover:text-audacia-gold hover:border-audacia-gold/40 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-audacia-gold"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300 text-[11px] font-medium">Copiado!</span>
            </>
          ) : (
            <Share2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Logo circular maior com glow dourado e anel animado */}
      <div className="relative mb-5">
        <motion.div
          aria-hidden="true"
          className="absolute -inset-2 rounded-full bg-gold-gradient opacity-50 blur-lg"
          animate={{ scale: [1, 1.06, 1], opacity: [0.45, 0.7, 0.45] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="relative w-32 h-32 rounded-full p-[3px] bg-gold-gradient shadow-[0_0_30px_rgba(212,175,55,0.35)]">
          <div className="w-full h-full rounded-full bg-audacia-rose-dark flex items-center justify-center overflow-hidden p-2.5">
            <Image
              src="/images/logo.png"
              alt={`Logo ${config.nomeLoja}`}
              width={120}
              height={120}
              priority
              className="object-contain w-full h-full rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Nome / @arroba e Slogan com mais respiro */}
      <h1 className="font-serif text-2xl sm:text-3xl text-white tracking-wide mb-1.5">
        {config.arrobaInstagram}
      </h1>
      <p className="text-sm sm:text-base text-white/80 font-light max-w-xs leading-relaxed">
        {config.hero.tituloParte2}{' '}
        <span className="text-gold-gradient font-medium">{config.hero.tituloParte3}</span>
      </p>
    </header>
  );
}

