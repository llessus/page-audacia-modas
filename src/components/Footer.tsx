import { Instagram, MapPin } from 'lucide-react';
import logo from '../assets/logo.png';
import { siteConfig } from '../config/siteConfig';

export function Footer() {
  return (
    <footer className="bg-audacia-rose-dark pt-16 pb-8 border-t border-audacia-gold/20 relative z-10">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12 items-center text-center md:text-left">

          {/* Coluna 1: Logo & Slogan */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <img src={logo} alt={siteConfig.nomeLoja} className="h-14 md:h-16 object-contain opacity-90" />
            <p className="text-white/70 font-light text-sm max-w-xs leading-relaxed">
              A elegância que você merece, com o atendimento exclusivo que você confia.
            </p>
          </div>

          {/* Coluna 2: Endereço Físico (Crucial para SEO Local) */}
          <div className="flex flex-col items-center md:items-start gap-4 md:mx-auto">
            <h4 className="text-audacia-gold font-serif text-xl tracking-wide">Nossa Loja</h4>
            <a 
              href={siteConfig.linkEndereco} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group flex items-start gap-3 text-white/80 hover:text-white transition-colors text-sm text-left"
            >
              <MapPin className="w-5 h-5 text-audacia-gold shrink-0 group-hover:-translate-y-1 transition-transform duration-300" />
              <span className="leading-relaxed">
                {siteConfig.enderecoCompleto}<br/>
                <span className="text-white/50 text-xs">Visite nosso espaço físico</span>
              </span>
            </a>
          </div>

          {/* Coluna 3: Redes Sociais */}
          <div className="flex flex-col items-center md:items-end gap-4">
            <h4 className="text-audacia-gold font-serif text-xl tracking-wide">Acompanhe</h4>
            <a 
              href={siteConfig.linkInstagram} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group flex items-center gap-3 text-white/80 hover:text-audacia-gold transition-colors text-sm"
            >
              <span className="font-medium tracking-wide">{siteConfig.arrobaInstagram}</span>
              <div className="p-2.5 rounded-full border border-white/20 group-hover:border-audacia-gold group-hover:bg-audacia-gold/10 transition-all duration-300">
                <Instagram className="w-4 h-4" />
              </div>
            </a>
          </div>

        </div>

        {/* Linha de Copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50 font-light tracking-wider">
          <p>&copy; {new Date().getFullYear()} {siteConfig.nomeLoja}. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Desenvolvido por <a href="https://github.com/llessus" target="_blank" rel="noopener noreferrer" className="text-audacia-gold hover:text-white transition-colors font-medium">Você</a>
          </p>
        </div>
      </div>
    </footer>
  );
}