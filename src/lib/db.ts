import { sql } from '@vercel/postgres';
import type { Produto } from '@/types/produto';

// Helper para montar um Produto completo a partir de uma row do banco
function rowToProduto(row: Record<string, unknown>): Produto {
  return {
    id: row.id as string,
    nome: row.nome as string,
    preco: Number(row.preco),
    imagem_url: row.imagem_url as string,
    categoria: row.categoria as string,
    descricao: (row.descricao as string) || null,
    status: row.status as 'disponivel' | 'esgotado',
    created_at: row.created_at as string,
    quantidade: row.quantidade != null ? Number(row.quantidade) : -1,
    tamanhos: Array.isArray(row.tamanhos) ? row.tamanhos as string[] : [],
    cores: Array.isArray(row.cores) ? row.cores as string[] : [],
    imagens_extras: Array.isArray(row.imagens_extras)
      ? (row.imagens_extras as string[])
      : [],
  };
}

export async function getProdutos(): Promise<Produto[]> {
  const { rows } = await sql`
    SELECT
      p.id, p.nome, p.preco, p.imagem_url, p.categoria, p.descricao,
      p.status, p.created_at, p.quantidade, p.tamanhos, p.cores,
      COALESCE(
        (SELECT array_agg(pi.imagem_url ORDER BY pi.ordem)
         FROM produto_imagens pi WHERE pi.produto_id = p.id),
        '{}'
      ) AS imagens_extras
    FROM produtos p
    ORDER BY p.created_at DESC
  `;
  return rows.map(rowToProduto);
}

export async function getProdutosDisponiveis(): Promise<Produto[]> {
  const { rows } = await sql`
    SELECT
      p.id, p.nome, p.preco, p.imagem_url, p.categoria, p.descricao,
      p.status, p.created_at, p.quantidade, p.tamanhos, p.cores,
      COALESCE(
        (SELECT array_agg(pi.imagem_url ORDER BY pi.ordem)
         FROM produto_imagens pi WHERE pi.produto_id = p.id),
        '{}'
      ) AS imagens_extras
    FROM produtos p
    WHERE p.status = 'disponivel'
    ORDER BY p.created_at DESC
  `;
  return rows.map(rowToProduto);
}

export async function getProdutoById(id: string): Promise<Produto | null> {
  const { rows } = await sql`
    SELECT
      p.id, p.nome, p.preco, p.imagem_url, p.categoria, p.descricao,
      p.status, p.created_at, p.quantidade, p.tamanhos, p.cores,
      COALESCE(
        (SELECT array_agg(pi.imagem_url ORDER BY pi.ordem)
         FROM produto_imagens pi WHERE pi.produto_id = p.id),
        '{}'
      ) AS imagens_extras
    FROM produtos p
    WHERE p.id = ${id}
  `;
  if (rows.length === 0) return null;
  return rowToProduto(rows[0]);
}

export async function getHeroImage(): Promise<string> {
  try {
    const { rows } = await sql`
      SELECT valor FROM config_site WHERE chave = 'hero_image' LIMIT 1
    `;
    return rows[0]?.valor || '/images/product_3.png';
  } catch (error) {
    // Retorna fallback caso a tabela não exista ainda ou haja outro erro
    return '/images/product_3.png';
  }
}
