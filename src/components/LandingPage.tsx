'use client';

import { Header } from '@/components/Header';
import { HeroSection } from '@/components/HeroSection';
import { MiniCatalog } from '@/components/MiniCatalog';
import { WhatsAppPurchaseSection } from '@/components/WhatsAppPurchaseSection';
import { InstagramSection } from '@/components/InstagramSection';
import { Footer } from '@/components/Footer';
import { FloatingWhatsApp } from '@/components/FloatingWhatsApp';
import { FloatingCart } from '@/components/FloatingCart';
import { CartDrawer } from '@/components/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { TrustStrip, WaveDividerDown, WaveDividerUp } from '@/components/Decorators';
import type { Produto } from '@/types/produto';

interface LandingPageProps {
  produtos: Produto[];
  heroImage: string;
}

export function LandingPage({ produtos, heroImage }: LandingPageProps) {
  return (
    <CartProvider>
      <main className="w-full relative overflow-x-hidden">
        <Header />
        <HeroSection heroImage={heroImage} />
        <TrustStrip />
        <WaveDividerDown />
        <MiniCatalog produtosIniciais={produtos} />
        <WaveDividerUp />
        <WhatsAppPurchaseSection />
        <InstagramSection produtos={produtos} />
        <Footer />
        <FloatingWhatsApp />
        <FloatingCart />
        <CartDrawer />
      </main>
    </CartProvider>
  );
}
