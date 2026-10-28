import type { Produto } from '@/types/produto';
import type { SiteConfig } from '@/config/siteConfig';
import { formatBRL } from '@/lib/format';

/** Mantém apenas dígitos do número (aceita "+55 (61) 99885-1403"). */
export function sanitizePhone(raw: string): string {
  return raw.replace(/\D/g, '');
}

export function buildWhatsAppLink(
  config: Pick<SiteConfig, 'whatsappDDIeDDD'>,
  message: string
): string {
  return `https://wa.me/${sanitizePhone(config.whatsappDDIeDDD)}?text=${encodeURIComponent(message)}`;
}

export interface BuyOptions {
  size?: string;
  color?: string;
}

/** Link de compra direta de uma peça, com preço, tamanho e cor quando informados. */
export function buildProductPurchaseLink(
  config: Pick<SiteConfig, 'whatsappDDIeDDD' | 'nomeLoja'>,
  produto: Pick<Produto, 'nome' | 'preco'>,
  opts: BuyOptions = {}
): string {
  const detalhes = [
    opts.size ? `Tamanho: ${opts.size}` : null,
    opts.color ? `Cor: ${opts.color}` : null,
  ].filter(Boolean);

  const message =
    `Olá! Tudo bem? Gostaria de comprar o *${produto.nome}* (${formatBRL(produto.preco)}) ` +
    `da ${config.nomeLoja}` +
    (detalhes.length ? `\n${detalhes.join(' | ')}` : '') +
    '.';

  return buildWhatsAppLink(config, message);
}

