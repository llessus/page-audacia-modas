'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ShoppingBag, MapPin, Instagram, Sparkles } from 'lucide-react';
import type { SiteConfig } from '@/config/siteConfig';
import type { Produto } from '@/types/produto';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { BioHeader } from './bio/BioHeader';
import { BioHighlightCard } from './bio/BioHighlightCard';
import { BioProductCarousel } from './bio/BioProductCarousel';
import { BioLinkButton } from './bio/BioLinkButton';
import { BioSocialProof } from './bio/BioSocialProof';
import { BioFloatingWhatsApp } from './bio/BioFloatingWhatsApp';
import { WhatsAppIcon } from './bio/WhatsAppIcon';

interface BioLinksClientProps {
  config: SiteConfig;
  produtos: Produto[];
  heroImage: string;
}

export function BioLinksClient({ config, produtos, heroImage }: BioLinksClientProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0.1 }
        : { staggerChildren: 0.08, delayChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: 'easeOut' as const },
    },
  };

  const whatsappHref = buildWhatsAppLink(
    config,
    `Olá! Vim pelo link do Instagram da *${config.nomeLoja}* e gostaria de atendimento personalizado ✨`
  );

  const totalDisponiveis = produtos.length;

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-[#2b1825] via-audacia-rose-dark to-[#462f3d] flex flex-col justify-between py-6 sm:py-10 px-3.5 sm:px-6 pb-24">
      {/* Background: imagem da coleção desfocada e escurecida + luzes douradas (preenche o desktop com elegância) */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <Image
          src={heroImage || '/images/hero.png'}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-[0.14] blur-2xl scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2b1825]/85 via-audacia-rose-dark/90 to-[#2b1825]/95" />
        <div className="absolute -top-24 left-1/4 w-96 h-96 rounded-full bg-audacia-gold/15 blur-[130px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-audacia-rose-light/20 blur-[140px]" />
      </div>

      {/* Card container central (max-w-480px com moldura sutil no desktop) */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-[480px] mx-auto flex flex-col gap-6 sm:rounded-[2.25rem] sm:bg-white/[0.03] sm:backdrop-blur-xl sm:border sm:border-audacia-gold/20 sm:p-7 sm:shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
      >
        {/* 1. Header: Localização discreta + Compartilhar + Logo Circular Maior + @ e Slogan */}
        <motion.div variants={itemVariants}>
          <BioHeader config={config} />
        </motion.div>

        {/* 2. Card de Campanha / Novidade + Selo Aberto/Fechado */}
        <motion.div variants={itemVariants}>
          <BioHighlightCard />
        </motion.div>

        {/* 3. Carrossel de Novidades com Fotos Reais do Catálogo */}
        {produtos.length > 0 && (
          <motion.div variants={itemVariants}>
            <BioProductCarousel produtos={produtos} />
          </motion.div>
        )}

        {/* 4. Lista de Botões de Ação (foco em conversão) */}
        <motion.nav aria-label="Links principais da loja" variants={itemVariants} className="space-y-3">
          {/* Principal: Catálogo Online (dourado com contraste escuro corrigido) */}
          <BioLinkButton
            href="/catalogo"
            variant="primary"
            title="Catálogo Online Completo"
            subtitle={
              totalDisponiveis > 0
                ? `${totalDisponiveis} ${totalDisponiveis === 1 ? 'peça disponível' : 'peças disponíveis'} • Comprar agora`
                : 'Veja todas as peças e preços'
            }
            icon={<ShoppingBag className="w-5 h-5" />}
          />

          {/* WhatsApp da Loja (SVG real do WhatsApp) */}
          <BioLinkButton
            href={whatsappHref}
            external
            title="Atendimento no WhatsApp"
            subtitle="Tire dúvidas de tamanhos e reserve seu look"
            icon={<WhatsAppIcon className="w-5 h-5" />}
          />

          {/* Localização da Loja (MapPin com endereço integrado) */}
          <BioLinkButton
            href={config.linkEndereco}
            external
            title="Como Chegar na Loja Física"
            subtitle={`${config.enderecoCompleto} • Ver no Google Maps`}
            icon={<MapPin className="w-5 h-5" />}
          />

          {/* Instagram */}
          <BioLinkButton
            href={config.linkInstagram}
            external
            title="Siga nosso Instagram"
            subtitle={`${config.arrobaInstagram} • Provadores e novidades`}
            icon={<Instagram className="w-5 h-5" />}
          />
        </motion.nav>

        {/* 5. Prova Social (Nota 5.0 + Depoimentos reais em carrossel) */}
        <motion.div variants={itemVariants}>
          <BioSocialProof />
        </motion.div>

        {/* Rodapé autoral */}
        <motion.footer variants={itemVariants} className="pt-2 text-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/65 hover:text-audacia-gold-light hover:border-audacia-gold/30 transition-all min-h-[40px]"
          >
            <Sparkles className="w-3 h-3 text-audacia-gold" />
            <span>
              © {new Date().getFullYear()} {config.nomeLoja}
            </span>
          </Link>
        </motion.footer>
      </motion.main>

      {/* 6. Botão flutuante fixo de WhatsApp no rodapé */}
      <BioFloatingWhatsApp href={whatsappHref} />
    </div>
  );
}
