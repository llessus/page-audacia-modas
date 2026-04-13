import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export function WhatsAppPurchaseSection() {
  // CONFIGURAÇÃO DO WHATSAPP:
  // Altere este número para o seu (com DDI e DDD, ex: 5561988887777)
  const WHATSAPP_NUMBER = "5561998851403"; 
  const WHATSAPP_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Oi! Vi a landing page e quero saber mais sobre as roupas!')}`;

  return (
    <section id="whatsapp-purchase" className="py-24 relative z-10 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto glassmorphism rounded-[2.5rem] p-10 md:p-16 text-center relative border-audacia-gold/30"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-audacia-gold/5 blur-3xl -z-10 rounded-full"></div>

          <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
            Gostou de algo? <span className="text-gold-gradient block mt-2">Fale direto com nossa estilista.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-white/80 font-light mb-10 max-w-2xl mx-auto">
            Atendimento personalizado para encontrar o tamanho perfeito e as melhores combinações para o seu estilo.
          </p>

          <motion.a
            href={WHATSAPP_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-5 md:px-12 md:py-6 bg-audacia-gold text-audacia-rose rounded-full text-xl font-semibold overflow-hidden transition-all shadow-[0_0_30px_rgba(212,175,55,0.3)] hover:shadow-[0_0_50px_rgba(212,175,55,0.6)] mb-6"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            animate={{ 
              boxShadow: ['0 0 20px rgba(212,175,55,0.4)', '0 0 40px rgba(212,175,55,0.8)', '0 0 20px rgba(212,175,55,0.4)'] 
            }}
            transition={{
              boxShadow: { duration: 2, repeat: Infinity, ease: "easeInOut" }
            }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></div>
            
            <MessageCircle className="w-8 h-8 text-audacia-rose fill-audacia-rose" />
            <span className="relative z-10">Chamar no WhatsApp</span>
          </motion.a>

          <p className="text-white/50 text-sm font-light">
            Respondemos em até 1h · Seg a Sáb, 9h às 18h
          </p>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </section>
  );
}
