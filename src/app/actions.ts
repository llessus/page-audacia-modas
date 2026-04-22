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
    const quantidadeRaw = formData.get('quantidade') as string | null;
    const tamanhosRaw = formData.get('tamanhos') as string | null;
    const coresRaw = formData.get('cores') as string | null;

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

    // Quantidade (-1 = ilimitado)
    const quantidade = quantidadeRaw !== null && quantidadeRaw !== ''
      ? parseInt(quantidadeRaw, 10)
      : -1;

    // Tamanhos e Cores (recebidos como JSON string)
    const tamanhos: string[] = tamanhosRaw ? JSON.parse(tamanhosRaw) : [];
    const cores: string[] = coresRaw ? JSON.parse(coresRaw) : [];

    // Determinar status baseado na quantidade
    const status = quantidade === 0 ? 'esgotado' : 'disponivel';

    // --- Upload ao Vercel Blob ---
    const blob = await put(`produtos/${Date.now()}-${arquivo.name}`, arquivo, {
      access: 'public',
    });

    // --- INSERT no Postgres ---
    const { rows } = await sql`
      INSERT INTO produtos (nome, preco, imagem_url, categoria, descricao, quantidade, tamanhos, cores, status)
      VALUES (${nome.trim()}, ${preco}, ${blob.url}, ${categoria}, ${descricaoFinal}, ${quantidade}, ${tamanhos as unknown as string}, ${cores as unknown as string}, ${status})
      RETURNING id, nome, preco, imagem_url, categoria, descricao, status, created_at, quantidade, tamanhos, cores
    `;

    const produtoId = rows[0].id;

    // --- Upload de imagens extras ---
    const imagensExtras: File[] = [];
    for (let i = 0; i < 3; i++) {
      const extra = formData.get(`imagem_extra_${i}`) as File | null;
      if (extra && extra.size > 0) {
        if (extra.size > 4.5 * 1024 * 1024) continue; // Pula se muito grande
        imagensExtras.push(extra);
      }
    }

    for (let i = 0; i < imagensExtras.length; i++) {
      const extraBlob = await put(`produtos/${Date.now()}-extra-${imagensExtras[i].name}`, imagensExtras[i], {
        access: 'public',
      });
      await sql`
        INSERT INTO produto_imagens (produto_id, imagem_url, ordem)
        VALUES (${produtoId}, ${extraBlob.url}, ${i})
      `;
    }

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

    // Buscar URL da imagem principal e extras antes de deletar
    const { rows } = await sql`
      SELECT imagem_url FROM produtos WHERE id = ${id}
    `;

    if (rows.length === 0) {
      return { success: false, message: 'Produto não encontrado.' };
    }

    const imagemUrl = rows[0].imagem_url as string;

    // Buscar imagens extras
    const { rows: extraRows } = await sql`
      SELECT imagem_url FROM produto_imagens WHERE produto_id = ${id}
    `;

    // Deletar do Postgres (CASCADE deleta produto_imagens automaticamente)
    await sql`DELETE FROM produtos WHERE id = ${id}`;

    // Deletar o blob principal
    try {
      await del(imagemUrl);
    } catch (blobError) {
      console.warn('[deleteProduct] Falha ao deletar blob (pode já ter sido removido):', blobError);
    }

    // Deletar blobs extras
    for (const row of extraRows) {
      try {
        await del(row.imagem_url as string);
      } catch (blobError) {
        console.warn('[deleteProduct] Falha ao deletar blob extra:', blobError);
      }
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
      RETURNING id, nome, preco, imagem_url, categoria, descricao, status, created_at, quantidade, tamanhos, cores
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
    const quantidadeRaw = formData.get('quantidade') as string | null;
    const tamanhosRaw = formData.get('tamanhos') as string | null;
    const coresRaw = formData.get('cores') as string | null;
    const imagensExtrasDeletarRaw = formData.get('imagensExtrasDeletar') as string | null;

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

    // Quantidade
    const quantidade = quantidadeRaw !== null && quantidadeRaw !== ''
      ? parseInt(quantidadeRaw, 10)
      : -1;

    // Tamanhos e Cores
    const tamanhos: string[] = tamanhosRaw ? JSON.parse(tamanhosRaw) : [];
    const cores: string[] = coresRaw ? JSON.parse(coresRaw) : [];

    // Status baseado na quantidade
    // Só auto-muda pra esgotado se quantidade = 0
    const statusUpdate = quantidade === 0 ? 'esgotado' : undefined;

    // --- Gerenciar imagem principal ---
    let imagemUrl = imagemAtual || '';

    const temNovaImagem = arquivo && arquivo.size > 0;

    if (temNovaImagem) {
      if (arquivo.size > 4.5 * 1024 * 1024) {
        return { success: false, message: 'A imagem deve ter no máximo 4.5MB.' };
      }

      const blob = await put(`produtos/${Date.now()}-${arquivo.name}`, arquivo, {
        access: 'public',
      });
      imagemUrl = blob.url;

      if (imagemAtual) {
        try {
          await del(imagemAtual);
        } catch (blobError) {
          console.warn('[updateProduct] Falha ao deletar blob antigo:', blobError);
        }
      }
    }

    // --- Deletar imagens extras marcadas para remoção ---
    if (imagensExtrasDeletarRaw) {
      const urlsParaDeletar: string[] = JSON.parse(imagensExtrasDeletarRaw);
      for (const url of urlsParaDeletar) {
        try {
          await sql`DELETE FROM produto_imagens WHERE produto_id = ${id} AND imagem_url = ${url}`;
          await del(url);
        } catch (e) {
          console.warn('[updateProduct] Falha ao deletar imagem extra:', e);
        }
      }
    }

    // --- Upload de novas imagens extras ---
    for (let i = 0; i < 3; i++) {
      const extra = formData.get(`imagem_extra_${i}`) as File | null;
      if (extra && extra.size > 0 && extra.size <= 4.5 * 1024 * 1024) {
        const extraBlob = await put(`produtos/${Date.now()}-extra-${extra.name}`, extra, {
          access: 'public',
        });
        // Get current max order
        const { rows: maxRows } = await sql`
          SELECT COALESCE(MAX(ordem), -1) + 1 as next_ordem FROM produto_imagens WHERE produto_id = ${id}
        `;
        const nextOrdem = maxRows[0]?.next_ordem ?? 0;
        await sql`
          INSERT INTO produto_imagens (produto_id, imagem_url, ordem)
          VALUES (${id}, ${extraBlob.url}, ${nextOrdem + i})
        `;
      }
    }

    // --- UPDATE no Postgres ---
    let updateQuery;
    if (statusUpdate) {
      updateQuery = await sql`
        UPDATE produtos
        SET nome = ${nome.trim()},
            preco = ${preco},
            imagem_url = ${imagemUrl},
            categoria = ${categoria},
            descricao = ${descricaoFinal},
            quantidade = ${quantidade},
            tamanhos = ${tamanhos as unknown as string},
            cores = ${cores as unknown as string},
            status = ${statusUpdate}
        WHERE id = ${id}
        RETURNING id, nome, preco, imagem_url, categoria, descricao, status, created_at, quantidade, tamanhos, cores
      `;
    } else {
      updateQuery = await sql`
        UPDATE produtos
        SET nome = ${nome.trim()},
            preco = ${preco},
            imagem_url = ${imagemUrl},
            categoria = ${categoria},
            descricao = ${descricaoFinal},
            quantidade = ${quantidade},
            tamanhos = ${tamanhos as unknown as string},
            cores = ${cores as unknown as string}
        WHERE id = ${id}
        RETURNING id, nome, preco, imagem_url, categoria, descricao, status, created_at, quantidade, tamanhos, cores
      `;
    }

    if (updateQuery.rows.length === 0) {
      return { success: false, message: 'Produto não encontrado.' };
    }

    revalidatePath('/admin/dashboard');
    revalidatePath('/');

    return {
      success: true,
      message: `Produto "${nome.trim()}" atualizado com sucesso!`,
      produto: updateQuery.rows[0] as unknown as Produto,
    };
  } catch (error) {
    console.error('[updateProduct] Erro:', error);
    return { success: false, message: 'Erro interno ao atualizar produto. Tente novamente.' };
  }
}

/**
 * Atualiza a imagem principal (Hero) da loja.
 * Persiste a nova URL no banco e a nova imagem no Vercel Blob.
 */
export async function updateHeroImage(formData: FormData): Promise<ActionResponse> {
  try {
    const arquivo = formData.get('imagem') as File | null;

    if (!arquivo || arquivo.size === 0) {
      return { success: false, message: 'Nenhuma nova imagem selecionada.' };
    }

    if (arquivo.size > 5 * 1024 * 1024) {
      return { success: false, message: 'A imagem deve ter no máximo 5MB.' };
    }

    // Tentar pegar URL antiga para deletar
    const { rows: configRows } = await sql`
      SELECT valor FROM config_site WHERE chave = 'hero_image' LIMIT 1
    `;
    const antigaUrl = configRows[0]?.valor;

    // Fazer upload da nova imagem
    const blob = await put(`hero/${Date.now()}-${arquivo.name}`, arquivo, {
      access: 'public',
    });

    // Salvar ou atualizar no banco
    await sql`
      INSERT INTO config_site (chave, valor)
      VALUES ('hero_image', ${blob.url})
      ON CONFLICT (chave)
      DO UPDATE SET valor = EXCLUDED.valor
    `;

    // Deletar a imagem antiga do Blob APENAS se for do Vercel Blob (evita deletar arquivos locais ou URLs externas q n podemos deletar)
    if (antigaUrl && antigaUrl.includes('vercel-storage.com')) {
      try {
        await del(antigaUrl);
      } catch (blobError) {
        console.warn('[updateHeroImage] Falha ao deletar blob antigo (Hero):', blobError);
      }
    }

    // Revalidar rotas
    revalidatePath('/admin/dashboard');
    revalidatePath('/');

    return {
      success: true,
      message: 'Foto de entrada atualizada com sucesso!',
    };

  } catch (error) {
    console.error('[updateHeroImage] Erro:', error);
    return { success: false, message: 'Erro ao atualizar a foto de entrada.' };
  }
}
