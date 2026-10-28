import { LandingPage } from '@/components/LandingPage';
import { getProdutos, getHeroImage, getSiteConfig } from '@/lib/db';

// Cache ISR de 60s para abrir rápido no celular (atualiza na hora quando edita no Admin)
export const revalidate = 60;

export default async function CatalogoPage() {
  const [produtos, heroImage, config] = await Promise.all([
    getProdutos(),
    getHeroImage(),
    getSiteConfig(),
  ]);

  return <LandingPage produtos={produtos} heroImage={heroImage} config={config} />;
}
