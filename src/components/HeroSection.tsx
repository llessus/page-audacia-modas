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
            className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-[1.1] tracking-tight"
          >
            <span className="text-gold-gradient block mb-2">Audácia Modas:</span>
            <span className="text-white font-light">Vista sua</span><br/>
            <span className="text-white">Essência.</span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-white/90 mb-10 font-sans font-light max-w-lg mx-auto md:mx-0 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Descubra a coleção exclusiva que combina elegância contemporânea com o toque clássico que você merece. Vista-se de confiança.
          </motion.p>
          
          <motion.a 
            href="#catalogo"
            className="btn-shimmer inline-block bg-gold-gradient text-audacia-rose-dark font-bold px-10 py-4 rounded-full text-lg shadow-gold-glow hover:shadow-[0_0_30px_rgba(212,175,55,0.6)] transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explorar Coleção
          </motion.a>
        </motion.div>

        {/* Hero Image with Floating Animation */}
        <motion.div 
          className="relative z-10 flex justify-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
        >
          <motion.div 
            className="relative"
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            {/* Decorative background circle (Glow mais difuso) */}
            <div className="absolute inset-0 bg-audacia-gold/20 rounded-full blur-[80px] transform scale-110"></div>
            
            {/* Image with Glassmorphism Frame */}
            <div className="relative p-2 rounded-3xl glassmorphism-gold">
              <img 
                src={heroImg} 
                alt="Modelo usando roupa Audácia Modas" 
                className="relative max-w-full h-auto max-h-[70vh] rounded-2xl object-cover"
              />
              {/* Subtle overlay gradient to blend image with the rose theme */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-audacia-rose-dark/40 to-transparent pointer-events-none"></div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Background decoration (Ambient Lights) */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-audacia-gold/5 rounded-full blur-[100px] pointer-events-none"></div>
    </section>
  );
}