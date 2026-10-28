const brl = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

/** Formata um número como moeda brasileira (ex.: 389.9 -> "R$ 389,90"). */
export function formatBRL(value: number): string {
  return brl.format(Number.isFinite(value) ? value : 0);
}

