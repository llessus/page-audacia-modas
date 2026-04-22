-- =============================================
-- Audácia Modas — Schema do Banco de Dados
-- Execute este script no console SQL do Neon
-- =============================================

CREATE TABLE IF NOT EXISTS produtos (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome       TEXT NOT NULL,
  preco      NUMERIC(10,2) NOT NULL,
  imagem_url TEXT NOT NULL,
  categoria  TEXT NOT NULL DEFAULT 'Destaques da Semana',
  descricao  TEXT,
  status     TEXT NOT NULL DEFAULT 'disponivel',
  quantidade INT DEFAULT -1,
  tamanhos   TEXT[] DEFAULT '{}',
  cores      TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índice para listar apenas produtos disponíveis no catálogo público
CREATE INDEX IF NOT EXISTS idx_produtos_status ON produtos (status);

-- Tabela para configurações gerais do site (Ex: Foto da Hero Section)
CREATE TABLE IF NOT EXISTS config_site (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chave      TEXT UNIQUE NOT NULL,
  valor      TEXT NOT NULL
);

-- Tabela para imagens extras de cada produto
CREATE TABLE IF NOT EXISTS produto_imagens (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  produto_id UUID REFERENCES produtos(id) ON DELETE CASCADE,
  imagem_url TEXT NOT NULL,
  ordem      INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_produto_imagens_produto ON produto_imagens (produto_id);
