export interface Produto {
  id: string;
  nome: string;
  preco: number;
  imagem_url: string;
  categoria: string;
  descricao?: string | null;
  status: 'disponivel' | 'esgotado';
  created_at: string;
  // Feature 4: Estoque
  quantidade: number; // -1 = ilimitado, 0 = esgotado, 1-2 = últimas peças
  // Feature 3: Tamanhos e Cores
  tamanhos: string[];
  cores: string[];
  // Feature 2: Múltiplas Fotos
  imagens_extras: string[];
}

export interface ActionResponse {
  success: boolean;
  message: string;
  produto?: Produto;
}

// Feature 3: Paleta fixa de cores
export const CORES_DISPONIVEIS = [
  { nome: 'Preto', hex: '#1a1a1a' },
  { nome: 'Branco', hex: '#f5f5f5' },
  { nome: 'Vermelho', hex: '#dc2626' },
  { nome: 'Azul', hex: '#2563eb' },
  { nome: 'Rosa', hex: '#ec4899' },
  { nome: 'Bege', hex: '#d4b896' },
  { nome: 'Marrom', hex: '#78350f' },
  { nome: 'Verde', hex: '#16a34a' },
  { nome: 'Amarelo', hex: '#eab308' },
  { nome: 'Roxo', hex: '#7c3aed' },
  { nome: 'Cinza', hex: '#6b7280' },
  { nome: 'Dourado', hex: '#d4af37' },
  { nome: 'Vinho', hex: '#7f1d1d' },
  { nome: 'Nude', hex: '#deb887' },
] as const;

export const TAMANHOS_DISPONIVEIS = ['PP', 'P', 'M', 'G', 'GG', 'Plus'] as const;
