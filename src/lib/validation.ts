import { z } from 'zod';

export const MAX_IMAGE_BYTES = 4.5 * 1024 * 1024;
export const CATEGORIA_PADRAO = 'Destaques da Semana';

/** Aceita "389,90", "1.299,90" ou "389.90" e devolve number. */
function parsePreco(v: unknown): unknown {
  if (typeof v === 'number') return v;
  if (typeof v !== 'string') return NaN;
  const s = v.trim();
  if (!s) return NaN;
  const normalizado = s.includes(',') ? s.replace(/\./g, '').replace(',', '.') : s;
  return Number(normalizado);
}

function parseJsonArray(v: unknown): unknown {
  if (typeof v !== 'string' || v === '') return [];
  try {
    return JSON.parse(v);
  } catch {
    return null;
  }
}

const textoLista = z
  .array(z.string().trim().min(1).max(30))
  .max(20, 'Limite de 20 itens.')
  .transform((arr) => Array.from(new Set(arr)));

export const produtoSchema = z.object({
  nome: z
    .string({ error: 'O nome do produto é obrigatório.' })
    .trim()
    .min(2, 'O nome deve ter ao menos 2 caracteres.')
    .max(120, 'O nome deve ter no máximo 120 caracteres.'),
  preco: z.preprocess(
    parsePreco,
    z
      .number({ error: 'Informe um preço válido.' })
      .positive('Informe um preço maior que zero.')
      .max(1_000_000, 'Preço acima do limite permitido.')
      .transform((n) => Math.round(n * 100) / 100)
  ),
  categoria: z.string().trim().min(1).max(60),
  descricao: z
    .string()
    .trim()
    .max(1000, 'A descrição deve ter no máximo 1000 caracteres.')
    .transform((s) => (s.length ? s : null)),
  quantidade: z.preprocess(
    (v) => (v === '' || v == null ? -1 : Number(v)),
    z
      .number({ error: 'Quantidade inválida.' })
      .int('A quantidade deve ser um número inteiro.')
      .min(-1, 'Quantidade inválida.')
      .max(100_000, 'Quantidade inválida.')
  ),
  tamanhos: z.preprocess(parseJsonArray, textoLista),
  cores: z.preprocess(parseJsonArray, textoLista),
  destaque: z.preprocess((v) => v === 'true' || v === 'on' || v === true, z.boolean()),
});

export type ProdutoInput = z.infer<typeof produtoSchema>;

export const siteConfigSchema = z.object({
  nomeLoja: z.string().trim().min(2, 'Informe o nome da loja.').max(80),
  whatsappDDIeDDD: z
    .string()
    .transform((s) => s.replace(/\D/g, ''))
    .pipe(z.string().regex(/^\d{12,13}$/, 'WhatsApp inválido. Use DDI + DDD + número (ex.: 5561998851403).')),
  linkInstagram: z.string().trim().url('Link do Instagram inválido.').max(300),
  arrobaInstagram: z.string().trim().min(2).max(60),
  enderecoCompleto: z.string().trim().min(2).max(200),
  linkEndereco: z.string().trim().url('Link do endereço inválido.').max(300),
  hero: z.object({
    tituloParte1: z.string().trim().min(1).max(80),
    tituloParte2: z.string().trim().min(1).max(80),
    tituloParte3: z.string().trim().min(1).max(80),
    subtitulo: z.string().trim().min(1).max(400),
  }),
});

/** Lê o FormData, resolve "nova categoria" e valida tudo com Zod. */
export function parseProdutoForm(formData: FormData):
  | { ok: true; data: ProdutoInput }
  | { ok: false; message: string } {
  const nova = String(formData.get('novaCategoria') ?? '').trim();
  const sel = String(formData.get('categoria') ?? '').trim();

  const parsed = produtoSchema.safeParse({
    nome: formData.get('nome') ?? '',
    preco: formData.get('preco') ?? '',
    categoria: nova || (sel && sel !== '__nova__' ? sel : CATEGORIA_PADRAO),
    descricao: String(formData.get('descricao') ?? ''),
    quantidade: formData.get('quantidade'),
    tamanhos: formData.get('tamanhos'),
    cores: formData.get('cores'),
    destaque: formData.get('destaque'),
  });

  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Dados inválidos.' };
  }
  return { ok: true, data: parsed.data };
}

export function validateImageFile(file: File | null, required: boolean): string | null {
  if (!file || file.size === 0) return required ? 'Selecione uma imagem para o produto.' : null;
  if (!file.type.startsWith('image/')) return 'O arquivo enviado não é uma imagem.';
  if (file.size > MAX_IMAGE_BYTES) return 'A imagem deve ter no máximo 4.5MB.';
  return null;
}

