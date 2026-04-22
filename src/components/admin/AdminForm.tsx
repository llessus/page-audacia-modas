'use client';

import { useState, useRef } from 'react';
import { uploadProduct } from '@/app/actions';
import { Camera, Upload, Sparkles, X, Tag, ChevronDown, FileText, Ruler, Palette, Package, Plus } from 'lucide-react';
import Image from 'next/image';
import { TAMANHOS_DISPONIVEIS, CORES_DISPONIVEIS } from '@/types/produto';

const CATEGORIAS_PADRAO = [
  'Destaques da Semana',
  'Frios',
  'Vestidos',
  'Tops',
  'Blusinhas',
  'Shorts',
  'Acessórios',
];

export function AdminForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [extraPreviews, setExtraPreviews] = useState<string[]>([]);
  const [showNovaCategoria, setShowNovaCategoria] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [customSizeInput, setCustomSizeInput] = useState('');
  const [customColorInput, setCustomColorInput] = useState('');
  const [stockMode, setStockMode] = useState<'unlimited' | 'limited'>('unlimited');
  const [stockQty, setStockQty] = useState(1);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extraFileRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  }

  function handleExtraFileChange(index: number, e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setExtraPreviews(prev => {
          const arr = [...prev];
          arr[index] = reader.result as string;
          return arr;
        });
      };
      reader.readAsDataURL(file);
    }
  }

  function clearPreview() {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  function clearExtraPreview(index: number) {
    setExtraPreviews(prev => {
      const arr = [...prev];
      arr[index] = '';
      return arr;
    });
    if (extraFileRefs.current[index]) {
      extraFileRefs.current[index]!.value = '';
    }
  }

  function handleCategoriaChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setShowNovaCategoria(e.target.value === '__nova__');
  }

  function toggleSize(size: string) {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  }

  function toggleColor(color: string) {
    setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  }

  function handleAddCustomSize() {
    const val = customSizeInput.trim();
    if (val && !selectedSizes.includes(val)) {
      setSelectedSizes(prev => [...prev, val]);
    }
    setCustomSizeInput('');
  }

  function handleAddCustomColor() {
    const val = customColorInput.trim();
    if (val && !selectedColors.includes(val)) {
      setSelectedColors(prev => [...prev, val]);
    }
    setCustomColorInput('');
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setFeedback(null);

    // Inject tamanhos/cores/quantidade as JSON
    formData.set('tamanhos', JSON.stringify(selectedSizes));
    formData.set('cores', JSON.stringify(selectedColors));
    formData.set('quantidade', stockMode === 'unlimited' ? '-1' : String(stockQty));

    try {
      const result = await uploadProduct(formData);
      
      if (result.success) {
        setFeedback({ type: 'success', message: result.message });
        formRef.current?.reset();
        setPreview(null);
        setExtraPreviews([]);
        setShowNovaCategoria(false);
        setSelectedSizes([]);
        setSelectedColors([]);
        setStockMode('unlimited');
        setStockQty(1);
      } else {
        setFeedback({ type: 'error', message: result.message });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Erro de conexão. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl bg-white/5 border border-audacia-gold/20 text-white placeholder:text-white/30 focus:outline-none focus:border-audacia-gold/60 focus:ring-1 focus:ring-audacia-gold/30 transition-all duration-300 font-sans text-sm';

  return (
    <div className="glassmorphism-gold rounded-[2rem] p-6 md:p-8 relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-audacia-gold/15 rounded-full blur-[50px] pointer-events-none" />
      
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 rounded-xl bg-audacia-gold/20 border border-audacia-gold/30">
          <Upload className="w-5 h-5 text-audacia-gold" />
        </div>
        <h2 className="text-xl font-serif text-white">Cadastrar Produto</h2>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-xl border text-sm font-medium transition-all duration-300 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {feedback.message}
        </div>
      )}

      <form ref={formRef} action={handleSubmit} className="space-y-5">
        {/* Nome do Produto */}
        <div>
          <label htmlFor="product-nome" className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
            Nome do Produto
          </label>
          <input
            id="product-nome"
            name="nome"
            type="text"
            required
            placeholder="Ex: Vestido Dourado Verão"
            className={inputClass}
            disabled={isLoading}
          />
        </div>

        {/* Preço */}
        <div>
          <label htmlFor="product-preco" className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
            Preço (R$)
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-audacia-gold/60 text-sm font-medium">
              R$
            </span>
            <input
              id="product-preco"
              name="preco"
              type="number"
              step="0.01"
              min="0.01"
              required
              placeholder="389.90"
              className={`${inputClass} pl-12`}
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Categoria */}
        <div>
          <label htmlFor="product-categoria" className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
            <span className="flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5" />
              Categoria
            </span>
          </label>
          <div className="relative">
            <select
              id="product-categoria"
              name="categoria"
              onChange={handleCategoriaChange}
              className={`${inputClass} appearance-none cursor-pointer pr-10`}
              disabled={isLoading}
            >
              {CATEGORIAS_PADRAO.map((cat) => (
                <option key={cat} value={cat} className="bg-[#3a2433] text-white">
                  {cat}
                </option>
              ))}
              <option value="__nova__" className="bg-[#3a2433] text-audacia-gold">
                + Nova Categoria...
              </option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-audacia-gold/50 pointer-events-none" />
          </div>

          {/* Input Nova Categoria (condicional) */}
          {showNovaCategoria && (
            <div className="mt-3 animate-in fade-in slide-in-from-top-2">
              <input
                name="novaCategoria"
                type="text"
                placeholder="Digite o nome da nova categoria"
                className={inputClass}
                disabled={isLoading}
                autoFocus
              />
            </div>
          )}
        </div>

        {/* Tamanhos */}
        <div>
          <label className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
            <span className="flex items-center gap-1.5">
              <Ruler className="w-3.5 h-3.5" />
              Tamanhos
              <span className="text-white/30 font-normal">(opcional)</span>
            </span>
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {Array.from(new Set([...TAMANHOS_DISPONIVEIS, ...selectedSizes])).map(size => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                disabled={isLoading}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-200 border ${
                  selectedSizes.includes(size)
                    ? 'bg-audacia-gold text-audacia-rose-dark border-audacia-gold'
                    : 'bg-white/5 text-white/50 border-white/10 hover:border-white/30'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customSizeInput}
              onChange={(e) => setCustomSizeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomSize();
                }
              }}
              placeholder="Outro (ex: Único)"
              className={`${inputClass} !py-2 !px-3 !rounded-lg !text-xs`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleAddCustomSize}
              disabled={isLoading || !customSizeInput.trim()}
              className="px-3 py-2 rounded-lg bg-audacia-gold/20 text-audacia-gold text-xs font-medium hover:bg-audacia-gold/30 disabled:opacity-50 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Cores */}
        <div>
          <label className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
            <span className="flex items-center gap-1.5">
              <Palette className="w-3.5 h-3.5" />
              Cores
              <span className="text-white/30 font-normal">(opcional)</span>
            </span>
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {Array.from(new Set([...CORES_DISPONIVEIS.map(c => c.nome), ...selectedColors])).map(corNome => {
              const corInfo = CORES_DISPONIVEIS.find(c => c.nome === corNome);
              return (
              <button
                key={corNome}
                type="button"
                onClick={() => toggleColor(corNome)}
                disabled={isLoading}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs tracking-wide transition-all duration-200 border ${
                  selectedColors.includes(corNome)
                    ? 'border-audacia-gold bg-audacia-gold/15 text-white'
                    : 'border-white/10 bg-white/5 text-white/40 hover:border-white/20'
                }`}
              >
                {corInfo ? (
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0"
                    style={{ backgroundColor: corInfo.hex }}
                  />
                ) : (
                  <span className="w-3.5 h-3.5 rounded-full border border-white/20 flex-shrink-0 bg-white/5 flex items-center justify-center text-[8px] text-white/40">✦</span>
                )}
                {corNome}
              </button>
            )})}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={customColorInput}
              onChange={(e) => setCustomColorInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddCustomColor();
                }
              }}
              placeholder="Outra (ex: Vinho Amarelado)"
              className={`${inputClass} !py-2 !px-3 !rounded-lg !text-xs`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={handleAddCustomColor}
              disabled={isLoading || !customColorInput.trim()}
              className="px-3 py-2 rounded-lg bg-audacia-gold/20 text-audacia-gold text-xs font-medium hover:bg-audacia-gold/30 disabled:opacity-50 transition-colors"
            >
              Adicionar
            </button>
          </div>
        </div>

        {/* Estoque */}
        <div>
          <label className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
            <span className="flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5" />
              Estoque
            </span>
          </label>
          <div className="flex gap-2 mb-3">
            <button
              type="button"
              onClick={() => setStockMode('unlimited')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all border ${
                stockMode === 'unlimited'
                  ? 'bg-audacia-gold/15 border-audacia-gold/40 text-audacia-gold'
                  : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
              }`}
            >
              Ilimitado
            </button>
            <button
              type="button"
              onClick={() => setStockMode('limited')}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all border ${
                stockMode === 'limited'
                  ? 'bg-audacia-gold/15 border-audacia-gold/40 text-audacia-gold'
                  : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
              }`}
            >
              Controlado
            </button>
          </div>
          {stockMode === 'limited' && (
            <input
              type="number"
              min="0"
              value={stockQty}
              onChange={(e) => setStockQty(Math.max(0, parseInt(e.target.value) || 0))}
              className={inputClass}
              placeholder="Quantidade em estoque"
              disabled={isLoading}
            />
          )}
        </div>

        {/* Descrição */}
        <div>
          <label htmlFor="product-descricao" className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              Descrição
              <span className="text-white/30 font-normal">(opcional)</span>
            </span>
          </label>
          <textarea
            id="product-descricao"
            name="descricao"
            rows={3}
            placeholder="Ex: Tecido leve, ideal para o verão. Disponível nos tamanhos P, M e G."
            className={`${inputClass} resize-none`}
            disabled={isLoading}
          />
        </div>

        {/* Upload de Imagem Principal */}
        <div>
          <label htmlFor="product-imagem" className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
            Foto Principal
          </label>
          
          {preview ? (
            <div className="relative rounded-xl overflow-hidden border border-audacia-gold/20 mb-2">
              <Image
                src={preview}
                alt="Preview"
                width={400}
                height={400}
                className="w-full h-48 object-cover"
              />
              <button
                type="button"
                onClick={clearPreview}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="product-imagem"
              className="flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-audacia-gold/20 hover:border-audacia-gold/50 bg-white/[0.02] cursor-pointer transition-all duration-300 group"
            >
              <div className="p-3 rounded-full bg-audacia-gold/10 group-hover:bg-audacia-gold/20 transition-colors">
                <Camera className="w-6 h-6 text-audacia-gold" />
              </div>
              <div className="text-center">
                <p className="text-white/60 text-sm">Clique para adicionar uma foto</p>
                <p className="text-audacia-gold text-sm font-medium">Galeria, câmera ou arquivo</p>
              </div>
            </label>
          )}
          
          <input
            ref={fileInputRef}
            id="product-imagem"
            name="imagem"
            type="file"
            accept="image/*"
            required
            onChange={handleFileChange}
            className={preview ? 'hidden' : 'sr-only'}
            disabled={isLoading}
          />
        </div>

        {/* Fotos Extras */}
        <div>
          <label className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
            <span className="flex items-center gap-1.5">
              Fotos Extras
              <span className="text-white/30 font-normal">(até 3, opcional)</span>
            </span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map(i => (
              <div key={i}>
                {extraPreviews[i] ? (
                  <div className="relative rounded-xl overflow-hidden border border-audacia-gold/20 aspect-square">
                    <Image
                      src={extraPreviews[i]}
                      alt={`Extra ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => clearExtraPreview(i)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <label
                    htmlFor={`extra-img-${i}`}
                    className="flex items-center justify-center aspect-square rounded-xl border-2 border-dashed border-white/10 hover:border-audacia-gold/30 bg-white/[0.02] cursor-pointer transition-all"
                  >
                    <Plus className="w-5 h-5 text-white/20" />
                  </label>
                )}
                <input
                  ref={el => { extraFileRefs.current[i] = el; }}
                  id={`extra-img-${i}`}
                  name={`imagem_extra_${i}`}
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleExtraFileChange(i, e)}
                  className="sr-only"
                  disabled={isLoading}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3.5 rounded-xl bg-gold-gradient text-audacia-rose-dark font-bold text-sm tracking-wider transition-all duration-300 shadow-gold-glow hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-shimmer"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Enviando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Cadastrar Produto
            </>
          )}
        </button>
      </form>
    </div>
  );
}
