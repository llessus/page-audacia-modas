'use client';

import { useState, useRef } from 'react';
import { updateHeroImage } from '@/app/actions';
import { Upload, ImageIcon, Loader2 } from 'lucide-react';
import Image from 'next/image';

interface HeroEditFormProps {
  currentHeroImage: string;
}

export function HeroEditForm({ currentHeroImage }: HeroEditFormProps) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      // Limpa mensagem
      setMessage({ type: '', text: '' });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;
        setPreview(URL.createObjectURL(file));
        setMessage({ type: '', text: '' });
      }
    }
  };

  async function handleSubmit(formData: FormData) {
    if (!formData.get('imagem')) {
      return;
    }
    
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await updateHeroImage(formData);
      
      if (res.success) {
        setMessage({ type: 'success', text: res.message });
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        
        setTimeout(() => {
          setMessage({ type: '', text: '' });
        }, 3000);
      } else {
        setMessage({ type: 'error', text: res.message || 'Erro ao atualizar.' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Erro de conexão.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="glassmorphism rounded-3xl p-6 mb-8 border border-white/10 relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute -top-12 -right-12 w-32 h-32 bg-audacia-gold/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center gap-3 mb-6 relative">
        <div className="p-2 rounded-xl bg-audacia-gold/10 border border-audacia-gold/20">
          <ImageIcon className="w-5 h-5 text-audacia-gold" />
        </div>
        <div>
          <h2 className="font-serif text-xl text-white">Foto de Entrada</h2>
          <p className="text-white/40 text-xs">A imagem principal da Landing Page</p>
        </div>
      </div>

      <div className="relative aspect-[3/4] w-full max-w-[200px] mx-auto rounded-2xl overflow-hidden mb-6 border-2 border-white/5 bg-black/20">
        <Image
          src={preview || currentHeroImage}
          alt="Visualização da foto de entrada"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </div>

      <form action={handleSubmit} className="space-y-4">
        {/* Upload Area */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-300 min-h-[44px] flex flex-col items-center justify-center ${
            preview 
            ? 'border-audacia-gold/50 bg-audacia-gold/5' 
            : 'border-white/10 hover:border-audacia-gold/30 hover:bg-white/5'
          }`}
        >
          <input 
            type="file" 
            name="imagem"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*" 
            className="hidden" 
          />
          
          <Upload className={`w-6 h-6 mb-2 ${preview ? 'text-audacia-gold' : 'text-white/40'}`} />
          <p className="text-sm font-medium text-white/70 mb-1">
            {preview ? 'Imagem selecionada' : 'Clique para selecionar'}
          </p>
          <p className="text-[10px] text-white/30 truncate max-w-[200px]">
            {preview ? 'Pronta para salvar' : 'No iPhone, você pode usar a Câmera ou Fototeca'}
          </p>
        </div>

        {/* Feedback Message */}
        {message.text && (
          <div className={`p-3 rounded-xl text-xs font-medium text-center border animate-in fade-in slide-in-from-top-2 ${
            message.type === 'success' 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-red-500/10 border-red-500/20 text-red-400'
          }`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !preview}
          className="w-full relative min-h-[44px] bg-gold-gradient text-audacia-rose-dark font-bold text-sm tracking-wide rounded-xl shadow-gold-glow hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden flex items-center justify-center gap-2 group"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <span>Salvar Alteração</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
