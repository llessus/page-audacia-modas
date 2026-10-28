'use server';

import { put, del } from '@vercel/blob';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import {
  parseProdutoForm,
  validateImageFile,
  siteConfigSchema,
} from '@/lib/validation';
import type { ActionResponse, Produto } from '@/types/produto';

const MAX_EXTRAS = 3;

/**
 * Server Actions são endpoints POST públicos: o middleware protege a rota,
 * mas cada mutação precisa validar a sessão por conta própria.
 */
async function requireAdmin(): Promise<ActionResponse | null> {
  const token = (await cookies()).get('admin_session')?.value;
  const ok = token ? await verifyJWT(token) : false;
  return ok ? null : { success: false, message: 'Sessão expirada. Faça login novamente.' };
}

function revalidateAll() {
  revalidatePath('/admin/dashboard');
  revalidatePath('/');
  revalidatePath('/bio');
}

function getExtraFiles(formData: FormData): File[] {
  const files: File[] = [];
  for (let i = 0; i < MAX_EXTRAS; i++) {
    const f = formData.get(`imagem_extra_${i}`) as File | null;
    if (f && f.size > 0 && !validateImageFile(f, false)) files.push(f);
  }
  return files;
}

async function safeDel(url: string | null | undefined) {
  if (!url) return;
  try {
    await del(url);
  } catch (e) {
    console.warn('[blob] Falha ao deletar (pode já ter sido removido):', url, e);
  }
}

/** Cria um produto: valida (Zod), envia imagens ao Vercel Blob e persiste no Postgres. */
export async function uploadProduct(formData: FormData): Promise<ActionResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const uploaded: string[] = [];
  try {
    const parsed = parseProdutoForm(formData);
    if (!parsed.ok) return { success: false, message: parsed.message };
    const d = parsed.data;

    const arquivo = formData.get('imagem') as File | null;
    const imgErr = validateImageFile(arquivo, true);
    if (imgErr) return { success: false, message: imgErr };

    const status = d.quantidade === 0 ? 'esgotado' : 'disponivel';

    const blob = await put(`produtos/${Date.now()}-${arquivo!.name}`, arquivo!, { access: 'public' });
    uploaded.push(blob.url);

    const { rows } = await sql`
      INSERT INTO produtos (nome, preco, imagem_url, categoria, descricao, quantidade, tamanhos, cores, status, destaque)
      VALUES (${d.nome}, ${d.preco}, ${blob.url}, ${d.categoria}, ${d.descricao}, ${d.quantidade},
              ${d.tamanhos as unknown as string}, ${d.cores as unknown as string}, ${status}, ${d.destaque})
      RETURNING id, nome, preco, imagem_url, categoria, descricao, status, created_at, quantidade, tamanhos, cores, destaque
    `;
    const produtoId = rows[0].id;

    const extras = getExtraFiles(formData);
    for (let i = 0; i < extras.length; i++) {
      const extraBlob = await put(`produtos/${Date.now()}-extra-${i}-${extras[i].name}`, extras[i], { access: 'public' });
      uploaded.push(extraBlob.url);
      await sql`
        INSERT INTO produto_imagens (produto_id, imagem_url, ordem)
        VALUES (${produtoId}, ${extraBlob.url}, ${i})
      `;
    }

    revalidateAll();
    return {
      success: true,
      message: `Produto "${d.nome}" cadastrado com sucesso!`,
      produto: rows[0] as unknown as Produto,
    };
  } catch (error) {
    console.error('[uploadProduct] Erro:', error);
    // evita blobs órfãos se algo falhou no meio do caminho
    await Promise.all(uploaded.map(safeDel));
    return { success: false, message: 'Erro interno ao cadastrar produto. Tente novamente.' };
  }
}

/** Remove um produto: deleta o registro no Postgres e os arquivos no Vercel Blob. */
export async function deleteProduct(id: string): Promise<ActionResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    if (!id) return { success: false, message: 'ID do produto é obrigatório.' };

    const { rows } = await sql`SELECT imagem_url FROM produtos WHERE id = ${id}`;
    if (rows.length === 0) return { success: false, message: 'Produto não encontrado.' };

    const { rows: extraRows } = await sql`SELECT imagem_url FROM produto_imagens WHERE produto_id = ${id}`;

    // CASCADE remove produto_imagens
    await sql`DELETE FROM produtos WHERE id = ${id}`;

    await safeDel(rows[0].imagem_url as string);
    for (const row of extraRows) await safeDel(row.imagem_url as string);

    revalidateAll();
    return { success: true, message: 'Produto excluído com sucesso.' };
  } catch (error) {
    console.error('[deleteProduct] Erro:', error);
    return { success: false, message: 'Erro interno ao excluir produto.' };
  }
}

/** Alterna o status entre 'disponivel' e 'esgotado'. */
export async function toggleStatus(id: string): Promise<ActionResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    if (!id) return { success: false, message: 'ID do produto é obrigatório.' };

    const { rows } = await sql`
      UPDATE produtos
      SET status = CASE WHEN status = 'disponivel' THEN 'esgotado' ELSE 'disponivel' END
      WHERE id = ${id}
      RETURNING id, nome, preco, imagem_url, categoria, descricao, status, created_at, quantidade, tamanhos, cores, destaque
    `;
    if (rows.length === 0) return { success: false, message: 'Produto não encontrado.' };

    revalidateAll();
    const updated = rows[0] as unknown as Produto;
    return {
      success: true,
      message: `Produto marcado como ${updated.status === 'disponivel' ? 'disponível' : 'esgotado'}.`,
      produto: updated,
    };
  } catch (error) {
    console.error('[toggleStatus] Erro:', error);
    return { success: false, message: 'Erro interno ao alterar status.' };
  }
}

/** Alterna rapidamente o destaque de um produto (usado no card do admin). */
export async function toggleDestaque(id: string): Promise<ActionResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    if (!id) return { success: false, message: 'ID do produto é obrigatório.' };
    const { rows } = await sql`
      UPDATE produtos SET destaque = NOT destaque WHERE id = ${id}
      RETURNING id, nome, preco, imagem_url, categoria, descricao, status, created_at, quantidade, tamanhos, cores, destaque
    `;
    if (rows.length === 0) return { success: false, message: 'Produto não encontrado.' };
    revalidateAll();
    const p = rows[0] as unknown as Produto;
    return { success: true, message: p.destaque ? 'Produto em destaque.' : 'Destaque removido.', produto: p };
  } catch (error) {
    console.error('[toggleDestaque] Erro:', error);
    return { success: false, message: 'Erro interno ao alterar destaque.' };
  }
}

/**
 * Atualiza um produto. Só envia nova imagem ao Blob se um arquivo novo foi
 * selecionado e só apaga a antiga depois que o UPDATE no banco deu certo.
 */
export async function updateProduct(formData: FormData): Promise<ActionResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  const uploaded: string[] = [];
  try {
    const id = formData.get('id') as string | null;
    if (!id) return { success: false, message: 'ID do produto é obrigatório.' };

    const parsed = parseProdutoForm(formData);
    if (!parsed.ok) return { success: false, message: parsed.message };
    const d = parsed.data;

    const { rows: atual } = await sql`SELECT imagem_url FROM produtos WHERE id = ${id}`;
    if (atual.length === 0) return { success: false, message: 'Produto não encontrado.' };
    const imagemAntiga = atual[0].imagem_url as string;

    const arquivo = formData.get('imagem') as File | null;
    const temNovaImagem = !!arquivo && arquivo.size > 0;
    if (temNovaImagem) {
      const imgErr = validateImageFile(arquivo, true);
      if (imgErr) return { success: false, message: imgErr };
    }

    let imagemUrl = imagemAntiga;
    if (temNovaImagem) {
      const blob = await put(`produtos/${Date.now()}-${arquivo!.name}`, arquivo!, { access: 'public' });
      imagemUrl = blob.url;
      uploaded.push(blob.url);
    }

    // Extras marcadas para remoção
    const delRaw = formData.get('imagensExtrasDeletar') as string | null;
    let extrasParaDeletar: string[] = [];
    if (delRaw) {
      try {
        const arr = JSON.parse(delRaw);
        if (Array.isArray(arr)) extrasParaDeletar = arr.filter((u) => typeof u === 'string');
      } catch { /* ignora payload inválido */ }
    }

    // Novas extras (respeitando o máximo total)
    const { rows: cnt } = await sql`SELECT COUNT(*)::int AS n FROM produto_imagens WHERE produto_id = ${id}`;
    const restantes = Math.max(0, MAX_EXTRAS - (Number(cnt[0].n) - extrasParaDeletar.length));
    const novasExtras = getExtraFiles(formData).slice(0, restantes);

    // Status: só vira 'esgotado' automaticamente quando quantidade = 0
    const { rows } = await sql`
      UPDATE produtos
      SET nome = ${d.nome},
          preco = ${d.preco},
          imagem_url = ${imagemUrl},
          categoria = ${d.categoria},
          descricao = ${d.descricao},
          quantidade = ${d.quantidade},
          tamanhos = ${d.tamanhos as unknown as string},
          cores = ${d.cores as unknown as string},
          destaque = ${d.destaque},
          status = CASE WHEN ${d.quantidade} = 0 THEN 'esgotado' ELSE status END
      WHERE id = ${id}
      RETURNING id, nome, preco, imagem_url, categoria, descricao, status, created_at, quantidade, tamanhos, cores, destaque
    `;

    // Pós-commit: limpeza e extras
    if (temNovaImagem) await safeDel(imagemAntiga);

    for (const url of extrasParaDeletar) {
      await sql`DELETE FROM produto_imagens WHERE produto_id = ${id} AND imagem_url = ${url}`;
      await safeDel(url);
    }

    if (novasExtras.length) {
      const { rows: maxRows } = await sql`
        SELECT COALESCE(MAX(ordem), -1) + 1 AS next_ordem FROM produto_imagens WHERE produto_id = ${id}
      `;
      const base = Number(maxRows[0]?.next_ordem ?? 0);
      for (let i = 0; i < novasExtras.length; i++) {
        const b = await put(`produtos/${Date.now()}-extra-${i}-${novasExtras[i].name}`, novasExtras[i], { access: 'public' });
        await sql`INSERT INTO produto_imagens (produto_id, imagem_url, ordem) VALUES (${id}, ${b.url}, ${base + i})`;
      }
    }

    revalidateAll();
    return {
      success: true,
      message: `Produto "${d.nome}" atualizado com sucesso!`,
      produto: rows[0] as unknown as Produto,
    };
  } catch (error) {
    console.error('[updateProduct] Erro:', error);
    await Promise.all(uploaded.map(safeDel));
    return { success: false, message: 'Erro interno ao atualizar produto. Tente novamente.' };
  }
}

/** Salva as configurações da loja (WhatsApp, Instagram, endereço, textos do hero). */
export async function updateSiteConfig(input: unknown): Promise<ActionResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

  try {
    const parsed = siteConfigSchema.safeParse(input);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return { success: false, message: issue?.message ?? 'Configurações inválidas.' };
    }
    await sql`
      INSERT INTO config_site (chave, valor)
      VALUES ('site_config', ${JSON.stringify(parsed.data)})
      ON CONFLICT (chave) DO UPDATE SET valor = EXCLUDED.valor
    `;
    revalidateAll();
    return { success: true, message: 'Configurações da loja salvas!' };
  } catch (error) {
    console.error('[updateSiteConfig] Erro:', error);
    return { success: false, message: 'Erro interno ao salvar configurações.' };
  }
}

/**
 * Atualiza a imagem principal (Hero) da loja.
 * Persiste a nova URL no banco e a nova imagem no Vercel Blob.
 */
export async function updateHeroImage(formData: FormData): Promise<ActionResponse> {
  const denied = await requireAdmin();
  if (denied) return denied;

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

