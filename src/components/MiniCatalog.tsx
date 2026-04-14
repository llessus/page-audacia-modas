'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Search, Tag, X } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { ProductModal } from '@/components/ProductModal';
import type { Produto } from '@/types/produto';

interface MiniCatalogProps {
  produtosIniciais: Produto[];
}

const CATEGORIA_ORDEM = [
  'Destaques da Semana',
  'Frios',
  'Vestidos',
  'Tops',
  'Blusinhas',
  'Shorts',
  'Acessórios',
];

export function MiniCatalog({ produtosIniciais }: MiniCatalogProps) {
  const [selectedProduct, setSelectedProduct] = useState<Produto | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  // Lista única de categorias presentes nos produtos
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    produtosIniciais.forEach(p => {
      if (p.categoria) cats.add(p.categoria);
    });
    return Array.from(cats).sort((a, b) => {
      const idxA = CATEGORIA_ORDEM.indexOf(a);
      const idxB = CATEGORIA_ORDEM.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [produtosIniciais]);

  // Filtragem e agrupamento
  const categoriasFiltradas = useMemo(() => {
    let filtered = produtosIniciais;

    // Filtro por Busca
    if (searchTerm.trim()) {
      const lowerSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.nome.toLowerCase().includes(lowerSearch) || 
        (p.descricao && p.descricao.toLowerCase().includes(lowerSearch))
      );
    }

    // Filtro por Categoria Ativa
    if (activeCategory) {
      filtered = filtered.filter(p => p.categoria === activeCategory);
    }

    // Agrupamento
    const grouped = new Map<string, Produto[]>();
    for (const produto of filtered) {
      const cat = produto.categoria || 'Destaques da Semana';
      if (!grouped.has(cat)) grouped.set(cat, []);
      grouped.get(cat)!.push(produto);
    }

    // Ordenação das chaves
    const sortedKeys = Array.from(grouped.keys()).sort((a, b) => {
      const idxA = CATEGORIA_ORDEM.indexOf(a);
      const idxB = CATEGORIA_ORDEM.indexOf(b);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });

    return sortedKeys.map(cat => ({
      nome: cat,
      produtos: grouped.get(cat)!
    }));
  }, [produtosIniciais, searchTerm, activeCategory]);

  return (
    <>
      <section id="catalogo" className="py-24 relative z-10">
        <div className="container mx-auto px-4 md:px-8">
          
          {/* BARRA DE BUSCA E FILTROS */}
          <div className="max-w-4xl mx-auto mb-16 space-y-6">
            <div className="relative group">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-audacia-gold/50 group-focus-within:text-audacia-gold transition-colors" />
              </div>
              <input
                type="text"
                placeholder="O que você está procurando hoje?"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-audacia-gold/20 text-white placeholder:text-white/30 focus:outline-none focus:border-audacia-gold/50 focus:ring-1 focus:ring-audacia-gold/30 transition-all backdrop-blur-md"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-4 flex items-center text-white/30 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Chips de Categorias */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${
                  activeCategory === null 
                  ? 'bg-audacia-gold text-audacia-rose-dark border-audacia-gold shadow-gold-glow' 
                  : 'bg-white/5 text-white/60 border-white/10 hover:border-audacia-gold/40 hover:text-white'
                }`}
              >
                Todos
              </button>
              {allCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 border ${
                    activeCategory === cat 
                    ? 'bg-audacia-gold text-audacia-rose-dark border-audacia-gold shadow-gold-glow' 
                    : 'bg-white/5 text-white/60 border-white/10 hover:border-audacia-gold/40 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {categoriasFiltradas.length > 0 ? (
              <motion.div
                key="catalog-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {categoriasFiltradas.map((categoria, catIndex) => (
                  <div key={categoria.nome} className={catIndex > 0 ? 'mt-24' : ''}>
                    {/* Header Categoria */}
                    <div className="text-center mb-12">
                      <h2 className="text-3xl md:text-4xl font-serif text-gold-gradient inline-block pb-1 border-b border-audacia-gold/20">
                        {categoria.nome}
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 max-w-6xl mx-auto">
                      {categoria.produtos.map((product, index) => {
                        const isEsgotado = product.status === 'esgotado';
                        
                        return (
                          <motion.div
                            key={product.id}
                            layout
                            className={`relative p-3 rounded-[2rem] glassmorphism hover:glassmorphism-gold transition-all duration-500 group flex flex-col cursor-pointer ${
                              isEsgotado ? 'opacity-60 saturate-[0.4]' : ''
                            }`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            whileHover={!isEsgotado ? { y: -10 } : {}}
                            onClick={() => setSelectedProduct(product)}
                          >
                            {/* Imagem */}
                            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-inner">
                              <Image 
                                src={product.imagem_url} 
                                alt={product.nome} 
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className={`object-cover transform transition-transform duration-700 ease-out ${!isEsgotado ? 'group-hover:scale-110' : ''}`}
                              />
                              
                              {/* Overlay de Status */}
                              {isEsgotado && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                                  <span className="px-6 py-2 rounded-full bg-red-500/80 text-white text-sm font-black tracking-[0.2em] uppercase border border-white/20 shadow-2xl">
                                    Esgotado
                                  </span>
                                </div>
                              )}

                              {!isEsgotado && (
                                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-all duration-300">
                                  <span className="text-white font-medium text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300 bg-black/60 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10">
                                    Ver Detalhes
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Info */}
                            <div className="px-4 pb-4 text-center flex flex-col flex-grow">
                              <h3 className="font-serif text-xl mb-1 text-white group-hover:text-audacia-gold transition-colors">
                                {product.nome}
                              </h3>
                              <p className={`font-sans font-bold text-lg ${isEsgotado ? 'text-white/40' : 'text-audacia-gold'}`}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
                              </p>
                              
                              <button 
                                disabled={isEsgotado}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isEsgotado) {
                                    const text = encodeURIComponent(`Olá! Tenho interesse no ${product.nome}`);
                                    window.open(`https://wa.me/${siteConfig.whatsappDDIeDDD}?text=${text}`, '_blank');
                                  }
                                }}
                                className={`mt-auto relative overflow-hidden px-6 py-3 rounded-full border transition-all duration-300 font-bold text-xs tracking-widest uppercase ${
                                  isEsgotado 
                                  ? 'border-white/10 text-white/20 cursor-not-allowed' 
                                  : 'border-audacia-gold/40 text-audacia-gold hover:border-audacia-gold hover:text-audacia-rose-dark group/btn'
                                }`}
                              >
                                {isEsgotado ? 'Produto Esgotado' : 'Quero este item'}
                                {!isEsgotado && (
                                  <div className="absolute inset-0 bg-audacia-gold transform scale-x-0 origin-left group-hover/btn:scale-x-100 transition-transform duration-300 -z-10" />
                                )}
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20 border-2 border-dashed border-white/10 rounded-[2rem] glassmorphism max-w-2xl mx-auto"
              >
                <Tag className="w-12 h-12 text-audacia-gold/20 mx-auto mb-4" />
                <h3 className="text-xl font-serif text-white/60">Nenhum produto encontrado</h3>
                <p className="text-white/30 text-sm mt-2">Tente buscar por outro termo ou categoria.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setActiveCategory(null); }}
                  className="mt-6 text-audacia-gold text-xs font-bold uppercase tracking-widest hover:underline"
                >
                  Limpar todos os filtros
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <ProductModal
        produto={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}