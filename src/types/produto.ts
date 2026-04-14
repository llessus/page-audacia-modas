export interface Produto {
  id: string;
  nome: string;
  preco: number;
  imagem_url: string;
  status: 'disponivel' | 'esgotado';
  created_at: string;
}

export interface ActionResponse {
  success: boolean;
  message: string;
  produto?: Produto;
}
