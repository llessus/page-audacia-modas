import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProdutoById, getSiteConfig } from '@/lib/db';
import { SiteConfigProvider } from '@/context/SiteConfigContext';
import { ProductPageClient } from './ProductPageClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const [produto, siteConfig] = await Promise.all([getProdutoById(id), getSiteConfig()]);

  if (!produto) {
    return {
      title: 'Produto não encontrado | ' + siteConfig.nomeLoja,
    };
  }

  const formattedPrice = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(produto.preco);

  const title = `${produto.nome} — ${formattedPrice} | ${siteConfig.nomeLoja}`;
  const description = produto.descricao
    ? `${produto.descricao.slice(0, 140)} — ${siteConfig.nomeLoja}`
    : `${produto.nome} por ${formattedPrice}. Moda feminina premium com atendimento personalizado. ${siteConfig.nomeLoja}`;

  return {
    title,
    description,
    openGraph: {
      type: 'website',
      title,
      description,
      images: [produto.imagem_url],
      locale: 'pt_BR',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [produto.imagem_url],
    },
  };
}

export default async function ProdutoPage({ params }: PageProps) {
  const { id } = await params;
  const [produto, config] = await Promise.all([getProdutoById(id), getSiteConfig()]);

  if (!produto) {
    notFound();
  }

  return (
    <SiteConfigProvider config={config}>
      <ProductPageClient produto={produto} />
    </SiteConfigProvider>
  );
}
