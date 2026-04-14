import { sql } from '@vercel/postgres';
import type { Produto } from '@/types/produto';

export async function getProdutos(): Promise<Produto[]> {
  const { rows } = await sql<Produto>`
    SELECT id, nome, preco, imagem_url, status, created_at
    FROM produtos
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function getProdutosDisponiveis(): Promise<Produto[]> {
  const { rows } = await sql<Produto>`
    SELECT id, nome, preco, imagem_url, status, created_at
    FROM produtos
    WHERE status = 'disponivel'
    ORDER BY created_at DESC
  `;
  return rows;
}

export async function getProdutoById(id: string): Promise<Produto | null> {
  const { rows } = await sql<Produto>`
    SELECT id, nome, preco, imagem_url, status, created_at
    FROM produtos
    WHERE id = ${id}
  `;
  return rows[0] ?? null;
}
