import logo from '../assets/logo.png';

export function Footer() {
  return (
    <footer className="py-10 border-t border-white/10 z-10 relative bg-black/10">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex items-center gap-2 opacity-80">
           {/* Logo */}
           <img src={logo} alt="Audácia Modas" className="h-10" /> 
        </div>

        <div className="text-white/60 font-light text-sm text-center md:text-left">
          &copy; 2026 Audácia Modas. Todos os direitos reservados.
        </div>

        <div className="flex items-center gap-4">
          <a href="https://www.instagram.com/lojaaudaciamoda?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="text-audacia-gold hover:text-white transition-colors duration-300 p-2 rounded-full hover:bg-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
