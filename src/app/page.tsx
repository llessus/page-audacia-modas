import { LandingPage } from '@/components/LandingPage';
import { getProdutos, getHeroImage, getSiteConfig } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Agora buscamos todos os produtos e deixamos o frontend
  // lidar com a exibição de "esgotado" conforme o novo requisito.
  const produtos = await getProdutos();
  const heroImage = await getHeroImage();
  const config = await getSiteConfig();
  
  return <LandingPage produtos={produtos} heroImage={heroImage} config={config} />;
}
