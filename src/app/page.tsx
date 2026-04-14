import { LandingPage } from '@/components/LandingPage';
import { getProdutos } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Agora buscamos todos os produtos e deixamos o frontend
  // lidar com a exibição de "esgotado" conforme o novo requisito.
  const produtos = await getProdutos();
  
  return <LandingPage produtos={produtos} />;
}
