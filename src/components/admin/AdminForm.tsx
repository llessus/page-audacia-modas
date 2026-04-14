'use client';

import { useState, useRef } from 'react';
import { uploadProduct } from '@/app/actions';
import { Camera, Upload, Sparkles, X } from 'lucide-react';
import Image from 'next/image';

export function AdminForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  function clearPreview() {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setFeedback(null);

    try {
      const result = await uploadProduct(formData);
      
      if (result.success) {
        setFeedback({ type: 'success', message: result.message });
        formRef.current?.reset();
        setPreview(null);
      } else {
        setFeedback({ type: 'error', message: result.message });
      }
    } catch {
      setFeedback({ type: 'error', message: 'Erro de conexão. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
  }

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
            className="w-full px-4 py-3 rounded-xl bg-white/5 border border-audacia-gold/20 text-white placeholder:text-white/30 focus:outline-none focus:border-audacia-gold/60 focus:ring-1 focus:ring-audacia-gold/30 transition-all duration-300 font-sans text-sm"
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
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-audacia-gold/20 text-white placeholder:text-white/30 focus:outline-none focus:border-audacia-gold/60 focus:ring-1 focus:ring-audacia-gold/30 transition-all duration-300 font-sans text-sm"
              disabled={isLoading}
            />
          </div>
        </div>

        {/* Upload de Imagem */}
        <div>
          <label htmlFor="product-imagem" className="block text-sm font-medium text-audacia-gold/80 mb-2 tracking-wide">
            Foto do Produto
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
                <p className="text-white/60 text-sm">Clique para escolher ou</p>
                <p className="text-audacia-gold text-sm font-medium">tirar foto com a câmera</p>
              </div>
            </label>
          )}
          
          <input
            ref={fileInputRef}
            id="product-imagem"
            name="imagem"
            type="file"
            accept="image/*"
            capture="environment"
            required
            onChange={handleFileChange}
            className={preview ? 'hidden' : 'sr-only'}
            disabled={isLoading}
          />
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
