-- Migration: marca de destaque nos produtos.
-- As configurações da loja reutilizam a tabela config_site (chave/valor), sem nova tabela.
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS destaque BOOLEAN NOT NULL DEFAULT FALSE;
CREATE INDEX IF NOT EXISTS idx_produtos_destaque ON produtos (destaque) WHERE destaque = TRUE;

