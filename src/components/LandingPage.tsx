'use client';

import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { MiniCatalog } from '@/components/MiniCatalog';
import { WhatsAppPurchaseSection } from '@/components/WhatsAppPurchaseSection';
import { Footer } from '@/components/Footer';
import { TrustStrip, WaveDividerDown, WaveDividerUp } from '@/components/Decorators';

export function LandingPage() {
  return (
    <main className="w-full relative overflow-x-hidden">
      <Header />
      <HeroSection />
      <TrustStrip />
      <WaveDividerDown />
      <MiniCatalog />
      <WaveDividerUp />
      <WhatsAppPurchaseSection />
      <Footer />
    </main>
  );
}
