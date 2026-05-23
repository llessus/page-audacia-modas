'use client';

import { MessageCircle } from 'lucide-react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { siteConfig } from '@/config/siteConfig';

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();
  const tapCountRef = useRef(0);
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoTap = useCallback(() => {
    tapCountRef.current += 1;

    if (tapTimerRef.current) {
      clearTimeout(tapTimerRef.current);
    }

    if (tapCountRef.current >= 3) {
      tapCountRef.current = 0;
      router.push('/admin');
      return;
    }

    tapTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, 800);
  }, [router]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-4 md:px-8 ${
      isScrolled ? 'py-4' : 'py-6'
    }`}>
      <div className={`mx-auto max-w-6xl flex justify-between items-center transition-all duration-500 ${
        isScrolled 
          ? 'glassmorphism rounded-full px-6 py-2 shadow-gold-glow border-audacia-gold/30' 
          : 'bg-transparent px-2 py-2 border-transparent'
      }`}>
        {/* Logo — 3 toques rápidos abre o admin */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={handleLogoTap}
          role="button"
          tabIndex={0}
          aria-label="Logo"
        >
          <Image 
            src="/images/logo.png"
            alt={siteConfig.nomeLoja} 
            width={160}
            height={64}
            className={`object-contain transition-all duration-500 ${isScrolled ? 'h-10 w-auto' : 'h-14 md:h-16 w-auto'}`} 
            priority
          />
        </div>

        {/* WhatsApp Button */}
        <a
          href={`https://wa.me/${siteConfig.whatsappDDIeDDD}?text=${encodeURIComponent(`Ola! Achei a ${siteConfig.nomeLoja} interessante e gostaria de ver as roupas e tirar algumas duvidas.`)}`}
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