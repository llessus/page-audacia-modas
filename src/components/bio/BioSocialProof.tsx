'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Star, Heart } from 'lucide-react';
import { BIO_CONFIG } from './bioConfig';

export function BioSocialProof() {
  const { depoimentos, notaMedia, clientesAtendidas } = BIO_CONFIG.provaSocial;
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (depoimentos.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % depoimentos.length);
    }, 4800);
    return () => clearInterval(timer);
  }, [depoimentos.length]);

  const atual = depoimentos[index];

  return (
    <section
      aria-label="Avaliações de clientes"
      className="w-full rounded-2xl glassmorphism p-4 border border-white/15"
    >
      {/* Topo: Estrelas + Contador de clientes */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 pb-2.5 border-b border-white/10">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-0.5" aria-label={`Nota ${notaMedia} de 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs font-bold text-white">{notaMedia}</span>
        </div>

        <span className="inline-flex items-center gap-1 text-[11px] text-white/75">
          <Heart className="w-3 h-3 text-audacia-gold fill-audacia-gold" />
          {clientesAtendidas}
        </span>
      </div>

      {/* Carrossel automático de depoimentos */}
      <div className="min-h-[60px] flex flex-col justify-center">
        <AnimatePresence mode="wait">
          <motion.blockquote
            key={atual.nome}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.28 }}
            className="text-xs text-white/85 italic leading-relaxed"
          >
            “{atual.texto}”
            <footer className="mt-1 not-italic font-semibold text-[11px] text-audacia-gold-light">
              — {atual.nome}
            </footer>
          </motion.blockquote>
        </AnimatePresence>
      </div>

      {/* Indicadores */}
      <div className="flex items-center justify-center gap-1.5 mt-2">
        {depoimentos.map((d, i) => (
          <button
            key={d.nome}
            type="button"
            onClick={() => setIndex(i)}
            aria-label={`Ver avaliação de ${d.nome}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? 'w-5 bg-audacia-gold' : 'w-1.5 bg-white/25'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

