'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { updateProduct } from '@/app/actions';
import { X, Camera, Save, Tag, ChevronDown, FileText } from 'lucide-react';
import Image from 'next/image';
import type { Produto } from '@/types/produto';

const CATEGORIAS_PADRAO = [
  'Destaques da Semana',
  'Frios',
  'Vestidos',
  'Tops',
  'Blusinhas',
  'Shorts',
  'Acessórios',
];

interface EditProductModalProps {
  produto: Produto | null;
  onClose: () => void;
}

export function EditProductModal({ produto, onClose }: EditProductModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [showNovaCategoria, setShowNovaCategoria] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset state when product changes
  useEffect(() => {
    if (produto) {
      setPreview(null);
      setFeedback(null);
      setIsLoading(false);
      // Check if current categoria is a custom one
      const isCustom = produto.categoria && !CATEGORIAS_PADRAO.includes(produto.categoria);
      setShowNovaCategoria(!!isCustom);
    }
  }, [produto]);

  // Close with ESC
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) onClose();
    },
    [onClose, isLoading]
  );

  useEffect(() => {
    if (produto) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [produto, handleKeyDown]);

  if (!produto) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }

  function clearNewImage() {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleCategoriaChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setShowNovaCategoria(e.target.value === '__nova__');
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setFeedback(null);

    try {
      const result = await updateProduct(formData);
      if (result.success) {
        setFeedback({ type: 'success', message: result.message });
        // Close after brief delay so user sees the success message
        setTimeout(() => onClose(), 1200);
      } else {
        setFeedback({ type: 'error', message: result.message });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Erro de conexão. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  }

  // Determine which categoria value to pre-select
  const isCustomCategoria = produto.categoria && !CATEGORIAS_PADRAO.includes(produto.categoria);
  const selectValue = isCustomCategoria ? '__nova__' : (produto.categoria || 'Destaques da Semana');

  const inputClass = 'w-full px-4 py-3.5 rounded-xl bg-white/5 border border-audacia-gold/20 text-white placeholder:text-white/30 focus:outline-none focus:border-audacia-gold/60 focus:ring-1 focus:ring-audacia-gold/30 transition-all duration-300 font-sans text-sm';

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      onClick={() => { if (!isLoading) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-label={`Editar ${produto.nome}`}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal — bottom-sheet on mobile, centered on desktop */}
      <div
        className="relative z-10 w-full md:max-w-lg max-h-[92vh] overflow-y-auto rounded-t-[2rem] md:rounded-[2rem] bg-audacia-rose-dark/95 backdrop-blur-2xl border border-audacia-gold/25 shadow-[0_0_60px_rgba(212,175,55,0.15)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag indicator (mobile) */}
        <div className="md:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 border-b border-audacia-gold/10 bg-audacia-rose-dark/90 backdrop-blur-xl rounded-t-[2rem]">
          <h3 className="font-serif text-lg text-white">Editar Produto</h3>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all disabled:opacity-40 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback Banner */}
        {feedback && (
          <div
            className={`mx-6 mt-4 p-4 rounded-xl border text-sm font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-red-500/10 border-red-500/30 text-red-300'
            }`}
          >
            {feedback.message}
          </div>
        )}

        {/* Form */}
        <form ref={formRef} action={handleSubmit} className="p-6 space-y-5">
          {/* Hidden fields */}
          <input type="hidden" name="id" value={produto.id} />
          <input type="hidden" name="imagemAtual" value={produto.imagem_url} />

          {/* Nome */}
          <div>
            <label htmlFor="edit-nome" className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
              Nome do Produto
            </label>
            <input
              id="edit-nome"
              name="nome"
              type="text"
              required
              defaultValue={produto.nome}
              className={inputClass}
              disabled={isLoading}
            />
          </div>

          {/* Preço */}
          <div>
            <label htmlFor="edit-preco" className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
              Preço (R$)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-audacia-gold/60 text-sm font-medium">
                R$
              </span>
              <input
                id="edit-preco"
                name="preco"
                type="number"
                step="0.01"
                min="0.01"
                required
                defaultValue={Number(produto.preco)}
                className={`${inputClass} pl-12`}
                disabled={isLoading}
              />
            </div>
          </div>

          {/* Categoria */}
          <div>
            <label htmlFor="edit-categoria" className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
              <span className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Categoria
              </span>
            </label>
            <div className="relative">
              <select
                id="edit-categoria"
                name="categoria"
                defaultValue={selectValue}
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

            {showNovaCategoria && (
              <div className="mt-3">
                <input
                  name="novaCategoria"
                  type="text"
                  defaultValue={isCustomCategoria ? produto.categoria : ''}
                  placeholder="Digite o nome da nova categoria"
                  className={inputClass}
                  disabled={isLoading}
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Descrição */}
          <div>
            <label htmlFor="edit-descricao" className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
              <span className="flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Descrição
                <span className="text-white/30 font-normal">(opcional)</span>
              </span>
            </label>
            <textarea
              id="edit-descricao"
              name="descricao"
              rows={3}
              defaultValue={produto.descricao || ''}
              placeholder="Ex: Tecido leve, ideal para o verão."
              className={`${inputClass} resize-none`}
              disabled={isLoading}
            />
          </div>

          {/* Foto */}
          <div>
            <label className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
              Foto do Produto
            </label>

            {/* Current / preview image */}
            <div className="relative rounded-xl overflow-hidden border border-audacia-gold/20 mb-3">
              <Image
                src={preview || produto.imagem_url}
                alt={produto.nome}
                width={400}
                height={300}
                className="w-full h-40 object-cover"
              />
              {preview && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/80 text-white text-xs font-bold tracking-wide">
                    Nova foto
                  </span>
                </div>
              )}
              {preview && (
                <button
                  type="button"
                  onClick={clearNewImage}
                  className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white hover:bg-red-500/80 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* File input trigger — large touch target */}
            <label
              htmlFor="edit-imagem"
              className="flex items-center justify-center gap-2 py-3.5 rounded-xl border border-dashed border-audacia-gold/30 hover:border-audacia-gold/60 bg-white/[0.02] cursor-pointer transition-all duration-300 text-sm text-audacia-gold/70 hover:text-audacia-gold min-h-[48px]"
            >
              <Camera className="w-4 h-4" />
              {preview ? 'Trocar foto novamente' : 'Trocar foto (opcional)'}
            </label>
            <input
              ref={fileInputRef}
              id="edit-imagem"
              name="imagem"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="sr-only"
              disabled={isLoading}
            />
          </div>

          {/* Actions — large touch targets for thumb */}
          <div className="flex gap-3 pt-2 pb-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-4 rounded-xl border border-white/10 text-white/60 font-medium text-sm tracking-wide hover:bg-white/5 transition-all disabled:opacity-40 min-h-[52px]"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-[2] py-4 rounded-xl bg-gold-gradient text-audacia-rose-dark font-bold text-sm tracking-wider transition-all duration-300 shadow-gold-glow hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 btn-shimmer min-h-[52px]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
