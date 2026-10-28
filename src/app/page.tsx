import type { Metadata } from 'next';
import { getSiteConfig, getProdutosDisponiveis, getHeroImage } from '@/lib/db';
import { BioLinksClient } from '@/components/BioLinksClient';

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
  const [config, heroImage] = await Promise.all([
    getSiteConfig(),
    getHeroImage().catch(() => '/images/og-share.png'),
  ]);

  const title = `${config.nomeLoja} | ${config.hero.tituloParte2} ${config.hero.tituloParte3}`;
  const description = `${config.nomeLoja} em ${config.enderecoCompleto} — Confira a nova coleção no Catálogo Online, fale com nossa vendedora no WhatsApp ou visite nossa loja física.`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      locale: 'pt_BR',
      images: [heroImage || '/images/og-share.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [heroImage || '/images/og-share.png'],
    },
  };
}

export default async function HomePage() {
  const [config, produtos, heroImage] = await Promise.all([
    getSiteConfig(),
    getProdutosDisponiveis().catch(() => []),
    getHeroImage().catch(() => '/images/hero.png'),
  ]);

  return (
    <BioLinksClient
      config={config}
      produtos={produtos}
      heroImage={heroImage}
    />
  );
}
