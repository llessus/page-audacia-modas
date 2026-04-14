import { sql } from '@vercel/postgres';
import type { Produto } from '@/types/produto';

export async function getProdutos(): Promise<Produto[]> {
  const { rows } = await sql<Produto>`
    SELECT id, nome, preco, imagem_url, categoria, descricao, status, created_at
    FROM produtos
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function getProdutosDisponiveis(): Promise<Produto[]> {
  const { rows } = await sql<Produto>`
    SELECT id, nome, preco, imagem_url, categoria, descricao, status, created_at
    FROM produtos
    WHERE status = 'disponivel'
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function getProdutoById(id: string): Promise<Produto | null> {
  const { rows } = await sql<Produto>`
    SELECT id, nome, preco, imagem_url, categoria, descricao, status, created_at
    FROM produtos
    WHERE id = ${id}
  `;
  return rows[0] ?? null;
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
