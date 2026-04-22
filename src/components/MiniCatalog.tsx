'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Search, Tag, X, ShoppingBag, Check, Share2, Flame } from 'lucide-react';
import { siteConfig } from '@/config/siteConfig';
import { ProductModal } from '@/components/ProductModal';
import { useCart } from '@/context/CartContext';
import type { Produto } from '@/types/produto';
import { CORES_DISPONIVEIS, TAMANHOS_DISPONIVEIS } from '@/types/produto';

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
  const [activeSizes, setActiveSizes] = useState<string[]>([]);
  const [activeColors, setActiveColors] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [hoveredProductId, setHoveredProductId] = useState<string | null>(null);
  const { addItem, justAdded } = useCart();

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

  // Tamanhos e cores presentes nos produtos
  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    produtosIniciais.forEach(p => p.tamanhos?.forEach(t => sizes.add(t)));
    return TAMANHOS_DISPONIVEIS.filter(t => sizes.has(t));
  }, [produtosIniciais]);

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    produtosIniciais.forEach(p => p.cores?.forEach(c => colors.add(c)));
    return CORES_DISPONIVEIS.filter(c => colors.has(c.nome));
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

    // Filtro por Tamanhos
    if (activeSizes.length > 0) {
      filtered = filtered.filter(p => 
        p.tamanhos && p.tamanhos.some(t => activeSizes.includes(t))
      );
    }

    // Filtro por Cores
    if (activeColors.length > 0) {
      filtered = filtered.filter(p => 
        p.cores && p.cores.some(c => activeColors.includes(c))
      );
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
  }, [produtosIniciais, searchTerm, activeCategory, activeSizes, activeColors]);

  const hasActiveFilters = activeSizes.length > 0 || activeColors.length > 0;

  function toggleSize(size: string) {
    setActiveSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  }

  function toggleColor(color: string) {
    setActiveColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  }

  function handleShare(product: Produto, e: React.MouseEvent) {
    e.stopPropagation();
    const url = `${window.location.origin}/produto/${product.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedId(product.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  function handleAddToCart(product: Produto, e: React.MouseEvent) {
    e.stopPropagation();
    addItem(product);
  }

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

            {/* Toggle de Filtros Avançados */}
            {(availableSizes.length > 0 || availableColors.length > 0) && (
              <div className="text-center">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs tracking-wider transition-all duration-300 border ${
                    hasActiveFilters
                      ? 'border-audacia-gold/50 text-audacia-gold bg-audacia-gold/10'
                      : 'border-white/10 text-white/40 hover:text-white/60 hover:border-white/20'
                  }`}
                >
                  <Tag className="w-3.5 h-3.5" />
                  Filtrar por tamanho e cor
                  {hasActiveFilters && (
                    <span className="w-5 h-5 rounded-full bg-audacia-gold text-audacia-rose-dark text-[10px] font-bold flex items-center justify-center">
                      {activeSizes.length + activeColors.length}
                    </span>
                  )}
                </button>
              </div>
            )}

            {/* Painel de Filtros */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-5">
                    {/* Tamanhos */}
                    {availableSizes.length > 0 && (
                      <div>
                        <p className="text-white/50 text-xs tracking-wider uppercase mb-3">Tamanhos</p>
                        <div className="flex flex-wrap gap-2">
                          {availableSizes.map(size => (
                            <button
                              key={size}
                              onClick={() => toggleSize(size)}
                              className={`w-10 h-10 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 border ${
                                activeSizes.includes(size)
                                  ? 'bg-audacia-gold text-audacia-rose-dark border-audacia-gold shadow-gold-glow'
                                  : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Cores */}
                    {availableColors.length > 0 && (
                      <div>
                        <p className="text-white/50 text-xs tracking-wider uppercase mb-3">Cores</p>
                        <div className="flex flex-wrap gap-2">
                          {availableColors.map(cor => (
                            <button
                              key={cor.nome}
                              onClick={() => toggleColor(cor.nome)}
                              className={`group/cor flex items-center gap-2 px-3 py-2 rounded-full text-xs tracking-wide transition-all duration-200 border ${
                                activeColors.includes(cor.nome)
                                  ? 'border-audacia-gold bg-audacia-gold/10 text-white'
                                  : 'border-white/10 bg-white/5 text-white/50 hover:border-white/30'
                              }`}
                              title={cor.nome}
                            >
                              <span
                                className="w-4 h-4 rounded-full border border-white/20 flex-shrink-0"
                                style={{ backgroundColor: cor.hex }}
                              />
                              <span>{cor.nome}</span>
                              {activeColors.includes(cor.nome) && (
                                <Check className="w-3 h-3 text-audacia-gold" />
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Limpar filtros */}
                    {hasActiveFilters && (
                      <button
                        onClick={() => { setActiveSizes([]); setActiveColors([]); }}
                        className="text-audacia-gold text-xs tracking-wider hover:underline"
                      >
                        Limpar filtros
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
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

                    <div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 pb-8 md:pb-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 max-w-6xl mx-auto md:overflow-x-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-4 md:px-0">
                      {categoria.produtos.map((product, index) => {
                        const isEsgotado = product.status === 'esgotado';
                        const isUltimasPecas = !isEsgotado && product.quantidade > 0 && product.quantidade <= 2;
                        const isAdded = justAdded === product.id;
                        const isHovered = hoveredProductId === product.id;
                        const hasSecondImage = product.imagens_extras && product.imagens_extras.length > 0;
                        
                        return (
                          <motion.div
                            key={product.id}
                            layout
                            className={`relative p-3 rounded-[2rem] glassmorphism hover:glassmorphism-gold transition-all duration-500 group flex flex-col cursor-pointer w-[75vw] flex-shrink-0 snap-center md:w-auto md:flex-shrink-1 ${
                              isEsgotado ? 'opacity-60 saturate-[0.4]' : ''
                            }`}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            whileHover={!isEsgotado ? { y: -10 } : {}}
                            onClick={() => setSelectedProduct(product)}
                            onMouseEnter={() => setHoveredProductId(product.id)}
                            onMouseLeave={() => setHoveredProductId(null)}
                          >
                            {/* Selo Últimas Peças */}
                            {isUltimasPecas && (
                              <motion.div
                                className="absolute top-5 left-5 z-30 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/90 text-white text-[11px] font-bold tracking-wider backdrop-blur-md border border-orange-400/40 shadow-lg"
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                              >
                                <Flame className="w-3.5 h-3.5" />
                                ÚLTIMAS PEÇAS
                              </motion.div>
                            )}

                            {/* Botão compartilhar */}
                            <button
                              onClick={(e) => handleShare(product, e)}
                              className="absolute top-5 right-5 z-30 p-2 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/60 hover:text-white hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100"
                              title="Copiar link do produto"
                            >
                              {copiedId === product.id ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <Share2 className="w-4 h-4" />
                              )}
                            </button>

                            {/* Imagem com hover swap */}
                            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-inner">
                              {/* Imagem principal */}
                              <Image 
                                src={product.imagem_url} 
                                alt={product.nome} 
                                fill
                                sizes="(max-width: 768px) 100vw, 33vw"
                                className={`object-cover transform transition-all duration-700 ease-out ${!isEsgotado ? 'group-hover:scale-110' : ''} ${
                                  hasSecondImage && isHovered ? 'opacity-0' : 'opacity-100'
                                }`}
                              />
                              {/* Segunda imagem (hover) */}
                              {hasSecondImage && (
                                <Image 
                                  src={product.imagens_extras[0]} 
                                  alt={`${product.nome} - foto 2`} 
                                  fill
                                  sizes="(max-width: 768px) 100vw, 33vw"
                                  className={`object-cover transform transition-all duration-700 ease-out absolute inset-0 ${
                                    isHovered ? 'opacity-100 scale-105' : 'opacity-0'
                                  }`}
                                />
                              )}
                              
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
                              
                              {/* Badges de tamanho e cor */}
                              {((product.tamanhos && product.tamanhos.length > 0) || (product.cores && product.cores.length > 0)) && (
                                <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
                                  {product.tamanhos?.map(t => (
                                    <span key={t} className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-white/5 border border-white/10 text-white/40">
                                      {t}
                                    </span>
                                  ))}
                                  {product.cores?.map(c => {
                                    const corInfo = CORES_DISPONIVEIS.find(cd => cd.nome === c);
                                    return (
                                      <span
                                        key={c}
                                        className="w-3.5 h-3.5 rounded-full border border-white/20"
                                        style={{ backgroundColor: corInfo?.hex || '#888' }}
                                        title={c}
                                      />
                                    );
                                  })}
                                </div>
                              )}

                              <p className={`font-sans font-bold text-lg ${isEsgotado ? 'text-white/40' : 'text-audacia-gold'}`}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)}
                              </p>
                              
                              {/* Aviso de estoque baixo */}
                              {isUltimasPecas && (
                                <p className="text-orange-400 text-[10px] font-bold tracking-wider mt-1">
                                  {product.quantidade === 1 ? 'Última unidade!' : `Restam apenas ${product.quantidade}`}
                                </p>
                              )}

                              <button 
                                disabled={isEsgotado}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (!isEsgotado) {
                                    handleAddToCart(product, e);
                                  }
                                }}
                                className={`mt-auto relative overflow-hidden px-6 py-3 rounded-full border transition-all duration-300 font-bold text-xs tracking-widest uppercase ${
                                  isEsgotado 
                                  ? 'border-white/10 text-white/20 cursor-not-allowed' 
                                  : isAdded
                                  ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                                  : 'border-audacia-gold/40 text-audacia-gold hover:border-audacia-gold hover:text-audacia-rose-dark group/btn'
                                }`}
                              >
                                {isEsgotado ? 'Produto Esgotado' : isAdded ? (
                                  <span className="flex items-center justify-center gap-2">
                                    <Check className="w-4 h-4" />
                                    Adicionado!
                                  </span>
                                ) : (
                                  <span className="flex items-center justify-center gap-2">
                                    <ShoppingBag className="w-3.5 h-3.5" />
                                    Adicionar à Sacola
                                  </span>
                                )}
                                {!isEsgotado && !isAdded && (
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
                  onClick={() => { setSearchTerm(''); setActiveCategory(null); setActiveSizes([]); setActiveColors([]); }}
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