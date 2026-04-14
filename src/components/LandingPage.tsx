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
}

export function LandingPage({ produtos }: LandingPageProps) {
  return (
    <main className="w-full relative overflow-x-hidden">
      <Header />
      <HeroSection />
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
