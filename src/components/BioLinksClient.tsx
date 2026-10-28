'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ShoppingBag, MapPin, Instagram, Sparkles } from 'lucide-react';
import type { SiteConfig } from '@/config/siteConfig';
import type { Produto } from '@/types/produto';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import { BIO_CONFIG } from './bio/bioConfig';
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
}

export function BioLinksClient({ config, produtos }: BioLinksClientProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: prefersReducedMotion
        ? { duration: 0.1 }
        : { staggerChildren: 0.06, delayChildren: 0.02 },
    },
  };

  const itemVariants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' as const },
    },
  };

  const whatsappHref = buildWhatsAppLink(
    config,
    `Olá! Vim pelo link do Instagram da *${config.nomeLoja}* e gostaria de atendimento personalizado ✨`
  );

  const totalDisponiveis = produtos.length;
  const catalogoEmBreve = BIO_CONFIG.catalogoEmBreve;

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden bg-gradient-to-br from-[#2b1825] via-audacia-rose-dark to-[#462f3d] flex flex-col justify-between py-6 sm:py-10 px-3.5 sm:px-6 pb-24">
      {/* Background leve em CSS puro (sem imagem pesada/blur-2xl travando o celular) */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 overflow-hidden z-0 bg-[radial-gradient(circle_at_20%_15%,rgba(212,175,55,0.14),transparent_45%),radial-gradient(circle_at_80%_80%,rgba(163,134,146,0.18),transparent_50%)]"
      />

      {/* Card container central (max-w-480px com moldura sutil no desktop) */}
      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-[480px] mx-auto flex flex-col gap-5 sm:rounded-[2.25rem] sm:bg-white/[0.03] sm:backdrop-blur-md sm:border sm:border-audacia-gold/20 sm:p-7 sm:shadow-[0_25px_80px_rgba(0,0,0,0.45)]"
      >
        {/* 1. Header */}
        <motion.div variants={itemVariants}>
          <BioHeader config={config} />
        </motion.div>

        {/* 2. Card de Campanha / Novidade + Selo Aberto/Fechado */}
        <motion.div variants={itemVariants}>
          <BioHighlightCard whatsappHref={whatsappHref} />
        </motion.div>

        {/* 3. Carrossel de Novidades (aparece quando o catálogo não está em breve e tem produtos) */}
        {!catalogoEmBreve && produtos.length > 0 && (
          <motion.div variants={itemVariants}>
            <BioProductCarousel produtos={produtos} />
          </motion.div>
        )}

        {/* 4. Lista de Botões de Ação */}
        <motion.nav aria-label="Links principais da loja" variants={itemVariants} className="space-y-3">
          {/* WhatsApp da Loja em destaque dourado enquanto o catálogo está em breve */}
          <BioLinkButton
            href={whatsappHref}
            external
            variant={catalogoEmBreve ? 'primary' : 'secondary'}
            title="Atendimento no WhatsApp"
            subtitle="Tire dúvidas de tamanhos e peça fotos dos looks"
            icon={<WhatsAppIcon className="w-5 h-5" />}
          />

          {/* Localização da Loja */}
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

          {/* Catálogo Online (desabilitado/cinza com "EM BREVE" enquanto catalogoEmBreve = true) */}
          <BioLinkButton
            href="/catalogo"
            variant={catalogoEmBreve ? 'secondary' : 'primary'}
            disabled={catalogoEmBreve}
            badgeText={catalogoEmBreve ? 'Em breve' : undefined}
            title="Catálogo Online"
            subtitle={
              catalogoEmBreve
                ? 'Estamos preparando as peças • Atendimento via WhatsApp'
                : totalDisponiveis > 0
                  ? `${totalDisponiveis} ${totalDisponiveis === 1 ? 'peça disponível' : 'peças disponíveis'} • Comprar agora`
                  : 'Veja todas as peças e preços'
            }
            icon={<ShoppingBag className="w-5 h-5" />}
          />
        </motion.nav>

        {/* 5. Prova Social */}
        <motion.div variants={itemVariants}>
          <BioSocialProof />
        </motion.div>

        {/* Rodapé autoral */}
        <motion.footer variants={itemVariants} className="pt-1 text-center">
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] text-white/60">
            <Sparkles className="w-3 h-3 text-audacia-gold" />
            <span>
              © {new Date().getFullYear()} {config.nomeLoja}
            </span>
          </span>
        </motion.footer>
      </motion.main>

      {/* 6. Botão flutuante fixo de WhatsApp no rodapé */}
      <BioFloatingWhatsApp href={whatsappHref} />
    </div>
  );
}
