'use client';

import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { MiniCatalog } from '@/components/MiniCatalog';
import { WhatsAppPurchaseSection } from '@/components/WhatsAppPurchaseSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { InstagramSection } from '@/components/InstagramSection';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { FloatingCart } from '@/components/FloatingCart';
import { CartDrawer } from '@/components/CartDrawer';
import { CartToast } from '@/components/CartToast';
import { BackToTop } from '@/components/BackToTop';
import { TrustStrip, WaveDividerDown, WaveDividerUp } from '@/components/Decorators';
import { SiteConfigProvider } from '@/context/SiteConfigContext';
import type { SiteConfig } from '@/config/siteConfig';
import type { Produto } from '@/types/produto';

interface LandingPageProps {
  produtos: Produto[];
  heroImage: string;
  config: SiteConfig;
}

export function LandingPage({ produtos, heroImage, config }: LandingPageProps) {
  return (
    <SiteConfigProvider config={config}>
    <main className="w-full relative overflow-x-hidden">
      <Header />
      <HeroSection heroImage={heroImage} />
      <TrustStrip />
      <WaveDividerDown />
      <MiniCatalog produtosIniciais={produtos} />
      <WaveDividerUp />
      <WhatsAppPurchaseSection />
      <TestimonialsSection />
      <InstagramSection produtos={produtos} />
      <Footer />
      <FloatingWhatsApp />
      <FloatingCart />
      <CartDrawer />
      <CartToast />
      <BackToTop />
    </main>
    </SiteConfigProvider>
  );
}
