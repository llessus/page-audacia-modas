-- =============================================
-- Audácia Modas — Schema do Banco de Dados
-- Execute este script no console SQL do Neon
-- =============================================

CREATE TABLE IF NOT EXISTS produtos (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome       TEXT NOT NULL,
  preco      NUMERIC(10,2) NOT NULL,
  imagem_url TEXT NOT NULL,
  status     TEXT NOT NULL DEFAULT 'disponivel',
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
