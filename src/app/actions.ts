'use server';

import { put, del } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import type { ActionResponse, Produto } from '@/types/produto';

/**
 * Upload de um novo produto: recebe FormData, envia imagem ao Vercel Blob
 * e persiste os dados no Neon Postgres.
 */
export async function uploadProduct(formData: FormData): Promise<ActionResponse> {
  try {
    const nome = formData.get('nome') as string | null;
    const precoRaw = formData.get('preco') as string | null;
    const arquivo = formData.get('imagem') as File | null;
    const categoriaSelect = formData.get('categoria') as string | null;
    const novaCategoria = formData.get('novaCategoria') as string | null;
    const descricao = formData.get('descricao') as string | null;

    // --- Validações rigorosas ---
    if (!nome || nome.trim().length === 0) {
      return { success: false, message: 'O nome do produto é obrigatório.' };
    }

    if (!precoRaw || isNaN(Number(precoRaw)) || Number(precoRaw) <= 0) {
      return { success: false, message: 'Informe um preço válido maior que zero.' };
    }

    if (!arquivo || arquivo.size === 0) {
      return { success: false, message: 'Selecione uma imagem para o produto.' };
    }

    // Limitar tamanho a 4.5MB (limite do Vercel Blob free tier)
    if (arquivo.size > 4.5 * 1024 * 1024) {
      return { success: false, message: 'A imagem deve ter no máximo 4.5MB.' };
    }

    const preco = Number(precoRaw);

    // Determinar categoria: prioriza "Nova Categoria" se preenchida
    const categoria = (novaCategoria && novaCategoria.trim().length > 0)
      ? novaCategoria.trim()
      : (categoriaSelect || 'Destaques da Semana');

    const descricaoFinal = descricao && descricao.trim().length > 0
      ? descricao.trim()
      : null;

    // --- Upload ao Vercel Blob ---
    const blob = await put(`produtos/${Date.now()}-${arquivo.name}`, arquivo, {
      access: 'public',
    });

    // --- INSERT no Postgres ---
    const { rows } = await sql`
      INSERT INTO produtos (nome, preco, imagem_url, categoria, descricao)
      VALUES (${nome.trim()}, ${preco}, ${blob.url}, ${categoria}, ${descricaoFinal})
      RETURNING id, nome, preco, imagem_url, categoria, descricao, status, created_at
    `;

    // Revalidar as páginas que consomem esses dados
    revalidatePath('/admin/dashboard');
    revalidatePath('/');

    return {
      success: true,
      message: `Produto "${nome}" cadastrado com sucesso!`,
      produto: rows[0] as unknown as Produto,
    };
  } catch (error) {
    console.error('[uploadProduct] Erro:', error);
    return { success: false, message: 'Erro interno ao cadastrar produto. Tente novamente.' };
  }
}

/**
 * Remove um produto: deleta o registro no Postgres e o arquivo no Vercel Blob.
 */
export async function deleteProduct(id: string): Promise<ActionResponse> {
  try {
    if (!id) {
      return { success: false, message: 'ID do produto é obrigatório.' };
    }

    // Buscar URL da imagem antes de deletar
    const { rows } = await sql`
      SELECT imagem_url FROM produtos WHERE id = ${id}
    `;

    if (rows.length === 0) {
      return { success: false, message: 'Produto não encontrado.' };
    }

    const imagemUrl = rows[0].imagem_url as string;

    // Deletar do Postgres
    await sql`DELETE FROM produtos WHERE id = ${id}`;

    // Deletar o blob físico
    try {
      await del(imagemUrl);
    } catch (blobError) {
      console.warn('[deleteProduct] Falha ao deletar blob (pode já ter sido removido):', blobError);
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/');

    return { success: true, message: 'Produto excluído com sucesso.' };
  } catch (error) {
    console.error('[deleteProduct] Erro:', error);
    return { success: false, message: 'Erro interno ao excluir produto.' };
  }
}

/**
 * Alterna o status de um produto entre 'disponivel' e 'esgotado'.
 */
export async function toggleStatus(id: string): Promise<ActionResponse> {
  try {
    if (!id) {
      return { success: false, message: 'ID do produto é obrigatório.' };
    }

    const { rows } = await sql`
      UPDATE produtos
      SET status = CASE
        WHEN status = 'disponivel' THEN 'esgotado'
        ELSE 'disponivel'
      END
      WHERE id = ${id}
      RETURNING id, nome, preco, imagem_url, categoria, descricao, status, created_at
    `;

    if (rows.length === 0) {
      return { success: false, message: 'Produto não encontrado.' };
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/');

    const updatedProduto = rows[0] as unknown as Produto;
    const novoStatus = updatedProduto.status === 'disponivel' ? 'disponível' : 'esgotado';
    return {
      success: true,
      message: `Produto marcado como ${novoStatus}.`,
      produto: updatedProduto,
    };
  } catch (error) {
    console.error('[toggleStatus] Erro:', error);
    return { success: false, message: 'Erro interno ao alterar status.' };
  }
}

/**
 * Atualiza um produto existente.
 * Só faz upload de nova imagem se o admin selecionou um arquivo novo,
 * economizando o limite do Vercel Blob.
 */
export async function updateProduct(formData: FormData): Promise<ActionResponse> {
  try {
    const id = formData.get('id') as string | null;
    const nome = formData.get('nome') as string | null;
    const precoRaw = formData.get('preco') as string | null;
    const categoriaSelect = formData.get('categoria') as string | null;
    const novaCategoria = formData.get('novaCategoria') as string | null;
    const descricao = formData.get('descricao') as string | null;
    const arquivo = formData.get('imagem') as File | null;
    const imagemAtual = formData.get('imagemAtual') as string | null;

    // --- Validações ---
    if (!id) {
      return { success: false, message: 'ID do produto é obrigatório.' };
    }

    if (!nome || nome.trim().length === 0) {
      return { success: false, message: 'O nome do produto é obrigatório.' };
    }

    if (!precoRaw || isNaN(Number(precoRaw)) || Number(precoRaw) <= 0) {
      return { success: false, message: 'Informe um preço válido maior que zero.' };
    }

    const preco = Number(precoRaw);

    // Determinar categoria
    const categoria = (novaCategoria && novaCategoria.trim().length > 0)
      ? novaCategoria.trim()
      : (categoriaSelect || 'Destaques da Semana');

    const descricaoFinal = descricao && descricao.trim().length > 0
      ? descricao.trim()
      : null;

    // --- Gerenciar imagem ---
    let imagemUrl = imagemAtual || '';

    // Só faz upload se o admin selecionou um arquivo novo (size > 0)
    const temNovaImagem = arquivo && arquivo.size > 0;

    if (temNovaImagem) {
      // Validar tamanho
      if (arquivo.size > 4.5 * 1024 * 1024) {
        return { success: false, message: 'A imagem deve ter no máximo 4.5MB.' };
      }

      // Upload da nova imagem
      const blob = await put(`produtos/${Date.now()}-${arquivo.name}`, arquivo, {
        access: 'public',
      });
      imagemUrl = blob.url;

      // Deletar a imagem antiga do Blob para liberar espaço
      if (imagemAtual) {
        try {
          await del(imagemAtual);
        } catch (blobError) {
          console.warn('[updateProduct] Falha ao deletar blob antigo:', blobError);
        }
      }
    }

    // --- UPDATE no Postgres ---
    const { rows } = await sql`
      UPDATE produtos
      SET nome = ${nome.trim()},
          preco = ${preco},
          imagem_url = ${imagemUrl},
          categoria = ${categoria},
          descricao = ${descricaoFinal}
      WHERE id = ${id}
      RETURNING id, nome, preco, imagem_url, categoria, descricao, status, created_at
    `;

    if (rows.length === 0) {
      return { success: false, message: 'Produto não encontrado.' };
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/');

    return {
      success: true,
      message: `Produto "${nome.trim()}" atualizado com sucesso!`,
      produto: rows[0] as unknown as Produto,
    };
  } catch (error) {
    console.error('[updateProduct] Erro:', error);
    return { success: false, message: 'Erro interno ao atualizar produto. Tente novamente.' };
  }
}
