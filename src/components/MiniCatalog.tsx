import { motion } from 'framer-motion';
import product1 from '../assets/product_1.png';
import product2 from '../assets/product_2.png';
import product3 from '../assets/product_3.png';

const products = [
  { id: 1, name: 'Vestido Dourado Verão', price: 'R$ 389,90', image: product1 },
  { id: 2, name: 'Conjunto Alfaiataria Nude', price: 'R$ 459,90', image: product2 },
  { id: 3, name: 'Longo Rosa Imperial', price: 'R$ 899,90', image: product3 },
];

export function MiniCatalog() {
  return (
    <section id="catalogo" className="py-20 bg-black/5 relative z-10">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-audacia-gold mb-4">Destaques da Semana</h2>
          <p className="text-white/70 font-light text-lg">As peças mais desejadas da nossa nova coleção.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 max-w-6xl mx-auto">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              className="bg-white/5 rounded-2xl overflow-hidden glassmorphism group border border-white/5 hover:border-audacia-gold/50 transition-all duration-300 flex flex-col"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-audacia-gold/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay z-10 pointer-events-none"></div>
                
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="p-5 text-center flex flex-col flex-grow">
                <h3 className="font-serif text-xl mb-2 text-white group-hover:text-audacia-gold transition-colors">{product.name}</h3>
                <p className="font-sans font-light text-white/80 mb-5">{product.price}</p>
                <a 
                  href={`https://wa.me/5561998851403?text=${encodeURIComponent(`Olá! Tenho interesse no ${product.name}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto px-4 py-2.5 bg-audacia-gold/10 hover:bg-audacia-gold/25 text-audacia-gold rounded-full text-sm font-medium border border-audacia-gold/30 transition-colors w-full"
                >
                  Pedir via WhatsApp
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
