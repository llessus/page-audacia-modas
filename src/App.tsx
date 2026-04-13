import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { MiniCatalog } from './components/MiniCatalog';
import { WhatsAppPurchaseSection } from './components/WhatsAppPurchaseSection';
import { Footer } from './components/Footer';

function App() {
  return (
    <main className="w-full relative overflow-x-hidden">
      <Header />
      <HeroSection />
      <MiniCatalog />
      <WhatsAppPurchaseSection />
      <Footer />
    </main>
  );
}

export default App;
