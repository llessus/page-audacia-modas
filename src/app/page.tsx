import { LandingPage } from '@/components/LandingPage';
import { getProdutos } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const produtos = await getProdutos();
  
  // Filtramos apenas os disponíveis para a página inicial
  const disponiveis = produtos.filter(p => p.status === 'disponivel');

  return <LandingPage produtos={disponiveis} />;
}
