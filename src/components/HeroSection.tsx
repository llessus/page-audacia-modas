import { motion } from 'framer-motion';
import heroImg from '../assets/product_3.png';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center">
        
        {/* Text Content */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="z-10 text-center md:text-left"
        >
          <motion.h1 
            className="text-5xl md:text-7xl font-serif font-bold mb-6 text-gold-gradient leading-tight"
          >
            Audácia Modas:<br/>
            <span className="text-white">Vista sua</span><br/>
            Essência.
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl text-white/80 mb-10 font-light max-w-lg mx-auto md:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Descubra a coleção exclusiva que combina elegância contemporânea com o toque clássico que você merece. Vista-se de confiança.
          </motion.p>
          <motion.a 
            href="#catalogo"
            className="inline-block bg-gold-gradient text-audacia-rose font-semibold px-8 py-4 rounded-full text-lg shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explorar Coleção
          </motion.a>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          className="relative z-10 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <div className="relative">
            {/* Decorative background circle */}
            <div className="absolute inset-0 bg-audacia-gold/10 rounded-full blur-3xl transform scale-110"></div>
            
            {/* Hero Image */}
            <img 
              src={heroImg} 
              alt="Modelo usando roupa Audácia Modas" 
              className="relative max-w-full h-auto max-h-[70vh] rounded-2xl shadow-2xl object-cover border border-white/10"
            />
          </div>
        </motion.div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
    </section>
  );
}
