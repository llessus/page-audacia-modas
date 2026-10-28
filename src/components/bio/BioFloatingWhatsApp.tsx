'use client';

import { motion } from 'framer-motion';
import { WhatsAppIcon } from './WhatsAppIcon';

interface BioFloatingWhatsAppProps {
  href: string;
}

export function BioFloatingWhatsApp({ href }: BioFloatingWhatsAppProps) {
  return (
    <div className="fixed bottom-4 inset-x-0 z-50 px-4 pointer-events-none flex justify-center">
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar com vendedora no WhatsApp agora"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        className="pointer-events-auto inline-flex items-center justify-center gap-2.5 min-h-[48px] px-5 py-3 rounded-full bg-[#1fa855] hover:bg-[#1b944b] text-white font-bold text-xs sm:text-sm tracking-wide shadow-[0_10px_30px_rgba(31,168,85,0.45)] border border-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
        </span>
        <WhatsAppIcon className="w-4 h-4 shrink-0" />
        <span>Chamar vendedora no WhatsApp</span>
      </motion.a>
    </div>
  );
}

