import type { Metadata } from 'next';
import { getSiteConfig, getProdutosDisponiveis } from '@/lib/db';
import { BIO_CONFIG } from '@/components/bio/bioConfig';
import { BioLinksClient } from '@/components/BioLinksClient';

// Cache ISR de 60s na CDN da Vercel (abre instantaneamente no celular!)
// Quando você edita algo no Admin, o revalidatePath('/') atualiza na mesma hora.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const config = await getSiteConfig();

  const title = `${config.nomeLoja} | ${config.hero.tituloParte2} ${config.hero.tituloParte3}`;
  const description = `${config.nomeLoja} em ${config.enderecoCompleto} — Fale com nossa vendedora no WhatsApp, visite nossa loja física ou confira nosso catálogo.`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      locale: 'pt_BR',
      images: ['/images/og-share.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/images/og-share.png'],
    },
  };
}

export default async function HomePage() {
  const [config, produtos] = await Promise.all([
    getSiteConfig(),
    BIO_CONFIG.catalogoEmBreve ? Promise.resolve([]) : getProdutosDisponiveis().catch(() => []),
  ]);

  return <BioLinksClient config={config} produtos={produtos} />;
}
