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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 md:px-8 ${
      isScrolled ? 'py-4' : 'py-6'
    }`}>
      <div className={`mx-auto max-w-6xl flex justify-between items-center transition-all duration-500 ${
        isScrolled 
          ? 'glassmorphism rounded-full px-6 py-2 shadow-gold-glow border-audacia-gold/30' 
          : 'bg-transparent px-2 py-2 border-transparent'
      }`}>
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img 
            src={logo} 
            alt="Audácia Modas" 
            className={`object-contain transition-all duration-500 ${isScrolled ? 'h-10' : 'h-14 md:h-16'}`} 
          />
        </div>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/5561998851403?text=Ol%C3%A1!%20Vi%20a%20landing%20page%20da%20Audácia%20Modas%20e%20quero%20falar%20com%20o%20atendimento."
          target="_blank"
          rel="noopener noreferrer"
          className={`group flex items-center gap-2 px-6 py-2.5 rounded-full border transition-all duration-300 ${
            isScrolled 
              ? 'border-audacia-gold text-audacia-gold hover:bg-audacia-gold hover:text-audacia-rose-dark' 
              : 'border-white/30 text-white hover:border-audacia-gold hover:text-audacia-gold'
          }`}
        >
          <span className="hidden md:inline font-medium text-sm tracking-wide transition-colors">
            Atendimento
          </span>
          <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
        </a>
      </div>
    </header>
  );
}