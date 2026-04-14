import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

async function main() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS config_site (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        chave TEXT UNIQUE NOT NULL,
        valor TEXT NOT NULL
      );
    `;
    console.log('Tabela config_site criada ou já existe!');
    process.exit(0);
  } catch (error) {
    console.error('Erro na migração:', error);
    process.exit(1);
  }
}

main();
