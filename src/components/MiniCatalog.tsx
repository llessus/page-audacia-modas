'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { siteConfig } from '@/config/siteConfig';
import type { Produto } from '@/types/produto';

interface MiniCatalogProps {
  produtosIniciais: Produto[];
}

export function MiniCatalog({ produtosIniciais }: MiniCatalogProps) {
  // Se não houver produtos no banco, podemos mostrar os estáticos ou nada. 
  // Mas agora vamos priorizar os do banco que vieram via props.
  const displayProducts = produtosIniciais.length > 0 ? produtosIniciais : [];

  if (displayProducts.length === 0) return null;

  return (
    <section id="catalogo" className="py-24 relative z-10">
      <div className="container mx-auto px-4 md:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif mb-4 pb-2 text-gold-gradient inline-block">
            Destaques da Semana
          </h2>
          <p className="text-white/80 font-light text-lg tracking-wide">
            As peças mais desejadas da nossa nova coleção.
          </p>
        </motion.div>

        {/* Catalog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
          {displayProducts.map((product, index) => (
            <motion.div
              key={product.id}
              className="relative p-3 rounded-[2rem] glassmorphism hover:glassmorphism-gold transition-all duration-500 group flex flex-col"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
              whileHover={{ y: -12 }}
            >
              {/* Image Container with Inner Rounding */}
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-inner">
                {/* Subtle vignette effect over image */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent z-10 pointer-events-none"></div>
                
                <Image 
                  src={product.imagem_url} 
                  alt={product.nome} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700 ease-out"
                />
              </div>
              
              {/* Product Info */}
              <div className="px-4 pb-4 text-center flex flex-col flex-grow">
                <h3 className="font-serif text-xl mb-1 text-white group-hover:text-audacia-gold-light transition-colors duration-300">
                  {product.nome}
                </h3>
                <p className="font-sans font-medium text-audacia-gold mb-6">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
                </p>
                
                {/* Advanced Ghost Button */}
                <a 
                  href={`https://wa.me/${siteConfig.whatsappDDIeDDD}?text=${encodeURIComponent(`Olá! Vi o catálogo e tenho interesse no ${product.nome}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto relative overflow-hidden px-6 py-3 rounded-full border border-audacia-gold/40 text-audacia-gold font-medium text-sm tracking-wider transition-all duration-300 group/btn hover:border-audacia-gold text-center"
                >
                  <span className="relative z-10 group-hover/btn:text-audacia-rose-dark transition-colors duration-300 font-semibold">
                    Pedir via WhatsApp
                  </span>
                  {/* Fill effect background */}
                  <div className="absolute inset-0 bg-audacia-gold transform scale-x-0 origin-left group-hover/btn:scale-x-100 transition-transform duration-300 ease-out z-0"></div>
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}