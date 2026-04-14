'use client';

import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { MiniCatalog } from '@/components/MiniCatalog';
import { WhatsAppPurchaseSection } from '@/components/WhatsAppPurchaseSection';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { TrustStrip, WaveDividerDown, WaveDividerUp } from '@/components/Decorators';
import type { Produto } from '@/types/produto';

interface LandingPageProps {
  produtos: Produto[];
  heroImage: string;
}

export function LandingPage({ produtos, heroImage }: LandingPageProps) {
  return (
    <main className="w-full relative overflow-x-hidden">
      <Header />
      <HeroSection heroImage={heroImage} />
      <TrustStrip />
      <WaveDividerDown />
      <MiniCatalog produtosIniciais={produtos} />
      <WaveDividerUp />
      <WhatsAppPurchaseSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
