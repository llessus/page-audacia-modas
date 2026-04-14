'use client';

import { motion } from 'framer-motion';

// Separadores em onda SVG para dividir seções com suavidade
export function WaveDividerDown() {
  return (
    <div className="relative w-full overflow-hidden leading-[0] -mb-1">
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: '60px' }}
      >
        <path
          d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z"
          fill="rgba(212,175,55,0.07)"
        />
        <path
          d="M0,55 C400,10 1040,70 1440,55 L1440,80 L0,80 Z"
          fill="rgba(90,66,80,0.4)"
        />
      </svg>
    </div>
  );
}

export function WaveDividerUp() {
  return (
    <div className="relative w-full overflow-hidden leading-[0] -mt-1">
      <svg
        viewBox="0 0 1440 80"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        preserveAspectRatio="none"
        style={{ height: '60px' }}
      >
        <path
          d="M0,40 C360,0 1080,80 1440,40 L1440,0 L0,0 Z"
          fill="rgba(212,175,55,0.07)"
        />
        <path
          d="M0,25 C400,70 1040,10 1440,25 L1440,0 L0,0 Z"
          fill="rgba(90,66,80,0.4)"
        />
      </svg>
    </div>
  );
}

// Faixa de credibilidade / trust badges
const trustItems = [
  { icon: '✦', text: 'Atendimento Personalizado' },
  { icon: '✦', text: 'Qualidade Premium' },
  { icon: '✦', text: 'Entrega Disponível' },
  { icon: '✦', text: 'Pagamento Facilitado' },
];

export function TrustStrip() {
  return (
    <motion.div
      className="relative z-10 bg-audacia-rose-dark/60 backdrop-blur-sm border-y border-audacia-gold/20 py-4 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.8, duration: 0.6 }}
    >
      {/* Linha dourada decorativa */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-audacia-gold/50 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-audacia-gold/50 to-transparent" />

      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-2">
          {trustItems.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 text-white/80 text-sm font-light tracking-wider"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
            >
              <span className="text-audacia-gold text-xs">{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
