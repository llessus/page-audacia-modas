-- Migration: Add categoria and descricao columns to produtos table
-- Run this against your Neon Postgres database

ALTER TABLE produtos ADD COLUMN IF NOT EXISTS categoria TEXT DEFAULT 'Destaques da Semana';
ALTER TABLE produtos ADD COLUMN IF NOT EXISTS descricao TEXT;
