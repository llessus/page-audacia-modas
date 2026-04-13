import { MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 py-4 lg:py-6 transition-all duration-300 ${isScrolled ? 'bg-black/40 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img src={logo} alt="Audácia Modas Logo" className="h-12 md:h-16 object-contain" />
        </div>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/5561998851403?text=Ol%C3%A1!%20Vi%20a%20landing%20page%20e%20quero%20saber%20mais%20sobre%20as%20roupas!"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-5 py-2 rounded-full border border-audacia-gold/50 text-white hover:bg-audacia-gold/10 transition-colors duration-300"
        >
          <span className="hidden md:inline font-medium">Atendimento</span>
          <MessageCircle className="w-5 h-5 text-audacia-gold" />
        </a>
      </div>
    </header>
  );
}
