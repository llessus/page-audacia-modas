'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { siteConfig } from '@/config/siteConfig';
import { ProductModal } from '@/components/ProductModal';
import type { Produto } from '@/types/produto';

interface MiniCatalogProps {
  produtosIniciais: Produto[];
}

/** Ordem de prioridade das categorias para exibição */
const CATEGORIA_ORDEM = [
  'Destaques da Semana',
  'Frios',
  'Vestidos',
  'Tops',
  'Blusinhas',
  'Shorts',
  'Acessórios',
];

/** Subtítulos amigáveis por categoria */
const CATEGORIA_SUBTITULO: Record<string, string> = {
  'Destaques da Semana': 'As peças mais desejadas da nossa nova coleção.',
  'Frios': 'Peças quentinhas para os dias mais frescos.',
  'Vestidos': 'Elegância e conforto para todas as ocasiões.',
  'Tops': 'Cropped e tops para compor looks incríveis.',
  'Blusinhas': 'Blusinhas versáteis para o dia a dia.',
  'Shorts': 'Shorts estilosos para arrasar no verão.',
  'Acessórios': 'Detalhes que fazem toda a diferença.',
};

export function MiniCatalog({ produtosIniciais }: MiniCatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);

  // Agrupar produtos por categoria
  const categorias = useMemo(() => {
    if (produtosIniciais.length === 0) return [];

    const grouped = new Map<string, Produto[]>();

    for (const produto of produtosIniciais) {
      const cat = produto.categoria || 'Destaques da Semana';
      if (!grouped.has(cat)) {
        grouped.set(cat, []);
      }
      grouped.get(cat)!.push(produto);
    }

    // Ordenar: categorias conhecidas primeiro (na ordem definida), depois as personalizadas
    const sortedKeys = Array.from(grouped.keys()).sort((a, b) => {
      const idxA = CATEGORIA_ORDEM.indexOf(a);
      const idxB = CATEGORIA_ORDEM.indexOf(b);
      // Categorias conhecidas vêm primeiro
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b, 'pt-BR');
    });

    return sortedKeys.map((cat) => ({
      nome: cat,
      subtitulo: CATEGORIA_SUBTITULO[cat] || 'Confira nossas peças selecionadas.',
      produtos: grouped.get(cat)!,
    }));
  }, [produtosIniciais]);

  if (categorias.length === 0) return null;

  return (
    <>
      <section id="catalogo" className="py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-8">
          {categorias.map((categoria, catIndex) => (
            <div key={categoria.nome} className={catIndex > 0 ? 'mt-20' : ''}>
              {/* Section Header */}
              <motion.div 
                className="text-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-4xl md:text-5xl font-serif mb-4 pb-2 text-gold-gradient inline-block">
                  {categoria.nome}
                </h2>
                <p className="text-white/80 font-light text-lg tracking-wide">
                  {categoria.subtitulo}
                </p>
              </motion.div>

              {/* Catalog Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
                {categoria.produtos.map((product, index) => (
                  <motion.div
                    key={product.id}
                    className="relative p-3 rounded-[2rem] glassmorphism hover:glassmorphism-gold transition-all duration-500 group flex flex-col cursor-pointer"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.7, delay: index * 0.15, ease: "easeOut" }}
                    whileHover={{ y: -12 }}
                    onClick={() => setSelectedProduct(product)}
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

                      {/* "Ver detalhes" overlay on hover */}
                      <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 group-hover:bg-black/30 transition-all duration-300">
                        <span className="text-white font-medium text-sm tracking-wider opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                          Ver detalhes
                        </span>
                      </div>
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
                        onClick={(e) => e.stopPropagation()}
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
          ))}
        </div>
      </section>

      {/* Product Detail Modal */}
      <ProductModal
        produto={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}