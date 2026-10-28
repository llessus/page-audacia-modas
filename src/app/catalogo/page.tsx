import { LandingPage } from '@/components/LandingPage';
import { getProdutos, getHeroImage, getSiteConfig } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function CatalogoPage() {
  const [produtos, heroImage, config] = await Promise.all([
    getProdutos(),
    getHeroImage(),
    getSiteConfig(),
  ]);

  return <LandingPage produtos={produtos} heroImage={heroImage} config={config} />;
}
