'use client';

import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import Image from 'next/image';
import type { Produto } from '@/types/produto';

interface InstagramSectionProps {
  produtos: Produto[];
}

export function InstagramSection({ produtos }: InstagramSectionProps) {
  // Pega até 6 fotos dos produtos para montar o "feed"
  const fotos = produtos
    .filter(p => p.status === 'disponivel' && p.imagem_url)
    .slice(0, 6);

  if (fotos.length < 3) return null; // Não mostra se tiver poucos produtos

  return (
    <section className="py-20 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Instagram className="w-4 h-4 text-audacia-gold" />
            <span className="text-white/60 text-sm tracking-wide">{siteConfig.arrobaInstagram}</span>
          </motion.div>
          
          <h2 className="text-3xl md:text-4xl font-serif text-white mb-4">
            Siga nosso <span className="text-gold-gradient">Estilo</span>
          </h2>
          <p className="text-white/50 text-sm max-w-md mx-auto">
            Acompanhe as novidades, looks do dia e tendências no nosso Instagram
          </p>
        </motion.div>

        {/* Grid de fotos estilo Instagram */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {fotos.map((foto, index) => (
            <motion.a
              key={foto.id}
              href={siteConfig.linkInstagram}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square rounded-2xl overflow-hidden group"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
            >
              <Image
                src={foto.imagem_url}
                alt={foto.nome}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transform translate-y-3 group-hover:translate-y-0 transition-all duration-300">
                  <Instagram className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              {/* Subtle gradient */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
            </motion.a>
          ))}
        </motion.div>

        {/* CTA Button */}
        <motion.div
          className="text-center mt-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <motion.a
            href={siteConfig.linkInstagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full border border-audacia-gold/30 text-audacia-gold hover:bg-audacia-gold hover:text-audacia-rose-dark transition-all duration-300 font-medium text-sm tracking-wide group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Instagram className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            Seguir no Instagram
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
