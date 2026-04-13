import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function WhatsAppPurchaseSection() {
  // CONFIGURAÇÃO DO WHATSAPP:
  const WHATSAPP_NUMBER = "5561998851403"; 
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Oi! Vi a landing page da Audácia Modas e quero falar com a estilista!')}`;

  return (
    <section id="whatsapp-purchase" className="py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto glassmorphism-gold rounded-[3rem] p-10 md:p-16 text-center relative"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-audacia-gold/10 blur-[80px] -z-10 rounded-[3rem] pointer-events-none"></div>

          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6 leading-tight">
            Gostou de algo? <span className="text-gold-gradient block mt-2">Fale direto com nossa vendedora.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/90 font-light mb-12 max-w-2xl mx-auto tracking-wide">
            Atendimento personalizado para encontrar o tamanho perfeito e as melhores combinações para o seu estilo.
          </p>

          <motion.a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-shimmer inline-flex items-center justify-center gap-4 px-10 py-5 md:px-14 md:py-6 bg-gold-gradient text-audacia-rose-dark rounded-full text-xl font-bold transition-all shadow-gold-glow hover:shadow-[0_0_40px_rgba(212,175,55,0.7)] mb-8"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: ['0 0 20px rgba(212,175,55,0.4)', '0 0 40px rgba(212,175,55,0.8)', '0 0 20px rgba(212,175,55,0.4)'] 
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            <MessageCircle className="w-7 h-7 text-audacia-rose-dark" />
            <span className="relative z-10">Chamar no WhatsApp</span>
          </motion.a>

          {/* Status Indicator (Online Now) */}
          <div className="flex items-center justify-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#25D366]"></span>
            </span>
            <p className="text-white/70 text-sm font-medium tracking-wide">
              Estilista disponível agora · Seg a Sáb, 9h às 19h
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}